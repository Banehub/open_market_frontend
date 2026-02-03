import { api } from './client'

export async function getUserById(id) {
  return api.get(`/users/${id}`)
}

export async function getUserByUsername(username) {
  return api.get(`/users/username/${encodeURIComponent(username)}`)
}

export async function updateUser(id, body) {
  return api.patch(`/users/${id}`, body)
}

export async function changePassword(id, currentPassword, newPassword) {
  return api.patch(`/users/${id}/password`, { currentPassword, newPassword })
}
