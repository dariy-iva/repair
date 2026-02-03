import { defineStore } from 'pinia'
import type { Expense } from '@/types/expense'

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

  const openExpenseModal = (expense?: Expense.Model) => {
    expenseModal.value.expense = expense || null
    expenseModal.value.visible = true
  }

  const closeExpenseModal = () => {
    expenseModal.value.visible = false
    expenseModal.value.expense = null
  }

  return {
    expenseModal,
    isExpenseModalVisible,
    editingExpense,
    isEditMode,
    openExpenseModal,
    closeExpenseModal
  }
})
