import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import {
  Price,
  CreatePriceParams,
  UpdatePriceParams,
  ListPricesParams,
  ListResponse,
} from '../types';

export class Prices extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/products');
  }

  async create(productId: string, params: CreatePriceParams): Promise<Price> {
    return this.http.post<Price>(`${this.basePath}/${productId}/prices`, params);
  }

  async retrieve(productId: string, priceId: string): Promise<Price> {
    return this.http.get<Price>(`${this.basePath}/${productId}/prices/${priceId}`);
  }

  async update(productId: string, priceId: string, params: UpdatePriceParams): Promise<Price> {
    return this.http.patch<Price>(`${this.basePath}/${productId}/prices/${priceId}`, params);
  }

  async list(productId: string, params?: ListPricesParams): Promise<ListResponse<Price>> {
    return this.http.get<ListResponse<Price>>(
      `${this.basePath}/${productId}/prices${this.buildQueryString(params)}`
    );
  }
}
