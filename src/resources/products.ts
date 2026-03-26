import { BaseResource } from './base-resource';
import {
  Product,
  CreateProductParams,
  UpdateProductParams,
  ListProductsParams,
  ListResponse,
} from '../types';

export class Products extends BaseResource {
  constructor(http: any) {
    super(http, '/products');
  }

  /**
   * Create a new product
   * @param params - Product creation parameters
   * @returns The created product
   */
  async create(params: CreateProductParams): Promise<Product> {
    return this.http.post<Product>(this.basePath, params);
  }

  /**
   * Retrieve a product by ID
   * @param id - Product ID
   * @returns The product
   */
  async retrieve(id: string): Promise<Product> {
    return this.http.get<Product>(this.buildUrl(id));
  }

  /**
   * Update a product
   * @param id - Product ID
   * @param params - Update parameters
   * @returns The updated product
   */
  async update(id: string, params: UpdateProductParams): Promise<Product> {
    return this.http.put<Product>(this.buildUrl(id), params);
  }

  /**
   * List all products
   * @param params - Pagination parameters
   * @returns List of products
   */
  async list(params?: ListProductsParams): Promise<ListResponse<Product>> {
    const query = this.buildQueryString(params);
    return this.http.get<ListResponse<Product>>(`${this.basePath}${query}`);
  }
}
