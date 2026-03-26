// Configuration
export interface UpagConfig {
  apiKey: string;
  timeout?: number;
}

// Common types
export interface ListResponse<T> {
  data: T[];
  hasMore: boolean;
  total?: number;
}

export interface ListParams {
  limit?: number;
  page?: number;
}

// Currency type
export type Currency = 'brl' | 'usd';

// Enums
export type BillingType = 'one_time' | 'recurring';
export type RecurringInterval = 'day' | 'week' | 'month' | 'year';
export type Source = 'checkout' | 'api' | 'dashboard';
export type BillingAddressCollection = 'auto' | 'required';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing' | 'paused' | 'incomplete';
export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
export type CancellationReason = 'too_expensive' | 'missing_features' | 'switched_service' | 'unused' | 'customer_service' | 'too_complex' | 'low_quality' | 'other';
export type RefundReason = 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'other';
export type ApplyAt = 'now' | 'period_end';

// ─── Customer ────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  accountId: string;
  email: string;
  name: string;
  phone?: string | null;
  taxId?: string | null;
  notificationPreference?: string[] | null;
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
  metadata?: Record<string, any> | null;
  livemode: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface CreateCustomerParams {
  email: string;
  name: string;
  phone?: string;
  taxId?: string;
  notificationPreference?: string[];
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
}

export interface UpdateCustomerParams {
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  taxId?: string | null;
  notificationPreference?: string[];
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
}

export interface ListCustomersParams extends ListParams {
  id?: string;
  email?: string;
  phone?: string;
}

// ─── Payment Method ──────────────────────────────────────────────────

export type PaymentMethodType = 'credit_card' | 'pix';

export interface CardParams {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  holderName: string;
}

export interface PixParams {
  expiresIn?: number | null;
}

export interface CreateCreditCardPaymentMethodParams {
  type: 'credit_card';
  card: CardParams;
}

export interface CreatePixPaymentMethodParams {
  type: 'pix';
  pix?: PixParams;
}

export type CreatePaymentMethodParams = CreateCreditCardPaymentMethodParams | CreatePixPaymentMethodParams;

export interface PaymentMethod {
  id: string;
  customerId: string;
  type: PaymentMethodType;
  brand?: string | null;
  firstDigits?: string | null;
  lastDigits?: string | null;
  expiryMonth?: number | null;
  expiryYear?: number | null;
  holderName?: string | null;
  metadata?: Record<string, any> | null;
  livemode: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

// ─── Payment ─────────────────────────────────────────────────────────

export type PaymentStatus = 'incomplete' | 'pending' | 'approved' | 'refused' | 'failed' | 'refunded';
export type PaymentRefuseReason = 'insufficient_funds' | 'invalid_card' | 'expired_card' | 'fraud' | 'other';

export interface Payment {
  id: string;
  customer: Customer;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  gross: number;
  mdr: number;
  net: number;
  interest: number;
  installments: number;
  description?: string | null;
  pixQrCode?: string | null;
  refuseReason?: PaymentRefuseReason | null;
  dueAt?: Date | null;
  livemode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CustomerInput = string | CreateCustomerParams;
export type PaymentMethodInput = string | CreatePaymentMethodParams;

export interface PaymentSplitParams {
  account: string;
  amount: number;
  liable?: boolean;
}

export interface CreatePaymentParams {
  customer: CustomerInput;
  paymentMethod: PaymentMethodInput;
  amount: number;
  currency: Currency;
  installments?: number | null;
  capture?: boolean;
  description?: string | null;
  splits?: PaymentSplitParams[];
}

export interface ListPaymentsParams extends ListParams {
  customer?: string;
  id?: string;
  status?: PaymentStatus;
  paymentMethodType?: PaymentMethodType;
}

export interface RefundPaymentParams {
  amount: number;
  reason?: RefundReason;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason?: RefundReason | null;
  livemode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Product ─────────────────────────────────────────────────────────

export interface Product {
  id: string;
  accountId: string;
  name: string;
  description: string;
  image?: string | null;
  prices?: Price[];
  livemode: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface DefaultPriceParams {
  name: string;
  amount: number;
  currency: Currency;
  billingType: BillingType;
  interval?: RecurringInterval | null;
  intervalCount?: number | null;
}

export interface CreateProductParams {
  name: string;
  description: string;
  image?: string;
  defaultPrice?: DefaultPriceParams;
}

export interface UpdateProductParams {
  name?: string;
  description?: string;
  image?: string;
}

export type ListProductsParams = ListParams;

// ─── Price ───────────────────────────────────────────────────────────

export interface Price {
  id: string;
  productId: string;
  accountId: string;
  name: string;
  amount: number;
  currency: Currency;
  billingType: BillingType;
  interval?: RecurringInterval | null;
  intervalCount?: number | null;
  sources?: Source[] | null;
  livemode: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface CreatePriceParams {
  name: string;
  amount: number;
  currency: Currency;
  billingType: BillingType;
  interval?: RecurringInterval | null;
  intervalCount?: number | null;
}

export interface UpdatePriceParams {
  name?: string;
  amount?: number;
  intervalCount?: number;
  sources?: Source[];
}

export type ListPricesParams = ListParams;

// ─── Checkout Session ────────────────────────────────────────────────

export interface CheckoutSessionItem {
  priceId: string;
  quantity: number;
}

export interface CheckoutSession {
  id: string;
  accountId: string;
  customerId?: string | null;
  items: CheckoutSessionItem[];
  paymentMethods?: PaymentMethodType[];
  billingAddressCollection?: BillingAddressCollection;
  successUrl?: string | null;
  cancelUrl?: string | null;
  url?: string | null;
  status: string;
  livemode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCheckoutSessionParams {
  items: CheckoutSessionItem[];
  customerId?: string | null;
  paymentMethods?: PaymentMethodType[];
  billingAddressCollection?: BillingAddressCollection;
  successUrl?: string | null;
  cancelUrl?: string | null;
}

export interface UpdateCheckoutSessionParams {
  customerId?: string | null;
  items?: CheckoutSessionItem[];
  paymentMethods?: PaymentMethodType[];
  successUrl?: string | null;
  cancelUrl?: string | null;
}

export type ListCheckoutSessionsParams = ListParams;

// ─── Subscription ────────────────────────────────────────────────────

export interface SubscriptionItemParams {
  price: string;
  quantity?: number;
}

export interface Subscription {
  id: string;
  accountId: string;
  customerId: string;
  paymentMethodId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date | null;
  cancellationReason?: CancellationReason | null;
  trialStart?: Date | null;
  trialEnd?: Date | null;
  items: SubscriptionItem[];
  livemode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionParams {
  customer: string;
  paymentMethod: string;
  items: SubscriptionItemParams[];
  trialEnd?: number;
}

export interface UpdateSubscriptionParams {
  paymentMethod?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface CancelSubscriptionParams {
  cancelAtPeriodEnd?: boolean;
  cancellationReason?: CancellationReason;
}

export interface ListSubscriptionsParams extends ListParams {
  customer?: string;
  id?: string;
  status?: SubscriptionStatus;
  cancelAtPeriodEnd?: boolean;
}

// Subscription items
export interface SubscriptionItem {
  id: string;
  subscriptionId: string;
  priceId: string;
  quantity: number;
  price?: Price;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionItemParams {
  price: string;
  quantity?: number;
  applyAt?: ApplyAt;
}

export interface UpdateSubscriptionItemParams {
  price?: string;
  quantity?: number;
  applyAt?: ApplyAt;
}

export interface DeleteSubscriptionItemParams {
  applyAt?: ApplyAt;
}

export interface SubscriptionScheduledChange {
  id: string;
  subscriptionId: string;
  action: string;
  data: Record<string, any>;
  effectiveAt: Date;
  createdAt: Date;
}

// ─── Invoice ─────────────────────────────────────────────────────────

export interface InvoiceItemParams {
  priceId: string;
  quantity: number;
}

export interface Invoice {
  id: string;
  accountId: string;
  customerId: string;
  paymentMethodId?: string | null;
  subscriptionId?: string | null;
  status: InvoiceStatus;
  total: number;
  subtotal: number;
  currency: Currency;
  items: InvoiceItem[];
  dueAt?: Date | null;
  paidAt?: Date | null;
  livemode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoiceParams {
  customerId: string;
  paymentMethodId: string;
  items: InvoiceItemParams[];
}

export interface ListInvoicesParams extends ListParams {
  id?: string;
  status?: InvoiceStatus;
  customer?: string;
}

export interface UpcomingInvoiceParams {
  subscription: string;
}

// Invoice items
export interface InvoiceItem {
  id: string;
  invoiceId: string;
  priceId: string;
  quantity: number;
  amount: number;
  price?: Price;
  product?: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoiceItemParams {
  priceId: string;
  quantity: number;
}

export interface UpdateInvoiceItemParams {
  priceId: string;
  quantity: number;
}

// ─── Webhook ─────────────────────────────────────────────────────────

export const WebhookEvent = {
  PAYMENT_CREATED: 'payment.created',
  PAYMENT_UPDATED: 'payment.updated',
  PAYMENT_INCOMPLETE: 'payment.incomplete',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_PENDING: 'payment.pending',
  PAYMENT_APPROVED: 'payment.approved',
  PAYMENT_REFUSED: 'payment.refused',
  PAYMENT_REFUNDED: 'payment.refunded',

  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',

  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_UPDATED: 'subscription.updated',
  SUBSCRIPTION_ACTIVE: 'subscription.active',
  SUBSCRIPTION_CANCELED: 'subscription.canceled',
  SUBSCRIPTION_PAST_DUE: 'subscription.past_due',
  SUBSCRIPTION_TRIALING: 'subscription.trialing',
  SUBSCRIPTION_INCOMPLETE: 'subscription.incomplete',
  SUBSCRIPTION_PAUSED: 'subscription.paused',
  SUBSCRIPTION_VOID: 'subscription.void',

  INVOICE_CREATED: 'invoice.created',
  INVOICE_UPDATED: 'invoice.updated',
  INVOICE_DRAFTED: 'invoice.drafted',
  INVOICE_OPENED: 'invoice.opened',
  INVOICE_PAID: 'invoice.paid',
  INVOICE_VOIDED: 'invoice.voided',

  REFUND_CREATED: 'refund.created',
  REFUND_UPDATED: 'refund.updated',
  REFUND_PENDING: 'refund.pending',
  REFUND_PROCESSING: 'refund.processing',
  REFUND_COMPLETED: 'refund.completed',
  REFUND_FAILED: 'refund.failed',

  DISPUTE_CREATED: 'dispute.created',
  DISPUTE_UPDATED: 'dispute.updated',
  DISPUTE_NEEDS_RESPONSE: 'dispute.needs_response',
  DISPUTE_UNDER_REVIEW: 'dispute.under_review',
  DISPUTE_WON: 'dispute.won',
  DISPUTE_LOST: 'dispute.lost',

  CHECKOUT_SESSION_CREATED: 'checkout-session.created',
  CHECKOUT_SESSION_OPENED: 'checkout-session.opened',
  CHECKOUT_SESSION_UPDATED: 'checkout-session.updated',
  CHECKOUT_SESSION_COMPLETED: 'checkout-session.completed',
  CHECKOUT_SESSION_EXPIRED: 'checkout-session.expired',
} as const;

export type WebhookEvent = typeof WebhookEvent[keyof typeof WebhookEvent];

export interface Webhook {
  id: string;
  accountId: string;
  name: string;
  description?: string | null;
  url: string;
  headers: Record<string, string>;
  events: WebhookEvent[];
  active: boolean;
  secret: string;
  livemode: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface CreateWebhookParams {
  name: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  description?: string | null;
  headers?: Record<string, string>;
  active?: boolean;
}

export interface UpdateWebhookParams {
  name?: string;
  description?: string | null;
  url?: string;
  headers?: Record<string, string>;
  events?: WebhookEvent[];
  active?: boolean;
}

export type ListWebhooksParams = ListParams;

// ─── Error ───────────────────────────────────────────────────────────

export interface UpagError {
  message: string;
  code: string;
  statusCode?: number;
  errors?: Record<string, any> | null;
}
