import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import {
  Product,
  CreateProductParams,
  UpdateProductParams,
  ListProductsParams,
  ListResponse,
} from '../types';

export class Products extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/products');
  }

  async create(params: CreateProductParams): Promise<Product> {
    return this.http.post<Product>(this.basePath, params);
  }

  async retrieve(id: string): Promise<Product> {
    return this.http.get<Product>(this.buildUrl(id));
  }

  async update(id: string, params: UpdateProductParams): Promise<Product> {
    return this.http.patch<Product>(this.buildUrl(id), params);
  }

  async list(params?: ListProductsParams): Promise<ListResponse<Product>> {
    return this.http.get<ListResponse<Product>>(`${this.basePath}${this.buildQueryString(params)}`);
  }
}
