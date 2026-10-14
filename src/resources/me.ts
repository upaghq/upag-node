import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import { MeResource } from '../types';

export class Me extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/me');
  }

  async retrieve(): Promise<MeResource> {
    return this.http.get<MeResource>(this.basePath);
  }
}
