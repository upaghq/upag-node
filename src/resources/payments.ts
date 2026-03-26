import { BaseResource } from './base-resource';
import {
  Payment,
  CreatePaymentParams,
  ListPaymentsParams,
  RefundPaymentParams,
  Refund,
  ListResponse,
} from '../types';

export class Payments extends BaseResource {
  constructor(http: any) {
    super(http, '/payments');
  }

  /**
   * Create a new payment
   *
   * Supports find-or-create pattern for customer and paymentMethod:
   * - Pass a string ID to use an existing customer/paymentMethod
   * - Pass an object to create a new customer/paymentMethod inline
   */
  async create(params: CreatePaymentParams): Promise<Payment> {
    return this.http.post<Payment>(this.basePath, params);
  }

  /**
   * Retrieve a payment by ID
   * @param id - Payment ID
   * @returns The payment
   */
  async retrieve(id: string): Promise<Payment> {
    return this.http.get<Payment>(this.buildUrl(id));
  }

  /**
   * List all payments
   * @param params - Filtering and pagination parameters
   * @returns List of payments
   */
  async list(params?: ListPaymentsParams): Promise<ListResponse<Payment>> {
    const query = this.buildQueryString(params);
    return this.http.get<ListResponse<Payment>>(`${this.basePath}${query}`);
  }

  /**
   * Refund a payment
   * @param id - Payment ID
   * @param params - Refund parameters (amount, reason)
   * @returns The created refund
   */
  async refund(id: string, params: RefundPaymentParams): Promise<Refund> {
    return this.http.post<Refund>(`${this.basePath}/${id}/refund`, params);
  }

  /**
   * Capture a previously authorized payment
   * @param id - Payment ID
   * @returns The captured payment
   */
  async capture(id: string): Promise<Payment> {
    return this.http.post<Payment>(`${this.basePath}/${id}/capture`);
  }

  /**
   * Cancel a payment
   * @param id - Payment ID
   * @returns The canceled payment
   */
  async cancel(id: string): Promise<Payment> {
    return this.http.post<Payment>(`${this.basePath}/${id}/cancel`);
  }
}
