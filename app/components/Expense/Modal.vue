<script setup lang="ts">
import { usePopupStore } from '@/stores/popup'
import { useExpensesStore } from '@/stores/expenses'

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

const handleClose = () => {
  popupStore.closeExpenseModal()
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="popupStore.isEditMode ? 'Редактировать расход' : 'Добавить расход'"
    width="500px"
    align-center
    @closed="handleClose"
  >
    <ExpenseForm
      v-if="visible"
      :key="formKey"
      :categories="expensesStore.categories"
      :expense="popupStore.editingExpense ?? undefined"
      @submit="handleClose"
    />
  </el-dialog>
</template>
