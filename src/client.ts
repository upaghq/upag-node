import { UpagConfig } from './types';
import { HttpClient } from './utils/http-client';
import { Customers } from './resources/customers';
import { Products } from './resources/products';
import { Prices } from './resources/prices';
import { CheckoutSessions } from './resources/checkout-sessions';
import { CheckoutLayouts } from './resources/checkout-layouts';
import { Subscriptions } from './resources/subscriptions';
import { Invoices } from './resources/invoices';
import { PaymentLinks } from './resources/payment-links';
import { Coupons } from './resources/coupons';
import { Transfers } from './resources/transfers';
import { Webhooks } from './resources/webhooks';
import { Cards } from './resources/cards';
import { Charges } from './resources/charges';
import { ThreeDSecure } from './resources/three-d-secure';
import { Me } from './resources/me';

export class Upag {
  private http: HttpClient;

  public readonly customers: Customers;
  public readonly products: Products;
  public readonly prices: Prices;
  public readonly checkoutSessions: CheckoutSessions;
  public readonly checkoutLayouts: CheckoutLayouts;
  public readonly subscriptions: Subscriptions;
  public readonly invoices: Invoices;
  public readonly paymentLinks: PaymentLinks;
  public readonly coupons: Coupons;
  public readonly transfers: Transfers;
  public readonly webhooks: Webhooks;
  public readonly cards: Cards;
  public readonly charges: Charges;
  public readonly threeDSecure: ThreeDSecure;
  public readonly me: Me;

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
    this.products = new Products(this.http);
    this.prices = new Prices(this.http);
    this.checkoutSessions = new CheckoutSessions(this.http);
    this.checkoutLayouts = new CheckoutLayouts(this.http);
    this.subscriptions = new Subscriptions(this.http);
    this.invoices = new Invoices(this.http);
    this.paymentLinks = new PaymentLinks(this.http);
    this.coupons = new Coupons(this.http);
    this.transfers = new Transfers(this.http);
    this.webhooks = new Webhooks(this.http);
    this.cards = new Cards(this.http);
    this.charges = new Charges(this.http);
    this.threeDSecure = new ThreeDSecure(this.http);
    this.me = new Me(this.http);
  }
}
