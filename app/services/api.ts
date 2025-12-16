import type { Category, Expense, CreateExpenseDto, UpdateExpenseDto, CreateCategoryDto } from '~/types/expense'

// Моковые данные
const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Услуги',
    color: '#3b82f6'
  },
  {
    id: '2',
    name: 'Материалы',
    color: '#10b981'
  },
  {
    id: '3',
    name: 'Оборудование',
    color: '#f59e0b'
  },
  {
    id: '4',
    name: 'Другое',
    color: '#8b5cf6',
    description: 'Сопутствующие расходы (временная мебель, сантехника и тп)'
  }
]

const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    categoryId: '1',
    name: 'Демонтаж стен',
    amount: 45000,
    date: new Date().toISOString()
  },
  {
    id: '2',
    categoryId: '2',
    name: 'Кирпич',
    amount: 12000,
    date: new Date().toISOString()
  },
  {
    id: '3',
    categoryId: '3',
    name: 'Дрель',
    amount: 8500,
    date: new Date().toISOString()
  },
  {
    id: '4',
    categoryId: '4',
    name: 'Временный стол',
    amount: 3000,
    date: new Date().toISOString()
  }
]

// Имитация задержки сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// API адаптер
class ExpenseApiService {
  private categories: Category[] = [...MOCK_CATEGORIES]
  private expenses: Expense[] = [...MOCK_EXPENSES]

  // Категории
  async getCategories(): Promise<Category[]> {
    await delay(800)
    return [...this.categories]
  }

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    await delay(800)
    const newCategory: Category = {
      id: Date.now().toString(),
      ...dto
    }
    this.categories.push(newCategory)
    return newCategory
  }

  // Расходы
  async getExpenses(): Promise<Expense[]> {
    await delay(800)
    return [...this.expenses]
  }

  async createExpense(dto: CreateExpenseDto): Promise<Expense> {
    await delay(800)
    const newExpense: Expense = {
      id: Date.now().toString(),
      ...dto,
      date: new Date().toISOString()
    }
    this.expenses.push(newExpense)
    return newExpense
  }

  async updateExpense(id: string, dto: UpdateExpenseDto): Promise<Expense> {
    await delay(800)
    const index = this.expenses.findIndex(e => e.id === id)
    if (index === -1) {
      throw new Error('Expense not found')
    }
    const currentExpense = this.expenses[index]
    this.expenses[index] = {
      ...currentExpense,
      ...dto
    } as Expense
    return this.expenses[index]
  }

  async deleteExpense(id: string): Promise<void> {
    await delay(800)
    const index = this.expenses.findIndex(e => e.id === id)
    if (index === -1) {
      throw new Error('Expense not found')
    }
    this.expenses.splice(index, 1)
  }
}

export const expenseApi = new ExpenseApiService()
