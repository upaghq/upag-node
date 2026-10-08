import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { UpagConfig, UpagError } from '../types';
import { resolveBaseURL } from './api-base-url';

export class HttpClient {
  private client: AxiosInstance;

  constructor(config: UpagConfig) {
    this.client = axios.create({
      baseURL: resolveBaseURL(config),
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': config.userAgent ? `upag-node/2.0.0 ${config.userAgent}` : 'upag-node/2.0.0',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        throw this.handleError(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  private handleError(error: AxiosError): UpagError {
    if (error.response) {
      const raw: any = error.response.data;
      const data: any = raw?.error && typeof raw.error === 'object' ? raw.error : raw;
      return {
        message: data?.message || error.message,
        code: data?.code ?? data?.meta?.errorCode,
        statusCode: error.response.status,
        errors: data?.errors,
        details: data?.details,
        meta: data?.meta,
      };
    } else if (error.request) {
      return {
        message: 'No response received from server',
        code: 'NETWORK_ERROR',
        statusCode: 0,
      };
    } else {
      return {
        code: 'CLIENT_ERROR',
        statusCode: 0,
        message: error.message,
      };
    }
  }
}
