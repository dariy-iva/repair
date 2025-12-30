import type { Expense } from '@/types'

export interface Props {
  items: Expense.CategoryWithCount[]
  isLoading?: boolean
}
