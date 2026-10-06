import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import {
  Webhook,
  WebhookLog,
  CreateWebhookParams,
  UpdateWebhookParams,
  ListWebhooksParams,
  ListResponse,
} from '../types';

export class WebhookLogs extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/webhooks');
  }

  async list(webhookId: string): Promise<ListResponse<WebhookLog>> {
    return this.http.get<ListResponse<WebhookLog>>(`${this.basePath}/${webhookId}/logs`);
  }

  async retrieve(webhookId: string, logId: string): Promise<WebhookLog> {
    return this.http.get<WebhookLog>(`${this.basePath}/${webhookId}/logs/${logId}`);
  }

  async reprocess(webhookId: string, logId: string): Promise<WebhookLog> {
    return this.http.post<WebhookLog>(`${this.basePath}/${webhookId}/logs/${logId}/reprocess`);
  }
}

export class Webhooks extends BaseResource {
  public readonly logs: WebhookLogs;

  constructor(http: HttpClient) {
    super(http, '/webhooks');
    this.logs = new WebhookLogs(http);
  }

  async create(params: CreateWebhookParams): Promise<Webhook> {
    return this.http.post<Webhook>(this.basePath, params);
  }

  async retrieve(id: string): Promise<Webhook> {
    return this.http.get<Webhook>(this.buildUrl(id));
  }

  async update(id: string, params: UpdateWebhookParams): Promise<Webhook> {
    return this.http.patch<Webhook>(this.buildUrl(id), params);
  }

  async delete(id: string): Promise<void> {
    await this.http.delete<void>(this.buildUrl(id));
  }

  async list(params?: ListWebhooksParams): Promise<ListResponse<Webhook>> {
    return this.http.get<ListResponse<Webhook>>(`${this.basePath}${this.buildQueryString(params)}`);
  }
}
