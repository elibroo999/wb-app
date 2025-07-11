import axios from 'axios'

export interface Sale {
  sale_id: string
  date: string
  supplier_article: string
  warehouse_name: string
  total_price: number
  discount_percent: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    total: number
  }
}

export async function fetchSales(
  apiKey: string,
  page: number,
  limit: number,
  dateFrom: string,
  dateTo: string
): Promise<PaginatedResponse<Sale>> {
  const response = await axios.get('/api/sales', {
    params: {
      key: apiKey,
      dateFrom,
      dateTo,
      page,
      limit
    }
  })

  // Преобразуем строки в числа
  const convertedData: Sale[] = response.data.data.map((item: any) => ({
    sale_id: item.sale_id,
    date: item.date,
    supplier_article: item.supplier_article,
    warehouse_name: item.warehouse_name,
    total_price: Number(item.total_price),
    discount_percent: Number(item.discount_percent)
  }))

  return {
    data: convertedData,
    meta: response.data.meta
  }
}
