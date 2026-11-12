import { createServer, IncomingMessage, Server } from 'node:http';
import { AddressInfo } from 'node:net';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Upag } from '../src';

interface Received {
  method?: string;
  url?: string;
  contentType?: string;
  body: Buffer;
}

const FILE = {
  id: 'f1',
  name: 'logo.png',
  size: 3,
  contentType: 'image/png',
  purpose: 'checkout_asset',
  url: 'https://assets.upag.io/acc/f1.png',
  createdAt: '2026-11-12T00:00:00.000Z',
};

let server: Server;
let upag: Upag;
let received: Received[];

function read(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

/** Parses the request as the API's multipart middleware does, with the Web `FormData` API. */
async function formOf(request: Received): Promise<FormData> {
  return new Request('http://localhost/', {
    method: 'POST',
    headers: { 'content-type': request.contentType ?? '' },
    body: new Uint8Array(request.body),
  }).formData();
}

beforeAll(async () => {
  // A real server: what matters is the bytes axios puts on the wire for a form.
  server = createServer(async (req, res) => {
    received.push({ method: req.method, url: req.url, contentType: req.headers['content-type'], body: await read(req) });
    res.setHeader('content-type', 'application/json');
    const listing = req.method === 'GET' && req.url?.split('?')[0] === '/v1/files';
    res.end(JSON.stringify(listing ? { data: [FILE], count: 1 } : FILE));
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  upag = new Upag({ apiKey: 'sk_test_x', baseURL: `http://127.0.0.1:${port}/v1` });
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  received = [];
});

describe('files', () => {
  it('uploads a buffer as multipart, with its purpose and name', async () => {
    const file = await upag.files.create({
      file: Buffer.from([1, 2, 3]),
      filename: 'logo.png',
      purpose: 'checkout_asset',
      name: 'Logo',
    });

    expect(file).toEqual(FILE);
    expect(received[0].contentType).toMatch(/^multipart\/form-data; boundary=/);
    const form = await formOf(received[0]);
    const part = form.get('file') as File;
    expect(part.name).toBe('logo.png');
    expect(Buffer.from(await part.arrayBuffer())).toEqual(Buffer.from([1, 2, 3]));
    expect(form.get('purpose')).toBe('checkout_asset');
    expect(form.get('name')).toBe('Logo');
  });

  it('uploads a Blob without a name field when none is given', async () => {
    await upag.files.create({ file: new Blob(['<svg/>'], { type: 'image/svg+xml' }), purpose: 'checkout_asset' });

    const form = await formOf(received[0]);
    expect((form.get('file') as File).type).toBe('image/svg+xml');
    expect(form.has('name')).toBe(false);
  });

  it("names a File's part after the file when no filename is given", async () => {
    await upag.files.create({ file: new File(['x'], 'banner.webp', { type: 'image/webp' }), purpose: 'checkout_asset' });

    expect(((await formOf(received[0])).get('file') as File).name).toBe('banner.webp');
  });

  it('imports from a URL as JSON', async () => {
    await upag.files.create({ url: 'https://cdn.example.com/banner.png', purpose: 'checkout_asset' });

    expect(received[0].method).toBe('POST');
    expect(received[0].contentType).toBe('application/json');
    expect(JSON.parse(received[0].body.toString())).toEqual({
      url: 'https://cdn.example.com/banner.png',
      purpose: 'checkout_asset',
    });
  });

  it('retrieves a file by id', async () => {
    await upag.files.retrieve('f1');

    expect(received[0]).toMatchObject({ method: 'GET', url: '/v1/files/f1' });
  });

  it('lists files with pagination and a purpose filter', async () => {
    const list = await upag.files.list({ page: 2, limit: 5, purpose: 'checkout_asset' });

    expect(list).toEqual({ data: [FILE], count: 1 });
    expect(received[0].url).toBe('/v1/files?page=2&limit=5&purpose=checkout_asset');
  });
});
