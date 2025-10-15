const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

async function request(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text();
    try { 
      const json = JSON.parse(text); 
      throw new Error(json.message || text); 
    } catch { 
      throw new Error(text || res.statusText); 
    }
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return null;
}

export { request, API_BASE };