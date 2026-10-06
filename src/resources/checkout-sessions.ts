import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import {
  CheckoutSession,
  CreateCheckoutSessionParams,
  UpdateCheckoutSessionParams,
  ListCheckoutSessionsParams,
  ConfirmCheckoutSessionParams,
  ApplyCouponParams,
  ListResponse,
} from '../types';

export class CheckoutSessions extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/checkout/sessions');
  }

  async create(params: CreateCheckoutSessionParams): Promise<CheckoutSession> {
    return this.http.post<CheckoutSession>(this.basePath, params);
  }

  async retrieve(id: string): Promise<CheckoutSession> {
    return this.http.get<CheckoutSession>(this.buildUrl(id));
  }

  async update(id: string, params: UpdateCheckoutSessionParams): Promise<CheckoutSession> {
    return this.http.patch<CheckoutSession>(this.buildUrl(id), params);
  }

  async delete(id: string): Promise<void> {
    await this.http.delete<void>(this.buildUrl(id));
  }

  async list(params?: ListCheckoutSessionsParams): Promise<ListResponse<CheckoutSession>> {
    return this.http.get<ListResponse<CheckoutSession>>(
      `${this.basePath}${this.buildQueryString(params)}`
    );
  }

  async confirm(id: string, params: ConfirmCheckoutSessionParams): Promise<CheckoutSession> {
    return this.http.post<CheckoutSession>(`${this.basePath}/${id}/confirm`, params);
  }

  async applyCoupon(id: string, params: ApplyCouponParams): Promise<CheckoutSession> {
    return this.http.post<CheckoutSession>(`${this.basePath}/${id}/coupon`, params);
  }

  async removeCoupon(id: string): Promise<CheckoutSession> {
    return this.http.delete<CheckoutSession>(`${this.basePath}/${id}/coupon`);
  }
}
