import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "flowgrid-api-key";

function readKey(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

/** Simple pub-sub so non-React code (the API client) can read the latest key. */
type Listener = () => void;
const listeners = new Set<Listener>();
let currentKey = readKey();

export function getApiKey(): string {
  return currentKey;
}

export function setApiKeyGlobal(key: string) {
  currentKey = key;
  if (typeof window !== "undefined") {
    if (key) window.localStorage.setItem(STORAGE_KEY, key);
    else window.localStorage.removeItem(STORAGE_KEY);
  }
  listeners.forEach((l) => l());
}

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState(currentKey);

  useEffect(() => {
    const listener = () => setApiKeyState(currentKey);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setApiKey = useCallback((key: string) => {
    setApiKeyGlobal(key.trim());
  }, []);

  return { apiKey, setApiKey };
}
