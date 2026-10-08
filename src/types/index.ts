export interface UpagConfig {
  apiKey: string;
  timeout?: number;
  /** Overrides the host inferred from the key (`sk_test_` → sandbox). */
  baseURL?: string;
  /** Appended to the `User-Agent` after `upag-node/<version>`, e.g. `my-app/1.2.0`. */
  userAgent?: string;
}

export interface ListResponse<T> {
  data: T[];
  count: number;
}

export interface ListParams {
  /** @default 1 */
  page?: number;
  /** @default 15 */
  limit?: number;
}

export interface IdempotentRequestOptions {
  /** Sent as the `Idempotency-Key` header (max 255 characters). */
  idempotencyKey?: string;
}

export type Currency = 'brl' | 'usd';
export type BillingType = 'one_time' | 'recurring';
export type RecurringInterval = 'day' | 'week' | 'month' | 'year';
export type PaymentMethodType = 'pix' | 'card';
export type BillingAddressCollection = 'auto' | 'required' | 'none';
export type ApplyAt = 'now' | 'period_end';

export type DocumentType = 'cpf' | 'cnpj';

export interface Phone {
  countryCode: string;
  areaCode: string;
  number: string;
}

export interface Address {
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
}

export interface CustomerInput {
  name: string;
  document: { type: DocumentType; number: string };
  email?: string | null;
  phone?: Phone | null;
  address?: Address | null;
}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  document: { type: DocumentType; number: string };
  phone: Phone | null;
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export type CreateCustomerParams = CustomerInput;
export type UpdateCustomerParams = Partial<Omit<CustomerInput, 'document'>>;
export type ListCustomersParams = ListParams;

export type CardBrand =
  | 'visa'
  | 'mastercard'
  | 'elo'
  | 'amex'
  | 'hipercard'
  | 'diners'
  | 'discover'
  | 'jcb'
  | 'aura'
  | 'unknown';
export type CardFunding = 'credit' | 'debit' | 'prepaid' | 'unknown';
export type CardWallet = 'apple_pay' | 'google_pay';
export type CardStatus = 'active' | 'invalid' | 'removed';

export interface Card {
  id: string;
  customer: string | null;
  brand: CardBrand;
  firstDigits: string;
  lastDigits: string;
  holderName: string;
  expirationMonth: number;
  expirationYear: number;
  funding: CardFunding | null;
  wallet: CardWallet | null;
  status: CardStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardParams {
  /** Card number, 13 to 19 digits, no spaces or dashes. */
  number: string;
  /** 1 to 12. */
  expirationMonth: number;
  /** Four-digit year. */
  expirationYear: number;
  /** Security code, 3 or 4 digits. */
  cvv: string;
  /** Letters and spaces only, 2 to 64 characters (no accents or punctuation). */
  holderName: string;
}

export interface ListCardsParams extends ListParams {
  customer?: string;
}

export type ThreeDSecureSessionStatus =
  | 'requires_action'
  | 'completed'
  | 'failed'
  | 'canceled'
  | 'expired';

export interface ThreeDSecureSession {
  id: string;
  status: ThreeDSecureSessionStatus;
  /** What the card will be charged, in cents. Fixed when the session is created. */
  finalAmount: number;
  card: string;
  expiresAt: string;
}

export interface CreatedThreeDSecureSession extends ThreeDSecureSession {
  /**
   * Hand this to your checkout page and to nobody else; the browser SDK needs it to
   * run the authentication. It is shown only here and never returned again.
   */
  clientSecret: string;
}

export interface CreateThreeDSecureSessionParams {
  /** List price in cents, up to 2,147,483,647. Send exactly what the charge will carry. */
  amount: number;
  /** 1 to 12. Defaults to 1. */
  installments?: number;
  /** UUID of a tokenized card of your account. */
  card: string;
  /** A customer UUID, or an inline customer used for this authentication only. */
  customer: string | CustomerInput;
  /** Name shown on the bank's challenge screen, up to 255 characters. */
  softDescriptor?: string;
  /** Sandbox only: always show the bank challenge. */
  forceChallenge?: boolean;
}

export type ChargeType = 'pix' | 'card';
export type ChargeStatus =
  | 'pending'
  | 'paid'
  | 'expired'
  | 'failed'
  | 'in_review'
  | 'refunded'
  | 'partially_refunded'
  | 'chargeback';
/** Why a charge failed. Set when `status` is `failed`, `null` otherwise. */
export type ChargeFailureCode =
  | 'card_declined'
  | 'card_expired'
  | 'card_blocked'
  | 'card_invalid'
  | 'card_invalid_number'
  | 'card_invalid_cvv'
  | 'insufficient_funds'
  | 'installments_exceeded'
  | 'fraud_suspected'
  | 'antifraud_declined'
  | 'authentication_failed'
  | 'issuer_unavailable'
  | 'processing_error'
  | 'unknown';
export type ChargeItemKind = 'physical' | 'digital' | 'shipping' | 'other';

export interface ChargeItemParams {
  externalId?: string;
  kind?: ChargeItemKind;
  sku?: string;
  name: string;
  url?: string;
  quantity: number;
  /** In cents. */
  unitAmount: number;
}

export interface ChargeItem {
  id: string;
  externalId: string | null;
  kind: ChargeItemKind;
  sku: string | null;
  name: string;
  url: string | null;
  quantity: number;
  unitAmount: number;
  amount: number;
  createdAt: string;
}

export interface ChargeSplitParams {
  account: string;
  /** In cents, greater than zero. */
  amount: number;
}

export interface ChargeSplit {
  id: string;
  type: 'mdr' | 'account';
  status: 'pending' | 'processing' | 'paid' | 'failed';
  amount: number;
  account?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChargeLocation {
  city?: string | null;
  /** Two-letter code. */
  state?: string | null;
  /** Two-letter code. */
  country?: string | null;
  zip?: string | null;
}

interface BaseCreateChargeParams {
  /** In cents, greater than zero. */
  amount: number;
  /** Free-text note, 1 to 140 characters. */
  description?: string;
  /** Up to 50 string key-value pairs, returned as sent. */
  meta?: Record<string, string>;
  /** Up to 100 informational items. */
  items?: ChargeItemParams[];
  splits?: ChargeSplitParams[];
}

export interface CreatePixChargeParams extends BaseCreateChargeParams {
  type: 'pix';
  pix?: {
    method: 'dynamic' | 'static';
    /** ISO 8601 expiry of a dynamic charge. Not accepted for static. */
    dueDate?: string;
  };
  /** A customer UUID, or an inline customer. Required for dynamic Pix. */
  customer?: string | CustomerInput;
}

export interface CreateCardChargeParams extends BaseCreateChargeParams {
  type: 'card';
  /** UUID of a tokenized card. With a 3D Secure session, it must be the session's card. */
  card: string;
  /** Required on card charges. */
  customer: string | (CustomerInput & { ipAddress?: string });
  /** 1 to 12. Defaults to 1. With a 3D Secure session it must match the session. */
  installments?: number;
  /** Shown on the payer's statement, up to 13 characters. */
  softDescriptor?: string;
  /** Where the payer appears to be. Never stored on the customer. */
  location?: ChargeLocation;
  /** A completed 3D Secure session for this card, amount and installments. */
  threeDSecureSession?: string;
  /** Public IPv4 or IPv6 of the payer. */
  ipAddress?: string;
}

export type CreateChargeParams = CreatePixChargeParams | CreateCardChargeParams;

export interface Charge {
  id: string;
  type: ChargeType;
  status: ChargeStatus;
  amount: number;
  /** Why the charge failed, `null` when it did not. */
  failureCode: ChargeFailureCode | null;
  description: string | null;
  meta: Record<string, string> | null;
  /** The customer id, the expanded customer when `includes=customer`, or `null`. */
  customer: string | Customer | null;
  /**
   * Always present on `charges.retrieve`. On `charges.list` it is present only
   * with `includes=items`.
   */
  items?: ChargeItem[];
  pix?: {
    reference: string | null;
    qrCode: string | null;
    expiresAt: string | null;
  };
  card?: {
    id: string;
    installments: number;
    nsu: string | null;
    authorizationCode: string | null;
    acquirerStatusCode: string | null;
  };
  splits: ChargeSplit[];
  ipAddress: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListChargesParams extends ListParams {
  /** `items`, `customer`, or both, comma separated. `retrieve` always returns `items`. */
  includes?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePriceFields {
  name: string;
  /** In cents, min 100. */
  amount: number;
  currency: Currency;
  billingType: BillingType;
  interval?: RecurringInterval | null;
  intervalCount?: number | null;
  metadata?: Record<string, string | boolean>;
}

export interface CreateProductParams {
  name: string;
  description: string;
  image?: string;
  defaultPrice?: CreatePriceFields;
}

export interface UpdateProductParams {
  name?: string;
  description?: string;
  image?: string;
}

export type ListProductsParams = ListParams;

export interface Price {
  id: string;
  name: string;
  billingType: BillingType;
  interval: RecurringInterval | null;
  intervalCount: number | null;
  currency: Currency;
  amount: number;
  metadata: Record<string, string | boolean>;
  createdAt: string;
  updatedAt: string;
}

export type CreatePriceParams = CreatePriceFields;

export interface UpdatePriceParams {
  name?: string;
  amount?: number;
  intervalCount?: number;
  metadata?: Record<string, string | boolean>;
}

export type ListPricesParams = ListParams;

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';

export interface PayPixParams {
  method: 'pix';
  dueDate?: string;
}

export interface PayCardParams {
  method: 'card';
  card: string;
  installments?: number;
  threeDSecureSession?: string;
  ipAddress?: string;
  location?: ChargeLocation;
  softDescriptor?: string;
}

export type PayInvoiceParams = PayPixParams | PayCardParams;

export interface InvoiceItemParams {
  price: string;
  quantity: number;
}

export interface InvoiceItem {
  id: string;
  product: string;
  price: string;
  name: string;
  amount: number;
  quantity: number;
  totalAmount: number;
}

export interface InvoiceDiscount {
  id: string;
  item: string;
  coupon: string;
  type: 'coupon';
  amount: number;
}

export interface InvoicePayment {
  charge: string;
  type: ChargeType;
  status: ChargeStatus;
  settledAt: string | null;
  createdAt: string;
}

export interface Invoice {
  id: string;
  customer: string;
  /** The id of the saved payment method, or `null`. Not the `pix` / `card` value of `Subscription.paymentMethod`. */
  paymentMethod: string | null;
  subscription: string | null;
  status: InvoiceStatus;
  currency: Currency;
  description: string | null;
  amountDue: number;
  amountPaid: number;
  attemptCount: number;
  dueDate: string | null;
  paidAt: string | null;
  items: InvoiceItem[];
  discounts: InvoiceDiscount[];
  payments: InvoicePayment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceParams {
  customer: string;
  description?: string | null;
  dueDate?: string | null;
  items: InvoiceItemParams[];
  open?: boolean;
}

export interface UpdateInvoiceParams {
  open?: boolean;
}

export interface ListInvoicesParams extends ListParams {
  id?: string;
  status?: InvoiceStatus;
  customer?: string;
}

export interface UpcomingInvoiceParams {
  subscription: string;
}

export interface CreateInvoiceItemParams {
  price: string;
  quantity: number;
}

export interface UpdateInvoiceItemParams {
  price?: string;
  quantity?: number;
}

export interface UpcomingInvoiceItem {
  product: string;
  price: string;
  name: string;
  amount: number;
  quantity: number;
  totalAmount: number;
}

export interface UpcomingInvoice {
  subscription: string;
  customer: string;
  currency: Currency;
  periodStart: string;
  periodEnd: string;
  amountDue: number;
  items: UpcomingInvoiceItem[];
}

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'trialing'
  | 'incomplete'
  | 'paused'
  | 'void';
export type SubscriptionPaymentMethod = 'pix' | 'card';
export type CancellationReason =
  | 'low_quality'
  | 'missing_features'
  | 'other'
  | 'switched_service'
  | 'too_complex'
  | 'too_expensive'
  | 'unused'
  /** Set by Upag: the trial ended with no payment method on file and `missingPaymentMethod` was `cancel`. Not accepted on cancel. */
  | 'missing_payment_method';
export type TrialEndBehavior = 'create_invoice' | 'cancel';
export type TrialInterval = 'day' | 'week' | 'month';
export type PaymentMethodCollection = 'always' | 'if_required';
export type ScheduledChangeOperation = 'add' | 'update' | 'remove';

export interface SubscriptionItem {
  id: string;
  product: string;
  price: string;
  name: string;
  amount: number;
  quantity: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  customer: string;
  paymentMethod: SubscriptionPaymentMethod | null;
  card: string | null;
  status: SubscriptionStatus;
  currency: Currency;
  interval: RecurringInterval;
  intervalCount: number;
  cancelAtPeriodEnd: boolean;
  startDate: string | null;
  endDate: string | null;
  trialStartDate: string | null;
  trialEndDate: string | null;
  /** What happens when the trial ends with no payment method. `null` when there was no trial. */
  trialEndBehavior: TrialEndBehavior | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  canceledAt: string | null;
  cancellationReason: CancellationReason | null;
  items: SubscriptionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionParams {
  customer: string;
  /** Required unless `trialEnd` is set. */
  paymentMethod?: SubscriptionPaymentMethod;
  /** Required when `paymentMethod` is `card`. */
  card?: string;
  trialEnd?: string;
  items: { price: string; quantity?: number }[];
}

export interface UpdateSubscriptionParams {
  paymentMethod?: SubscriptionPaymentMethod;
  card?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface CancelSubscriptionParams {
  atPeriodEnd?: boolean;
  reason?: Exclude<CancellationReason, 'missing_payment_method'>;
}

export interface ListSubscriptionsParams extends ListParams {
  id?: string;
  status?: SubscriptionStatus;
  customer?: string;
  cancelAtPeriodEnd?: boolean;
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
  subscription: string;
  operation: ScheduledChangeOperation;
  item: string | null;
  price: string | null;
  quantity: number | null;
  createdAt: string;
}

export type CheckoutSessionStatus = 'open' | 'complete' | 'expired';

/** A relative trial, counted from the moment the subscription is created. Up to 730 days: `day` ≤ 730, `week` ≤ 104, `month` ≤ 24. */
export interface TrialDuration {
  interval: TrialInterval;
  intervalCount: number;
}

export interface TrialSettings {
  endBehavior: {
    /** @default 'create_invoice' */
    missingPaymentMethod: TrialEndBehavior;
  };
}

/**
 * Trial of the subscription an offer creates. The trial is a property of the
 * link or session, not of the price. Needs at least one recurring item.
 */
export interface PaymentLinkSubscriptionDataParams {
  /** `null` removes the trial. */
  trial?: TrialDuration | null;
  trialSettings?: { endBehavior?: { missingPaymentMethod?: TrialEndBehavior } };
}

/** A session takes either a relative `trial` or an absolute `trialEnd`, never both. */
export interface CheckoutSessionSubscriptionDataParams extends PaymentLinkSubscriptionDataParams {
  /** At least 48 hours from now. Unix seconds or an ISO date. */
  trialEnd?: number | string;
}

export interface PaymentLinkSubscriptionData {
  trial: TrialDuration | null;
  trialSettings: TrialSettings;
}

export interface CheckoutSessionSubscriptionData extends PaymentLinkSubscriptionData {
  trialEnd: string | null;
}

export interface CheckoutSessionItem {
  id: string;
  price: string;
  quantity: number;
}

export interface CheckoutSessionBump {
  id: string;
  price: string;
  quantity: number;
  amount: number;
  title: string | null;
  description: string | null;
}

export interface CheckoutSessionDiscount {
  id: string;
  item: string;
  coupon: string;
  type: 'coupon';
  amount: number;
}

export interface CheckoutSession {
  id: string;
  customer: string | null;
  checkoutLayout: string | null;
  paymentLink: string | null;
  paymentMethods: PaymentMethodType[];
  subscriptionData: CheckoutSessionSubscriptionData;
  /** `if_required` lets a session with nothing to pay today finish without a payment method. */
  paymentMethodCollection: PaymentMethodCollection;
  status: CheckoutSessionStatus;
  url: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  billingAddressCollection: BillingAddressCollection;
  successUrl: string | null;
  cancelUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  country: string | null;
  region: string | null;
  city: string | null;
  invoice: string | null;
  /** The subscription the session created, once it has. */
  subscription: string | null;
  couponEnabled: boolean;
  couponCode: string | null;
  items: CheckoutSessionItem[];
  bumps: CheckoutSessionBump[];
  discounts: CheckoutSessionDiscount[];
}

export interface CreateCheckoutSessionParams {
  customer?: string | null;
  items: { price: string; quantity: number }[];
  bumps?: {
    price: string;
    quantity?: number;
    title?: string | null;
    description?: string | null;
  }[];
  paymentMethods?: PaymentMethodType[];
  successUrl?: string | null;
  cancelUrl?: string | null;
  billingAddressCollection?: BillingAddressCollection;
  couponEnabled?: boolean;
  subscriptionData?: CheckoutSessionSubscriptionDataParams;
  /**
   * @default 'always'. With a trial, `always` needs `card` among `paymentMethods`.
   */
  paymentMethodCollection?: PaymentMethodCollection;
  expiresAt?: string | null;
}

export interface UpdateCheckoutSessionParams {
  customer?: string | null;
  paymentMethods?: PaymentMethodType[];
  successUrl?: string | null;
  cancelUrl?: string | null;
}

export interface ListCheckoutSessionsParams extends ListParams {
  id?: string;
  status?: CheckoutSessionStatus;
  customer?: string;
}

/**
 * A card to keep for the subscription when nothing is charged today (a trial
 * covers every item). A card already tokenized through `cards.create`.
 */
export interface ConfirmPaymentMethodParams {
  type: 'card';
  card: string;
}

interface ConfirmCheckoutSessionBase {
  customer: string | CustomerInput;
  bumps?: string[];
}

/** An amount is due today: pay it with `charge`. */
export interface ConfirmCheckoutSessionWithCharge extends ConfirmCheckoutSessionBase {
  charge: PayInvoiceParams;
  paymentMethod?: never;
}

/**
 * Nothing is due today: no charge and no invoice are created, so send no
 * `charge`. `paymentMethod` is required when `paymentMethodCollection` is
 * `always` and optional under `if_required`.
 */
export interface ConfirmCheckoutSessionWithPaymentMethod extends ConfirmCheckoutSessionBase {
  charge?: never;
  paymentMethod?: ConfirmPaymentMethodParams;
}

export type ConfirmCheckoutSessionParams =
  | ConfirmCheckoutSessionWithCharge
  | ConfirmCheckoutSessionWithPaymentMethod;

/** An invoice payment on a confirm response: `charge` is the charge itself when it was created by the call. */
export interface ConfirmedInvoicePayment extends Omit<InvoicePayment, 'charge'> {
  charge: string | Charge;
}

export interface ConfirmedInvoice extends Omit<Invoice, 'payments'> {
  payments: ConfirmedInvoicePayment[];
}

/**
 * What `checkoutSessions.confirm` returns: the session, with the paying
 * `customer` expanded and the `charge` and `invoice` the call created. `charge`
 * and `invoice` are `null` when nothing was due today.
 */
export interface ConfirmCheckoutSessionResponse extends Omit<CheckoutSession, 'customer' | 'invoice'> {
  customer: Customer;
  charge: Charge | null;
  invoice: ConfirmedInvoice | null;
}

/** Opens a 3D Secure session for the checkout. The amount comes from the session, never from you. */
export interface CreateCheckoutThreeDSecureSessionParams {
  /** UUID of a card tokenized through `cards.create`. */
  card: string;
  /** 1 to 12. Defaults to 1. */
  installments?: number;
  /** A customer UUID, or the payer's data. */
  customer: string | CustomerInput;
  /** Ids of the session's bumps the payer accepted. */
  bumps?: string[];
  /** Sandbox only: always show the bank challenge. */
  forceChallenge?: boolean;
}

export interface ApplyCouponParams {
  code: string;
}

export interface CheckoutLayoutTheme {
  radius: string;
  font?: string;
  background: string;
  foreground: string;
  card: string;
  'card-foreground': string;
  popover: string;
  'popover-foreground': string;
  primary: string;
  'primary-foreground': string;
  secondary: string;
  'secondary-foreground': string;
  muted: string;
  'muted-foreground': string;
  accent: string;
  'accent-foreground': string;
  destructive: string;
  'destructive-foreground': string;
  success: string;
  'success-foreground': string;
  warning: string;
  'warning-foreground': string;
  border: string;
  input: string;
  ring: string;
}

export interface CheckoutLayout {
  id: string;
  name: string;
  theme: CheckoutLayoutTheme | null;
  favicon: string | null;
  desktop: Record<string, unknown> | null;
  mobile: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCheckoutLayoutParams {
  name: string;
  theme?: CheckoutLayoutTheme;
  favicon?: string | null;
  desktop?: Record<string, unknown> | null;
  mobile?: Record<string, unknown> | null;
}

export type UpdateCheckoutLayoutParams = Partial<CreateCheckoutLayoutParams>;
export type ListCheckoutLayoutsParams = ListParams;

export interface PaymentLinkItem {
  id: string;
  product: string;
  price: string;
  quantity: number;
  amount: number;
}

export interface PaymentLinkBump {
  id: string;
  product: string;
  price: string;
  quantity: number;
  amount: number;
  title: string | null;
  description: string | null;
}

export interface PaymentLink {
  id: string;
  name: string;
  description: string | null;
  checkoutLayout: string | null;
  active: boolean;
  amount: number;
  url: string;
  paymentMethods: PaymentMethodType[];
  couponEnabled: boolean;
  billingAddressCollection: BillingAddressCollection;
  successUrl: string | null;
  cancelUrl: string | null;
  subscriptionData: PaymentLinkSubscriptionData;
  paymentMethodCollection: PaymentMethodCollection;
  items: PaymentLinkItem[];
  bumps: PaymentLinkBump[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentLinkItemParams {
  price: string;
  quantity: number;
}

export type UpdatePaymentLinkItemParams = Partial<CreatePaymentLinkItemParams>;

export interface CreatePaymentLinkBumpParams {
  price: string;
  quantity?: number;
  amount?: number;
  title?: string | null;
  description?: string | null;
}

export interface UpdatePaymentLinkBumpParams {
  price?: string;
  quantity?: number;
  amount?: number;
  title?: string | null;
  description?: string | null;
}

export interface CreatePaymentLinkParams {
  name: string;
  description?: string | null;
  checkoutLayout?: string | null;
  paymentMethods?: PaymentMethodType[];
  billingAddressCollection?: BillingAddressCollection;
  successUrl?: string | null;
  cancelUrl?: string | null;
  subscriptionData?: PaymentLinkSubscriptionDataParams;
  paymentMethodCollection?: PaymentMethodCollection;
  items: CreatePaymentLinkItemParams[];
  bumps?: CreatePaymentLinkBumpParams[];
}

export interface UpdatePaymentLinkParams {
  name?: string;
  description?: string | null;
  checkoutLayout?: string | null;
  paymentMethods?: PaymentMethodType[];
  billingAddressCollection?: BillingAddressCollection;
  successUrl?: string | null;
  cancelUrl?: string | null;
  active?: boolean;
  couponEnabled?: boolean;
  subscriptionData?: PaymentLinkSubscriptionDataParams;
  paymentMethodCollection?: PaymentMethodCollection;
}

export interface ListPaymentLinksParams extends ListParams {
  name?: string;
  active?: boolean;
  product?: string;
}

export type CouponType = 'percentage' | 'fixed';
export type CouponAppliesTo = 'all' | 'specific';

interface CouponFields {
  name: string;
  code: string;
  description?: string | null;
  active?: boolean;
  maxUses?: number | null;
  expiresAt?: string | null;
  appliesTo: CouponAppliesTo;
  appliesToProducts?: string[] | null;
}

export interface CreatePercentageCouponParams extends CouponFields {
  type: 'percentage';
  percentOff: number;
}

export interface CreateFixedCouponParams extends CouponFields {
  type: 'fixed';
  amountOff: number;
  currency: Currency;
}

export type CreateCouponParams = CreatePercentageCouponParams | CreateFixedCouponParams;

export interface UpdateCouponParams {
  name?: string;
  description?: string | null;
  active?: boolean;
  maxUses?: number | null;
  expiresAt?: string | null;
  appliesTo?: CouponAppliesTo;
  appliesToProducts?: string[] | null;
}

export interface Coupon {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  type: CouponType;
  code: string;
  currency: Currency | null;
  amountOff: number | null;
  percentOff: number | null;
  uses: number;
  maxUses: number | null;
  appliesTo: CouponAppliesTo;
  appliesToProducts: string[] | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ListCouponsParams = ListParams;

export type TransferStatus =
  | 'awaiting_approval'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'canceled'
  | 'failed';
export type TransferType = 'key' | 'hash' | 'beneficiary';
export type TransferDirection = 'in' | 'out';
export type PixKeyType = 'email' | 'phone' | 'cpf' | 'cnpj' | 'random';
export type ReceiptFormat = 'pdf' | 'image';

export interface ListTransfersParams extends ListParams {
  direction?: TransferDirection;
}

export type TransferLookupParams =
  | { type: 'key'; value: string }
  | { type: 'hash'; value: string }
  | { type: 'beneficiary'; beneficiary: string; beneficiaryAccount: string };

export type CreateTransferParams =
  | {
      type: 'key';
      pixKey: string;
      pixKeyType: PixKeyType;
      amount: number;
      description?: string;
      paymentDate?: string;
    }
  | {
      type: 'hash';
      hash: string;
      description?: string;
      paymentDate?: string;
    };

export interface TransferLookup {
  type: 'key' | 'hash';
  isBeneficiary: boolean;
  pixKey: string;
  name: string;
  tradingName: string | null;
  taxNumber: string;
  ispb: string;
  bank: string;
  bankName: string;
  branch: string | null;
  account: string | null;
  accountType: string | null;
  pixKeyType?: string | number;
  accountDigit?: string | null;
  hash?: string;
  /** Hash lookups only. A decimal string in reais straight from the QR code, not cents. */
  originalValue?: string;
  /** Hash lookups only. A decimal string in reais, not cents. */
  finalValue?: string;
  dueDate?: string | null;
  description?: string | null;
}

export interface TransferParty {
  name: string;
  /** Digits only on `from` and in webhook payloads. On `to` in API responses it is formatted (`123.456.789-09`). */
  taxNumber: string;
  bankName: string;
}

export type TransactionSourceType =
  | 'transfer'
  | 'charge'
  | 'charge_split'
  | 'ted_in'
  | 'refund'
  | 'refund_reversal'
  | 'dispute'
  | 'dispute_release';

export interface TransferTransaction {
  id: string;
  entryType: 'credit' | 'debit';
  amount: number;
  description: string | null;
  endToEndId: string | null;
  availableAt: string;
  source: { type: TransactionSourceType; id: string };
  createdAt: string;
}

export interface Transfer {
  id: string;
  status: TransferStatus;
  direction: TransferDirection;
  type: TransferType;
  amount: number;
  pixKey: string | null;
  pixKeyType: PixKeyType | null;
  from: TransferParty;
  to: TransferParty;
  endToEndId: string | null;
  providerTransactionId: string | null;
  url: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatedTransfer extends Transfer {
  transaction: TransferTransaction;
}

export const WebhookEvent = {
  CHARGE_CREATED: 'charge.created',
  CHARGE_UPDATED: 'charge.updated',
  CHARGE_PENDING: 'charge.pending',
  CHARGE_PAID: 'charge.paid',
  CHARGE_EXPIRED: 'charge.expired',
  CHARGE_REFUNDED: 'charge.refunded',
  CHARGE_PARTIALLY_REFUNDED: 'charge.partially_refunded',
  CHARGE_FAILED: 'charge.failed',
  CHARGE_IN_REVIEW: 'charge.in_review',
  CHARGE_CHARGEBACK: 'charge.chargeback',
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
  TRANSFER_CREATED: 'transfer.created',
  TRANSFER_UPDATED: 'transfer.updated',
  TRANSFER_PROCESSING: 'transfer.processing',
  TRANSFER_COMPLETED: 'transfer.completed',
  TRANSFER_FAILED: 'transfer.failed',
  DISPUTE_CREATED: 'dispute.created',
  DISPUTE_UPDATED: 'dispute.updated',
  DISPUTE_RESOLVED: 'dispute.resolved',
  REFUND_CREATED: 'refund.created',
  REFUND_UPDATED: 'refund.updated',
  REFUND_PROCESSING: 'refund.processing',
  REFUND_COMPLETED: 'refund.completed',
  REFUND_FAILED: 'refund.failed',
  PAYMENT_CREATED: 'payment.created',
  PAYMENT_INCOMPLETE: 'payment.incomplete',
  PAYMENT_PENDING: 'payment.pending',
  PAYMENT_APPROVED: 'payment.approved',
  PAYMENT_REFUNDED: 'payment.refunded',
  PAYMENT_REFUSED: 'payment.refused',
  PAYMENT_FAILED: 'payment.failed',
  INVOICE_CREATED: 'invoice.created',
  INVOICE_OPENED: 'invoice.opened',
  INVOICE_PAID: 'invoice.paid',
  INVOICE_VOIDED: 'invoice.voided',
  INVOICE_UNCOLLECTIBLE: 'invoice.uncollectible',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
  INVOICE_UPDATED: 'invoice.updated',
  INVOICE_DRAFTED: 'invoice.drafted',
  SUBSCRIPTION_CREATED: 'subscription.created',
  SUBSCRIPTION_ACTIVE: 'subscription.active',
  SUBSCRIPTION_CANCELED: 'subscription.canceled',
  SUBSCRIPTION_PAST_DUE: 'subscription.past_due',
  SUBSCRIPTION_TRIALING: 'subscription.trialing',
  /** Three days before a trial ends. */
  SUBSCRIPTION_TRIAL_ENDING: 'subscription.trial_ending',
  SUBSCRIPTION_INCOMPLETE: 'subscription.incomplete',
  SUBSCRIPTION_PAUSED: 'subscription.paused',
  SUBSCRIPTION_VOID: 'subscription.void',
  SUBSCRIPTION_UPDATED: 'subscription.updated',
  CHECKOUT_SESSION_CREATED: 'checkout-session.created',
  CHECKOUT_SESSION_OPENED: 'checkout-session.opened',
  CHECKOUT_SESSION_UPDATED: 'checkout-session.updated',
  CHECKOUT_SESSION_COMPLETED: 'checkout-session.completed',
  CHECKOUT_SESSION_EXPIRED: 'checkout-session.expired',
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRICE_CREATED: 'price.created',
  PRICE_UPDATED: 'price.updated',
} as const;

export type WebhookEvent = (typeof WebhookEvent)[keyof typeof WebhookEvent];

/** The JSON body of a delivery, sent with `X-Webhook-Id`, `X-Webhook-Event` and `X-Webhook-Signature` headers. */
export interface WebhookDeliveryPayload<T = Record<string, unknown>> {
  id: string;
  event: WebhookEvent;
  createdAt: string;
  /** The resource the event is about, in the same shape the API returns. Related entities appear as ids. */
  data: T;
}

export interface Webhook {
  id: string;
  description: string | null;
  active: boolean;
  url: string;
  headers: Record<string, string>;
  events: WebhookEvent[];
  /** The signing secret (`whsec_…`). Returned on every read. */
  secret: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebhookParams {
  url: string;
  events: WebhookEvent[];
  description?: string | null;
  headers?: Record<string, string>;
  active?: boolean;
}

export interface UpdateWebhookParams {
  url?: string;
  events?: WebhookEvent[];
  description?: string | null;
  headers?: Record<string, string>;
  active?: boolean;
}

export type ListWebhooksParams = ListParams;

export interface WebhookLog {
  id: string;
  webhook: string;
  event: WebhookEvent;
  method: string;
  url: string;
  statusCode: number | null;
  /** Milliseconds the delivery took. */
  duration: number | null;
  request: string;
  response: string | null;
  retryCount: number;
  success: boolean;
  createdAt: string;
}

export type ApiKeyType = 'publishable' | 'secret';

export interface MeResource {
  account: string;
  type: ApiKeyType;
  permissions: string[];
}

export interface UpagError {
  message: string;
  code: string;
  statusCode?: number;
  errors?: Record<string, any> | null;
  /** Structured context, such as the fields that failed validation. */
  details?: unknown;
  /** Guidance from the API: a stable `errorCode` and the `action` to take. */
  meta?: Record<string, any> | null;
}
