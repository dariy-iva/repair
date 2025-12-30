<template>
  <LayoutPage
    :title="TITLE"
    :description="DESCRIPTION"
    :error="error"
  >
    <Chart
      :items="expensesByCategory"
      :is-loading="loading"
    />

    <ExpenseTable
      :expenses="expensesWithCategories"
      :loading="loading"
      @edit="handleEditExpense"
      @delete="handleDeleteExpense"
      @create-category="handleCreateCategory"
    />

    <div class="add-button-container">
      <el-button
        type="primary"
        size="large"
        @click="editingExpense = null; showExpenseModal = true"
      >
        <el-icon class="button-icon">
          <Plus />
        </el-icon>
        Добавить расход
      </el-button>
    </div>

    <el-dialog
      v-model="showExpenseModal"
      :title="editingExpense ? 'Редактировать расход' : 'Добавить расход'"
      width="500px"
      align-center
    >
      <ExpenseForm
        :categories="categories"
        :loading="loading"
        :expense="editingExpense"
        @create="handleCreateExpense"
        @update="handleUpdateExpense"
        @cancel="handleCloseModal"
      />
    </el-dialog>
  </LayoutPage>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'

const TITLE = 'Расходы на ремонт'
const DESCRIPTION = 'Отслеживайте и управляйте расходами на ремонт'

useHead({
  title: TITLE,
  meta: [
    { name: 'description', content: DESCRIPTION }
  ]
})

const {
  categories,
  loading,
  error,
  loadCategories,
  loadExpenses,
  createCategory,
  updateExpense,
  deleteExpense,
  expensesWithCategories,
  expensesByCategory
} = useExpenses()

const showExpenseModal = ref(false)
const editingExpense = ref<{ id: string, category: string, name: string, amount: number } | null>(null)

onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadExpenses()
  ])
})

const handleEditExpense = (expense: any) => {
  editingExpense.value = {
    id: expense.id,
    category: expense.category,
    name: expense.name,
    amount: expense.amount
  }
  showExpenseModal.value = true
}

const handleUpdateExpense = async (id: string, data: { categoryId?: string, name?: string, amount?: number }) => {
  try {
    await updateExpense(id, data)
    showExpenseModal.value = false
    editingExpense.value = null
  } catch (e) {
    console.error('Failed to update expense:', e)
  }
}

const handleDeleteExpense = async (id: string) => {
  try {
    await deleteExpense(id)
  } catch (e) {
    console.error('Failed to delete expense:', e)
  }
}

const handleCreateCategory = async (data: { name: string, color: string, description?: string }) => {
  try {
    await createCategory(data)
  } catch (e) {
    console.error('Failed to create category:', e)
  }
}

const handleCreateExpense = async (data: { category: string, name: string, amount: number }) => {
  try {
    await createExpense(data)
    showExpenseModal.value = false
    editingExpense.value = null
  } catch (e) {
    console.error('Failed to create expense:', e)
  }
}

const handleCloseModal = () => {
  showExpenseModal.value = false
  editingExpense.value = null
}
</script>

<style scoped lang="scss">
.add-button-container {
  display: flex;
  justify-content: center;

  .button-icon {
    margin-right: 8px;
  }
}
</style>
