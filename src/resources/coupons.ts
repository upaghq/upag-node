import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import {
  Coupon,
  CreateCouponParams,
  UpdateCouponParams,
  ListCouponsParams,
  ListResponse,
} from '../types';

export class Coupons extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/coupons');
  }

  async create(params: CreateCouponParams): Promise<Coupon> {
    return this.http.post<Coupon>(this.basePath, params);
  }

  async retrieve(id: string): Promise<Coupon> {
    return this.http.get<Coupon>(this.buildUrl(id));
  }

  async update(id: string, params: UpdateCouponParams): Promise<Coupon> {
    return this.http.patch<Coupon>(this.buildUrl(id), params);
  }

  async delete(id: string): Promise<void> {
    await this.http.delete<void>(this.buildUrl(id));
  }

  async list(params?: ListCouponsParams): Promise<ListResponse<Coupon>> {
    return this.http.get<ListResponse<Coupon>>(`${this.basePath}${this.buildQueryString(params)}`);
  }
}
