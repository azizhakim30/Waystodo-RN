import axios from "axios"

export const API = axios.create({
  baseURL:
    "https://api.kontenbase.com/query/api/v1/5175e88f-3a30-4e62-8280-45e01162a201",
})

export function setAuthorization(token) {
  if (!token) {
    delete API.defaults.headers.common
    return
  }
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`
}
