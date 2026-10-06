import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import {
  CheckoutLayout,
  CreateCheckoutLayoutParams,
  UpdateCheckoutLayoutParams,
  ListCheckoutLayoutsParams,
  ListResponse,
} from '../types';

export class CheckoutLayouts extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/checkout/layouts');
  }

  async create(params: CreateCheckoutLayoutParams): Promise<CheckoutLayout> {
    return this.http.post<CheckoutLayout>(this.basePath, params);
  }

  async retrieve(id: string): Promise<CheckoutLayout> {
    return this.http.get<CheckoutLayout>(this.buildUrl(id));
  }

  async update(id: string, params: UpdateCheckoutLayoutParams): Promise<CheckoutLayout> {
    return this.http.patch<CheckoutLayout>(this.buildUrl(id), params);
  }

  async delete(id: string): Promise<void> {
    await this.http.delete<void>(this.buildUrl(id));
  }

  async list(params?: ListCheckoutLayoutsParams): Promise<ListResponse<CheckoutLayout>> {
    return this.http.get<ListResponse<CheckoutLayout>>(
      `${this.basePath}${this.buildQueryString(params)}`
    );
  }
}
