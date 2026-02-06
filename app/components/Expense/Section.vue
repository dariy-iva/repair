<script setup lang="ts">
import type { Expense } from '@/types/expense'
import { Plus } from '@element-plus/icons-vue'
import { usePopupStore } from '@/stores/popup'

interface Props {
  expenses: Expense.ModelWithCategory[]
  loading?: boolean
}

defineProps<Props>()

const popupStore = usePopupStore()

const handleAddExpense = () => {
  popupStore.openExpenseModal()
}
</script>

<template>
  <UiSection
    title="Детализация расходов"
    class="expense-section"
  >
    <template #header>
      <el-button
        type="primary"
        size="default"
        class="expense-section__add-button"
        @click="handleAddExpense"
      >
        <el-icon class="button-icon">
          <Plus />
        </el-icon>
        Добавить расход
      </el-button>
    </template>

    <el-card>
      <ExpenseTable
        :items="expenses"
        :is-loading="loading"
      />
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
  &__add-button {
    min-width: 15rem;
    margin-left: auto;

    .button-icon {
      margin-right: 8px;
    }
  }
}
</style>
