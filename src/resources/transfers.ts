import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import {
  Transfer,
  CreatedTransfer,
  TransferLookup,
  TransferLookupParams,
  CreateTransferParams,
  ListTransfersParams,
  ReceiptFormat,
  ListResponse,
} from '../types';

export class Transfers extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/transfers');
  }

  async lookup(params: TransferLookupParams): Promise<TransferLookup> {
    return this.http.post<TransferLookup>(`${this.basePath}/lookup`, params);
  }

  async create(params: CreateTransferParams): Promise<CreatedTransfer> {
    return this.http.post<CreatedTransfer>(this.basePath, params);
  }

  async retrieve(id: string): Promise<Transfer> {
    return this.http.get<Transfer>(this.buildUrl(id));
  }

  async list(params?: ListTransfersParams): Promise<ListResponse<Transfer>> {
    return this.http.get<ListResponse<Transfer>>(`${this.basePath}${this.buildQueryString(params)}`);
  }

  /** Receipt HTML. `format` is `image` by default; `pdf` opens the print dialog. */
  async receipt(id: string, params?: { format?: ReceiptFormat }): Promise<string> {
    return this.http.get<string>(`${this.basePath}/${id}/receipt${this.buildQueryString(params)}`);
  }
}
