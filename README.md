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
  line1: '123 Main St',
  city: 'São Paulo',
  state: 'SP',
  country: 'Brazil',
  zipCode: '01310-100'
});

// Retrieve a customer
const customer = await upag.customers.retrieve('cus_123');

// Update a customer
const updated = await upag.customers.update('cus_123', {
  name: 'John Smith',
  phone: '+5511888888888'
});

// List customers
const customers = await upag.customers.list({
  limit: 10,
  page: 1
});

// Delete a customer
const deleted = await upag.customers.delete('cus_123');
```

### Payment Methods

```typescript
// Create a credit card payment method
const paymentMethod = await upag.paymentMethods.create('cus_123', {
  type: 'credit_card',
  card: {
    number: '4242424242424242',
    expiryMonth: '12',
    expiryYear: '2025',
    cvv: '123',
    holderName: 'John Doe'
  }
});

// Create a PIX payment method
const pixMethod = await upag.paymentMethods.create('cus_123', {
  type: 'pix',
  pix: { expiresIn: 600 } // 10 minutes
});

// Retrieve a payment method
const paymentMethod = await upag.paymentMethods.retrieve('cus_123', 'pm_456');

// List payment methods for a customer
const paymentMethods = await upag.paymentMethods.list('cus_123', {
  limit: 10,
  page: 1
});

// Delete a payment method
const deleted = await upag.paymentMethods.delete('cus_123', 'pm_456');
```

### Payments

```typescript
// Create a payment with existing customer and payment method IDs
const payment = await upag.payments.create({
  customer: 'cus_123',
  paymentMethod: 'pm_456',
  amount: 10000, // Amount in cents (R$ 100.00)
  currency: 'brl',
  installments: 1
});

// Retrieve a payment
const payment = await upag.payments.retrieve('pay_123');

// List payments
const payments = await upag.payments.list({
  limit: 10,
  page: 1,
  customer: 'cus_123' // optional filter
});
```

### Inline Creation (Find or Create Pattern)

The payments API supports creating customers and payment methods inline, improving developer experience by reducing the number of API calls needed.

```typescript
// Create payment with inline customer and payment method
const payment = await upag.payments.create({
  customer: {
    email: 'john@example.com',
    name: 'John Doe',
    phone: '+5511999999999',
    taxId: '12345678900'
  },
  paymentMethod: {
    type: 'credit_card',
    card: {
      number: '4111111111111111',
      expiryMonth: '12',
      expiryYear: '2030',
      cvv: '123',
      holderName: 'John Doe'
    }
  },
  amount: 5000,
  currency: 'brl',
  installments: 3
});

// Mix existing ID with inline creation
const payment = await upag.payments.create({
  customer: 'cus_123', // existing customer
  paymentMethod: {
    type: 'pix',
    pix: { expiresIn: 1800 } // 30 minutes
  },
  amount: 2500,
  currency: 'brl'
});

// The response includes the created customer and payment method
console.log(payment.customer.id);       // New customer ID
console.log(payment.paymentMethod.id);  // New payment method ID

// For PIX payments, the QR code is returned
if (payment.pixQrCode) {
  console.log(payment.pixQrCode);       // Base64 QR code image or PIX copy-paste code
}
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
  CreatePaymentParams,
  CreatePaymentMethodParams,
  CustomerInput,
  PaymentMethodInput,
  Currency
} from 'upag';

// Type-safe payment creation with union types
const params: CreatePaymentParams = {
  customer: { email: 'test@example.com', name: 'Test' }, // or string ID
  paymentMethod: { type: 'pix', pix: { expiresIn: 600 } }, // or string ID
  amount: 1000,
  currency: 'brl'
};
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
