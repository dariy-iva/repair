import type { Expense } from '@/types'

export const getFormatedAmount = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU').format(amount)
}

export const getTotalAmount = (items: Expense.CategoryWithCount[]): number => {
  return items.reduce((accumulator, item) => accumulator + item.total, 0)
}
