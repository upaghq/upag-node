import { BaseResource } from './base-resource';
import {
  PaymentMethod,
  CreatePaymentMethodParams,
  ListResponse,
  ListParams,
} from '../types';

export class PaymentMethods extends BaseResource {
  constructor(http: any) {
    super(http, '/customers');
  }

  /**
   * Create a new payment method for a customer
   * 
   * @example
   * // Create a credit card payment method
   * await upag.paymentMethods.create('cus_123', {
   *   type: 'credit_card',
   *   card: {
   *     number: '4111111111111111',
   *     expiryMonth: '12',
   *     expiryYear: '2030',
   *     cvv: '123',
   *     holderName: 'John Doe'
   *   }
   * });
   * 
   * @example
   * // Create a PIX payment method
   * await upag.paymentMethods.create('cus_123', {
   *   type: 'pix',
   *   pix: { expiresIn: 600 }
   * });
   * 
   * @param customerId - Customer ID
   * @param params - Payment method creation parameters
   * @returns The created payment method
   */
  async create(customerId: string, params: CreatePaymentMethodParams): Promise<PaymentMethod> {
    return this.http.post<PaymentMethod>(`${this.basePath}/${customerId}/payment-methods`, params);
  }

  /**
   * Retrieve a payment method by ID
   * @param customerId - Customer ID
   * @param paymentMethodId - Payment method ID
   * @returns The payment method
   */
  async retrieve(customerId: string, paymentMethodId: string): Promise<PaymentMethod> {
    return this.http.get<PaymentMethod>(`${this.basePath}/${customerId}/payment-methods/${paymentMethodId}`);
  }

  /**
   * Delete a payment method (soft delete)
   * @param customerId - Customer ID
   * @param paymentMethodId - Payment method ID
   * @returns The deleted payment method
   */
  async delete(customerId: string, paymentMethodId: string): Promise<PaymentMethod> {
    return this.http.delete<PaymentMethod>(`${this.basePath}/${customerId}/payment-methods/${paymentMethodId}`);
  }

  /**
   * List all payment methods for a customer
   * @param customerId - Customer ID
   * @param params - List parameters (limit, page)
   * @returns List of payment methods
   */
  async list(customerId: string, params?: ListParams): Promise<ListResponse<PaymentMethod>> {
    const query = this.buildQueryString(params);
    return this.http.get<ListResponse<PaymentMethod>>(`${this.basePath}/${customerId}/payment-methods${query}`);
  }
}
