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

// Customer types
export interface Customer {
  id: string;
  accountId: string;
  email: string;
  name: string;
  phone?: string | null;
  taxId?: string | null;
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
  metadata?: Record<string, any>;
}

export interface UpdateCustomerParams {
  email?: string;
  name?: string;
  phone?: string;
  taxId?: string;
  metadata?: Record<string, any>;
}

// Payment Method types
export type PaymentMethodType = 'credit_card' | 'pix' | 'boleto';

export interface PaymentMethod {
  id: string;
  customerId: string;
  type: PaymentMethodType;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  pix?: {
    key?: string;
  };
  boleto?: Record<string, any>;
  metadata?: Record<string, any> | null;
  livemode: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface CreatePaymentMethodParams {
  customerId: string;
  type: PaymentMethodType;
  card?: {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
    holderName: string;
  };
  metadata?: Record<string, any>;
}

// Payment types
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
export type PaymentMethod_Type = 'credit_card' | 'pix' | 'boleto';

export interface Payment {
  id: string;
  accountId: string;
  customerId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod_Type;
  paymentMethodId?: string | null;
  description?: string | null;
  metadata?: Record<string, any> | null;
  paidAt?: Date | null;
  canceledAt?: Date | null;
  livemode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentParams {
  customerId: string;
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod_Type;
  paymentMethodId?: string;
  description?: string;
  metadata?: Record<string, any>;
}

// Error types
export interface UpagError {
  type: string;
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

