import { defineStore } from 'pinia'
import type { Expense, CreateCategoryDto } from '@/types/expense'
import { expenseApi } from '@/services/api'
import generateUniqueId from '@/utils/generateUniqueId'

type ListState<T> = {
  list: T[]
  isLoading: boolean
}

type CategoriesState = ListState<Expense.Category>

type ExpensesState = ListState<Expense.Model>

export const useExpensesStore = defineStore('expenses', () => {
  const categoriesData = reactive<CategoriesState>({
    list: [],
    isLoading: false
  })
  const categories = computed<Expense.Category[]>(() => categoriesData.list)
  const isLoadingCategories = computed<boolean>(() => categoriesData.isLoading)

  const loadCategories = async () => {
    categoriesData.isLoading = true

    try {
      categoriesData.list = (await expenseApi.getCategories()) || []
    } catch (e) {
      console.error('Failed to load categories:', e)
    } finally {
      categoriesData.isLoading = false
    }
  }

  const createCategory = async (dto: CreateCategoryDto) => {
    try {
      const id = generateUniqueId(categoriesData.list)
      const newCategory = await expenseApi.createCategory({ id, ...dto })
      categoriesData.list = [newCategory, ...categoriesData.list]
      return newCategory
    } catch (e) {
      console.error('Failed to create category:', e)
      throw e
    }
  }

  const expensesData = reactive<ExpensesState>({
    list: [],
    isLoading: false
  })

  const expenses = computed<Expense.Model[]>(() => expensesData.list)
  const isLoadingExpenses = computed<boolean>(() => expensesData.isLoading)

  const expensesWithCategories = computed<Expense.ModelWithCategory[]>(() => {
    return expenses.value.map((expense) => {
      const category = categories.value.find(c => c.id === expense.categoryId)
      return {
        ...expense,
        category: category || { id: '', name: '', color: '', description: '' }
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

  const loadExpenses = async () => {
    expensesData.isLoading = true

    try {
      expensesData.list = (await expenseApi.getExpenses()) || []
    } catch (e) {
      console.error('Failed to load expenses:', e)
    } finally {
      expensesData.isLoading = false
    }
  }

  const createExpense = async (dto: Expense.ModelNew) => {
    try {
      const id = generateUniqueId(expenses.value)
      const newExpense = await expenseApi.createExpense({ id, ...dto })
      expensesData.list = [...expensesData.list, newExpense]
      return newExpense
    } catch (e) {
      console.error('Failed to create expense:', e)
      throw e
    }
  }

  const updateExpense = async (id: string, dto: Expense.Model) => {
    try {
      const updatedExpense = await expenseApi.updateExpense(id, dto)
      expensesData.list = expensesData.list.map(item => item.id === id ? updatedExpense : item)
      return updatedExpense
    } catch (e) {
      console.error('Failed to update expense:', e)
      throw e
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      await expenseApi.deleteExpense(id)
      expensesData.list = expensesData.list.filter(e => e.id !== id)
    } catch (e) {
      console.error('Failed to delete expense:', e)
      throw e
    }
  }

  return {
    categories,
    isLoadingCategories,
    loadCategories,
    createCategory,

    expenses,
    isLoadingExpenses,
    expensesWithCategories,
    expensesByCategory,
    totalAmount,
    loadExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  }
})
