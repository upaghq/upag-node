import { BaseResource } from './base-resource';
import {
  PaymentMethod,
  CreatePaymentMethodParams,
  ListResponse,
  ListParams,
} from '../types';

export class PaymentMethods extends BaseResource {
  constructor(http: any) {
    super(http, '/payment-methods');
  }

  /**
   * Create a new payment method
   * @param params - Payment method creation parameters
   * @returns The created payment method
   */
  async create(params: CreatePaymentMethodParams): Promise<PaymentMethod> {
    return this.http.post<PaymentMethod>(this.basePath, params);
  }

  /**
   * Retrieve a payment method by ID
   * @param id - Payment method ID
   * @returns The payment method
   */
  async retrieve(id: string): Promise<PaymentMethod> {
    return this.http.get<PaymentMethod>(this.buildUrl(id));
  }

  /**
   * Delete a payment method (soft delete)
   * @param id - Payment method ID
   * @returns The deleted payment method
   */
  async delete(id: string): Promise<PaymentMethod> {
    return this.http.delete<PaymentMethod>(this.buildUrl(id));
  }

  /**
   * List all payment methods
   * @param params - List parameters (limit, offset, customerId)
   * @returns List of payment methods
   */
  async list(params?: ListParams & { customerId?: string }): Promise<ListResponse<PaymentMethod>> {
    const query = this.buildQueryString(params);
    return this.http.get<ListResponse<PaymentMethod>>(`${this.basePath}${query}`);
  }

  /**
   * List payment methods for a specific customer
   * @param customerId - Customer ID
   * @param params - List parameters (limit, offset)
   * @returns List of payment methods
   */
  async listByCustomer(customerId: string, params?: ListParams): Promise<ListResponse<PaymentMethod>> {
    return this.list({ ...params, customerId });
  }
}

