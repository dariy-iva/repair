<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { usePopupStore } from '~/stores/popup'
import { useExpensesStore } from '~/stores/expenses'
import { storeToRefs } from 'pinia'

const TITLE = 'Расходы на ремонт'
const DESCRIPTION = 'Отслеживайте и управляйте расходами на ремонт'

useHead({
  title: TITLE,
  meta: [
    { name: 'description', content: DESCRIPTION }
  ]
})

const popupStore = usePopupStore()
const expensesStore = useExpensesStore()

onMounted(async () => {
  await Promise.all([
    expensesStore.loadCategories(),
    expensesStore.loadExpenses()
  ])
})

const handleAddExpense = () => {
  popupStore.openExpenseModal()
}
</script>

<template>
  <LayoutPage
    :title="TITLE"
    :description="DESCRIPTION"
    :error="expensesStore.error"
  >
    <Chart
      :items="expensesStore.expensesByCategory"
      :is-loading="expensesStore.loading"
    />

    <ExpenseSection
      :expenses="expensesStore.expensesWithCategories"
      :loading="expensesStore.loading"
    />

    <div class="add-button-container">
      <el-button
        type="primary"
        size="large"
        @click="handleAddExpense"
      >
        <el-icon class="button-icon">
          <Plus />
        </el-icon>
        Добавить расход
      </el-button>
    </div>
  </LayoutPage>
</template>

<style scoped lang="scss">
.add-button-container {
  display: flex;
  justify-content: center;

  .button-icon {
    margin-right: 8px;
  }
}
</style>
