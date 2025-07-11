import axios from 'axios'

export interface Order {
  g_number: string
  date: string
  supplier_article: string
  warehouse_name: string
  total_price: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    total: number
  }
}

export async function fetchOrders(
  apiKey: string,
  page: number,
  limit: number,
  dateFrom: string,
  dateTo: string
): Promise<PaginatedResponse<Order>> {
  const response = await axios.get('/api/orders', {
    params: {
      key: apiKey,
      dateFrom,
      dateTo,
      page,
      limit
    }
  })

  return response.data
}
