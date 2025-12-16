<template>
  <UContainer class="py-8">
    <div class="space-y-8">
      <div>
        <h1 class="text-4xl font-bold mb-2">Расходы на ремонт</h1>
        <p class="text-gray-600">Отслеживайте и управляйте расходами на ремонт</p>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <ExpenseChart
        :expenses-by-category="expensesByCategory"
        :total-amount="totalAmount"
        :loading="loading"
      />

      <ExpenseTable
        :expenses="expensesWithCategories"
        :loading="loading"
        @update="handleUpdateExpense"
        @delete="handleDeleteExpense"
        @create-category="handleCreateCategory"
      />

      <ExpenseForm
        :categories="categories"
        :loading="loading"
        @create="handleCreateExpense"
      />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
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

onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadExpenses()
  ])
})

const handleUpdateExpense = async (id: string, data: { name?: string; amount?: number }) => {
  try {
    await updateExpense(id, data)
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
  } catch (e) {
    console.error('Failed to create expense:', e)
  }
}

useHead({
  title: 'Расходы на ремонт',
  meta: [
    { name: 'description', content: 'Отслеживайте и управляйте расходами на ремонт' }
  ]
})
</script>
