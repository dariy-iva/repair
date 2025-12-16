<template>
  <div class="page-container">
    <div class="page-content">
      <div class="page-header">
        <h1 class="page-title">Расходы на ремонт</h1>
        <p class="page-description">Отслеживайте и управляйте расходами на ремонт</p>
      </div>

      <el-alert
        v-if="error"
        type="error"
        :closable="false"
        show-icon
      >
        {{ error }}
      </el-alert>

      <ExpenseChart
        :expenses-by-category="expensesByCategory"
        :total-amount="totalAmount"
        :loading="loading"
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
          <el-icon class="button-icon"><Plus /></el-icon>
          Добавить расход
        </el-button>
      </div>

      <el-dialog
        v-model="showExpenseModal"
        :title="editingExpense ? 'Редактировать расход' : 'Добавить расход'"
        width="500px"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'

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
  expensesByCategory,
  totalAmount
} = useExpenses()

const showExpenseModal = ref(false)
const editingExpense = ref<{ id: string; categoryId: string; name: string; amount: number } | null>(null)

onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadExpenses()
  ])
})

const handleEditExpense = (expense: any) => {
  editingExpense.value = {
    id: expense.id,
    categoryId: expense.categoryId,
    name: expense.name,
    amount: expense.amount
  }
  showExpenseModal.value = true
}

const handleUpdateExpense = async (id: string, data: { categoryId?: string; name?: string; amount?: number }) => {
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

const handleCreateCategory = async (data: { name: string; color: string; description?: string }) => {
  try {
    await createCategory(data)
  } catch (e) {
    console.error('Failed to create category:', e)
  }
}

const handleCreateExpense = async (data: { categoryId: string; name: string; amount: number }) => {
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

useHead({
  title: 'Мой ремонт',
  meta: [
    { name: 'description', content: 'Отслеживайте и управляйте расходами на ремонт' }
  ]
})
</script>

<style scoped lang="scss">
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  .page-title {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .page-description {
    color: #6b7280;
  }
}

.add-button-container {
  display: flex;
  justify-content: center;

  .button-icon {
    margin-right: 8px;
  }
}
</style>
