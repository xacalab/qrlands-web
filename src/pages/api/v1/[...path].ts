import { IncomingMessage, ServerResponse } from 'http';
import { API_URL } from '@web/lib/constants';
import { getToken } from 'next-auth/jwt';

type CustomIncomingMessage = IncomingMessage & {
  query: { path?: string[] };
  body: object;
  cookies: Partial<{ [key: string]: string }>;
};

export default async function handler(
  req: CustomIncomingMessage,
  res: ServerResponse,
) {
  const { path, ...searchParams } = req.query;
  const input = path?.join('/') || '';
  const query = searchParams
    ? `?${new URLSearchParams(
        Object.entries(searchParams).map(([key, value]) => [key, `${value}`]),
      )}`
    : '';
  const token = await getToken({ req });

  const response = await fetch(`${API_URL}/api/v1/${input}${query}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token.apiToken}` } : undefined),
    },
    method: req.method,
    body:
      req.body && req.method !== 'GET' && req.method !== 'HEAD'
        ? JSON.stringify(req.body)
        : undefined,
  });

  res.writeHead(response.status, response.statusText);
  res.end(JSON.stringify(await response.json().catch(() => ({}))));
}
