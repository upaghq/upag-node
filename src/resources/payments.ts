import { BaseResource } from './base-resource';
import {
  Payment,
  CreatePaymentParams,
  ListResponse,
  ListParams,
} from '../types';

export class Payments extends BaseResource {
  constructor(http: any) {
    super(http, '/payments');
  }

  /**
   * Create a new payment
   * @param params - Payment creation parameters
   * @returns The created payment
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
   * @param params - List parameters (limit, offset, customerId, status)
   * @returns List of payments
   */
  async list(params?: ListParams & { customerId?: string; status?: string }): Promise<ListResponse<Payment>> {
    const query = this.buildQueryString(params);
    return this.http.get<ListResponse<Payment>>(`${this.basePath}${query}`);
  }
}

