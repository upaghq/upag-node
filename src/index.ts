export { Upag } from './client';
export * from './types';

export { Customers } from './resources/customers';
export { Products } from './resources/products';
export { Prices } from './resources/prices';
export { CheckoutSessions } from './resources/checkout-sessions';
export { CheckoutLayouts } from './resources/checkout-layouts';
export { Subscriptions } from './resources/subscriptions';
export { Invoices } from './resources/invoices';
export { PaymentLinks } from './resources/payment-links';
export { Coupons } from './resources/coupons';
export { Transfers } from './resources/transfers';
export { Webhooks, WebhookLogs } from './resources/webhooks';
export { Cards } from './resources/cards';
export { Charges } from './resources/charges';
export { ThreeDSecure } from './resources/three-d-secure';
export { Me } from './resources/me';

import { Upag } from './client';
export default Upag;
