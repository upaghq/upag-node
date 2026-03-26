import { UpagConfig } from './types';
import { HttpClient } from './utils/http-client';
import { Customers } from './resources/customers';
import { PaymentMethods } from './resources/payment-methods';
import { Payments } from './resources/payments';
import { Products } from './resources/products';
import { Prices } from './resources/prices';
import { CheckoutSessions } from './resources/checkout-sessions';
import { Subscriptions } from './resources/subscriptions';
import { Invoices } from './resources/invoices';
import { Webhooks } from './resources/webhooks';

export class Upag {
  private http: HttpClient;
  
  public readonly customers: Customers;
  public readonly paymentMethods: PaymentMethods;
  public readonly payments: Payments;
  public readonly products: Products;
  public readonly prices: Prices;
  public readonly checkoutSessions: CheckoutSessions;
  public readonly subscriptions: Subscriptions;
  public readonly invoices: Invoices;
  public readonly webhooks: Webhooks;

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
    
    this.customers = new Customers(this.http);
    this.paymentMethods = new PaymentMethods(this.http);
    this.payments = new Payments(this.http);
    this.products = new Products(this.http);
    this.prices = new Prices(this.http);
    this.checkoutSessions = new CheckoutSessions(this.http);
    this.subscriptions = new Subscriptions(this.http);
    this.invoices = new Invoices(this.http);
    this.webhooks = new Webhooks(this.http);
  }
}
