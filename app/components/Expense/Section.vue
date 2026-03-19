<script setup lang="ts">
import type { Expense } from '@/types/expense'

interface Props {
  expenses: Expense.ModelWithCategory[]
  loading?: boolean
}

defineProps<Props>()
</script>

<template>
  <UiSection
    title="Детализация расходов"
    class="expense-section"
  >
    <template #header>
      <ExpenseAddButton />
    </template>

    <el-card v-loading="loading">
      <ExpenseTable :items="expenses" />
    </el-card>
  </UiSection>
</template>

<style scoped lang="scss">
.expense-section {
  &__empty-text {
    text-align: center;
    color: #6b7280;
    padding: 2rem 0;
  }
}
</style>
