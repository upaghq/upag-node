import { UpagConfig } from '../types';

export const API_PRODUCTION_URL = 'https://api.upag.io/v1';
export const API_SANDBOX_URL = 'https://api.upag.dev/v1';

/**
 * Where the API lives for this client. The API has no live mode of its own:
 * the environment is the URL. `baseURL` wins; `sk_test_` is sandbox; otherwise production.
 */
export function resolveBaseURL(config: UpagConfig): string {
  if (config.baseURL) return config.baseURL;
  if (config.apiKey.startsWith('sk_test_')) return API_SANDBOX_URL;
  return API_PRODUCTION_URL;
}
