import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import {
  Subscription,
  CreateSubscriptionParams,
  UpdateSubscriptionParams,
  CancelSubscriptionParams,
  ListSubscriptionsParams,
  ListResponse,
  SubscriptionItem,
  CreateSubscriptionItemParams,
  UpdateSubscriptionItemParams,
  DeleteSubscriptionItemParams,
  SubscriptionScheduledChange,
} from '../types';

export class Subscriptions extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/subscriptions');
  }

  async create(params: CreateSubscriptionParams): Promise<Subscription> {
    return this.http.post<Subscription>(this.basePath, params);
  }

  async retrieve(id: string): Promise<Subscription> {
    return this.http.get<Subscription>(this.buildUrl(id));
  }

  async update(id: string, params: UpdateSubscriptionParams): Promise<Subscription> {
    return this.http.patch<Subscription>(this.buildUrl(id), params);
  }

  async cancel(id: string, params?: CancelSubscriptionParams): Promise<Subscription> {
    return this.http.post<Subscription>(`${this.basePath}/${id}/cancel`, params);
  }

  async list(params?: ListSubscriptionsParams): Promise<ListResponse<Subscription>> {
    return this.http.get<ListResponse<Subscription>>(
      `${this.basePath}${this.buildQueryString(params)}`
    );
  }

  async createItem(
    subscriptionId: string,
    params: CreateSubscriptionItemParams
  ): Promise<SubscriptionItem | SubscriptionScheduledChange> {
    return this.http.post(`${this.basePath}/${subscriptionId}/items`, params);
  }

  async updateItem(
    subscriptionId: string,
    itemId: string,
    params: UpdateSubscriptionItemParams
  ): Promise<SubscriptionItem | SubscriptionScheduledChange> {
    return this.http.patch(`${this.basePath}/${subscriptionId}/items/${itemId}`, params);
  }

  async deleteItem(
    subscriptionId: string,
    itemId: string,
    params?: DeleteSubscriptionItemParams
  ): Promise<void> {
    await this.http.delete(
      `${this.basePath}/${subscriptionId}/items/${itemId}${this.buildQueryString(params)}`
    );
  }

  async listScheduledChanges(
    subscriptionId: string
  ): Promise<ListResponse<SubscriptionScheduledChange>> {
    return this.http.get<ListResponse<SubscriptionScheduledChange>>(
      `${this.basePath}/${subscriptionId}/scheduled-changes`
    );
  }

  async deleteScheduledChange(subscriptionId: string, changeId: string): Promise<void> {
    await this.http.delete(`${this.basePath}/${subscriptionId}/scheduled-changes/${changeId}`);
  }
}
