export const env = {
  API_URL: 'https://reqres.in/api',
  API_KEY: 'test-api-key',
  APP_NAME: 'User Backoffice',
  APP_VERSION: '1.0.0',
  ENABLE_DEBUG: true,
  ENABLE_ANALYTICS: false,
  NODE_ENV: 'test',
  IS_DEV: false,
  IS_PROD: false,
} as const;

export function validateEnv(): void {}

export function getApiConfig() {
  return {
    baseURL: env.API_URL,
    headers: {
      'x-api-key': env.API_KEY,
      'Content-Type': 'application/json',
    },
  };
}

export function logEnvConfig(): void {}
