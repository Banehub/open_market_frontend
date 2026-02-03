import { api } from './client'

export async function getRatingsBySeller(userId) {
  return api.get(`/ratings/seller/${userId}`)
}

export async function getRatingsByProduct(productId) {
  return api.get(`/ratings/product/${productId}`)
}

export async function getAverageRatingSeller(userId) {
  return api.get(`/ratings/average/seller/${userId}`)
}

export async function checkRatedSeller(fromUserId, toUserId) {
  const q = `?fromUserId=${encodeURIComponent(fromUserId)}&toUserId=${encodeURIComponent(toUserId)}`
  return api.get(`/ratings/check/seller${q}`)
}

export async function checkRatedProduct(fromUserId, productId) {
  const q = `?fromUserId=${encodeURIComponent(fromUserId)}&productId=${encodeURIComponent(productId)}`
  return api.get(`/ratings/check/product${q}`)
}

export async function createRating(body) {
  return api.post('/ratings', body)
}
