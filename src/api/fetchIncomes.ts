import axios from 'axios'

export interface Income {
  income_id: number
  date: string
  supplier_article: string
  tech_size: string
  barcode: number
  quantity: number
  total_price: string
  date_close: string
  warehouse_name: string
  nm_id: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    total: number
  }
}

export async function fetchIncomes(
  apiKey: string,
  page: number,
  limit: number,
  dateFrom: string,
  dateTo: string
): Promise<PaginatedResponse<Income>> {
  const response = await axios.get('/api/incomes', {
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
