// Main client
export { Upag } from './client';

// Types
export * from './types';

// Resources (for advanced usage)
export { Customers } from './resources/customers';
export { PaymentMethods } from './resources/payment-methods';
export { Payments } from './resources/payments';

// Default export
import { Upag } from './client';
export default Upag;

