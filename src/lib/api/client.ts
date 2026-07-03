/**
 * Native-fetch transport for the API. TanStack Query (useQuery/useMutation) calls the typed
 * helpers below — this module just performs the request and normalises the response.
 *
 * Auth is httpOnly cookies (sf_access / sf_refresh) set by the server, so there is no token
 * for JS to read or attach. We send `credentials: "include"` so the browser ships the cookies
 * (the Next dev server on :3000 is same-site with the API on :5095, so SameSite=Lax works).
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5095/api/v1";

/** Every endpoint returns this envelope (EduTech.Shared ServiceResponses<T>). */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode?: number;
  errorCode?: number;
}

/** Normalised error thrown to callers — carries the backend's user-facing message. */
export class ApiError extends Error {
  statusCode?: number;
  errorCode?: number;
  constructor(message: string, statusCode?: number, errorCode?: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

let refreshing: Promise<boolean> | null = null;

function refreshEndpointForCurrentPortal(): string | null {
  if (typeof window === "undefined") return null;
  const path = window.location.pathname;
  if (path.startsWith("/school")) return "/school/auth/refresh";
  if (path.startsWith("/parent")) return "/parent/auth/refresh";
  if (path.startsWith("/staff")) return "/staff/auth/refresh";
  return null;
}

async function postRefresh(url: string): Promise<boolean> {
  const locks = typeof navigator !== "undefined" ? navigator.locks : undefined;
  if (locks) {
    return locks.request("sf-token-refresh", async () => {
      const r = await rawRequest(url, { method: "POST" });
      return r.ok;
    });
  }
  const r = await rawRequest(url, { method: "POST" });
  return r.ok;
}

async function rawRequest(path: string, init: RequestInit): Promise<Response> {
  const isForm = init.body instanceof FormData;
  return fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(init.headers ?? {}),
    },
    ...init,
  });
}

async function tryRefresh(): Promise<boolean> {
  const url = refreshEndpointForCurrentPortal();
  if (!url) return false;
  refreshing ??= postRefresh(url)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

async function request<T>(
  path: string,
  init: RequestInit
): Promise<ApiEnvelope<T>> {
  let response = await rawRequest(path, init);

  // One-shot silent refresh on 401, then replay the original request.
  const isAuthCall =
    path.includes("/auth/refresh") || path.includes("/auth/login");
  if (response.status === 401 && !isAuthCall && (await tryRefresh())) {
    response = await rawRequest(path, init);
  }

  // 204 / empty body — synthesise a success envelope.
  const text = await response.text();
  const env: ApiEnvelope<T> = text
    ? JSON.parse(text)
    : { success: response.ok, message: "", data: null as T };

  if (!response.ok || env.success === false) {
    throw new ApiError(
      env.message || "Something went wrong. Please try again.",
      response.status,
      env.errorCode
    );
  }
  return env;
}

export function apiGet<T>(path: string) {
  return request<T>(path, { method: "GET" });
}
export function apiPost<T>(path: string, body?: unknown) {
  return request<T>(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
export function apiPatch<T>(path: string, body?: unknown) {
  return request<T>(path, {
    method: "PATCH",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
export function apiPut<T>(path: string, body?: unknown) {
  return request<T>(path, {
    method: "PUT",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
export function apiDelete<T>(path: string) {
  return request<T>(path, { method: "DELETE" });
}
export function apiPostForm<T>(path: string, form: FormData) {
  return request<T>(path, { method: "POST", body: form });
}
