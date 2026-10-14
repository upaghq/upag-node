import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import {
  AttachCardParams,
  Card,
  Customer,
  CreateCustomerParams,
  UpdateCustomerParams,
  ListCardsParams,
  ListCustomersParams,
  ListResponse,
} from '../types';

/** The cards of one customer (`/customers/:customerId/cards`). Secret key only. */
export class CustomerCards extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/customers');
  }

  /** Lists the customer's active cards. Cards with no customer are never listed. */
  async list(customerId: string, params?: ListCardsParams): Promise<ListResponse<Card>> {
    return this.http.get<ListResponse<Card>>(
      `${this.basePath}/${customerId}/cards${this.buildQueryString(params)}`
    );
  }

  /** Retrieves an active card of the customer. Any other card is a 404. */
  async retrieve(customerId: string, cardId: string): Promise<Card> {
    return this.http.get<Card>(`${this.basePath}/${customerId}/cards/${cardId}`);
  }

  /**
   * Attaches an existing card. A card with no customer is attached; the same customer again
   * returns it unchanged; another customer's card is a 409 `card_already_attached`.
   */
  async attach(customerId: string, params: AttachCardParams): Promise<Card> {
    return this.http.post<Card>(`${this.basePath}/${customerId}/cards`, params);
  }

  /**
   * Removes (soft deletes) an active card of the customer. It is no longer listed, retrievable
   * or chargeable. The customer's default card is a 409 `card_is_default`; any other card,
   * including one already removed, is a 404.
   */
  async delete(customerId: string, cardId: string): Promise<void> {
    await this.http.delete<void>(`${this.basePath}/${customerId}/cards/${cardId}`);
  }
}

export class Customers extends BaseResource {
  public readonly cards: CustomerCards;

  constructor(http: HttpClient) {
    super(http, '/customers');
    this.cards = new CustomerCards(http);
  }

  async create(params: CreateCustomerParams): Promise<Customer> {
    return this.http.post<Customer>(this.basePath, params);
  }

  async retrieve(id: string): Promise<Customer> {
    return this.http.get<Customer>(this.buildUrl(id));
  }

  async update(id: string, params: UpdateCustomerParams): Promise<Customer> {
    return this.http.patch<Customer>(this.buildUrl(id), params);
  }

  async delete(id: string): Promise<void> {
    await this.http.delete<void>(this.buildUrl(id));
  }

  async list(params?: ListCustomersParams): Promise<ListResponse<Customer>> {
    return this.http.get<ListResponse<Customer>>(`${this.basePath}${this.buildQueryString(params)}`);
  }
}
