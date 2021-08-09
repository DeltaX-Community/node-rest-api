export interface Paginate<T> {
  rows: T[]
  page: number
  perPage: number
  total: number
}
