import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import {
  BillingPortalConfiguration,
  CreateBillingPortalConfigurationParams,
  UpdateBillingPortalConfigurationParams,
  ListBillingPortalConfigurationsParams,
  CreateBillingPortalSessionParams,
  CreatedBillingPortalSession,
  ListResponse,
} from '../types';

/** What the portal offers customers (`/billing-portal/configurations`). Secret key only. */
export class BillingPortalConfigurations extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/billing-portal/configurations');
  }

  async create(params: CreateBillingPortalConfigurationParams = {}): Promise<BillingPortalConfiguration> {
    return this.http.post<BillingPortalConfiguration>(this.basePath, params);
  }

  async retrieve(id: string): Promise<BillingPortalConfiguration> {
    return this.http.get<BillingPortalConfiguration>(this.buildUrl(id));
  }

  /** Changes only the fields sent. Sessions already open keep their copy of the configuration. */
  async update(
    id: string,
    params: UpdateBillingPortalConfigurationParams
  ): Promise<BillingPortalConfiguration> {
    return this.http.patch<BillingPortalConfiguration>(this.buildUrl(id), params);
  }

  async list(
    params?: ListBillingPortalConfigurationsParams
  ): Promise<ListResponse<BillingPortalConfiguration>> {
    return this.http.get<ListResponse<BillingPortalConfiguration>>(
      `${this.basePath}${this.buildQueryString(params)}`
    );
  }
}

/** Portal links for a customer (`/billing-portal/sessions`). Secret key only. */
export class BillingPortalSessions extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/billing-portal/sessions');
  }

  /** Redirect the customer to the returned `url`. It cannot be read again later. */
  async create(params: CreateBillingPortalSessionParams): Promise<CreatedBillingPortalSession> {
    return this.http.post<CreatedBillingPortalSession>(this.basePath, params);
  }
}

export class BillingPortal {
  public readonly configurations: BillingPortalConfigurations;
  public readonly sessions: BillingPortalSessions;

  constructor(http: HttpClient) {
    this.configurations = new BillingPortalConfigurations(http);
    this.sessions = new BillingPortalSessions(http);
  }
}
