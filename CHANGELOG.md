# Changelog

All notable changes to `upag-node` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Trial on payment links and checkout sessions. `paymentLinks.create` / `update` and `checkoutSessions.create` take `subscriptionData: { trial: { interval, intervalCount }, trialSettings: { endBehavior: { missingPaymentMethod } } }` (`interval` is `day`, `week` or `month`, up to 730 days; `missingPaymentMethod` is `create_invoice` by default or `cancel`) and `paymentMethodCollection` (`always` by default, or `if_required`). A session also takes an absolute `subscriptionData.trialEnd` (at least 48 hours ahead) instead of `trial`. Links and sessions return the same fields; a session also returns `subscription` once one is created. Needs a recurring item.
- `checkoutSessions.confirm` accepts `paymentMethod: { type: 'card', card }` instead of `charge` when nothing is due today. It keeps the card for the first charge after the trial. Under `paymentMethodCollection: 'if_required'` the body may carry neither. No charge and no invoice are created.
- `Subscription.trialEndBehavior`, the `missing_payment_method` cancellation reason (set by Upag, not accepted on cancel) and the `subscription.trial_ending` webhook event, sent three days before a trial ends.
- `upag.webhooks.validateSignature(payload, signature, secret)` to verify inbound deliveries against the webhook signing secret
- `charges.create(params, { idempotencyKey })` sends the `Idempotency-Key` header. The API does not enforce it on charges yet; reconcile through `meta` before retrying.

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
