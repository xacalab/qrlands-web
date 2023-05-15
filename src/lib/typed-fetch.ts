import { PUBLIC_URL } from '@web/lib/constants';

export interface ApiFetchResponse<T> {
  status: number;
  data: T;
}

/**
 * Communicates with the API. It assumes the API returns JSON objects.
 * @param input Same as fetch.
 * @param init Same as fetch.
 * @returns A parsed object.
 */
export async function apiFetch<T = unknown, U = unknown>(
  input: RequestInfo | URL,
  {
    searchParams,
    ...init
  }: Omit<RequestInit, 'body'> & { body?: U } & {
    searchParams?: { [index: string]: number | string };
  } = {},
): Promise<ApiFetchResponse<T>> {
  const query = searchParams
    ? `?${new URLSearchParams(
        Object.entries(searchParams).map(([key, value]) => [key, `${value}`]),
      )}`
    : '';
  const url = `${PUBLIC_URL}/api/v1${input}${query}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });

  if (response.ok) {
    return {
      status: response.status,
      data: (await response.json().catch(() => ({}))) as T,
    };
  }

  throw new APIFetchError(response);
}

const errorMessagesByStatus: { [index: number]: string } = {
  400: 'error.bad-request',
  401: 'error.unauthorized',
  403: 'error.forbidden',
  404: 'error.not-found',
  405: 'error.method-not-allowed',
  406: 'error.not-acceptable',
  408: 'error.timeout',
  409: 'error.conflict',
  410: 'error.gone',
  411: 'error.length-required',
  412: 'error.precondition-failed',
  413: 'error.payload-too-large',
  414: 'error.uri-too-long',
  415: 'error.unsupported-media-type',
  416: 'error.range-not-satisfiable',
  417: 'error.expectation-failed',
  418: 'error.im-a-teapot',
  421: 'error.misdirected',
  422: 'error.unprocessable-entity',
  423: 'error.locked',
  424: 'error.failed-dependency',
  425: 'error.too-early',
  426: 'error.upgrade-required',
  428: 'error.precondition-required',
  429: 'error.too-many-requests',
  431: 'error.request-header-fields-too-large',
  451: 'error.unavailable-for-legal-reasons',
  500: 'error.internal-server-error',
};

const fallbackErrorMessage = 'error.unknown';
function getErrorMessage(response: Response): string {
  const message = errorMessagesByStatus[response.status];

  if (message) return message;

  // Fallback
  return fallbackErrorMessage;
}

export class APIFetchError extends Error {
  public readonly status: number;

  constructor(public readonly response: Response) {
    super(getErrorMessage(response));

    this.status = response.status;
  }
}
