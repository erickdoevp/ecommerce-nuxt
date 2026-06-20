export function createPublicApi() {
  return $fetch.create({
    baseURL: 'https://ecommerce-13d7.onrender.com/api/v1'
  })
}
