import { BaseResource } from './base-resource';
import {
  Customer,
  CreateCustomerParams,
  UpdateCustomerParams,
  ListResponse,
  ListParams,
} from '../types';

export class Customers extends BaseResource {
  constructor(http: any) {
    super(http, '/customers');
  }

  /**
   * Create a new customer
   * @param params - Customer creation parameters
   * @returns The created customer
   */
  async create(params: CreateCustomerParams): Promise<Customer> {
    return this.http.post<Customer>(this.basePath, params);
  }

  /**
   * Retrieve a customer by ID
   * @param id - Customer ID
   * @returns The customer
   */
  async retrieve(id: string): Promise<Customer> {
    return this.http.get<Customer>(this.buildUrl(id));
  }

  /**
   * Update a customer
   * @param id - Customer ID
   * @param params - Update parameters
   * @returns The updated customer
   */
  async update(id: string, params: UpdateCustomerParams): Promise<Customer> {
    return this.http.put<Customer>(this.buildUrl(id), params);
  }

  /**
   * Delete a customer (soft delete)
   * @param id - Customer ID
   * @returns The deleted customer
   */
  async delete(id: string): Promise<Customer> {
    return this.http.delete<Customer>(this.buildUrl(id));
  }

  /**
   * List all customers
   * @param params - List parameters (limit, offset)
   * @returns List of customers
   */
  async list(params?: ListParams): Promise<ListResponse<Customer>> {
    const query = this.buildQueryString(params);
    return this.http.get<ListResponse<Customer>>(`${this.basePath}${query}`);
  }
}

