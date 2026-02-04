/**
 * API client for OpenMarket backend.
 * Base URL: set VITE_API_BASE_URL in .env (e.g. http://localhost:3000/api)
 */

const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL || ''

const getToken = () => localStorage.getItem('openmarket_token')

/**
 * Resolve image URLs so they work in production. The backend may return
 * localhost URLs (e.g. http://localhost:10000/uploads/...). Rewrite those
 * to use the same origin as the API so images load on the deployed site.
 */
export function toImageUrl(url) {
  if (!url || typeof url !== 'string') return url
  const base = getBaseUrl()
  if (!base) return url
  try {
    if (url.startsWith('http://localhost') || url.startsWith('https://localhost')) {
      const parsed = new URL(url)
      const origin = new URL(base).origin
      return origin + parsed.pathname
    }
    if (url.startsWith('/')) {
      return new URL(base).origin + url
    }
  } catch (_) {}
  return url
}

async function request(path, options = {}) {
  const url = `${getBaseUrl()}${path}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.message || data.error || `HTTP ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

async function requestForm(path, formData) {
  const url = `${getBaseUrl()}${path}`
  const headers = {}
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, { method: 'POST', headers, body: formData })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.message || data.error || `HTTP ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  postForm: (path, formData) => requestForm(path, formData),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}

export default api
