const API_HOST = 'http://109.73.206.144:6969'
const API_KEY = import.meta.env.VITE_API_KEY

export async function fetchData(endpoint: string) {
  if (!API_KEY) {
    throw new Error('API ключ не задан! Убедитесь, что переменная VITE_API_KEY есть в .env')
  }
  
const response = await fetch(`${API_HOST}/${endpoint}`, {
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
})

if (!response.ok) {
  throw new Error(`Ошибка загрузки: ${response.status}`)
}

return response.json()
}