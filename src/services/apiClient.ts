const API_BASE = 'http://localhost:5000/api';

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  });

  if (!res.ok) {
    let errorMsg = `HTTP error ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson.message) errorMsg = errJson.message;
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}
