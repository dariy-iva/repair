<script setup lang="ts">
import { Top } from '@element-plus/icons-vue'
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

onMounted(async () => {
  await Promise.all([
    expensesStore.loadCategories(),
    expensesStore.loadExpenses()
  ])
})
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
.back-top {
  color: #0052a2;
}
</style>
