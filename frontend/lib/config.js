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
// Loaded from Expo config (which is populated from frontend/.env via app.config.js)
const extra = (Constants?.expoConfig?.extra || Constants?.expoGoConfig?.extra || {});
export const SUPABASE_URL = extra.SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = extra.SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[Config] Missing SUPABASE_URL or SUPABASE_ANON_KEY. Ensure frontend/.env is set and Metro restarted.');
}


