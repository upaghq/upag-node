import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import {
  PaymentLink,
  PaymentLinkItem,
  PaymentLinkBump,
  CreatePaymentLinkParams,
  UpdatePaymentLinkParams,
  ListPaymentLinksParams,
  CreatePaymentLinkItemParams,
  UpdatePaymentLinkItemParams,
  CreatePaymentLinkBumpParams,
  UpdatePaymentLinkBumpParams,
  ListResponse,
} from '../types';

export class PaymentLinks extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/payment-links');
  }

  async create(params: CreatePaymentLinkParams): Promise<PaymentLink> {
    return this.http.post<PaymentLink>(this.basePath, params);
  }

  async retrieve(id: string): Promise<PaymentLink> {
    return this.http.get<PaymentLink>(this.buildUrl(id));
  }

  async update(id: string, params: UpdatePaymentLinkParams): Promise<PaymentLink> {
    return this.http.patch<PaymentLink>(this.buildUrl(id), params);
  }

  async list(params?: ListPaymentLinksParams): Promise<ListResponse<PaymentLink>> {
    return this.http.get<ListResponse<PaymentLink>>(
      `${this.basePath}${this.buildQueryString(params)}`
    );
  }

  async createItem(paymentLinkId: string, params: CreatePaymentLinkItemParams): Promise<PaymentLinkItem> {
    return this.http.post<PaymentLinkItem>(`${this.basePath}/${paymentLinkId}/items`, params);
  }

  async updateItem(
    paymentLinkId: string,
    itemId: string,
    params: UpdatePaymentLinkItemParams
  ): Promise<PaymentLinkItem> {
    return this.http.patch<PaymentLinkItem>(
      `${this.basePath}/${paymentLinkId}/items/${itemId}`,
      params
    );
  }

  async deleteItem(paymentLinkId: string, itemId: string): Promise<void> {
    await this.http.delete(`${this.basePath}/${paymentLinkId}/items/${itemId}`);
  }

  async createBump(paymentLinkId: string, params: CreatePaymentLinkBumpParams): Promise<PaymentLinkBump> {
    return this.http.post<PaymentLinkBump>(`${this.basePath}/${paymentLinkId}/bumps`, params);
  }

  async updateBump(
    paymentLinkId: string,
    bumpId: string,
    params: UpdatePaymentLinkBumpParams
  ): Promise<PaymentLinkBump> {
    return this.http.patch<PaymentLinkBump>(
      `${this.basePath}/${paymentLinkId}/bumps/${bumpId}`,
      params
    );
  }

  async deleteBump(paymentLinkId: string, bumpId: string): Promise<void> {
    await this.http.delete(`${this.basePath}/${paymentLinkId}/bumps/${bumpId}`);
  }
}
