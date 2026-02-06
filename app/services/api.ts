import type { Expense, CreateCategoryDto } from '@/types/expense'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface RequestOptions<T = unknown> {
  endpoint: string
  method?: HttpMethod
  body?: T
}

class ExpenseApiService {
  static readonly API_BASE_URL = 'https://pvl-iv.ru/api/site2'

  static readonly CATEGORY_ROUTE = 'categories'

  static readonly EXPENSE_ROUTE = 'expenses'

  private async request<TResponse, TBody = unknown>(
    options: RequestOptions<TBody>
  ): Promise<TResponse> {
    const { endpoint, method = 'GET', body } = options

    const config: RequestInit = { method }

    if (body) {
      config.headers = { 'Content-Type': 'application/json' }
      config.body = JSON.stringify(body)
    }

    const response = await fetch(`${ExpenseApiService.API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return response.json()
    }

    return undefined as TResponse
  }

  async getCategories(): Promise<Expense.Category[]> {
    return await this.request<Expense.Category[]>({ endpoint: `/${ExpenseApiService.CATEGORY_ROUTE}` })
  }

  async createCategory(dto: CreateCategoryDto & { id: string }): Promise<Expense.Category> {
    return await this.request<Expense.Category, typeof dto>({
      endpoint: `/${ExpenseApiService.CATEGORY_ROUTE}`,
      method: 'POST',
      body: dto
    })
  }

  async deleteCategory(id: string): Promise<Expense.Category> {
    return await this.request({
      endpoint: `/${ExpenseApiService.CATEGORY_ROUTE}/${id}`,
      method: 'DELETE'
    })
  }

  async getExpenses(): Promise<Expense.Model[]> {
    return await this.request<Expense.Model[]>({ endpoint: `/${ExpenseApiService.EXPENSE_ROUTE}` })
  }

  async createExpense(data: Expense.Model): Promise<Expense.Model> {
    return await this.request<Expense.Model, Expense.Model>({
      endpoint: `/${ExpenseApiService.EXPENSE_ROUTE}`,
      method: 'POST',
      body: data
    })
  }

  async updateExpense(id: string, data: Expense.Model): Promise<Expense.Model> {
    return await this.request<Expense.Model, Expense.Model>({
      endpoint: `/${ExpenseApiService.EXPENSE_ROUTE}/${id}`,
      method: 'PATCH',
      body: data
    })
  }

  async deleteExpense(id: string): Promise<void> {
    return await this.request<undefined>({
      endpoint: `/${ExpenseApiService.EXPENSE_ROUTE}/${id}`,
      method: 'DELETE'
    })
  }
}

export const expenseApi = new ExpenseApiService()
