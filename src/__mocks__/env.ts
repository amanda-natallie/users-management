// Mock for src/utils/env.ts
export const env = {
  // API Configuration
  API_URL: 'https://reqres.in/api',
  API_KEY: 'test-api-key',

  // App Configuration
  APP_NAME: 'User Backoffice',
  APP_VERSION: '1.0.0',

  // Feature Flags
  ENABLE_DEBUG: true,
  ENABLE_ANALYTICS: false,

  // Environment
  NODE_ENV: 'test',
  IS_DEV: false,
  IS_PROD: false,
} as const;

export function validateEnv(): void {
  // Mock implementation - always passes in tests
}

export function getApiConfig() {
  return {
    baseURL: env.API_URL,
    headers: {
      'x-api-key': env.API_KEY,
      'Content-Type': 'application/json',
    },
  };
}

export function logEnvConfig(): void {
  // Mock implementation - no-op in tests
}
