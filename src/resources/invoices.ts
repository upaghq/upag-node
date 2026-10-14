import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import {
  Invoice,
  InvoiceItem,
  CreateInvoiceParams,
  UpdateInvoiceParams,
  ListInvoicesParams,
  UpcomingInvoiceParams,
  UpcomingInvoice,
  PayInvoiceParams,
  CreateInvoiceItemParams,
  UpdateInvoiceItemParams,
  ListResponse,
} from '../types';

export class Invoices extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/invoices');
  }

  async create(params: CreateInvoiceParams): Promise<Invoice> {
    return this.http.post<Invoice>(this.basePath, params);
  }

  async retrieve(id: string): Promise<Invoice> {
    return this.http.get<Invoice>(this.buildUrl(id));
  }

  /** Finalize a draft invoice with `{ open: true }`. */
  async update(id: string, params: UpdateInvoiceParams): Promise<Invoice> {
    return this.http.patch<Invoice>(this.buildUrl(id), params);
  }

  async list(params?: ListInvoicesParams): Promise<ListResponse<Invoice>> {
    return this.http.get<ListResponse<Invoice>>(`${this.basePath}${this.buildQueryString(params)}`);
  }

  async pay(id: string, params: PayInvoiceParams): Promise<Invoice> {
    return this.http.post<Invoice>(`${this.basePath}/${id}/pay`, params);
  }

  async markAsPaid(id: string): Promise<Invoice> {
    return this.http.post<Invoice>(`${this.basePath}/${id}/mark-as-paid`);
  }

  async upcoming(params: UpcomingInvoiceParams): Promise<UpcomingInvoice> {
    return this.http.get<UpcomingInvoice>(`${this.basePath}/upcoming${this.buildQueryString(params)}`);
  }

  async createItem(invoiceId: string, params: CreateInvoiceItemParams): Promise<InvoiceItem> {
    return this.http.post<InvoiceItem>(`${this.basePath}/${invoiceId}/items`, params);
  }

  async updateItem(
    invoiceId: string,
    itemId: string,
    params: UpdateInvoiceItemParams
  ): Promise<InvoiceItem> {
    return this.http.patch<InvoiceItem>(`${this.basePath}/${invoiceId}/items/${itemId}`, params);
  }

  async deleteItem(invoiceId: string, itemId: string): Promise<void> {
    await this.http.delete(`${this.basePath}/${invoiceId}/items/${itemId}`);
  }
}
