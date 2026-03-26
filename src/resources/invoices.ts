import { BaseResource } from './base-resource';
import {
  Invoice,
  CreateInvoiceParams,
  ListInvoicesParams,
  UpcomingInvoiceParams,
  ListResponse,
  InvoiceItem,
  CreateInvoiceItemParams,
  UpdateInvoiceItemParams,
} from '../types';

export class Invoices extends BaseResource {
  constructor(http: any) {
    super(http, '/invoices');
  }

  /**
   * Create a new invoice
   * @param params - Invoice creation parameters
   * @returns The created invoice
   */
  async create(params: CreateInvoiceParams): Promise<Invoice> {
    return this.http.post<Invoice>(this.basePath, params);
  }

  /**
   * Retrieve an invoice by ID
   * @param id - Invoice ID
   * @returns The invoice
   */
  async retrieve(id: string): Promise<Invoice> {
    return this.http.get<Invoice>(this.buildUrl(id));
  }

  /**
   * Finalize a draft invoice
   * @param id - Invoice ID
   * @returns The updated invoice
   */
  async update(id: string): Promise<Invoice> {
    return this.http.patch<Invoice>(this.buildUrl(id));
  }

  /**
   * List all invoices
   * @param params - Filtering and pagination parameters
   * @returns List of invoices
   */
  async list(params?: ListInvoicesParams): Promise<ListResponse<Invoice>> {
    const query = this.buildQueryString(params);
    return this.http.get<ListResponse<Invoice>>(`${this.basePath}${query}`);
  }

  /**
   * Pay an invoice
   * @param id - Invoice ID
   * @returns The paid invoice
   */
  async pay(id: string): Promise<Invoice> {
    return this.http.post<Invoice>(`${this.basePath}/${id}/pay`);
  }

  /**
   * Mark an invoice as paid out of band
   * @param id - Invoice ID
   * @returns The updated invoice
   */
  async markAsPaid(id: string): Promise<Invoice> {
    return this.http.post<Invoice>(`${this.basePath}/${id}/mark-as-paid`);
  }

  /**
   * Retrieve the upcoming invoice for a subscription
   * @param params - Must include the subscription ID
   * @returns The upcoming invoice preview
   */
  async upcoming(params: UpcomingInvoiceParams): Promise<Invoice> {
    const query = this.buildQueryString(params);
    return this.http.get<Invoice>(`${this.basePath}/upcoming${query}`);
  }

  /**
   * Add an item to an invoice
   * @param invoiceId - Invoice ID
   * @param params - Item creation parameters
   * @returns The created invoice item
   */
  async createItem(invoiceId: string, params: CreateInvoiceItemParams): Promise<InvoiceItem> {
    return this.http.post<InvoiceItem>(`${this.basePath}/${invoiceId}/items`, params);
  }

  /**
   * Update an invoice item
   * @param invoiceId - Invoice ID
   * @param itemId - Invoice item ID
   * @param params - Update parameters
   * @returns The updated invoice item
   */
  async updateItem(invoiceId: string, itemId: string, params: UpdateInvoiceItemParams): Promise<InvoiceItem> {
    return this.http.put<InvoiceItem>(`${this.basePath}/${invoiceId}/items/${itemId}`, params);
  }

  /**
   * Delete an invoice item
   * @param invoiceId - Invoice ID
   * @param itemId - Invoice item ID
   */
  async deleteItem(invoiceId: string, itemId: string): Promise<void> {
    await this.http.delete(`${this.basePath}/${invoiceId}/items/${itemId}`);
  }
}
