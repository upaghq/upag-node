import { BaseResource } from './base-resource';
import { HttpClient } from '../utils/http-client';
import { CreateFileParams, ListFilesParams, ListResponse, UpagFile, UploadFileParams } from '../types';

export class Files extends BaseResource {
  constructor(http: HttpClient) {
    super(http, '/files');
  }

  /**
   * Uploads a file (`multipart/form-data`), or, given a `url`, has the API download it.
   * Returns the file with its `url` when its purpose is public.
   */
  async create(params: CreateFileParams): Promise<UpagFile> {
    if ('url' in params) {
      return this.http.post<UpagFile>(this.basePath, params);
    }
    // A fixed JSON Content-Type would make axios serialize the form as JSON; this one gets its boundary.
    return this.http.post<UpagFile>(this.basePath, Files.form(params), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async retrieve(id: string): Promise<UpagFile> {
    return this.http.get<UpagFile>(this.buildUrl(id));
  }

  async list(params?: ListFilesParams): Promise<ListResponse<UpagFile>> {
    return this.http.get<ListResponse<UpagFile>>(`${this.basePath}${this.buildQueryString(params)}`);
  }

  private static nameOf(file: UploadFileParams['file']): string {
    return typeof File !== 'undefined' && file instanceof File ? file.name : 'file';
  }

  private static form(params: UploadFileParams): FormData {
    const form = new FormData();
    const file = params.file instanceof Blob ? params.file : new Blob([new Uint8Array(params.file)]);
    form.append('file', file, params.filename ?? Files.nameOf(params.file));
    form.append('purpose', params.purpose);
    if (params.name !== undefined) {
      form.append('name', params.name);
    }
    return form;
  }
}
