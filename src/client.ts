import { UpagConfig } from './types';
import { HttpClient } from './utils/http-client';
import { Customers } from './resources/customers';
import { PaymentMethods } from './resources/payment-methods';
import { Payments } from './resources/payments';

export class Upag {
  private http: HttpClient;
  
  public readonly customers: Customers;
  public readonly paymentMethods: PaymentMethods;
  public readonly payments: Payments;

  /**
   * Create a new Upag client instance
   * @param apiKey - Your Upag API key
   * @param config - Optional configuration
   */
  constructor(apiKey: string);
  constructor(config: UpagConfig);
  constructor(apiKeyOrConfig: string | UpagConfig) {
    const config: UpagConfig = typeof apiKeyOrConfig === 'string'
      ? { apiKey: apiKeyOrConfig }
      : apiKeyOrConfig;

    if (!config.apiKey) {
      throw new Error('API key is required');
    }

    this.http = new HttpClient(config);
    
    // Initialize resources
    this.customers = new Customers(this.http);
    this.paymentMethods = new PaymentMethods(this.http);
    this.payments = new Payments(this.http);
  }
}

