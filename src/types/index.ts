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

// Customer types
export interface Customer {
  id: string;
  accountId: string;
  email: string;
  name: string;
  phone?: string | null;
  taxId?: string | null;
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
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
}

// Payment Method types
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

// Payment types
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
  pixQrCode?: string | null;
  refuseReason?: PaymentRefuseReason | null;
  dueAt?: Date | null;
  livemode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Customer input can be either an ID string or an object to create inline
export type CustomerInput = string | CreateCustomerParams;

// Payment method input can be either an ID string or an object to create inline
export type PaymentMethodInput = string | CreatePaymentMethodParams;

export interface CreatePaymentParams {
  customer: CustomerInput;
  paymentMethod: PaymentMethodInput;
  amount: number;
  currency: Currency;
  installments?: number | null;
}

export interface ListPaymentsParams extends ListParams {
  customer?: string;
}

// Error types
export interface UpagError {
  message: string;
  code: string;
  statusCode?: number;
  errors?: Record<string, any> | null;
}
