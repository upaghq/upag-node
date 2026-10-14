import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import { idempotencyHeaders } from '../utils/idempotency';
import { Card, CreateCardParams, IdempotentRequestOptions } from '../types';

/**
 * Card tokenization, the only card operation at the root. Reading, attaching and deleting
 * cards live under a customer: `upag.customers.cards`.
 */
export class Cards extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/cards');
  }

  /**
   * Tokenizes a card. Prefer tokenizing in the browser with upag-js so the card number never
   * reaches your server; use this only if you already handle card data.
   *
   * The card is created without a customer. With a secret key, `customer` attaches it on
   * creation; a publishable key ignores that field.
   */
  async create(params: CreateCardParams, options: IdempotentRequestOptions = {}): Promise<Card> {
    return this.http.post<Card>(this.basePath, params, idempotencyHeaders(options));
  }
}
