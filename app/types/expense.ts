export namespace Expense {
  export interface Category {
    id: string
    name: string
    color: string
    description: string
  }

  export interface CategoryWithCount extends Category {
    total: number
    count: number
  }

  export interface Model {
    id: string
    categoryId: string
    name: string
    amount: number
    date: string
  }

  export interface ModelWithCategory extends Omit<Model, 'categoryId'> {
    category: Category
  }
}

export interface CreateExpenseDto {
  category: string
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
  description: string
}
