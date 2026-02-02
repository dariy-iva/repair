<script setup lang="ts">
import { Plus, Top } from '@element-plus/icons-vue'
import { usePopupStore } from '@/stores/popup'
import { useExpensesStore } from '@/stores/expenses'
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
const { isLoadingCategories, expensesByCategory, isLoadingExpenses, expensesWithCategories } = storeToRefs(expensesStore)

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
  >
    <Chart
      :items="expensesByCategory"
      :is-loading="isLoadingCategories || isLoadingExpenses"
    />

    <ExpenseSection
      :expenses="expensesWithCategories"
      :loading="isLoadingExpenses"
    />

    <el-button
      type="primary"
      size="large"
      class="add-button"
      @click="handleAddExpense"
    >
      <el-icon class="button-icon">
        <Plus />
      </el-icon>
      Добавить расход
    </el-button>

    <el-backtop
      :right="50"
      :bottom="50"
      class="back-top"
    >
      <el-icon><Top /></el-icon>
    </el-backtop>
  </LayoutPage>
</template>

<style scoped lang="scss">
.add-button {
  width: 100%;
  max-width: 20rem;
  margin: 0 auto;

  .button-icon {
    margin-right: 8px;
  }
}

.back-top {
  color: #0052a2;
}
</style>
