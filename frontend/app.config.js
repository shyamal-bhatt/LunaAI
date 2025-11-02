// Expo app config that loads environment variables from frontend/.env
// This avoids committing secrets in source code and exposes them to the app via Constants.expoConfig.extra
const path = require('path');

// Try to load dotenv if available (install with: npm install dotenv)
let dotenv;
try {
  dotenv = require('dotenv');
} catch (e) {
  console.warn('[app.config.js] dotenv not found - install with: npm install dotenv');
}

// Load env from frontend/.env (same directory as app.config.js)
const envPath = path.resolve(__dirname, '.env');
if (dotenv) {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.warn('[app.config.js] Could not load .env file:', envPath);
    console.warn('[app.config.js] Error:', result.error.message);
  } else {
    console.log('[app.config.js] ✅ Loaded .env from:', envPath);
    console.log('[app.config.js] SUPABASE_URL present:', !!process.env.SUPABASE_URL);
    console.log('[app.config.js] SUPABASE_ANON_KEY present:', !!process.env.SUPABASE_ANON_KEY);
  }
} else {
  console.warn('[app.config.js] dotenv not available - using process.env directly');
}

module.exports = {
  expo: {
    name: 'LunaAI',
    slug: 'LunaAI',
    scheme: 'lunaai',
    version: '1.0.0',
    orientation: 'portrait',
    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL || '',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
    },
  },
};


