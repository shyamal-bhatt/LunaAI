// Analytics screen component
// - Displays time-series graphs for activity data using Victory Native
// - Supports multiple graphs with up to 2 activities per graph
// - Month selector to filter data
// - Activity selection with options shown on respective axes
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { getAllActivityLogs } from '../../lib/activityStorage';
import { analyticsStyles as styles } from '../../styles/analyticsStyles';

// Available activities for graphing
const AVAILABLE_ACTIVITIES = {
  bleeding: { label: 'Bleeding', type: 'categorical', options: ['Heavy', 'Mild', 'Light', 'Spotting', 'clots'] },
  bleedingColor: { label: 'Bleeding Color', type: 'categorical', options: ['bright red', 'light pink', 'dark red or dark purple', 'brown muddy'] },
  padCounts: { label: 'Pad Counts', type: 'numeric', unit: 'pads' },
  mood: { label: 'Mood', type: 'multi', options: ['Happy', 'Neutral', 'Sensitive', 'Irritable', 'Sad', 'low-self esteem', 'procrastinating'] },
  cravings: { label: 'Cravings', type: 'multi', options: ['Sugar', 'snacking', 'sour'] },
  workLoad: { label: 'Work Load', type: 'multi', options: ['Easy', 'Moderate', 'High', 'Overwhelming', 'brain fog'] },
  symptoms: { label: 'Symptoms', type: 'multi', options: ['Cramps', 'Backache', 'Bloating', 'Nausea', 'Fatigue', 'facial hair', 'acne'] },
  sleepQuality: { label: 'Sleep Quality', type: 'categorical', options: ['disturbed', 'undisturbed'] },
  sleepHrs: { label: 'Sleep Hours', type: 'numeric', unit: 'hours' },
  weight: { label: 'Weight', type: 'numeric', unit: 'kg' },
  steps: { label: 'Steps', type: 'numeric', unit: 'steps' },
  exercise: { label: 'Exercise', type: 'multi', options: ['walking', 'light workout'] },
};

export default function Analytics() {
  // Track multiple graphs
  const [graphs, setGraphs] = useState([
    { id: 1, activity1: null, activity2: null, month: null }
  ]);
  
  // Available months with data
  const [availableMonths, setAvailableMonths] = useState([]);
  
  // All activity data stored as object with dates as keys
  const [allActivityData, setAllActivityData] = useState({});

  // Load available months and activity data from stored data
  useEffect(() => {
    const loadData = async () => {
      const allLogs = await getAllActivityLogs();
      setAllActivityData(allLogs);
      
      const dates = Object.keys(allLogs).sort();
      
      // Extract unique months
      const monthsSet = new Set();
      dates.forEach(date => {
        const [year, month] = date.split('-');
        monthsSet.add(`${year}-${month}`);
      });
      
      const months = Array.from(monthsSet).sort();
      setAvailableMonths(months);
      
      // Set default month to most recent for all graphs if they don't have one
      if (months.length > 0) {
        setGraphs(prevGraphs => prevGraphs.map(g => 
          g.month ? g : { ...g, month: months[months.length - 1] }
        ));
      }
    };
    
    loadData();
  }, []);

  // Add a new graph
  const addGraph = () => {
    const newGraph = {
      id: graphs.length + 1,
      activity1: null,
      activity2: null,
      month: availableMonths.length > 0 ? availableMonths[availableMonths.length - 1] : null,
    };
    setGraphs([...graphs, newGraph]);
  };

  // Remove a graph
  const removeGraph = (graphId) => {
    if (graphs.length > 1) {
      setGraphs(graphs.filter(g => g.id !== graphId));
    } else {
      Alert.alert('Error', 'At least one graph is required');
    }
  };

  // Update graph configuration
  const updateGraph = (graphId, field, value) => {
    setGraphs(graphs.map(g => 
      g.id === graphId ? { ...g, [field]: value } : g
    ));
  };

  // Get screen width for chart
  const screenWidth = Dimensions.get('window').width - 64; // Account for padding

  // Prepare data for a specific graph (for react-native-chart-kit format)
  const prepareChartData = (graph) => {
    if (!graph.month || Object.keys(allActivityData).length === 0) {
      return null;
    }
    
    // Get all dates for the selected month
    const monthDates = Object.keys(allActivityData).filter(date => {
      const logMonth = date.substring(0, 7); // YYYY-MM
      return logMonth === graph.month;
    }).sort();
    
    // Convert to array of log objects with dates
    const monthData = monthDates.map(date => ({
      date,
      ...allActivityData[date],
    }));
    
    // Get all days in the month (1-31)
    const daysInMonth = new Date(graph.month + '-01').getDate();
    const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    
    // Initialize datasets
    const datasets = [];
    
    // Process activity1 data
    if (graph.activity1) {
      const activity1Values = Array(daysInMonth).fill(null);
      
      monthData.forEach(log => {
        const day = new Date(log.date).getDate() - 1; // 0-indexed
        const value = log[graph.activity1];
        
        if (value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
          const activityConfig = AVAILABLE_ACTIVITIES[graph.activity1];
          
          if (activityConfig.type === 'numeric') {
            activity1Values[day] = parseFloat(value) || 0;
          } else if (activityConfig.type === 'multi' && Array.isArray(value)) {
            activity1Values[day] = value.length;
          } else {
            const optionIndex = activityConfig.options?.indexOf(value) ?? -1;
            activity1Values[day] = optionIndex >= 0 ? optionIndex + 1 : 0;
          }
        }
      });
      
      datasets.push({
        data: activity1Values,
        color: (opacity = 1) => `rgba(236, 72, 153, ${opacity})`, // LunaAI pink
        strokeWidth: 2,
      });
    }
    
    // Process activity2 data
    if (graph.activity2) {
      const activity2Values = Array(daysInMonth).fill(null);
      
      monthData.forEach(log => {
        const day = new Date(log.date).getDate() - 1; // 0-indexed
        const value = log[graph.activity2];
        
        if (value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
          const activityConfig = AVAILABLE_ACTIVITIES[graph.activity2];
          
          if (activityConfig.type === 'numeric') {
            activity2Values[day] = parseFloat(value) || 0;
          } else if (activityConfig.type === 'multi' && Array.isArray(value)) {
            activity2Values[day] = value.length;
          } else {
            const optionIndex = activityConfig.options?.indexOf(value) ?? -1;
            activity2Values[day] = optionIndex >= 0 ? optionIndex + 1 : 0;
          }
        }
      });
      
      datasets.push({
        data: activity2Values,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue
        strokeWidth: 2,
      });
    }
    
    if (datasets.length === 0) {
      return null;
    }
    
    // Track activity configs for Y-axis labeling
    const activity1Config = graph.activity1 ? AVAILABLE_ACTIVITIES[graph.activity1] : null;
    const activity2Config = graph.activity2 ? AVAILABLE_ACTIVITIES[graph.activity2] : null;
    
    return {
      labels,
      datasets,
      legend: [
        ...(graph.activity1 ? [AVAILABLE_ACTIVITIES[graph.activity1].label] : []),
        ...(graph.activity2 ? [AVAILABLE_ACTIVITIES[graph.activity2].label] : []),
      ],
      // Metadata for Y-axis formatting
      activity1Config,
      activity2Config,
    };
  };

  // Format Y-axis labels for categorical activities
  const formatYLabel = (value, chartData) => {
    if (!chartData) return value.toString();
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value.toString();
    
    // Priority: Show activity1 labels if it's categorical, otherwise activity2
    const categoricalConfig = (chartData.activity1Config && chartData.activity1Config.type === 'categorical') 
      ? chartData.activity1Config 
      : (chartData.activity2Config && chartData.activity2Config.type === 'categorical')
        ? chartData.activity2Config
        : null;
    
    if (categoricalConfig && categoricalConfig.options) {
      const options = categoricalConfig.options;
      const index = Math.round(numValue) - 1; // Convert back to 0-indexed
      if (index >= 0 && index < options.length) {
        // Return option name (truncated to 10 chars for readability on Y-axis)
        const optionName = options[index];
        return optionName.length > 10 ? optionName.substring(0, 10) + '...' : optionName;
      }
    }
    
    // Default: return numeric value for numeric activities
    return numValue.toString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📊 Analytics</Text>
          <Text style={styles.subtitle}>Track your cycle patterns</Text>
        </View>

        {/* Graphs */}
        {graphs.map((graph) => {
          
          return (
            <View key={graph.id} style={styles.graphCard}>
              {/* Graph Controls */}
              <View style={styles.graphHeader}>
                <Text style={styles.graphTitle}>Graph {graph.id}</Text>
                {graphs.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeGraph(graph.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Month Selector */}
              <View style={styles.selectorContainer}>
                <Text style={styles.selectorLabel}>Month:</Text>
                <View style={styles.optionRow}>
                  {availableMonths.map(month => {
                    const [year, monthNum] = month.split('-');
                    const monthName = new Date(year, parseInt(monthNum) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                    return (
                      <TouchableOpacity
                        key={month}
                        style={[
                          styles.optionPill,
                          graph.month === month && styles.optionPillActive
                        ]}
                        onPress={() => updateGraph(graph.id, 'month', month)}
                      >
                        <Text style={[
                          styles.optionPillText,
                          graph.month === month && styles.optionPillTextActive
                        ]}>
                          {monthName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Activity 1 Selector */}
              <View style={styles.selectorContainer}>
                <Text style={styles.selectorLabel}>Activity 1:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activityScroll}>
                  <View style={styles.optionRow}>
                    <TouchableOpacity
                      style={[
                        styles.optionPill,
                        !graph.activity1 && styles.optionPillActive
                      ]}
                      onPress={() => updateGraph(graph.id, 'activity1', null)}
                    >
                      <Text style={[
                        styles.optionPillText,
                        !graph.activity1 && styles.optionPillTextActive
                      ]}>
                        None
                      </Text>
                    </TouchableOpacity>
                    {Object.keys(AVAILABLE_ACTIVITIES).map(key => (
                      <TouchableOpacity
                        key={key}
                        style={[
                          styles.optionPill,
                          graph.activity1 === key && styles.optionPillActive,
                          graph.activity2 === key && styles.optionPillDisabled
                        ]}
                        onPress={() => {
                          if (graph.activity2 !== key) {
                            updateGraph(graph.id, 'activity1', key);
                          }
                        }}
                        disabled={graph.activity2 === key}
                      >
                        <Text style={[
                          styles.optionPillText,
                          graph.activity1 === key && styles.optionPillTextActive,
                          graph.activity2 === key && styles.optionPillTextDisabled
                        ]}>
                          {AVAILABLE_ACTIVITIES[key].label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Activity 2 Selector */}
              <View style={styles.selectorContainer}>
                <Text style={styles.selectorLabel}>Activity 2 (optional):</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activityScroll}>
                  <View style={styles.optionRow}>
                    <TouchableOpacity
                      style={[
                        styles.optionPill,
                        !graph.activity2 && styles.optionPillActive
                      ]}
                      onPress={() => updateGraph(graph.id, 'activity2', null)}
                    >
                      <Text style={[
                        styles.optionPillText,
                        !graph.activity2 && styles.optionPillTextActive
                      ]}>
                        None
                      </Text>
                    </TouchableOpacity>
                    {Object.keys(AVAILABLE_ACTIVITIES).map(key => (
                      <TouchableOpacity
                        key={key}
                        style={[
                          styles.optionPill,
                          graph.activity2 === key && styles.optionPillActive,
                          graph.activity1 === key && styles.optionPillDisabled
                        ]}
                        onPress={() => {
                          if (graph.activity1 !== key) {
                            updateGraph(graph.id, 'activity2', key);
                          }
                        }}
                        disabled={graph.activity1 === key}
                      >
                        <Text style={[
                          styles.optionPillText,
                          graph.activity2 === key && styles.optionPillTextActive,
                          graph.activity1 === key && styles.optionPillTextDisabled
                        ]}>
                          {AVAILABLE_ACTIVITIES[key].label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Graph Visualization */}
              {graph.activity1 && graph.month && (() => {
                const chartData = prepareChartData(graph);
                const hasData = chartData && chartData.datasets.some(dataset => dataset.data.some(v => v !== null));
                
                return (
                  <View style={styles.chartContainer}>
                    {hasData && chartData ? (
                      <View>
                        <LineChart
                          data={chartData}
                          width={screenWidth}
                          height={280}
                          chartConfig={{
                            backgroundColor: '#ffffff',
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            decimalPlaces: 1,
                            color: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`, // Text color
                            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                            formatYLabel: (value) => formatYLabel(value, chartData),
                            style: {
                              borderRadius: 12,
                            },
                            propsForDots: {
                              r: '4',
                              strokeWidth: '2',
                            },
                            propsForBackgroundLines: {
                              strokeDasharray: '', // Solid lines
                              stroke: '#e5e7eb',
                              strokeWidth: 1,
                            },
                          }}
                          bezier // Smooth curves
                          style={{
                            marginVertical: 8,
                            borderRadius: 12,
                          }}
                          withVerticalLines={true}
                          withHorizontalLines={true}
                          withInnerLines={true}
                          withOuterLines={true}
                          fromZero={false}
                        />
                        {/* Custom Legend */}
                        <View style={styles.legendContainer}>
                          {graph.activity1 && (
                            <View style={styles.legendItem}>
                              <View style={[styles.legendDot, { backgroundColor: '#ec4899' }]} />
                              <Text style={styles.legendText}>{AVAILABLE_ACTIVITIES[graph.activity1].label}</Text>
                            </View>
                          )}
                          {graph.activity2 && (
                            <View style={styles.legendItem}>
                              <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
                              <Text style={styles.legendText}>{AVAILABLE_ACTIVITIES[graph.activity2].label}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    ) : (
                      <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>No data available for selected month</Text>
                      </View>
                    )}
                  </View>
                );
              })()}

              {!graph.activity1 && (
                <View style={styles.noSelectionContainer}>
                  <Text style={styles.noSelectionText}>Select at least one activity to view graph</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Add Graph Button */}
        <TouchableOpacity style={styles.addButton} onPress={addGraph}>
          <Text style={styles.addButtonText}>+ Add Another Graph</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

