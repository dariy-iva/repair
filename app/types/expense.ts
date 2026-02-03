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

  export type ModelNew = Omit<Model, 'id'>

  export interface ModelWithCategory extends Omit<Model, 'categoryId'> {
    category: Category
  }
}

export interface CreateCategoryDto {
  name: string
  color: string
  description: string
}
