export interface Category {
  id: string
  name: string
  color: string
  description?: string
}

export interface Expense {
  id: string
  categoryId: string
  name: string
  amount: number
  date: string
}

export interface ExpenseWithCategory extends Expense {
  category: Category
}

export interface CreateExpenseDto {
  categoryId: string
  name: string
  amount: number
}

export interface UpdateExpenseDto {
  categoryId?: string
  name?: string
  amount?: number
}

export interface CreateCategoryDto {
  name: string
  color: string
  description?: string
}
