import axios from 'axios'
import type { Stock } from '@/types/Stock'

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    total: number
  }
}

export async function fetchStocks(
  apiKey: string,
  page: number,
  limit: number
): Promise<PaginatedResponse<Stock>> {
  const today = new Date().toISOString().split('T')[0]

  const response = await axios.get('/api/stocks', {
    params: {
      key: apiKey,
      dateFrom: today,
      page,
      limit
    }
  })

  return response.data
}
