export interface PaginatedResponse<T> {
  data: T[]
  last_page: number
}
