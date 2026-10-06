import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import { idempotencyHeaders } from '../utils/idempotency';
import {
  Card,
  ListResponse,
  CreateCardParams,
  IdempotentRequestOptions,
  ListCardsParams,
} from '../types';

export class Cards extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/cards');
  }

  /**
   * Tokenizes a card. Prefer tokenizing in the browser with upag-js so the card number never
   * reaches your server; use this only if you already handle card data.
   */
  async create(params: CreateCardParams, options: IdempotentRequestOptions = {}): Promise<Card> {
    return this.http.post<Card>(this.basePath, params, idempotencyHeaders(options));
  }

  async list(params?: ListCardsParams): Promise<ListResponse<Card>> {
    return this.http.get<ListResponse<Card>>(`${this.basePath}${this.buildQueryString(params)}`);
  }

  async retrieve(id: string): Promise<Card> {
    return this.http.get<Card>(this.buildUrl(id));
  }

  async remove(id: string): Promise<void> {
    await this.http.delete<void>(this.buildUrl(id));
  }
}
