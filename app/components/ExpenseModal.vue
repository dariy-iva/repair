<template>
  <el-dialog
    v-model="visible"
    :title="popupStore.isEditMode ? 'Редактировать расход' : 'Добавить расход'"
    width="500px"
    align-center
    @closed="handleClosed"
  >
    <ExpenseForm
      v-if="visible"
      :key="formKey"
      :categories="expensesStore.categories"
      :loading="expensesStore.loading"
      :expense="popupStore.editingExpense ?? undefined"
      @create="handleCreateExpense"
      @update="handleUpdateExpense"
      @cancel="handleClose"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import type { CreateExpenseDto } from '~/types/expense'
import { usePopupStore } from '~/stores/popup'
import { useExpensesStore } from '~/stores/expenses'

const popupStore = usePopupStore()
const expensesStore = useExpensesStore()

const formKey = ref(0)

const visible = computed({
  get: () => popupStore.isExpenseModalVisible,
  set: (value: boolean) => {
    if (!value) {
      popupStore.closeExpenseModal()
    }
  }
})

watch(visible, async (isVisible) => {
  if (isVisible) {
    formKey.value++
    if (expensesStore.categories.length === 0) {
      await expensesStore.loadCategories()
    }
  }
})

const handleCreateExpense = async (data: CreateExpenseDto) => {
  try {
    await expensesStore.createExpense(data)
    popupStore.closeExpenseModal()
  } catch (e) {
    console.error('Failed to create expense:', e)
  }
}

const handleUpdateExpense = async (id: string, data: { categoryId?: string, name?: string, amount?: number }) => {
  try {
    await expensesStore.updateExpense(id, data)
    popupStore.closeExpenseModal()
  } catch (e) {
    console.error('Failed to update expense:', e)
  }
}

const handleClose = () => {
  popupStore.closeExpenseModal()
}

const handleClosed = () => {
  popupStore.closeExpenseModal()
}
</script>
