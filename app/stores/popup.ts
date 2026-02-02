import { defineStore } from 'pinia'

export interface ExpenseFormData {
  id: string
  category: string
  name: string
  amount: number
}

export const usePopupStore = defineStore('popup', () => {
  const expenseModal = ref<{
    visible: boolean
    expense: ExpenseFormData | null
  }>({
    visible: false,
    expense: null
  })

  const isExpenseModalVisible = computed(() => expenseModal.value.visible)
  const editingExpense = computed(() => expenseModal.value.expense)
  const isEditMode = computed(() => !!expenseModal.value.expense)

  const openExpenseModal = (expense?: ExpenseFormData) => {
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
