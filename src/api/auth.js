import { api } from './client'

export async function login(email, password) {
  const data = await api.post('/auth/login', { email, password })
  return data
}

export async function register(body) {
  const data = await api.post('/auth/register', body)
  return data
}

export async function getMe() {
  return api.get('/auth/me')
}
