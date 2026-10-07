import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import {
  Charge,
  ListResponse,
  CreateChargeParams,
  ListChargesParams,
} from '../types';

export class Charges extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/charges');
  }

  /**
   * Create a Pix or card charge. For a card charge authenticated with 3D Secure, pass the
   * completed session as `threeDSecureSession`. A failed card charge carries a `failureCode`.
   */
  async create(params: CreateChargeParams): Promise<Charge> {
    return this.http.post<Charge>(this.basePath, params);
  }

  /** Always includes `items`. Add `includes: 'customer'` to expand the customer. */
  async retrieve(id: string, params?: Pick<ListChargesParams, 'includes'>): Promise<Charge> {
    return this.http.get<Charge>(`${this.buildUrl(id)}${this.buildQueryString(params)}`);
  }

  async list(params?: ListChargesParams): Promise<ListResponse<Charge>> {
    return this.http.get<ListResponse<Charge>>(`${this.basePath}${this.buildQueryString(params)}`);
  }
}
