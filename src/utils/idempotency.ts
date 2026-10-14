import { IdempotentRequestOptions } from '../types';

/** Request config carrying the `Idempotency-Key` header, or nothing when no key was given. */
export function idempotencyHeaders(options: IdempotentRequestOptions) {
  return options.idempotencyKey
    ? { headers: { 'Idempotency-Key': options.idempotencyKey } }
    : undefined;
}
