import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import {
  CheckoutSession,
  CreateCheckoutSessionParams,
  UpdateCheckoutSessionParams,
  ListCheckoutSessionsParams,
  ConfirmCheckoutSessionParams,
  ConfirmCheckoutSessionResponse,
  CreateCheckoutThreeDSecureSessionParams,
  CreatedThreeDSecureSession,
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

  /**
   * Pays the session. The response is the session with the paying `customer` expanded and
   * the `charge` and `invoice` the call created.
   */
  async confirm(
    id: string,
    params: ConfirmCheckoutSessionParams
  ): Promise<ConfirmCheckoutSessionResponse> {
    return this.http.post<ConfirmCheckoutSessionResponse>(`${this.basePath}/${id}/confirm`, params);
  }

  /**
   * Opens a 3D Secure session for the checkout. The amount comes from the session (items,
   * accepted bumps and coupon). Pass the completed session as `charge.threeDSecureSession`
   * when you confirm. Answers 404 while 3D Secure is not enabled for the account.
   */
  async createThreeDSecureSession(
    id: string,
    params: CreateCheckoutThreeDSecureSessionParams
  ): Promise<CreatedThreeDSecureSession> {
    return this.http.post<CreatedThreeDSecureSession>(`${this.basePath}/${id}/3ds/session`, params);
  }

  async applyCoupon(id: string, params: ApplyCouponParams): Promise<CheckoutSession> {
    return this.http.post<CheckoutSession>(`${this.basePath}/${id}/coupon`, params);
  }

  async removeCoupon(id: string): Promise<CheckoutSession> {
    return this.http.delete<CheckoutSession>(`${this.basePath}/${id}/coupon`);
  }
}
