import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import {
  Customer,
  CreateCustomerParams,
  UpdateCustomerParams,
  ListCustomersParams,
  ListResponse,
} from '../types';

export class Customers extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/customers');
  }

  async create(params: CreateCustomerParams): Promise<Customer> {
    return this.http.post<Customer>(this.basePath, params);
  }

  async retrieve(id: string): Promise<Customer> {
    return this.http.get<Customer>(this.buildUrl(id));
  }

  async update(id: string, params: UpdateCustomerParams): Promise<Customer> {
    return this.http.patch<Customer>(this.buildUrl(id), params);
  }

  async delete(id: string): Promise<void> {
    await this.http.delete<void>(this.buildUrl(id));
  }

  async list(params?: ListCustomersParams): Promise<ListResponse<Customer>> {
    return this.http.get<ListResponse<Customer>>(`${this.basePath}${this.buildQueryString(params)}`);
  }
}
