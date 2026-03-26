import { BaseResource } from './base-resource';
import {
  Webhook,
  CreateWebhookParams,
  UpdateWebhookParams,
  ListWebhooksParams,
  ListResponse,
} from '../types';

export class Webhooks extends BaseResource {
  constructor(http: any) {
    super(http, '/webhooks');
  }

  /**
   * Create a new webhook endpoint
   * @param params - Webhook creation parameters
   * @returns The created webhook
   */
  async create(params: CreateWebhookParams): Promise<Webhook> {
    return this.http.post<Webhook>(this.basePath, params);
  }

  /**
   * Retrieve a webhook by ID
   * @param id - Webhook ID
   * @returns The webhook
   */
  async retrieve(id: string): Promise<Webhook> {
    return this.http.get<Webhook>(this.buildUrl(id));
  }

  /**
   * Update a webhook endpoint
   * @param id - Webhook ID
   * @param params - Update parameters
   * @returns The updated webhook
   */
  async update(id: string, params: UpdateWebhookParams): Promise<Webhook> {
    return this.http.put<Webhook>(this.buildUrl(id), params);
  }

  /**
   * Delete a webhook endpoint
   * @param id - Webhook ID
   * @returns The deleted webhook
   */
  async delete(id: string): Promise<Webhook> {
    return this.http.delete<Webhook>(this.buildUrl(id));
  }

  /**
   * List all webhook endpoints
   * @param params - Pagination parameters
   * @returns List of webhooks
   */
  async list(params?: ListWebhooksParams): Promise<ListResponse<Webhook>> {
    const query = this.buildQueryString(params);
    return this.http.get<ListResponse<Webhook>>(`${this.basePath}${query}`);
  }
}
