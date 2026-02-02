import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { Expense, CreateExpenseDto, UpdateExpenseDto, CreateCategoryDto } from '~/types/expense'
import { expenseApi } from '~/services/api'

export const useExpensesStore = defineStore('expenses', () => {
  const categories = ref<Expense.Category[]>([])
  const expenses = ref<Expense.Model[]>([])
  const loading = ref(false)
  const error = ref('')

  const expensesWithCategories = computed<Expense.ModelWithCategory[]>(() => {
    return expenses.value.map((expense) => {
      const category = categories.value.find(c => c.id === expense.categoryId)
      return {
        ...expense,
        category: category || { id: '', name: 'Unknown', color: '#gray' }
      }
    })
  })

  const expensesByCategory = computed(() => {
    return categories.value.map((category) => {
      const categoryExpenses = expenses.value.filter(e => e.categoryId === category.id)
      const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)
      return {
        ...category,
        total,
        count: categoryExpenses.length
      }
    })
  })

  const totalAmount = computed(() => {
    return expenses.value.reduce((sum, e) => sum + e.amount, 0)
  })

  const loadCategories = async () => {
    loading.value = true
    error.value = ''
    try {
      categories.value = await expenseApi.getCategories()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load categories'
      console.error('Failed to load categories:', e)
    } finally {
      loading.value = false
    }
  }

  const loadExpenses = async () => {
    loading.value = true
    error.value = ''
    try {
      expenses.value = await expenseApi.getExpenses()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load expenses'
      console.error('Failed to load expenses:', e)
    } finally {
      loading.value = false
    }
  }

  const generateUniqueCategoryId = (): string => {
    let id = uuidv4()
    while (categories.value.some(c => c.id === id)) {
      id = uuidv4()
    }
    return id
  }

  const createCategory = async (dto: CreateCategoryDto) => {
    loading.value = true
    error.value = ''
    try {
      const id = generateUniqueCategoryId()
      const newCategory = await expenseApi.createCategory({ id, ...dto })
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

  const createExpense = async (dto: CreateExpenseDto) => {
    loading.value = true
    error.value = ''
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

  const updateExpense = async (id: string, dto: UpdateExpenseDto) => {
    loading.value = true
    error.value = ''
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

  const deleteExpense = async (id: string) => {
    loading.value = true
    error.value = ''
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

  return {
    categories: readonly(categories),
    expenses,
    loading,
    error,
    expensesWithCategories,
    expensesByCategory,
    totalAmount,
    loadCategories,
    loadExpenses,
    createCategory,
    createExpense,
    updateExpense,
    deleteExpense
  }
})
