# Upag Node.js SDK

Official Node.js library for the Upag API - Payment and subscription management platform.

## Installation

```bash
npm install upag
```

## Usage

### Initialize the client

```typescript
import { Upag } from 'upag';

// Using API key only
const upag = new Upag('sk_test_your_api_key');

// Or with full configuration
const upag = new Upag({
  apiKey: 'sk_test_your_api_key',
  timeout: 30000, // optional, default 30s
});
```

### Customers

```typescript
// Create a customer
const customer = await upag.customers.create({
  email: 'customer@example.com',
  name: 'John Doe',
  phone: '+5511999999999',
  taxId: '12345678900',
  metadata: { plan: 'premium' }
});

// Retrieve a customer
const customer = await upag.customers.retrieve('cus_123');

// Update a customer
const updated = await upag.customers.update('cus_123', {
  name: 'John Smith',
  metadata: { plan: 'enterprise' }
});

// List customers
const customers = await upag.customers.list({
  limit: 10,
  offset: 0
});

// Delete a customer
const deleted = await upag.customers.delete('cus_123');
```

### Payment Methods

```typescript
// Create a credit card payment method
const paymentMethod = await upag.paymentMethods.create({
  customerId: 'cus_123',
  type: 'credit_card',
  card: {
    number: '4242424242424242',
    expMonth: 12,
    expYear: 2025,
    cvc: '123',
    holderName: 'John Doe'
  }
});

// Retrieve a payment method
const paymentMethod = await upag.paymentMethods.retrieve('pm_123');

// List payment methods
const paymentMethods = await upag.paymentMethods.list({
  limit: 10,
  offset: 0
});

// List payment methods for a customer
const customerPaymentMethods = await upag.paymentMethods.listByCustomer('cus_123');

// Delete a payment method
const deleted = await upag.paymentMethods.delete('pm_123');
```

### Payments

```typescript
// Create a payment
const payment = await upag.payments.create({
  customerId: 'cus_123',
  amount: 10000, // Amount in cents (R$ 100.00)
  currency: 'brl',
  paymentMethodId: 'pm_123',
});

// Retrieve a payment
const payment = await upag.payments.retrieve('pay_123');

// List payments
const payments = await upag.payments.list({
  limit: 10,
  page: 1,
});
```

## TypeScript Support

This library is written in TypeScript and includes type definitions out of the box.

```typescript
import { 
  Upag,
  Customer,
  Payment,
  PaymentMethod,
  CreateCustomerParams,
  CreatePaymentParams
} from 'upag';
```

## Error Handling

All API errors are thrown with detailed information:

```typescript
try {
  const customer = await upag.customers.create({
    email: 'invalid-email',
    name: 'John Doe'
  });
} catch (error) {
  console.error('Error type:', error.type);
  console.error('Error message:', error.message);
  console.error('Status code:', error.statusCode);
  console.error('Error code:', error.code);
  console.error('Details:', error.details);
}
```

### Error Types

- `api_error` - Server-side error
- `validation_error` - Invalid parameters
- `authentication_error` - Invalid API key
- `network_error` - Network/connection error
- `client_error` - Client-side error

## API Keys

Get your API keys from the [Upag Dashboard](https://app.upag.io).

- **Test mode**: Use keys starting with `sk_test_`
- **Live mode**: Use keys starting with `sk_live_`

⚠️ **Never share your API keys or commit them to version control.**

## Requirements

- Node.js >= 16.0.0
- npm or yarn

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Watch mode for development
npm run dev
```

## License

MIT

## Support

- Documentation: https://docs.upag.io
- Email: support@upag.io
- GitHub: https://github.com/upaghq/upag

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

