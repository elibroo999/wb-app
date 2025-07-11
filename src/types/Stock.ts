export interface Stock {
  date: string
  last_change_date: string | null
  supplier_article: string | null
  tech_size: string | null
  barcode: number
  warehouse_name: string
  quantity: number
  price: string
  discount: string
}
