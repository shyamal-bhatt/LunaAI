// Generate dummy activity log data for testing
// - Creates realistic menstrual cycle data from Jan 2025 to today
// - Includes regular cycles with natural fluctuations
// - Adds bleeding days, weight, pad counts, and other activities
import { saveActivityLog, getActivityLog } from './activityStorage';

/**
 * Generate dummy data for menstrual cycle tracking
 * Period cycles: ~28 days with ±3 day variation
 * Bleeding duration: 3-7 days
 * Weight fluctuation: ±1-2kg over cycle
 */
export const generateDummyData = async () => {
  const today = new Date();
  const startDate = new Date('2025-01-01');
  
  // Cycle parameters
  const avgCycleLength = 28; // Average cycle length in days
  const cycleVariation = 3; // ±3 days variation
  const avgBleedingDays = 5; // Average bleeding duration
  const bleedingVariation = 2; // ±2 days
  
  // Activity options
  const bleedingOptions = ['Heavy', 'Mild', 'Light', 'Spotting', 'clots'];
  const bleedingColors = ['bright red', 'light pink', 'dark red or dark purple', 'brown muddy'];
  const moodOptions = ['Happy', 'Neutral', 'Sensitive', 'Irritable', 'Sad', 'low-self esteem', 'procrastinating'];
  const cravingsOptions = ['Sugar', 'snacking', 'sour'];
  const workLoadOptions = ['Easy', 'Moderate', 'High', 'Overwhelming', 'brain fog'];
  const symptomsOptions = ['Cramps', 'Backache', 'Bloating', 'Nausea', 'Fatigue', 'facial hair', 'acne'];
  
  // Base weight (fluctuates over cycle)
  let baseWeight = 62; // Starting weight in kg
  
  // Track cycle dates
  let currentDate = new Date(startDate);
  let lastPeriodStart = new Date('2025-01-05'); // First period starts Jan 5
  let currentBleedingEnd = new Date('2025-01-09'); // First bleeding period ends Jan 9 (5 days)
  let cycleNumber = 0;
  
  console.log('[DummyData] Generating data from', startDate.toISOString().split('T')[0], 'to', today.toISOString().split('T')[0]);
  
  const savedDates = [];
  
  // Generate first period data (Jan 5-9)
  const firstBleedingDays = 5;
  for (let i = 0; i < firstBleedingDays; i++) {
    const bleedDate = new Date(lastPeriodStart);
    bleedDate.setDate(bleedDate.getDate() + i);
    if (bleedDate > today) break;
    
    const bleedDateString = bleedDate.toISOString().split('T')[0];
    
    let bleedingIntensity;
    let padCount;
    if (i === 0) {
      bleedingIntensity = 'Heavy';
      padCount = '5';
    } else if (i === 1) {
      bleedingIntensity = 'Heavy';
      padCount = '4';
    } else if (i < firstBleedingDays - 1) {
      bleedingIntensity = 'Mild';
      padCount = '3';
    } else {
      bleedingIntensity = 'Light';
      padCount = '2';
    }
    
    const activityData = {
      bleeding: bleedingIntensity,
      bleedingColor: 'bright red',
      padCounts: padCount,
      mood: ['Sensitive', 'Irritable'],
      cravings: ['Sugar', 'snacking'],
      symptoms: ['Cramps', 'Backache', 'Bloating'],
      workLoad: ['Moderate'],
      sleepQuality: 'undisturbed',
      sleepHrs: '7',
      weight: (baseWeight - 0.5).toFixed(1),
      exercise: [],
      steps: '4000',
      birthControl: 'No',
      smoke: 'No',
      alcohol: 'No',
    };
    
    await saveActivityLog(bleedDateString, activityData);
    savedDates.push(bleedDateString);
  }
  
  console.log(`[DummyData] First period: Jan 5-9`);
  
  while (currentDate <= today) {
    const dateString = currentDate.toISOString().split('T')[0];
    const daysSinceLastPeriod = Math.floor((currentDate - lastPeriodStart) / (1000 * 60 * 60 * 24));
    
    // Calculate cycle length with variation (gets slightly shorter/longer over time)
    const cycleLength = avgCycleLength + (Math.random() * cycleVariation * 2 - cycleVariation);
    
    // Check if current date is within an active bleeding period
    let isBleedingDay = false;
    if (currentBleedingEnd && currentDate <= currentBleedingEnd) {
      isBleedingDay = true;
    }
    
    // Determine if we should start a new period
    if (daysSinceLastPeriod >= cycleLength) {
      // New period starts
      lastPeriodStart = new Date(currentDate);
      cycleNumber++;
      isBleedingDay = true;
      
      // Determine bleeding duration for this period
      const bleedingDays = Math.max(3, Math.min(7, avgBleedingDays + Math.floor(Math.random() * (bleedingVariation * 2 + 1)) - bleedingVariation));
      
      // Set when this bleeding period will end
      currentBleedingEnd = new Date(lastPeriodStart);
      currentBleedingEnd.setDate(currentBleedingEnd.getDate() + bleedingDays - 1);
      
      // Mark all bleeding days for this period
      for (let i = 0; i < bleedingDays; i++) {
        const bleedDate = new Date(lastPeriodStart);
        bleedDate.setDate(bleedDate.getDate() + i);
        
        if (bleedDate > today) break;
        
        const bleedDateString = bleedDate.toISOString().split('T')[0];
        
        // Bleeding intensity decreases over days
        let bleedingIntensity;
        let padCount;
        
        if (i === 0) {
          // First day - usually heaviest
          bleedingIntensity = Math.random() < 0.6 ? 'Heavy' : 'Mild';
          padCount = Math.floor(Math.random() * 3) + 4; // 4-6 pads
        } else if (i === 1) {
          // Second day - still heavy
          bleedingIntensity = Math.random() < 0.5 ? 'Heavy' : 'Mild';
          padCount = Math.floor(Math.random() * 3) + 3; // 3-5 pads
        } else if (i < bleedingDays - 1) {
          // Middle days - lighter
          bleedingIntensity = Math.random() < 0.3 ? 'Mild' : 'Light';
          padCount = Math.floor(Math.random() * 2) + 2; // 2-3 pads
        } else {
          // Last day - spotting
          bleedingIntensity = Math.random() < 0.5 ? 'Light' : 'Spotting';
          padCount = Math.floor(Math.random() * 2) + 1; // 1-2 pads
        }
        
        // Weight slightly lower during period (water retention drops)
        const periodWeight = baseWeight - (Math.random() * 1.5);
        
        // More likely to have cramps, backache, bloating during period
        const periodSymptoms = [];
        if (Math.random() < 0.8) periodSymptoms.push('Cramps');
        if (Math.random() < 0.6) periodSymptoms.push('Backache');
        if (Math.random() < 0.7) periodSymptoms.push('Bloating');
        if (Math.random() < 0.3) periodSymptoms.push('Fatigue');
        
        // Mood more sensitive during period
        const periodMood = [];
        if (Math.random() < 0.5) periodMood.push('Sensitive');
        if (Math.random() < 0.4) periodMood.push('Irritable');
        if (Math.random() < 0.3) periodMood.push('Sad');
        if (periodMood.length === 0) periodMood.push('Neutral');
        
        // Cravings more common
        const periodCravings = [];
        if (Math.random() < 0.6) periodCravings.push('Sugar');
        if (Math.random() < 0.5) periodCravings.push('snacking');
        
        const activityData = {
          bleeding: bleedingIntensity,
          bleedingColor: bleedingColors[Math.floor(Math.random() * bleedingColors.length)],
          padCounts: padCount.toString(),
          mood: periodMood,
          cravings: periodCravings,
          symptoms: periodSymptoms,
          workLoad: [workLoadOptions[Math.floor(Math.random() * 3)]], // Easy to Moderate
          sleepQuality: Math.random() < 0.4 ? 'disturbed' : 'undisturbed',
          sleepHrs: (Math.floor(Math.random() * 3) + 6).toString(), // 6-8 hours
          weight: periodWeight.toFixed(1),
          exercise: Math.random() < 0.3 ? ['walking'] : [],
          steps: (Math.floor(Math.random() * 2000) + 3000).toString(), // 3000-5000 steps
          birthControl: 'No',
          smoke: 'No',
          alcohol: 'No',
        };
        
        await saveActivityLog(bleedDateString, activityData);
        savedDates.push(bleedDateString);
        
        if (i === 0) {
          console.log(`[DummyData] Period ${cycleNumber} started on ${bleedDateString} (${bleedingDays} days)`);
        }
      }
      
      // Update base weight (fluctuates slightly over cycles)
      baseWeight += (Math.random() * 0.4 - 0.2); // ±0.2kg variation
    }
    
    // Add random activity logs on non-bleeding days (about 30% of days)
    // Check if this date already has bleeding data (avoid duplicates)
    const existingLog = await getActivityLog(dateString);
    if (!existingLog && !isBleedingDay && Math.random() < 0.3) {
      // Weight fluctuates over cycle (lower during period, higher mid-cycle)
      const cyclePosition = daysSinceLastPeriod / cycleLength;
      let weightVariation = 0;
      if (cyclePosition < 0.15) {
        // Just after period - weight lower
        weightVariation = -0.5;
      } else if (cyclePosition > 0.5 && cyclePosition < 0.7) {
        // Mid-cycle - weight higher (ovulation)
        weightVariation = 0.8;
      } else if (cyclePosition > 0.85) {
        // Pre-menstrual - water retention
        weightVariation = 1.2;
      }
      
      const dailyWeight = (baseWeight + weightVariation + (Math.random() * 0.5 - 0.25)).toFixed(1);
      
      // Random mood (happier mid-cycle)
      const mood = [];
      if (cyclePosition > 0.3 && cyclePosition < 0.6) {
        // Mid-cycle - generally happier
        if (Math.random() < 0.6) mood.push('Happy');
        if (Math.random() < 0.3) mood.push('Neutral');
      } else {
        if (Math.random() < 0.4) mood.push('Happy');
        if (Math.random() < 0.5) mood.push('Neutral');
        if (Math.random() < 0.2) mood.push('Sensitive');
      }
      if (mood.length === 0) mood.push('Neutral');
      
      // Occasional symptoms (more common pre-menstrual)
      const symptoms = [];
      if (cyclePosition > 0.75) {
        // Pre-menstrual symptoms
        if (Math.random() < 0.5) symptoms.push('Bloating');
        if (Math.random() < 0.4) symptoms.push('acne');
        if (Math.random() < 0.3) symptoms.push('Fatigue');
      } else if (Math.random() < 0.1) {
        // Random occasional symptoms
        symptoms.push(symptomsOptions[Math.floor(Math.random() * symptomsOptions.length)]);
      }
      
      const activityData = {
        mood: mood,
        cravings: Math.random() < 0.3 ? [cravingsOptions[Math.floor(Math.random() * cravingsOptions.length)]] : [],
        workLoad: [workLoadOptions[Math.floor(Math.random() * workLoadOptions.length)]],
        symptoms: symptoms,
        sleepQuality: Math.random() < 0.3 ? 'disturbed' : 'undisturbed',
        sleepHrs: (Math.floor(Math.random() * 3) + 7).toString(), // 7-9 hours
        weight: dailyWeight,
        exercise: Math.random() < 0.5 ? [Math.random() < 0.6 ? 'walking' : 'light workout'] : [],
        steps: (Math.floor(Math.random() * 3000) + 4000).toString(), // 4000-7000 steps
        birthControl: 'No',
        smoke: 'No',
        alcohol: Math.random() < 0.15 ? 'Yes' : 'No', // Occasional alcohol
      };
      
      await saveActivityLog(dateString, activityData);
      savedDates.push(dateString);
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  console.log(`[DummyData] ✅ Generated ${savedDates.length} activity logs`);
  console.log(`[DummyData] Date range: ${savedDates[0]} to ${savedDates[savedDates.length - 1]}`);
  
  return savedDates;
};

