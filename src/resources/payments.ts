import { BaseResource } from './base-resource';
import {
  Payment,
  CreatePaymentParams,
  ListResponse,
  ListPaymentsParams,
} from '../types';

export class Payments extends BaseResource {
  constructor(http: any) {
    super(http, '/payments');
  }

  /**
   * Create a new payment
   * 
   * Supports find-or-create pattern for customer and paymentMethod:
   * - Pass a string UUID to use an existing customer/paymentMethod
   * - Pass an object to create a new customer/paymentMethod inline
   * 
   * @example
   * // With existing customer and payment method IDs
   * await upag.payments.create({
   *   customer: 'cus_123',
   *   paymentMethod: 'pm_456',
   *   amount: 1000,
   *   currency: 'brl'
   * });
   * 
   * @example
   * // With inline customer and payment method creation
   * await upag.payments.create({
   *   customer: { email: 'john@example.com', name: 'John Doe' },
   *   paymentMethod: { type: 'credit_card', card: { number: '4111...', ... } },
   *   amount: 1000,
   *   currency: 'brl'
   * });
   * 
   * @param params - Payment creation parameters
   * @returns The created payment with customer and paymentMethod details
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
   * @param params - List parameters (limit, page, customer)
   * @returns List of payments
   */
  async list(params?: ListPaymentsParams): Promise<ListResponse<Payment>> {
    const query = this.buildQueryString(params);
    return this.http.get<ListResponse<Payment>>(`${this.basePath}${query}`);
  }
}
