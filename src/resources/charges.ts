import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import { idempotencyHeaders } from '../utils/idempotency';
import {
  Charge,
  ListResponse,
  CreateChargeParams,
  IdempotentRequestOptions,
  ListChargesParams,
} from '../types';

export class Charges extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/charges');
  }

  /**
   * Create a Pix or card charge. For a card charge authenticated with 3D Secure, pass the
   * completed session as `threeDSecureSession`. A failed card charge carries a `failureCode`.
   * `idempotencyKey` is sent as the `Idempotency-Key` header; the API does not enforce it on
   * charges yet, so reconcile through `meta` before retrying a create that timed out.
   */
  async create(params: CreateChargeParams, options: IdempotentRequestOptions = {}): Promise<Charge> {
    return this.http.post<Charge>(this.basePath, params, idempotencyHeaders(options));
  }

  /** Always includes `items`. Add `includes: 'customer'` to expand the customer. */
  async retrieve(id: string, params?: Pick<ListChargesParams, 'includes'>): Promise<Charge> {
    return this.http.get<Charge>(`${this.buildUrl(id)}${this.buildQueryString(params)}`);
  }

  async list(params?: ListChargesParams): Promise<ListResponse<Charge>> {
    return this.http.get<ListResponse<Charge>>(`${this.basePath}${this.buildQueryString(params)}`);
  }
}
