import { defineStore } from 'pinia'
import type { Expense } from '@/types/expense'
import { readonly } from '../../.nuxt/imports'

export const usePopupStore = defineStore('popup', () => {
  const expenseModal = ref<{
    visible: boolean
    expense: Expense.Model | null
  }>({
    visible: false,
    expense: null
  })

  const isExpenseModalVisible = computed(() => expenseModal.value.visible)
  const editingExpense = computed(() => expenseModal.value.expense)
  const isEditMode = computed(() => !!expenseModal.value.expense)

  const openExpenseModal = (expense?: Expense.Model): void => {
    expenseModal.value.expense = expense || null
    expenseModal.value.visible = true
  }

  const closeExpenseModal = (): void => {
    expenseModal.value.visible = false
    expenseModal.value.expense = null
  }

  const categoryModal = ref<{ visible: boolean }>({
    visible: false
  })
  const isCategoryModalVisible = computed(() => categoryModal.value.visible)

  const toggleCategoryModal = (status = false): void => {
    categoryModal.value.visible = status || false
  }

  return {
    expenseModal: readonly(expenseModal),
    isExpenseModalVisible,
    editingExpense,
    isEditMode,
    openExpenseModal,
    closeExpenseModal,

    categoryModal: readonly(categoryModal),
    isCategoryModalVisible,
    toggleCategoryModal
  }
})
