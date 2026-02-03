<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import type { Expense } from '@/types/expense'

interface Props {
  expenses: Expense.ModelWithCategory[]
  loading?: boolean
}

defineProps<Props>()

const showCategoryForm = ref(false)

const toggleCategoryForm = (): void => {
  showCategoryForm.value = !showCategoryForm.value
}
</script>

<template>
  <el-card class="expense-section">
    <template #header>
      <div class="expense-section__header">
        <h2 class="expense-section__title">
          Детализация расходов
        </h2>

        <el-button
          v-if="!showCategoryForm"
          type="primary"
          @click="toggleCategoryForm"
        >
          <el-icon class="expense-section__button-icon">
            <Plus />
          </el-icon>
          Добавить категорию
        </el-button>
      </div>

      <ExpenseCategoryForm
        v-if="showCategoryForm"
        @on-cancel="toggleCategoryForm"
      />
    </template>

    <div v-if="!expenses.length && !loading">
      <p
        class="expense-section__empty-text"
      >
        Пока нет расходов
      </p>
    </div>

    <ExpenseTable
      v-else
      :items="expenses"
      :is-loading="loading"
    />
  </el-card>
</template>

<style scoped lang="scss">
.expense-section {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }

  &__button-icon {
    margin-right: 0.8rem;
  }

  &__empty-text {
    text-align: center;
    color: #6b7280;
    padding: 2rem 0;
  }
}
</style>
