// Main client
export { Upag } from './client';

// Types
export * from './types';

// Resources (for advanced usage)
export { Customers } from './resources/customers';
export { PaymentMethods } from './resources/payment-methods';
export { Payments } from './resources/payments';
export { Products } from './resources/products';
export { Prices } from './resources/prices';
export { CheckoutSessions } from './resources/checkout-sessions';
export { Subscriptions } from './resources/subscriptions';
export { Invoices } from './resources/invoices';
export { Webhooks } from './resources/webhooks';

// Default export
import { Upag } from './client';
export default Upag;
