import crypto from 'crypto';
import { describe, expect, it } from 'vitest';
import { Upag } from '../src';

const secret = 'whsec_test';
const payload = '{"id":"evt-1","event":"charge.paid"}';

function sign(body: string | Buffer, key = secret): string {
  return `sha256=${crypto.createHmac('sha256', key).update(body).digest('hex')}`;
}

describe('webhooks.validateSignature', () => {
  const webhooks = new Upag({ apiKey: 'sk_test_x' }).webhooks;

  it('accepts a valid Buffer payload', () => {
    const body = Buffer.from(payload);
    expect(webhooks.validateSignature(body, sign(body), secret)).toBe(true);
  });

  it('accepts a valid string payload', () => {
    expect(webhooks.validateSignature(payload, sign(payload), secret)).toBe(true);
  });

  it('accepts a string[] signature header', () => {
    expect(webhooks.validateSignature(payload, [sign(payload)], secret)).toBe(true);
  });

  it('rejects a wrong signature', () => {
    expect(webhooks.validateSignature(payload, sign(payload, 'other'), secret)).toBe(false);
  });

  it('rejects a tampered body', () => {
    expect(webhooks.validateSignature('{"event":"charge.failed"}', sign(payload), secret)).toBe(false);
  });

  it('rejects a missing signature', () => {
    expect(webhooks.validateSignature(payload, undefined, secret)).toBe(false);
  });

  it('rejects a missing secret', () => {
    expect(webhooks.validateSignature(payload, sign(payload), undefined)).toBe(false);
  });

  it('rejects a signature of a different length', () => {
    expect(webhooks.validateSignature(payload, 'sha256=deadbeef', secret)).toBe(false);
  });
});
