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
  threeDSecureSessionId: session.id,
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
  threeDSecureSessionId: session.id,
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
  payment: { method: 'pix' },
});

const link = await upag.paymentLinks.create({
  name: 'Checkout',
  items: [{ priceId: price.id, quantity: 1 }],
});
```

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
