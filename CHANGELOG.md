# Changelog

All notable changes to `upag-node` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- **Breaking**: charging a card (`charges.create`, invoice pay, subscriptions) with a card bound to another customer is a `409 card_already_attached`, and a deleted card is a `404`. A card with no customer is still accepted and is attached to the payer once the charge is paid.
- **Breaking**: cards are scoped to their customer. `upag.cards` keeps only `create`; `cards.list`, `cards.retrieve` and `cards.remove` are gone, along with the `customer` filter of `ListCardsParams`.

### Added
- `upag.customers.cards` (`list`, `retrieve`, `attach`, `delete`) over `/customers/:customerId/cards`. `attach(customerId, { card })` is idempotent for the same customer and answers `409 card_already_attached` for another customer's card. `delete` soft-deletes an active card of the customer (404 for any other); the card is no longer listed, retrievable or chargeable. The customer's default card is a `409 card_is_default`: change or clear the default first. A subscription that pays with it stops charging it at the next renewal.
- `cards.create` accepts `customer` (a customer UUID) to attach the card on creation. A publishable key ignores it.
- `charges.list` accepts `customer` (a customer UUID) to list only that customer's charges. An unknown customer returns an empty list.
- Boleto: `'boleto'` joins `PaymentMethodType` and `ChargeType`, `Charge.boleto` carries `barcode`, `digitableLine`, `pdfUrl` and `dueDate`, and `checkoutSessions.confirm` accepts `charge: { method: 'boleto' }`. The customer needs a full address and phone. A subscription paid by boleto gets a new boleto every cycle, which the customer pays manually; `paymentMethod: 'boleto'` is accepted on subscriptions.
- Trial on payment links and checkout sessions. `paymentLinks.create` / `update` and `checkoutSessions.create` take `subscriptionData: { trial: { interval, intervalCount }, trialSettings: { endBehavior: { missingPaymentMethod } } }` (`interval` is `day`, `week` or `month`, up to 730 days; `missingPaymentMethod` is `create_invoice` by default or `cancel`) and `paymentMethodCollection` (`always` by default, or `if_required`). A session also takes an absolute `subscriptionData.trialEnd` (at least 48 hours ahead) instead of `trial`. Links and sessions return the same fields; a session also returns `subscription` once one is created. Needs a recurring item.
- `checkoutSessions.confirm` accepts `paymentMethod: { type: 'card', card }` instead of `charge` when nothing is due today. It keeps the card for the first charge after the trial. Under `paymentMethodCollection: 'if_required'` the body may carry neither. No charge and no invoice are created.
- `Subscription.trialEndBehavior`, the `missing_payment_method` cancellation reason (set by Upag, not accepted on cancel) and the `subscription.trial_ending` webhook event, sent three days before a trial ends.
- `upag.webhooks.validateSignature(payload, signature, secret)` to verify inbound deliveries against the webhook signing secret

### Fixed
- `checkoutSessions.confirm` sends `charge`, the field the API reads. The type and README said `payment`.

## [2.0.0] - 2026-10-06

### Added
- `upag.cards` (`create`, `list`, `retrieve`, `remove`) with `Idempotency-Key` on create
- `upag.threeDSecure` (`createSession`, `retrieveSession`) with `Idempotency-Key` on create
- `upag.charges` (`create`, `retrieve`, `list`) for Pix and card charges
- `upag.paymentLinks` (CRUD plus items and bumps)
- `upag.checkoutLayouts` (CRUD)
- `upag.coupons` (CRUD)
- `upag.transfers` (`lookup`, `create`, `retrieve`, `list`, `receipt`)
- `upag.webhooks.logs` (`list`, `retrieve`, `reprocess`)
- `upag.me.retrieve()` for key introspection
- Checkout session `confirm`, `applyCoupon`, `removeCoupon`, and `delete`
- Invoice `pay` accepts `{ method: 'pix' | 'card' }`

### Changed
- **Breaking**: one host for every resource. `sk_test_` → `https://api.upag.dev/v1`, otherwise `https://api.upag.io/v1`. `baseURL` still overrides it. The billing host is gone.
- **Breaking**: paths are flat (`/customers`, `/invoices`, `/checkout/sessions`). There is no `/billing` prefix.
- **Breaking**: list envelope is `{ data, count }`. `hasMore` is gone.
- **Breaking**: customers use `document`, nested `phone`, and `address` (`zip`, not `zipCode` / `taxId` / `line1`).
- **Breaking**: updates are `PATCH`. Subscription cancel is `POST /subscriptions/:id/cancel` with `{ atPeriodEnd, reason }`.
- **Breaking**: entity refs on the wire drop the `Id` suffix (`customer`, `price`, `card`, `account`, `threeDSecureSession`, `webhook`, `checkoutLayout`, `product`, `beneficiary`, `beneficiaryAccount`).
- **Breaking**: timestamps are ISO strings. Amounts are integer cents.
- **Breaking**: `UpagError` is `{ message, code, statusCode, details, meta }`. There is no `type`.
- Checkout session create with a secret key does not return `clientSecret`.

### Removed
- **Breaking**: `upag.payments` and `upag.paymentMethods`. Use `charges` and `cards`.
- **Breaking**: `environment` option. The host follows the key.

## [1.0.0] - 2025-01-XX

### Added
- Initial release of upag-node SDK
- Customer, payment method, and payment resources against the billing API

[2.0.0]: https://github.com/upaghq/upag-node/releases/tag/v2.0.0
[1.0.0]: https://github.com/upaghq/upag-node/releases/tag/v1.0.0
