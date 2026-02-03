import { api } from './client'

/** Upload image files. Backend can implement POST /upload returning { urls: string[] }. */
export async function uploadImages(files) {
  const form = new FormData()
  Array.from(files).forEach((file, i) => form.append('images', file, file.name))
  const data = await api.postForm('/upload', form)
  return data.urls || data.url ? (Array.isArray(data.urls) ? data.urls : [data.url]) : []
}

function buildQuery(params) {
  const sp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') sp.set(k, v)
  })
  const q = sp.toString()
  return q ? `?${q}` : ''
}

export async function getListings({ search, category, sort, limit, offset } = {}) {
  const query = buildQuery({ search, category, sort, limit, offset })
  return api.get(`/listings${query}`)
}

export async function getFeaturedListings(limit = 6) {
  return api.get(`/listings/featured${limit != null ? `?limit=${limit}` : ''}`)
}

export async function getListingById(id) {
  return api.get(`/listings/${id}`)
}

export async function getListingsBySeller(sellerId) {
  return api.get(`/listings/seller/${sellerId}`)
}

export async function createListing(body) {
  return api.post('/listings', body)
}

export async function updateListing(id, body) {
  return api.patch(`/listings/${id}`, body)
}

export async function deleteListing(id) {
  return api.delete(`/listings/${id}`)
}
