// Activity storage utility
// - Stores activity logs per date in AsyncStorage
// - Data format optimized for graph building (time-series)
// - Persists across app restarts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@LunaAI:activity_logs';

/**
 * Activity data structure per date:
 * {
 *   "2025-11-02": {
 *     date: "2025-11-02",
 *     bleeding: "Heavy" | null,
 *     bleedingColor: "bright red" | null,
 *     padCounts: "5" | "",
 *     mood: ["Happy", "Sensitive"],
 *     cravings: ["Sugar"],
 *     workLoad: ["Moderate"],
 *     symptoms: ["Cramps", "Bloating"],
 *     birthControl: "Yes" | null,
 *     smoke: "No" | null,
 *     alcohol: "No" | null,
 *     sleepQuality: "undisturbed" | null,
 *     sleepHrs: "8",
 *     weight: "65",
 *     exercise: ["walking"],
 *     steps: "5000",
 *     hasBleeding: boolean, // derived field for quick checks
 *     hasAnyActivity: boolean, // derived field for quick checks
 *   }
 * }
 */

/**
 * Get all stored activity logs
 * @returns {Promise<Object>} Object with dates as keys and activity data as values
 */
export const getAllActivityLogs = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (error) {
    console.error('[ActivityStorage] Error reading logs:', error);
    return {};
  }
};

/**
 * Get activity log for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object|null>} Activity data for the date or null if not found
 */
export const getActivityLog = async (date) => {
  try {
    const allLogs = await getAllActivityLogs();
    return allLogs[date] || null;
  } catch (error) {
    console.error('[ActivityStorage] Error reading log for date:', date, error);
    return null;
  }
};

/**
 * Save or update activity log for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Object} activityData - Activity data to save
 * @returns {Promise<boolean>} Success status
 */
export const saveActivityLog = async (date, activityData) => {
  try {
    const allLogs = await getAllActivityLogs();
    
    // Add derived fields for quick access
    const enrichedData = {
      ...activityData,
      date,
      hasBleeding: !!activityData.bleeding,
      hasAnyActivity: Object.values(activityData).some(
        value => value !== null && value !== '' && 
        (!Array.isArray(value) || value.length > 0)
      ),
    };
    
    // Update the logs
    allLogs[date] = enrichedData;
    
    // Save back to storage
    const jsonValue = JSON.stringify(allLogs);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    
    console.log('[ActivityStorage] ✅ Saved activity log for', date);
    return true;
  } catch (error) {
    console.error('[ActivityStorage] ❌ Error saving log:', error);
    return false;
  }
};

/**
 * Get all dates that have logged activities
 * @returns {Promise<string[]>} Array of dates (YYYY-MM-DD format)
 */
export const getDatesWithActivities = async () => {
  try {
    const allLogs = await getAllActivityLogs();
    return Object.keys(allLogs).filter(date => allLogs[date].hasAnyActivity);
  } catch (error) {
    console.error('[ActivityStorage] Error getting dates with activities:', error);
    return [];
  }
};

/**
 * Get all dates that have bleeding logged
 * @returns {Promise<string[]>} Array of dates (YYYY-MM-DD format) with bleeding
 */
export const getDatesWithBleeding = async () => {
  try {
    const allLogs = await getAllActivityLogs();
    return Object.keys(allLogs).filter(date => allLogs[date].hasBleeding);
  } catch (error) {
    console.error('[ActivityStorage] Error getting dates with bleeding:', error);
    return [];
  }
};

/**
 * Get time-series data for graph building
 * Returns data sorted by date, perfect for plotting
 * @param {string[]} fields - Array of field names to extract (e.g., ['bleeding', 'mood', 'weight'])
 * @param {string} startDate - Optional start date (YYYY-MM-DD)
 * @param {string} endDate - Optional end date (YYYY-MM-DD)
 * @returns {Promise<Array>} Array of objects with date and requested fields
 */
export const getTimeSeriesData = async (fields = [], startDate = null, endDate = null) => {
  try {
    const allLogs = await getAllActivityLogs();
    let dates = Object.keys(allLogs).sort();
    
    // Filter by date range if provided
    if (startDate) {
      dates = dates.filter(d => d >= startDate);
    }
    if (endDate) {
      dates = dates.filter(d => d <= endDate);
    }
    
    // Extract time-series data
    return dates.map(date => {
      const log = allLogs[date];
      const dataPoint = { date };
      
      // Extract requested fields or all fields if none specified
      const fieldsToExtract = fields.length > 0 ? fields : Object.keys(log).filter(k => k !== 'date' && k !== 'hasBleeding' && k !== 'hasAnyActivity');
      
      fieldsToExtract.forEach(field => {
        dataPoint[field] = log[field] ?? null;
      });
      
      return dataPoint;
    });
  } catch (error) {
    console.error('[ActivityStorage] Error getting time-series data:', error);
    return [];
  }
};

/**
 * Delete activity log for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<boolean>} Success status
 */
export const deleteActivityLog = async (date) => {
  try {
    const allLogs = await getAllActivityLogs();
    delete allLogs[date];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allLogs));
    console.log('[ActivityStorage] ✅ Deleted activity log for', date);
    return true;
  } catch (error) {
    console.error('[ActivityStorage] ❌ Error deleting log:', error);
    return false;
  }
};

/**
 * Clear all activity logs (use with caution)
 * @returns {Promise<boolean>} Success status
 */
export const clearAllLogs = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('[ActivityStorage] ✅ Cleared all activity logs');
    return true;
  } catch (error) {
    console.error('[ActivityStorage] ❌ Error clearing logs:', error);
    return false;
  }
};

/**
 * Debug function: Print all stored activity logs to console in a readable format
 * @returns {Promise<void>}
 */
export const printAllLogs = async () => {
  try {
    const allLogs = await getAllActivityLogs();
    const dates = Object.keys(allLogs).sort();
    
    console.log('\n========================================');
    console.log('[ActivityStorage] 📊 All Stored Activity Logs');
    console.log('========================================');
    console.log(`Total dates with logs: ${dates.length}\n`);
    
    dates.forEach(date => {
      const log = allLogs[date];
      console.log(`\n📅 ${date} (${new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })})`);
      console.log('─'.repeat(40));
      
      if (log.hasBleeding) {
        console.log(`  🩸 Bleeding: ${log.bleeding}`);
        console.log(`     Color: ${log.bleedingColor || 'N/A'}`);
        console.log(`     Pad Count: ${log.padCounts || 'N/A'}`);
      }
      
      if (log.mood && log.mood.length > 0) {
        console.log(`  😊 Mood: ${log.mood.join(', ')}`);
      }
      
      if (log.symptoms && log.symptoms.length > 0) {
        console.log(`  🤒 Symptoms: ${log.symptoms.join(', ')}`);
      }
      
      if (log.weight) {
        console.log(`  ⚖️  Weight: ${log.weight} kg`);
      }
      
      if (log.sleepHrs) {
        console.log(`  😴 Sleep: ${log.sleepHrs} hrs (${log.sleepQuality || 'N/A'})`);
      }
      
      if (log.steps) {
        console.log(`  🏃 Steps: ${log.steps}`);
      }
      
      if (log.exercise && log.exercise.length > 0) {
        console.log(`  💪 Exercise: ${log.exercise.join(', ')}`);
      }
      
      if (log.cravings && log.cravings.length > 0) {
        console.log(`  🍫 Cravings: ${log.cravings.join(', ')}`);
      }
      
      if (log.workLoad && log.workLoad.length > 0) {
        console.log(`  💼 Work Load: ${log.workLoad.join(', ')}`);
      }
      
      if (log.birthControl) {
        console.log(`  💊 Birth Control: ${log.birthControl}`);
      }
      
      if (log.smoke) {
        console.log(`  🚬 Smoke: ${log.smoke}`);
      }
      
      if (log.alcohol) {
        console.log(`  🍷 Alcohol: ${log.alcohol}`);
      }
    });
    
    console.log('\n========================================');
    console.log(`Total: ${dates.length} dates with activity logs`);
    console.log('========================================\n');
    
    return allLogs;
  } catch (error) {
    console.error('[ActivityStorage] ❌ Error printing logs:', error);
    return {};
  }
};

