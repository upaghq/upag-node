import { BaseResource } from './base-resource';
import {
  Price,
  CreatePriceParams,
  UpdatePriceParams,
  ListPricesParams,
  ListResponse,
} from '../types';

export class Prices extends BaseResource {
  constructor(http: any) {
    super(http, '/products');
  }

  /**
   * Create a new price for a product
   * @param productId - Product ID
   * @param params - Price creation parameters
   * @returns The created price
   */
  async create(productId: string, params: CreatePriceParams): Promise<Price> {
    return this.http.post<Price>(`${this.basePath}/${productId}/prices`, params);
  }

  /**
   * Retrieve a price by ID
   * @param productId - Product ID
   * @param priceId - Price ID
   * @returns The price
   */
  async retrieve(productId: string, priceId: string): Promise<Price> {
    return this.http.get<Price>(`${this.basePath}/${productId}/prices/${priceId}`);
  }

  /**
   * Update a price
   * @param productId - Product ID
   * @param priceId - Price ID
   * @param params - Update parameters
   * @returns The updated price
   */
  async update(productId: string, priceId: string, params: UpdatePriceParams): Promise<Price> {
    return this.http.put<Price>(`${this.basePath}/${productId}/prices/${priceId}`, params);
  }

  /**
   * List all prices for a product
   * @param productId - Product ID
   * @param params - Pagination parameters
   * @returns List of prices
   */
  async list(productId: string, params?: ListPricesParams): Promise<ListResponse<Price>> {
    const query = this.buildQueryString(params);
    return this.http.get<ListResponse<Price>>(`${this.basePath}/${productId}/prices${query}`);
  }
}
