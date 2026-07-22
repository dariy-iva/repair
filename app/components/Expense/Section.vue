<script setup lang="ts">
import type { Expense } from '@/types/expense'

interface Props {
  expenses: Expense.ModelWithCategory[]
  loading?: boolean
}

const props = defineProps<Props>()

const search = shallowRef<string>('')

const filteredExpenses = computed<Expense.ModelWithCategory[]>(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) {
    return props.expenses
  }

  return props.expenses.filter(expense =>
    expense.name.toLowerCase().includes(query) || expense.category.name.toLowerCase().includes(query)
  )
})
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
      <el-input
        v-model="search"
        class="expense-section__search"
        placeholder="Поиск по названию или категории"
        clearable
        size="large"
      />
      <ExpenseTable :items="filteredExpenses" />
    </el-card>
  </UiSection>
</template>

<style scoped lang="scss">
.expense-section {
  &__search {
    margin-bottom: 1rem;

    @include desktop {
      max-width: 50%;
    }
  }

  &__empty-text {
    text-align: center;
    color: var(--app-text-secondary);
    padding: 2rem 0;
  }
}
</style>
