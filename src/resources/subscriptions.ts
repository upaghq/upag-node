import { BaseResource } from './base-resource';
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
  constructor(http: any) {
    super(http, '/subscriptions');
  }

  /**
   * Create a new subscription
   * @param params - Subscription creation parameters
   * @returns The created subscription
   */
  async create(params: CreateSubscriptionParams): Promise<Subscription> {
    return this.http.post<Subscription>(this.basePath, params);
  }

  /**
   * Retrieve a subscription by ID
   * @param id - Subscription ID
   * @returns The subscription
   */
  async retrieve(id: string): Promise<Subscription> {
    return this.http.get<Subscription>(this.buildUrl(id));
  }

  /**
   * Update a subscription
   * @param id - Subscription ID
   * @param params - Update parameters
   * @returns The updated subscription
   */
  async update(id: string, params: UpdateSubscriptionParams): Promise<Subscription> {
    return this.http.put<Subscription>(this.buildUrl(id), params);
  }

  /**
   * Cancel a subscription
   * @param id - Subscription ID
   * @param params - Cancellation parameters (immediate or at period end)
   * @returns The canceled subscription
   */
  async cancel(id: string, params?: CancelSubscriptionParams): Promise<Subscription> {
    return this.http.delete<Subscription>(this.buildUrl(id), { data: params });
  }

  /**
   * List all subscriptions
   * @param params - Filtering and pagination parameters
   * @returns List of subscriptions
   */
  async list(params?: ListSubscriptionsParams): Promise<ListResponse<Subscription>> {
    const query = this.buildQueryString(params);
    return this.http.get<ListResponse<Subscription>>(`${this.basePath}${query}`);
  }

  /**
   * Add an item to a subscription
   * @param subscriptionId - Subscription ID
   * @param params - Item creation parameters
   * @returns The created item or a scheduled change if applied at period end
   */
  async createItem(subscriptionId: string, params: CreateSubscriptionItemParams): Promise<SubscriptionItem | SubscriptionScheduledChange> {
    return this.http.post(`${this.basePath}/${subscriptionId}/items`, params);
  }

  /**
   * Update a subscription item
   * @param subscriptionId - Subscription ID
   * @param itemId - Subscription item ID
   * @param params - Update parameters
   * @returns The updated item or a scheduled change if applied at period end
   */
  async updateItem(subscriptionId: string, itemId: string, params: UpdateSubscriptionItemParams): Promise<SubscriptionItem | SubscriptionScheduledChange> {
    return this.http.put(`${this.basePath}/${subscriptionId}/items/${itemId}`, params);
  }

  /**
   * Remove an item from a subscription
   * @param subscriptionId - Subscription ID
   * @param itemId - Subscription item ID
   * @param params - Deletion parameters (immediate or at period end)
   */
  async deleteItem(subscriptionId: string, itemId: string, params?: DeleteSubscriptionItemParams): Promise<void> {
    const query = this.buildQueryString(params);
    await this.http.delete(`${this.basePath}/${subscriptionId}/items/${itemId}${query}`);
  }

  /**
   * List scheduled changes for a subscription
   * @param subscriptionId - Subscription ID
   * @returns List of scheduled changes
   */
  async listScheduledChanges(subscriptionId: string): Promise<ListResponse<SubscriptionScheduledChange>> {
    return this.http.get<ListResponse<SubscriptionScheduledChange>>(`${this.basePath}/${subscriptionId}/scheduled-changes`);
  }

  /**
   * Delete a scheduled change
   * @param subscriptionId - Subscription ID
   * @param changeId - Scheduled change ID
   */
  async deleteScheduledChange(subscriptionId: string, changeId: string): Promise<void> {
    await this.http.delete(`${this.basePath}/${subscriptionId}/scheduled-changes/${changeId}`);
  }
}
