<script setup lang="ts">
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

const expensesStore = useExpensesStore()
const { isLoadingCategories, expensesByCategory, isLoadingExpenses, expensesWithCategories } = storeToRefs(expensesStore)
</script>

<template>
  <LayoutPage
    :title="TITLE"
    :description="DESCRIPTION"
  >
    <ChartSection
      :items="expensesByCategory"
      :is-loading="isLoadingCategories || isLoadingExpenses"
    />

    <ExpenseSection
      :expenses="expensesWithCategories"
      :loading="isLoadingExpenses"
    />
  </LayoutPage>
</template>

<style scoped lang="scss">
.back-top {
  color: #0052a2;
}
</style>
