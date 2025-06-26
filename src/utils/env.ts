/**
 * Environment configuration utility
 * Provides type-safe access to environment variables
 */

export const env = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || '',
  API_KEY: import.meta.env.VITE_API_KEY || '',

  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'User Backoffice',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Feature Flags
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',

  // Environment
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  IS_DEV: import.meta.env.NODE_ENV === 'development',
  IS_PROD: import.meta.env.NODE_ENV === 'production',
} as const;

/**
 * Validate required environment variables
 * Throws error if required variables are missing
 */
export function validateEnv(): void {
  const required = ['VITE_API_URL', 'VITE_API_KEY'];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file or environment configuration.',
    );
  }
}

/**
 * Get API configuration for axios
 */
export function getApiConfig() {
  return {
    baseURL: env.API_URL,
    headers: {
      'x-api-key': env.API_KEY,
      'Content-Type': 'application/json',
    },
  };
}

/**
 * Log environment configuration (only in development)
 */
export function logEnvConfig(): void {
  if (env.IS_DEV) {
    console.log('🌍 Environment Configuration:', {
      API_URL: env.API_URL,
      API_KEY: env.API_KEY ? '***' : 'NOT SET',
      APP_NAME: env.APP_NAME,
      APP_VERSION: env.APP_VERSION,
      ENABLE_DEBUG: env.ENABLE_DEBUG,
      ENABLE_ANALYTICS: env.ENABLE_ANALYTICS,
      NODE_ENV: env.NODE_ENV,
    });
  }
}
