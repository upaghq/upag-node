# Upag Node.js SDK

Official Node.js library for the Upag API.

## Installation

```bash
npm install upag
```

## Usage

### Initialize the client

```typescript
import { Upag } from 'upag';

const upag = new Upag('sk_test_your_api_key');

const upag = new Upag({
  apiKey: 'sk_test_your_api_key',
  timeout: 30000,
  // baseURL: 'http://localhost:3000/v1',
});
```

`sk_test_` talks to `https://api.upag.dev/v1`. Any other key talks to `https://api.upag.io/v1`. `baseURL` overrides the host.

Amounts are integers in cents. Identifiers are UUIDs. Timestamps are ISO 8601 strings. Lists return `{ data, count }`.

### Cards, 3D Secure and charges

Tokenize in the browser with upag-js whenever you can. Server-side:

```typescript
const card = await upag.cards.create(
  {
    number: '4111111111111111',
    expirationMonth: 12,
    expirationYear: 2030,
    cvv: '737',
    holderName: 'Maria Silva',
  },
  { idempotencyKey: 'card-order-123' }
);

const session = await upag.threeDSecure.createSession(
  { amount: 10000, installments: 1, card: card.id, customer: 'customer-uuid' },
  { idempotencyKey: 'order-123' }
);

const charge = await upag.charges.create({
  type: 'card',
  amount: 10000,
  card: card.id,
  customer: 'customer-uuid',
  threeDSecureSession: session.id,
});

await upag.charges.retrieve(charge.id, { includes: 'customer' });
await upag.charges.list({ limit: 20, includes: 'items' });
await upag.cards.list({ customer: 'customer-uuid' });
await upag.cards.remove(card.id);
```

Pix charge with an inline customer:

```typescript
const charge = await upag.charges.create({
  type: 'pix',
  amount: 10000,
  pix: { method: 'dynamic' },
  customer: {
    name: 'Maria Silva',
    document: { type: 'cpf', number: '12345678909' },
    email: 'maria@example.com',
    phone: { countryCode: '55', areaCode: '11', number: '999999999' },
  },
});
```

### Customers

```typescript
const customer = await upag.customers.create({
  name: 'John Doe',
  email: 'customer@example.com',
  document: { type: 'cpf', number: '12345678909' },
  phone: { countryCode: '55', areaCode: '11', number: '999999999' },
  address: {
    street: 'Rua Augusta',
    number: '100',
    city: 'São Paulo',
    state: 'SP',
    country: 'BR',
    zip: '01310100',
  },
});

await upag.customers.retrieve(customer.id);
await upag.customers.update(customer.id, { name: 'John Smith' });
await upag.customers.list({ limit: 10, page: 1 });
await upag.customers.delete(customer.id);
```

### Products and prices

```typescript
const product = await upag.products.create({
  name: 'Plan',
  description: 'Monthly access',
  defaultPrice: {
    name: 'Monthly',
    amount: 9900,
    currency: 'brl',
    billingType: 'recurring',
    interval: 'month',
    intervalCount: 1,
  },
});

const price = await upag.prices.create(product.id, {
  name: 'Yearly',
  amount: 99000,
  currency: 'brl',
  billingType: 'recurring',
  interval: 'year',
  intervalCount: 1,
});
```

### Invoices and subscriptions

```typescript
const invoice = await upag.invoices.create({
  customer: customer.id,
  items: [{ price: price.id, quantity: 1 }],
  open: true,
});

await upag.invoices.pay(invoice.id, { method: 'pix' });
await upag.invoices.pay(invoice.id, {
  method: 'card',
  card: card.id,
  threeDSecureSession: session.id,
});

const subscription = await upag.subscriptions.create({
  customer: customer.id,
  paymentMethod: 'card',
  card: card.id,
  items: [{ price: price.id, quantity: 1 }],
});

await upag.subscriptions.cancel(subscription.id, { atPeriodEnd: true });
```

### Checkout sessions and payment links

Secret-key session create does not return a `clientSecret`. Shopper checkout starts from a payment-link code in upag-js.

```typescript
const session = await upag.checkoutSessions.create({
  items: [{ price: price.id, quantity: 1 }],
  paymentMethods: ['pix', 'card'],
  successUrl: 'https://example.com/ok',
  cancelUrl: 'https://example.com/cancel',
});

await upag.checkoutSessions.confirm(session.id, {
  customer: customer.id,
  charge: { method: 'pix' },
});

const link = await upag.paymentLinks.create({
  name: 'Checkout',
  items: [{ price: price.id, quantity: 1 }],
});
```

#### Free trial

A trial belongs to the offer (link or session), not to the price. It needs at least one recurring item. Nothing is charged today for recurring items; one-time items are charged as usual.

```typescript
// A link holds a relative trial; each session counts it from when the subscription is created.
await upag.paymentLinks.create({
  name: 'Plan with trial',
  items: [{ price: monthlyPrice.id, quantity: 1 }],
  subscriptionData: {
    trial: { interval: 'day', intervalCount: 14 }, // day ≤ 730, week ≤ 104, month ≤ 24
    trialSettings: { endBehavior: { missingPaymentMethod: 'cancel' } }, // or 'create_invoice' (default)
  },
  paymentMethodCollection: 'always', // or 'if_required'
});

// A session can also end the trial on a fixed date (at least 48 hours ahead), instead of `trial`.
const session = await upag.checkoutSessions.create({
  items: [{ price: monthlyPrice.id, quantity: 1 }],
  subscriptionData: { trialEnd: Math.floor(Date.now() / 1000) + 10 * 86400 },
});

// Nothing is due today, so confirm with a card to keep instead of a charge.
await upag.checkoutSessions.confirm(session.id, {
  customer: customer.id,
  paymentMethod: { type: 'card', card: card.id },
});
```

When the trial ends the subscription charges the card on file. With no card, `create_invoice` bills by Pix and `cancel` cancels the subscription with reason `missing_payment_method`. The `subscription.trial_ending` webhook is sent three days before the end.

### Transfers and webhooks

```typescript
const lookup = await upag.transfers.lookup({ type: 'key', value: 'email@example.com' });
const transfer = await upag.transfers.create({
  type: 'key',
  pixKey: 'email@example.com',
  pixKeyType: 'email',
  amount: 1500,
});

const webhook = await upag.webhooks.create({
  url: 'https://example.com/webhooks',
  events: ['charge.paid', 'invoice.paid'],
});

await upag.webhooks.logs.list(webhook.id);
await upag.me.retrieve();
```

Verify deliveries with the raw body and the `X-Webhook-Signature` header. Do not use `express.json()` on this route — parsing and re-serializing the JSON changes the payload and breaks the comparison.

```typescript
import express from 'express';

app.post('/webhooks', express.raw({ type: '*/*' }), (req, res) => {
  const ok = upag.webhooks.validateSignature(
    req.body, // raw Buffer
    req.headers['x-webhook-signature'],
    process.env.UPAG_WEBHOOK_SECRET
  );
  if (!ok) return res.sendStatus(401);
  // ... handle the event
  res.sendStatus(200);
});
```

## TypeScript Support

This library is written in TypeScript and includes type definitions.

```typescript
import { Upag, CreateChargeParams, CreateCustomerParams } from 'upag';

const params: CreateChargeParams = {
  type: 'pix',
  amount: 1000,
  pix: { method: 'dynamic' },
  customer: {
    name: 'Test',
    document: { type: 'cpf', number: '12345678909' },
  },
};
```

## Error Handling

API errors are thrown as `UpagError` objects (`message`, `code`, `statusCode`, `details`, `meta`):

```typescript
try {
  await upag.customers.create({
    name: 'John Doe',
    document: { type: 'cpf', number: 'invalid' },
  });
} catch (error) {
  console.error(error.message);
  console.error(error.code);
  console.error(error.statusCode);
  console.error(error.details);
  console.error(error.meta);
}
```

Codes include `NETWORK_ERROR`, `CLIENT_ERROR`, `VALIDATION_FAILED`, and API-specific codes.

## API Keys

Get your API keys from the [Upag Dashboard](https://app.upag.io).

- **Sandbox**: keys starting with `sk_test_`
- **Production**: keys starting with `sk_live_`

Never share your API keys or commit them to version control.

## Requirements

- Node.js >= 16.0.0
- npm or yarn

## Development

```bash
npm install
npm run build
npm test
npm run dev
```

## License

MIT

## Support

- Documentation: https://docs.upag.io
- Email: support@upag.io
- GitHub: https://github.com/upaghq/upag-node
