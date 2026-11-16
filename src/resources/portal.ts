import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import { idempotencyHeaders } from '../utils/idempotency';
import {
  AttachPortalCardParams,
  IdempotentRequestOptions,
  PortalCard,
  PortalOverview,
  PortalPlanChangeParams,
  PortalSubscription,
  PortalSubscriptionUpdate,
  PortalSubscriptionUpdatePreview,
  UpdatePortalPaymentMethodParams,
} from '../types';

/**
 * The customer side of the billing portal (`/portal`). These routes take no API key: build the
 * client with the session token, the last path segment of the session `url`, as `apiKey`. A
 * token has no `sk_test_` prefix, so pass `baseURL` to reach the sandbox.
 */
export class Portal extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/portal');
  }

  /** Who the customer is and what the session lets them manage. */
  async me(): Promise<PortalOverview> {
    return this.http.get<PortalOverview>(this.buildUrl('me'));
  }

  /**
   * Attaches a card tokenized with the overview's `publishableKey` to the customer. Nothing is
   * charged. It becomes the default card when the customer has none.
   */
  async attachCard(params: AttachPortalCardParams): Promise<PortalCard> {
    return this.http.post<PortalCard>(this.buildUrl('payment-methods'), params);
  }

  /** Switches how a subscription is paid. Nothing is charged until its next invoice. */
  async updatePaymentMethod(
    subscriptionId: string,
    params: UpdatePortalPaymentMethodParams
  ): Promise<PortalSubscription> {
    return this.http.post<PortalSubscription>(
      this.buildUrl(`subscriptions/${subscriptionId}/payment-method`),
      params
    );
  }

  /** What `updateSubscription` would do with the same params, without changing anything. */
  async previewSubscriptionUpdate(
    subscriptionId: string,
    params: PortalPlanChangeParams
  ): Promise<PortalSubscriptionUpdatePreview> {
    return this.http.post<PortalSubscriptionUpdatePreview>(
      this.buildUrl(`subscriptions/${subscriptionId}/preview`),
      params
    );
  }

  /**
   * Switches an item to another price of its product. On `requires_payment` send the customer
   * to `checkoutUrl`: the switch applies once paid. Repeating an `idempotencyKey` with the same
   * params returns the first result.
   */
  async updateSubscription(
    subscriptionId: string,
    params: PortalPlanChangeParams,
    options: IdempotentRequestOptions = {}
  ): Promise<PortalSubscriptionUpdate> {
    return this.http.post<PortalSubscriptionUpdate>(
      this.buildUrl(`subscriptions/${subscriptionId}/update`),
      params,
      idempotencyHeaders(options)
    );
  }
}
