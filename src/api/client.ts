import type { Envelope } from "@/api/types";
import { getApiKey } from "@/hooks/useApiKey";
import { toast } from "@/lib/toast";

declare global {
  interface Window {
    __FLOWGRID_API_BASE__?: string;
  }
}

export const API_BASE: string =
  (typeof window !== "undefined" && window.__FLOWGRID_API_BASE__) ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  query?: Record<string, string | number | undefined | null>;
  /** Suppress the built-in error toast (caller handles it, e.g. inline form errors). */
  silent?: boolean;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(path.replace(/^\//, ""), API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, silent } = options;
  const url = buildUrl(path, query);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const apiKey = getApiKey();
  if (apiKey) headers["X-API-Key"] = apiKey;

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    if (!silent) {
      toast.error("Network error", "Could not reach the FlowGrid API. Is the server running?");
    }
    throw new ApiError("Network error", 0);
  }

  if (res.status === 401) {
    if (!silent) toast.error("Invalid API key", "Check your key in Settings and try again.");
    throw new ApiError("Unauthorized", 401);
  }

  if (res.status === 429) {
    if (!silent) toast.warning("Rate limit exceeded", "Retrying automatically...");
    throw new ApiError("Rate limited", 429);
  }

  let envelope: Envelope<T> | null = null;
  try {
    envelope = (await res.json()) as Envelope<T>;
  } catch {
    // No JSON body (e.g. empty 204)
  }

  if (!res.ok) {
    const message = envelope?.error || `Request failed (${res.status})`;
    if (!silent) toast.error("Request failed", message);
    throw new ApiError(message, res.status);
  }

  if (envelope?.error) {
    if (!silent) toast.error("Request failed", envelope.error);
    throw new ApiError(envelope.error, res.status);
  }

  return (envelope?.data ?? (null as unknown)) as T;
}

export async function apiRequestWithMeta<T>(
  path: string,
  options: RequestOptions = {}
): Promise<Envelope<T>> {
  const { method = "GET", body, query, silent } = options;
  const url = buildUrl(path, query);

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const apiKey = getApiKey();
  if (apiKey) headers["X-API-Key"] = apiKey;

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    if (!silent) toast.error("Network error", "Could not reach the FlowGrid API. Is the server running?");
    throw new ApiError("Network error", 0);
  }

  if (res.status === 401) {
    if (!silent) toast.error("Invalid API key", "Check your key in Settings and try again.");
    throw new ApiError("Unauthorized", 401);
  }
  if (res.status === 429) {
    if (!silent) toast.warning("Rate limit exceeded", "Retrying automatically...");
    throw new ApiError("Rate limited", 429);
  }

  const envelope = (await res.json().catch(() => null)) as Envelope<T> | null;

  if (!res.ok || envelope?.error) {
    const message = envelope?.error || `Request failed (${res.status})`;
    if (!silent) toast.error("Request failed", message);
    throw new ApiError(message, res.status);
  }

  return envelope ?? { data: null, meta: null, error: null };
}
