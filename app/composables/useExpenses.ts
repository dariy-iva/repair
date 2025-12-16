import type { Category, Expense, ExpenseWithCategory, CreateExpenseDto, UpdateExpenseDto, CreateCategoryDto } from '~/types/expense'
import { expenseApi } from '~/services/api'

export const useExpenses = () => {
  const categories = ref<Category[]>([])
  const expenses = ref<Expense[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Загрузка категорий
  const loadCategories = async () => {
    loading.value = true
    error.value = null
    try {
      categories.value = await expenseApi.getCategories()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load categories'
      console.error('Failed to load categories:', e)
    } finally {
      loading.value = false
    }
  }

  // Загрузка расходов
  const loadExpenses = async () => {
    loading.value = true
    error.value = null
    try {
      expenses.value = await expenseApi.getExpenses()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load expenses'
      console.error('Failed to load expenses:', e)
    } finally {
      loading.value = false
    }
  }

  // Создание категории
  const createCategory = async (dto: CreateCategoryDto) => {
    loading.value = true
    error.value = null
    try {
      const newCategory = await expenseApi.createCategory(dto)
      categories.value.push(newCategory)
      return newCategory
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create category'
      console.error('Failed to create category:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Создание расхода
  const createExpense = async (dto: CreateExpenseDto) => {
    loading.value = true
    error.value = null
    try {
      const newExpense = await expenseApi.createExpense(dto)
      expenses.value.push(newExpense)
      return newExpense
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create expense'
      console.error('Failed to create expense:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Обновление расхода
  const updateExpense = async (id: string, dto: UpdateExpenseDto) => {
    loading.value = true
    error.value = null
    try {
      const updatedExpense = await expenseApi.updateExpense(id, dto)
      const index = expenses.value.findIndex(e => e.id === id)
      if (index !== -1) {
        expenses.value[index] = updatedExpense
      }
      return updatedExpense
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update expense'
      console.error('Failed to update expense:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Удаление расхода
  const deleteExpense = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await expenseApi.deleteExpense(id)
      expenses.value = expenses.value.filter(e => e.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete expense'
      console.error('Failed to delete expense:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Расходы с категориями
  const expensesWithCategories = computed<ExpenseWithCategory[]>(() => {
    return expenses.value.map(expense => {
      const category = categories.value.find(c => c.id === expense.categoryId)
      return {
        ...expense,
        category: category || { id: '', name: 'Unknown', color: '#gray' }
      }
    })
  })

  // Расходы по категориям для диаграммы
  const expensesByCategory = computed(() => {
    const result = categories.value.map(category => {
      const categoryExpenses = expenses.value.filter(e => e.categoryId === category.id)
      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)
      return {
        category,
        total,
        count: categoryExpenses.length
      }
    })
    return result.filter(item => item.total > 0)
  })

  // Общая сумма
  const totalAmount = computed(() => {
    return expenses.value.reduce((sum, e) => sum + e.amount, 0)
  })

  return {
    categories,
    expenses,
    loading,
    error,
    loadCategories,
    loadExpenses,
    createCategory,
    createExpense,
    updateExpense,
    deleteExpense,
    expensesWithCategories,
    expensesByCategory,
    totalAmount
  }
}
