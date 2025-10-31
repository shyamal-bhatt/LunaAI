// Central API base URL resolution that works across Expo dev environments
// - Android emulator: use 10.0.2.2 to reach host machine
// - iOS simulator: localhost works
// - Physical devices on LAN: infer Metro host IP
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Try to infer the Metro host (e.g., "192.168.1.10:8081")
const debuggerHost = (Constants?.expoGoConfig?.debuggerHost || Constants?.expoConfig?.hostUri || '').toString();
const inferredHost = debuggerHost.split(':')[0];

const ANDROID_LOCALHOST = '10.0.2.2';
const FALLBACK_LOCALHOST = 'localhost';

const resolvedHost = (() => {
  if (Platform.OS === 'android') {
    // If we can't infer a LAN IP, default to Android emulator loopback
    if (!inferredHost || inferredHost === 'localhost' || inferredHost === '127.0.0.1') {
      return ANDROID_LOCALHOST;
    }
    return inferredHost;
  }
  // iOS simulator can use localhost; devices need the LAN IP
  if (!inferredHost || inferredHost === '127.0.0.1') {
    return FALLBACK_LOCALHOST;
  }
  return inferredHost;
})();

export const API_BASE_URL = `http://${resolvedHost}:8000`;
console.log('Resolved host:', resolvedHost);
console.log('API_BASE_URL:', API_BASE_URL);

// Supabase public (anon) configuration for frontend auth
// Replace with your project values; for dev you can keep them here, for prod move to secure config
export const SUPABASE_URL = 'https://uumpbkprkrreydinleyl.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bXBia3Bya3JyZXlkaW5sZXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMzY2NDUsImV4cCI6MjA3NjkxMjY0NX0.IguJPyCV3h2xt3wtzc1NMDIDfwCJlSTytYSV3HVrCVY';


