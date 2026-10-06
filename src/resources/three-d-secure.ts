import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import { idempotencyHeaders } from '../utils/idempotency';
import {
  CreatedThreeDSecureSession,
  CreateThreeDSecureSessionParams,
  IdempotentRequestOptions,
  ThreeDSecureSession,
} from '../types';

/**
 * 3D Secure sessions. Your server opens a session and hands its `clientSecret` to the
 * checkout page; the browser SDK (upag-js) runs the authentication. The charge then
 * references the session with `threeDSecureSession`.
 */
export class ThreeDSecure extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/3ds/sessions');
  }

  /**
   * Open a session that authenticates one card for one amount
   * @param params - The amount, installments, card and customer
   * @param options - `idempotencyKey` returns the same session, with a new `clientSecret`,
   * when the call is repeated within 24 hours
   * @returns The session, with the `clientSecret` for the browser
   */
  async createSession(
    params: CreateThreeDSecureSessionParams,
    options: IdempotentRequestOptions = {}
  ): Promise<CreatedThreeDSecureSession> {
    return this.http.post<CreatedThreeDSecureSession>(this.basePath, params, idempotencyHeaders(options));
  }

  /**
   * Retrieve a session by ID. The `clientSecret` is never returned again.
   * @param id - Session ID
   */
  async retrieveSession(id: string): Promise<ThreeDSecureSession> {
    return this.http.get<ThreeDSecureSession>(this.buildUrl(id));
  }
}
