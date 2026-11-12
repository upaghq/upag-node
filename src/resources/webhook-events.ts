import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import { ListResponse, WebhookEventOption } from '../types';

export class WebhookEvents extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/webhook-events');
  }

  async list(): Promise<ListResponse<WebhookEventOption>> {
    return this.http.get<ListResponse<WebhookEventOption>>(this.basePath);
  }
}
