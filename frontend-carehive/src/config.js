// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// reCAPTCHA Configuration
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'your-recaptcha-site-key';

// Other configuration constants
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export {
  API_BASE_URL,
  RECAPTCHA_SITE_KEY,
  AUTH_TOKEN_KEY,
  USER_DATA_KEY
};
// Add more configuration constants as needed
