// Home screen component
// - Displays a swipeable calendar for tracking menstrual cycle
// - Allows date selection for logging activities
// - Calendar shows today's date highlighted by default
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { homeStyles as styles } from '../../styles/homeStyles';

export default function Home() {
  // Get today's date in YYYY-MM-DD format for initial selection
  const today = useMemo(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }, []);

  // Track the currently selected date
  const [selectedDate, setSelectedDate] = useState(today);

  // Section 1: Bleeding data (single select)
  const [bleeding, setBleeding] = useState(null);
  const [bleedingColor, setBleedingColor] = useState(null);
  const [padCounts, setPadCounts] = useState('');

  // Other questions - single select
  const [birthControl, setBirthControl] = useState(null);
  const [smoke, setSmoke] = useState(null);
  const [alcohol, setAlcohol] = useState(null);
  const [sleepQuality, setSleepQuality] = useState(null);
  // Exercise should be multi-select
  const [exercise, setExercise] = useState([]);

  // Multi-select questions - stored as arrays
  const [mood, setMood] = useState([]);
  const [cravings, setCravings] = useState([]);
  const [workLoad, setWorkLoad] = useState([]);
  const [symptoms, setSymptoms] = useState([]);

  // Number inputs
  const [sleepHrs, setSleepHrs] = useState('');
  const [weight, setWeight] = useState('');
  const [steps, setSteps] = useState('');

  // Handler for single-select questions
  const handleSingleSelect = (setter, value) => {
    setter(value);
  };

  // Handler for multi-select questions
  const handleMultiSelect = (currentValues, setter, value) => {
    if (currentValues.includes(value)) {
      setter(currentValues.filter((v) => v !== value));
    } else {
      setter([...currentValues, value]);
    }
  };

  // Handler called when a date is tapped
  const onDateSelect = (day) => {
    setSelectedDate(day.dateString);
    console.log('Date selected:', day.dateString);
  };

  // Prepare marked dates object for calendar highlighting
  const markedDates = useMemo(() => ({
    [selectedDate]: {
      selected: true,
      selectedColor: '#ec4899',
      selectedTextColor: '#ffffff',
    },
    [today]: {
      marked: true,
      dotColor: '#ec4899',
      // If today is selected, it will use selectedColor instead
    },
  }), [selectedDate, today]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header section with tagline */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Track your <Text style={styles.cycleText}>Periods</Text>
          </Text>
        </View>

        {/* Calendar section - swipeable by month */}
        <View style={styles.calendarContainer}>
          <Text style={styles.sectionTitle}>Calendar</Text>
          <Calendar
            // Enable swipe gestures to navigate between months
            enableSwipeMonths={true}
            // Handler called when a date is pressed
            onDayPress={onDateSelect}
            // Mark today and selected date with custom styling
            markedDates={markedDates}
            // Customize calendar theme colors to match LunaAI branding
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#6b7280',
              selectedDayBackgroundColor: '#ec4899',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#ec4899',
              dayTextColor: '#1f2937',
              textDisabledColor: '#d1d5db',
              dotColor: '#ec4899',
              selectedDotColor: '#ffffff',
              arrowColor: '#ec4899',
              monthTextColor: '#1f2937',
              textDayFontWeight: '400',
              textMonthFontWeight: '700',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            // Show arrows for month navigation
            showArrows={true}
            // Don't hide days from previous/next month
            hideExtraDays={false}
            // First day of week (0 = Sunday, 1 = Monday)
            firstDay={1}
          />
        </View>

        {/* Activity Logging */}
        {/* Section 1: Bleeding (top, light red background) */}
        <View style={styles.bleedingSection}>
          <Text style={styles.activityTitle}>
            🩸 Bleeding
          </Text>
          <View style={styles.optionGrid}>
            {['Heavy', 'Mild', 'Light', 'Spotting', 'clots'].map((label) => (
              <TouchableOpacity
                key={label}
                style={[styles.optionPill, bleeding === label && styles.optionPillActive]}
                onPress={() => handleSingleSelect(setBleeding, label)}
              >
                <Text style={[styles.optionPillText, bleeding === label && styles.optionPillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.inputRow, { marginTop: 14 }]}>
            <Text style={styles.inputLabel}>Bleeding color</Text>
          </View>
          <View style={[styles.optionGrid, { marginTop: 8 }]}>
            {['bright red', 'light pink', 'dark red or dark purple', 'brown muddy'].map((label) => (
              <TouchableOpacity
                key={label}
                style={[styles.optionPill, bleedingColor === label && styles.optionPillActive]}
                onPress={() => handleSingleSelect(setBleedingColor, label)}
              >
                <Text style={[styles.optionPillText, bleedingColor === label && styles.optionPillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Pad counts</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="0"
              keyboardType="numeric"
              returnKeyType="done"
              value={padCounts}
              onChangeText={setPadCounts}
            />
          </View>
        </View>

        {/* Other questions - Multi-select */}
        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>😊 Mood</Text>
          <View style={styles.optionGrid}>
            {['Happy', 'Neutral', 'Sensitive', 'Irritable', 'Sad', 'low-self esteem', 'procrastinating'].map((label) => (
              <TouchableOpacity
                key={label}
                style={[styles.optionPill, mood.includes(label) && styles.optionPillActive]}
                onPress={() => handleMultiSelect(mood, setMood, label)}
              >
                <Text style={[styles.optionPillText, mood.includes(label) && styles.optionPillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>🍫 Cravings</Text>
          <View style={styles.optionGrid}>
            {['Sugar', 'snacking', 'sour'].map((label) => (
              <TouchableOpacity
                key={label}
                style={[styles.optionPill, cravings.includes(label) && styles.optionPillActive]}
                onPress={() => handleMultiSelect(cravings, setCravings, label)}
              >
                <Text style={[styles.optionPillText, cravings.includes(label) && styles.optionPillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>💼 Work Load</Text>
          <View style={styles.optionGrid}>
            {['Easy', 'Moderate', 'High', 'Overwhelming', 'brain fog'].map((label) => (
              <TouchableOpacity
                key={label}
                style={[styles.optionPill, workLoad.includes(label) && styles.optionPillActive]}
                onPress={() => handleMultiSelect(workLoad, setWorkLoad, label)}
              >
                <Text style={[styles.optionPillText, workLoad.includes(label) && styles.optionPillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>🤒 Symptoms</Text>
          <View style={styles.optionGrid}>
            {['Cramps', 'Backache', 'Bloating', 'Nausea', 'Fatigue', 'facial hair', 'acne'].map((label) => (
              <TouchableOpacity
                key={label}
                style={[styles.optionPill, symptoms.includes(label) && styles.optionPillActive]}
                onPress={() => handleMultiSelect(symptoms, setSymptoms, label)}
              >
                <Text style={[styles.optionPillText, symptoms.includes(label) && styles.optionPillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Single-select Yes/No questions */}
        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>💊 Birth Control Pills</Text>
          <View style={styles.yesNoRow}>
            {['Yes', 'No'].map((label) => (
              <TouchableOpacity
                key={label}
                style={[styles.optionPill, birthControl === label && styles.optionPillActive]}
                onPress={() => handleSingleSelect(setBirthControl, label)}
              >
                <Text style={[styles.optionPillText, birthControl === label && styles.optionPillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>🚬 Smoke</Text>
          <View style={styles.yesNoRow}>
            {['Yes', 'No'].map((label) => (
              <TouchableOpacity
                key={label}
                style={[styles.optionPill, smoke === label && styles.optionPillActive]}
                onPress={() => handleSingleSelect(setSmoke, label)}
              >
                <Text style={[styles.optionPillText, smoke === label && styles.optionPillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>🍷 Alcohol</Text>
          <View style={styles.yesNoRow}>
            {['Yes', 'No'].map((label) => (
              <TouchableOpacity
                key={label}
                style={[styles.optionPill, alcohol === label && styles.optionPillActive]}
                onPress={() => handleSingleSelect(setAlcohol, label)}
              >
                <Text style={[styles.optionPillText, alcohol === label && styles.optionPillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sleep section */}
        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>😴 Sleep</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Hours</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="0"
              keyboardType="numeric"
              returnKeyType="done"
              value={sleepHrs}
              onChangeText={setSleepHrs}
            />
          </View>
          <View style={[styles.inputRow, { marginTop: 10 }]}>
            <Text style={styles.inputLabel}>Quality</Text>
          </View>
          <View style={[styles.optionGrid, { marginTop: 8 }]}>
            {['disturbed', 'undisturbed'].map((label) => (
              <TouchableOpacity
                key={label}
                style={[styles.optionPill, sleepQuality === label && styles.optionPillActive]}
                onPress={() => handleSingleSelect(setSleepQuality, label)}
              >
                <Text style={[styles.optionPillText, sleepQuality === label && styles.optionPillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weight section */}
        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>⚖️ Weight</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>kg</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="0"
              keyboardType="numeric"
              returnKeyType="done"
              value={weight}
              onChangeText={setWeight}
            />
          </View>
        </View>

        {/* Exercise section */}
        <View style={styles.activitySection}>
          <Text style={styles.activityTitle}>🏃 Exercise</Text>
          <View style={styles.optionGrid}>
            {['walking', 'light workout'].map((label) => (
              <TouchableOpacity
                key={label}
                style={[styles.optionPill, exercise.includes(label) && styles.optionPillActive]}
                onPress={() => handleMultiSelect(exercise, setExercise, label)}
              >
                <Text style={[styles.optionPillText, exercise.includes(label) && styles.optionPillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.inputRow, { marginTop: 12 }]}>
            <Text style={styles.inputLabel}>Steps</Text>
            <TextInput
              style={styles.numberInput}
              placeholder="0"
              keyboardType="numeric"
              returnKeyType="done"
              value={steps}
              onChangeText={setSteps}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

