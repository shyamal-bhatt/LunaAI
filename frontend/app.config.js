// Expo app config that loads environment variables from frontend/.env
// This avoids committing secrets in source code and exposes them to the app via Constants.expoConfig.extra
const path = require('path');
const dotenv = require('dotenv');

// Load env from ./frontend/.env
dotenv.config({ path: path.resolve(__dirname, '.env') });

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


