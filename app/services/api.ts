import { v4 as uuidv4 } from 'uuid'
import type { Expense, CreateExpenseDto, UpdateExpenseDto, CreateCategoryDto } from '~/types/expense'

// Моковые данные
const MOCK_CATEGORIES: Expense.Category[] = [
  {
    id: 'e13de722-6cec-491f-80dc-168874e380ff',
    name: 'Услуги',
    color: '#3b82f6'
  },
  {
    id: 'yS2iDIi',
    name: 'Материалы',
    color: '#10b981'
  },
  {
    id: 'e320dd26-a91e-458a-99ba-12c1b3e689f2',
    name: 'Оборудование',
    color: '#f59e0b'
  },
  {
    id: 'f36f206f-4f0e-4587-96c8-154f4265882b',
    name: 'Другое',
    color: '#8b5cf6',
    description: 'Сопутствующие расходы (временная мебель, сантехника и тп)'
  }
]

const MOCK_EXPENSES: Expense.Model[] = [
  {
    id: '1',
    date: '2025-12-14',
    categoryId: 'f36f206f-4f0e-4587-96c8-154f4265882b',
    name: 'Вешалка',
    amount: 898
  },
  {
    id: '2',
    date: '2025-12-14',
    categoryId: 'f36f206f-4f0e-4587-96c8-154f4265882b',
    name: 'Гофра для строительного унитаза',
    amount: 396
  },
  {
    id: '3',
    date: '2025-12-15',
    categoryId: 'f36f206f-4f0e-4587-96c8-154f4265882b',
    name: 'Кран шаровый временный',
    amount: 361
  },
  {
    id: '4',
    date: '2025-12-13',
    categoryId: 'f36f206f-4f0e-4587-96c8-154f4265882b',
    name: 'Лампочки',
    amount: 822
  },
  {
    id: '5',
    date: '2025-12-14',
    categoryId: 'f36f206f-4f0e-4587-96c8-154f4265882b',
    name: 'Личинка замка',
    amount: 394
  },
  {
    id: '6',
    date: '2025-12-21',
    categoryId: 'f36f206f-4f0e-4587-96c8-154f4265882b',
    name: 'Мешки для строительного пылесоса',
    amount: 589
  },
  {
    id: '7',
    date: '2025-12-15',
    categoryId: 'f36f206f-4f0e-4587-96c8-154f4265882b',
    name: 'Подводка временная',
    amount: 166
  },
  {
    id: '8',
    date: '2025-12-15',
    categoryId: 'f36f206f-4f0e-4587-96c8-154f4265882b',
    name: 'Подводка временная',
    amount: 166
  },
  {
    id: '9',
    date: '2026-01-01',
    categoryId: 'f36f206f-4f0e-4587-96c8-154f4265882b',
    name: 'Подводка временная',
    amount: 246
  },
  {
    id: '10',
    date: '2025-12-16',
    categoryId: 'f36f206f-4f0e-4587-96c8-154f4265882b',
    name: 'Расходники',
    amount: 626
  },
  {
    id: '11',
    date: '2025-12-15',
    categoryId: 'f36f206f-4f0e-4587-96c8-154f4265882b',
    name: 'Сантех прокладки временные',
    amount: 179
  },
  {
    id: '12',
    date: '2025-12-14',
    categoryId: 'f36f206f-4f0e-4587-96c8-154f4265882b',
    name: 'Строительный унитаз',
    amount: 3501
  },
  {
    id: '13',
    date: '2025-12-15',
    categoryId: 'f36f206f-4f0e-4587-96c8-154f4265882b',
    name: 'Стул, 2шт',
    amount: 1600
  },
  {
    id: '14',
    date: '2025-12-18',
    categoryId: 'f36f206f-4f0e-4587-96c8-154f4265882b',
    name: 'Тройник на трубу временный',
    amount: 295
  },
  {
    id: '15',
    date: '2026-01-16',
    categoryId: 'yS2iDIi',
    name: 'Адаптер для шуруповерта',
    amount: 181
  },
  {
    id: '16',
    date: '2026-01-14',
    categoryId: 'yS2iDIi',
    name: 'Блоки для вентиляции',
    amount: 2631
  },
  {
    id: '17',
    date: '2026-01-03',
    categoryId: 'yS2iDIi',
    name: 'Диск на болгарку',
    amount: 460
  },
  {
    id: '18',
    date: '2026-01-14',
    categoryId: 'yS2iDIi',
    name: 'Сверла',
    amount: 422
  },
  {
    id: '19',
    date: '2026-01-06',
    categoryId: 'yS2iDIi',
    name: 'Скотч для окон',
    amount: 2457
  },
  {
    id: '20',
    date: '2026-01-08',
    categoryId: 'yS2iDIi',
    name: 'Укрывная пленка для окон',
    amount: 348
  },
  {
    id: '21',
    date: '2026-01-03',
    categoryId: 'yS2iDIi',
    name: 'Укрывная пленка для окон, скотч для окон',
    amount: 956
  },
  {
    id: '22',
    date: '2025-12-13',
    categoryId: 'yS2iDIi',
    name: 'Ведро, перчатки',
    amount: 311
  },
  {
    id: '23',
    date: '2026-01-02',
    categoryId: 'e320dd26-a91e-458a-99ba-12c1b3e689f2',
    name: 'Болгарка',
    amount: 14212
  },
  {
    id: '24',
    date: '2025-12-12',
    categoryId: 'e320dd26-a91e-458a-99ba-12c1b3e689f2',
    name: 'Вышка тура',
    amount: 14626
  },
  {
    id: '25',
    date: '2025-12-13',
    categoryId: 'e320dd26-a91e-458a-99ba-12c1b3e689f2',
    name: 'Лазерный уровень',
    amount: 4356
  },
  {
    id: '26',
    date: '2026-01-01',
    categoryId: 'e320dd26-a91e-458a-99ba-12c1b3e689f2',
    name: 'Ножницы по металлу',
    amount: 1313
  },
  {
    id: '27',
    date: '2026-01-12',
    categoryId: 'e320dd26-a91e-458a-99ba-12c1b3e689f2',
    name: 'Перфоратор',
    amount: 17804
  },
  {
    id: '28',
    date: '2026-01-16',
    categoryId: 'e320dd26-a91e-458a-99ba-12c1b3e689f2',
    name: 'Просекатель',
    amount: 762
  },
  {
    id: '29',
    date: '2026-01-02',
    categoryId: 'e320dd26-a91e-458a-99ba-12c1b3e689f2',
    name: 'Тележка',
    amount: 3430
  },
  {
    id: '30',
    date: '2025-12-17',
    categoryId: 'e13de722-6cec-491f-80dc-168874e380ff',
    name: 'Дизайнер',
    amount: 5000
  },
  {
    id: '31',
    date: '2025-12-23',
    categoryId: 'e13de722-6cec-491f-80dc-168874e380ff',
    name: 'Дизайнер',
    amount: 65100
  },
  {
    id: '32',
    date: '2026-01-14',
    categoryId: 'e13de722-6cec-491f-80dc-168874e380ff',
    name: 'Дизайнер',
    amount: 86800
  },
  {
    id: '33',
    date: '2026-01-2026',
    categoryId: 'e13de722-6cec-491f-80dc-168874e380ff',
    name: 'Антресоль+лестница',
    amount: 172075
  }
]

// Имитация задержки сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const API_BASE_URL = 'https://pvl-iv.ru/api/site2'

// API адаптер
class ExpenseApiService {
  private categories: Expense.Category[] = [...MOCK_CATEGORIES]
  private expenses: Expense.Model[] = [...MOCK_EXPENSES]

  // Категории
  async getCategories(): Promise<Expense.Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories/`)
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`)
    }
    const data = await response.json()
    return data
  }

  async createCategory(dto: CreateCategoryDto & { id: string }): Promise<Expense.Category> {
    const response = await fetch(`${API_BASE_URL}/categories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    })
    if (!response.ok) {
      throw new Error(`Failed to create category: ${response.status}`)
    }
    return response.json()
  }

  // Расходы
  async getExpenses(): Promise<Expense.Model[]> {
    const response = await fetch(`${API_BASE_URL}/expenses/`)
    if (!response.ok) {
      throw new Error(`Failed to fetch expenses: ${response.status}`)
    }
    const data = await response.json()
    return data
  }

  async createExpense(dto: CreateExpenseDto): Promise<Expense.Model> {
    await delay(800)
    const newExpense: Expense.Model = {
      id: uuidv4(),
      ...dto,
      date: new Date().toISOString()
    }
    this.expenses.push(newExpense)
    return newExpense
  }

  async updateExpense(id: string, dto: UpdateExpenseDto): Promise<Expense.Model> {
    await delay(800)
    const index = this.expenses.findIndex(e => e.id === id)
    if (index === -1) {
      throw new Error('Expense not found')
    }
    const currentExpense = this.expenses[index]
    this.expenses[index] = {
      ...currentExpense,
      ...dto
    } as Expense.Model
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
