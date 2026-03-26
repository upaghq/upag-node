import { BaseResource } from './base-resource';
import {
  CheckoutSession,
  CreateCheckoutSessionParams,
  UpdateCheckoutSessionParams,
  ListCheckoutSessionsParams,
  ListResponse,
} from '../types';

export class CheckoutSessions extends BaseResource {
  constructor(http: any) {
    super(http, '/checkout-sessions');
  }

  /**
   * Create a new checkout session
   * @param params - Checkout session creation parameters
   * @returns The created checkout session
   */
  async create(params: CreateCheckoutSessionParams): Promise<CheckoutSession> {
    return this.http.post<CheckoutSession>(this.basePath, params);
  }

  /**
   * Retrieve a checkout session by ID
   * @param id - Checkout session ID
   * @returns The checkout session
   */
  async retrieve(id: string): Promise<CheckoutSession> {
    return this.http.get<CheckoutSession>(this.buildUrl(id));
  }

  /**
   * Update a checkout session
   * @param id - Checkout session ID
   * @param params - Update parameters
   * @returns The updated checkout session
   */
  async update(id: string, params: UpdateCheckoutSessionParams): Promise<CheckoutSession> {
    return this.http.put<CheckoutSession>(this.buildUrl(id), params);
  }

  /**
   * List all checkout sessions
   * @param params - Pagination parameters
   * @returns List of checkout sessions
   */
  async list(params?: ListCheckoutSessionsParams): Promise<ListResponse<CheckoutSession>> {
    const query = this.buildQueryString(params);
    return this.http.get<ListResponse<CheckoutSession>>(`${this.basePath}${query}`);
  }
}
