import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Upag } from '../src';

interface Sent {
  method?: string;
  url: string;
  headers: Record<string, any>;
  data: any;
}

const originalAdapter = axios.defaults.adapter;
let sent: Sent[];
let reply: { status: number; data: unknown };

beforeEach(() => {
  sent = [];
  reply = { status: 200, data: {} };
  axios.defaults.adapter = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
    sent.push({
      method: config.method,
      url: `${config.baseURL}${config.url}`,
      headers: config.headers as Record<string, any>,
      data: config.data ? JSON.parse(config.data) : undefined,
    });
    const response = { data: reply.data, status: reply.status, statusText: '', headers: {}, config } as AxiosResponse;
    if (reply.status >= 400) {
      throw Object.assign(new Error(`Request failed with status code ${reply.status}`), {
        isAxiosError: true,
        response,
        config,
      });
    }
    return response;
  };
});

afterEach(() => {
  axios.defaults.adapter = originalAdapter;
});

const customerInput = {
  name: 'Maria Silva',
  document: { type: 'cpf' as const, number: '12345678909' },
  phone: { countryCode: '55', areaCode: '11', number: '999999999' },
};

describe('base URL', () => {
  it('uses production for a live key', async () => {
    await new Upag({ apiKey: 'sk_live_x' }).customers.retrieve('c1');
    expect(sent[0].url).toBe('https://api.upag.io/v1/customers/c1');
  });

  it('uses sandbox for a test key', async () => {
    await new Upag({ apiKey: 'sk_test_x' }).customers.retrieve('c1');
    expect(sent[0].url).toBe('https://api.upag.dev/v1/customers/c1');
  });

  it('lets baseURL override the key prefix', async () => {
    await new Upag({ apiKey: 'sk_test_x', baseURL: 'http://localhost:3000/v1' }).charges.retrieve('ch1');
    expect(sent[0].url).toBe('http://localhost:3000/v1/charges/ch1');
  });

  it('sends every resource to the same host', async () => {
    await new Upag({ apiKey: 'sk_test_x' }).customers.retrieve('cus-1');
    expect(sent[0].url).toBe('https://api.upag.dev/v1/customers/cus-1');
    expect(sent[0].url).not.toContain('api.billing.upag.io');
    expect(sent[0].url).not.toContain('/billing/');
  });

  it('does not accept an environment option', () => {
    const upag = new Upag({ apiKey: 'sk_live_x' });
    expect('environment' in upag).toBe(false);
    expect(upag).not.toHaveProperty('paymentMethods');
    expect(upag).not.toHaveProperty('payments');
  });
});

describe('cards', () => {
  it('sends the Idempotency-Key header only when given', async () => {
    const upag = new Upag({ apiKey: 'sk_test_x' });
    const params = {
      number: '4111111111111111',
      expirationMonth: 12,
      expirationYear: 2030,
      cvv: '737',
      holderName: 'Maria Silva',
    };
    await upag.cards.create(params, { idempotencyKey: 'k-1' });
    await upag.cards.create(params);
    expect(sent[0].headers['Idempotency-Key']).toBe('k-1');
    expect(sent[1].headers['Idempotency-Key']).toBeUndefined();
    expect(sent[0].data).toEqual(params);
  });

  it('creates a card already attached to a customer', async () => {
    const upag = new Upag({ apiKey: 'sk_test_x' });
    const params = {
      number: '4111111111111111',
      expirationMonth: 12,
      expirationYear: 2030,
      cvv: '737',
      holderName: 'Maria Silva',
      customer: 'cus',
    };
    await upag.cards.create(params);
    expect(sent[0].url).toBe('https://api.upag.dev/v1/cards');
    expect(sent[0].data).toEqual(params);
  });

  it('only tokenizes at the root: the flat read and delete routes are gone', () => {
    const upag = new Upag({ apiKey: 'sk_test_x' });
    expect(upag.cards).not.toHaveProperty('list');
    expect(upag.cards).not.toHaveProperty('retrieve');
    expect(upag.cards).not.toHaveProperty('remove');
  });
});

describe('customers.cards', () => {
  it('lists with a query string under the customer', async () => {
    const upag = new Upag({ apiKey: 'sk_test_x' });
    await upag.customers.cards.list('cus', { page: 2, limit: 5 });
    expect(sent[0].method).toBe('get');
    expect(sent[0].url).toContain('https://api.upag.dev/v1/customers/cus/cards?');
    expect(sent[0].url).toContain('page=2');
    expect(sent[0].url).toContain('limit=5');
  });

  it('retrieves a card of the customer', async () => {
    const upag = new Upag({ apiKey: 'sk_test_x' });
    await upag.customers.cards.retrieve('cus', 'c1');
    expect(sent[0].method).toBe('get');
    expect(sent[0].url).toBe('https://api.upag.dev/v1/customers/cus/cards/c1');
  });

  it('attaches a card with the card id in the body', async () => {
    const upag = new Upag({ apiKey: 'sk_test_x' });
    await upag.customers.cards.attach('cus', { card: 'c1' });
    expect(sent[0].method).toBe('post');
    expect(sent[0].url).toBe('https://api.upag.dev/v1/customers/cus/cards');
    expect(sent[0].data).toEqual({ card: 'c1' });
  });

  it('deletes a card of the customer', async () => {
    const upag = new Upag({ apiKey: 'sk_test_x' });
    await upag.customers.cards.delete('cus', 'c1');
    expect(sent[0].method).toBe('delete');
    expect(sent[0].url).toBe('https://api.upag.dev/v1/customers/cus/cards/c1');
  });

  it('surfaces card_already_attached as a 409', async () => {
    reply = {
      status: 409,
      data: { error: { code: 'card_already_attached', message: 'Card is already attached to another customer' } },
    };
    await expect(new Upag({ apiKey: 'sk_test_x' }).customers.cards.attach('cus', { card: 'c1' })).rejects.toMatchObject({
      statusCode: 409,
      code: 'card_already_attached',
    });
  });
});

describe('threeDSecure', () => {
  it('creates a session and retrieves it', async () => {
    const upag = new Upag({ apiKey: 'sk_test_x' });
    reply = { status: 201, data: { id: 's1', clientSecret: 'abc' } };
    const session = await upag.threeDSecure.createSession(
      { amount: 10000, card: 'card-1', customer: 'cus-1' },
      { idempotencyKey: 'order-1' }
    );
    expect(session.clientSecret).toBe('abc');
    expect(sent[0].url).toBe('https://api.upag.dev/v1/3ds/sessions');
    expect(sent[0].headers['Idempotency-Key']).toBe('order-1');

    await upag.threeDSecure.retrieveSession('s1');
    expect(sent[1].url).toBe('https://api.upag.dev/v1/3ds/sessions/s1');
  });
});

describe('charges', () => {
  it('creates a card charge carrying the 3DS session', async () => {
    const upag = new Upag({ apiKey: 'sk_test_x' });
    await upag.charges.create({
      type: 'card',
      amount: 10000,
      card: 'card-1',
      customer: 'cus-1',
      threeDSecureSession: 's1',
    });
    expect(sent[0].url).toBe('https://api.upag.dev/v1/charges');
    expect(sent[0].data.threeDSecureSession).toBe('s1');
  });

  it('passes includes on retrieve and list', async () => {
    const upag = new Upag({ apiKey: 'sk_test_x' });
    await upag.charges.retrieve('ch1', { includes: 'customer' });
    await upag.charges.list({ includes: 'items', limit: 10 });
    expect(sent[0].url).toContain('/charges/ch1?includes=customer');
    expect(sent[1].url).toContain('includes=items');
  });

  it('filters the list by customer', async () => {
    const upag = new Upag({ apiKey: 'sk_test_x' });
    await upag.charges.list({ customer: 'cus-1', limit: 10 });
    await upag.charges.list({ limit: 10 });
    expect(sent[0].url).toContain('customer=cus-1');
    expect(sent[1].url).not.toContain('customer=');
  });
});

describe('customers', () => {
  it('creates with document and nested phone', async () => {
    const upag = new Upag({ apiKey: 'sk_test_x' });
    await upag.customers.create(customerInput);
    expect(sent[0].method).toBe('post');
    expect(sent[0].url).toBe('https://api.upag.dev/v1/customers');
    expect(sent[0].data).toEqual(customerInput);
    expect(sent[0].data.taxId).toBeUndefined();
  });

  it('updates with PATCH', async () => {
    await new Upag({ apiKey: 'sk_test_x' }).customers.update('cus-1', { name: 'Ana' });
    expect(sent[0].method).toBe('patch');
    expect(sent[0].url).toBe('https://api.upag.dev/v1/customers/cus-1');
  });
});

describe('catalog', () => {
  const upag = () => new Upag({ apiKey: 'sk_test_x' });

  it('creates a product on /products', async () => {
    await upag().products.create({ name: 'Plan', description: 'Access' });
    expect(sent[0].url).toBe('https://api.upag.dev/v1/products');
  });

  it('creates a price under the product', async () => {
    await upag().prices.create('prod-1', {
      name: 'Monthly',
      amount: 9900,
      currency: 'brl',
      billingType: 'recurring',
      interval: 'month',
      intervalCount: 1,
    });
    expect(sent[0].url).toBe('https://api.upag.dev/v1/products/prod-1/prices');
  });

  it('pays an invoice with pix or card', async () => {
    const client = upag();
    await client.invoices.pay('inv-1', { method: 'pix' });
    await client.invoices.pay('inv-1', { method: 'card', card: 'card-1', threeDSecureSession: 's1' });
    expect(sent[0].url).toBe('https://api.upag.dev/v1/invoices/inv-1/pay');
    expect(sent[0].data).toEqual({ method: 'pix' });
    expect(sent[1].data).toMatchObject({ method: 'card', card: 'card-1', threeDSecureSession: 's1' });
  });

  it('cancels a subscription with POST', async () => {
    await upag().subscriptions.cancel('sub-1', { atPeriodEnd: true, reason: 'unused' });
    expect(sent[0].method).toBe('post');
    expect(sent[0].url).toBe('https://api.upag.dev/v1/subscriptions/sub-1/cancel');
    expect(sent[0].data).toEqual({ atPeriodEnd: true, reason: 'unused' });
  });

  it('confirms a checkout session', async () => {
    await upag().checkoutSessions.confirm('ses-1', {
      customer: customerInput,
      charge: { method: 'pix' },
    });
    expect(sent[0].url).toBe('https://api.upag.dev/v1/checkout/sessions/ses-1/confirm');
    expect(sent[0].data.customer.document).toEqual({ type: 'cpf', number: '12345678909' });
    expect(sent[0].data.charge).toEqual({ method: 'pix' });
  });

  it('confirms a trial session with nothing due today by keeping a card', async () => {
    await upag().checkoutSessions.confirm('ses-1', {
      customer: 'cus-1',
      paymentMethod: { type: 'card', card: 'card-1' },
    });
    expect(sent[0].url).toBe('https://api.upag.dev/v1/checkout/sessions/ses-1/confirm');
    expect(sent[0].data).toEqual({ customer: 'cus-1', paymentMethod: { type: 'card', card: 'card-1' } });
    expect(sent[0].data.charge).toBeUndefined();
  });

  it('opens a 3D Secure session for a checkout session', async () => {
    reply = { status: 201, data: { id: 's1', clientSecret: 'cs_1' } };
    const created = await upag().checkoutSessions.createThreeDSecureSession('ses-1', {
      card: 'card-1',
      customer: 'cus-1',
      installments: 2,
    });
    expect(sent[0].method).toBe('post');
    expect(sent[0].url).toBe('https://api.upag.dev/v1/checkout/sessions/ses-1/3ds/session');
    expect(sent[0].data).toEqual({ card: 'card-1', customer: 'cus-1', installments: 2 });
    expect(created.clientSecret).toBe('cs_1');
  });

  it('returns the scheduled change when a subscription item removal is deferred', async () => {
    reply = { status: 200, data: { id: 'chg-1', operation: 'remove' } };
    const change = await upag().subscriptions.deleteItem('sub-1', 'item-1', { applyAt: 'period_end' });
    expect(sent[0].method).toBe('delete');
    expect(sent[0].url).toBe('https://api.upag.dev/v1/subscriptions/sub-1/items/item-1?applyAt=period_end');
    expect(change).toEqual({ id: 'chg-1', operation: 'remove' });
  });

  it('resolves with undefined when a subscription item removal is applied now', async () => {
    reply = { status: 204, data: '' };
    expect(await upag().subscriptions.deleteItem('sub-1', 'item-1')).toBeUndefined();
  });

  it('creates a checkout session with a trial', async () => {
    await upag().checkoutSessions.create({
      items: [{ price: 'price-1', quantity: 1 }],
      subscriptionData: {
        trial: { interval: 'day', intervalCount: 14 },
        trialSettings: { endBehavior: { missingPaymentMethod: 'cancel' } },
      },
      paymentMethodCollection: 'if_required',
    });
    expect(sent[0].url).toBe('https://api.upag.dev/v1/checkout/sessions');
    expect(sent[0].data.subscriptionData).toEqual({
      trial: { interval: 'day', intervalCount: 14 },
      trialSettings: { endBehavior: { missingPaymentMethod: 'cancel' } },
    });
    expect(sent[0].data.paymentMethodCollection).toBe('if_required');
  });

  it('creates a payment link with a trial and removes it with null', async () => {
    await upag().paymentLinks.create({
      name: 'Trial',
      items: [{ price: 'price-1', quantity: 1 }],
      subscriptionData: { trial: { interval: 'week', intervalCount: 2 } },
    });
    expect(sent[0].data.subscriptionData).toEqual({ trial: { interval: 'week', intervalCount: 2 } });

    await upag().paymentLinks.update('link-1', { subscriptionData: { trial: null } });
    expect(sent[1].method).toBe('patch');
    expect(sent[1].data.subscriptionData).toEqual({ trial: null });
  });
});

describe('new resources', () => {
  const upag = () => new Upag({ apiKey: 'sk_test_x' });

  it('creates a payment link with price items', async () => {
    await upag().paymentLinks.create({
      name: 'Checkout',
      items: [{ price: 'price-1', quantity: 1 }],
    });
    expect(sent[0].url).toBe('https://api.upag.dev/v1/payment-links');
    expect(sent[0].data.items[0].price).toBe('price-1');
  });

  it('updates a checkout layout with PATCH', async () => {
    await upag().checkoutLayouts.update('lay-1', { name: 'Dark' });
    expect(sent[0].method).toBe('patch');
    expect(sent[0].url).toBe('https://api.upag.dev/v1/checkout/layouts/lay-1');
  });

  it('creates a percentage coupon', async () => {
    await upag().coupons.create({
      type: 'percentage',
      name: 'Launch',
      code: 'LAUNCH',
      appliesTo: 'all',
      percentOff: 10,
    });
    expect(sent[0].url).toBe('https://api.upag.dev/v1/coupons');
    expect(sent[0].data.percentOff).toBe(10);
  });

  it('looks up and creates a transfer', async () => {
    const client = upag();
    await client.transfers.lookup({ type: 'key', value: 'a@b.com' });
    await client.transfers.lookup({
      type: 'beneficiary',
      beneficiary: 'ben-1',
      beneficiaryAccount: 'acc-1',
    });
    await client.transfers.create({
      type: 'key',
      pixKey: 'a@b.com',
      pixKeyType: 'email',
      amount: 1500,
    });
    await client.transfers.receipt('tr-1', { format: 'image' });
    expect(sent[0].url).toBe('https://api.upag.dev/v1/transfers/lookup');
    expect(sent[1].data).toEqual({
      type: 'beneficiary',
      beneficiary: 'ben-1',
      beneficiaryAccount: 'acc-1',
    });
    expect(sent[2].url).toBe('https://api.upag.dev/v1/transfers');
    expect(sent[3].url).toBe('https://api.upag.dev/v1/transfers/tr-1/receipt?format=image');
  });

  it('lists and reprocesses webhook logs', async () => {
    const client = upag();
    await client.webhooks.create({ url: 'https://example.com/hook', events: ['charge.paid'] });
    await client.webhooks.logs.list('wh-1');
    await client.webhooks.logs.reprocess('wh-1', 'log-1');
    expect(sent[0].url).toBe('https://api.upag.dev/v1/webhooks');
    expect(sent[1].url).toBe('https://api.upag.dev/v1/webhooks/wh-1/logs');
    expect(sent[2].url).toBe('https://api.upag.dev/v1/webhooks/wh-1/logs/log-1/reprocess');
  });

  it('retrieves the key identity', async () => {
    await upag().me.retrieve();
    expect(sent[0].url).toBe('https://api.upag.dev/v1/me');
  });
});

describe('error handling', () => {
  it('reads the core nested error shape', async () => {
    reply = {
      status: 422,
      data: {
        error: {
          code: 'card_invalid',
          message: 'Card is invalid',
          meta: { errorCode: 'card_invalid', action: 'check the card' },
          details: [{ path: 'number' }],
        },
      },
    };
    await expect(new Upag({ apiKey: 'sk_test_x' }).customers.cards.retrieve('cus', 'c')).rejects.toMatchObject({
      statusCode: 422,
      code: 'card_invalid',
      message: 'Card is invalid',
      details: [{ path: 'number' }],
      meta: { action: 'check the card' },
    });
  });

  it('still reads a top-level error shape', async () => {
    reply = { status: 404, data: { message: 'Not found', code: 'not_found', errors: { id: 'x' } } };
    await expect(new Upag({ apiKey: 'sk_test_x' }).customers.retrieve('x')).rejects.toMatchObject({
      statusCode: 404,
      code: 'not_found',
      message: 'Not found',
      errors: { id: 'x' },
    });
  });
});
