<script setup lang="ts">
import { useExpensesStore } from '@/stores/expenses'
import { storeToRefs } from 'pinia'
import type { Expense } from '@/types'

const TITLE = 'Детализация расходов'
const DESCRIPTION = 'Смотрите расходы по категориям'

useHead({
  title: TITLE
})

const expensesStore = useExpensesStore()
const { isLoadingCategories, isLoadingExpenses, expensesWithCategories, categories } = storeToRefs(expensesStore)

const route = useRoute()

const selectedCategory = ref<string>(route.query.category as string)

const toggleCategory = (categoryId: string): void => {
  selectedCategory.value = categoryId
}

const items = computed<Expense.ModelWithCategory[]>(() => selectedCategory.value ? unref(expensesWithCategories).filter(item => item.category.id === selectedCategory.value) : [])
const totalPrice = computed<number>(() => items.value.reduce((acc, item) => acc += item.amount, 0))
</script>

<template>
  <LayoutPage
    :title="TITLE"
    :description="DESCRIPTION"
    class="expense-detail-page"
  >
    <template #header>
      <ExpenseAddButton />
    </template>

    <el-card v-loading="isLoadingCategories || isLoadingExpenses">
      <template #header>
        <div class="expense-detail-page__actions">
          <el-button
            v-for="category in categories"
            :key="`category-${category.id}`"
            size="large"
            class="expense-detail-page__action"
            :class="{ 'expense-detail-page__action--selected': selectedCategory === category.id }"
            :style="{ '--category-color': category.color }"
            @click="toggleCategory(category.id)"
          >
            {{ category.name }}
          </el-button>
        </div>
        <p class="expense-detail-page__total">
          Всего: {{ totalPrice }} &#8381;
        </p>
      </template>

      <ExpenseTable
        :items="items"
        :has-category="false"
      />
    </el-card>
  </LayoutPage>
</template>

<style scoped lang="scss">
.expense-detail-page {
  &__actions {
    display: grid;

    @include tablet-desktop {
      grid-template-columns: repeat(4, 1fr);
    }

    @include mobile {
      grid-template-columns: 1fr;
      gap: 0.4rem;
    }
  }
  &__action {
    //&:not(&--selected) {
    //  --el-button-text-color: var(--category-color) !important;
    //  --el-button-border-color: var(--category-color) !important;
    //  --el-button-hover-text-color: var(--category-color) !important;
    //  --el-button-hover-border-color: var(--category-color) !important;
    //  --el-button-hover-bg-color: transparent !important;
    //}

    &--selected {
      --el-button-text-color: #ffffff !important;
      --el-button-bg-color: var(--category-color) !important;
      --el-button-border-color: var(--category-color) !important;
      --el-button-hover-text-color: #ffffff !important;
      --el-button-hover-bg-color: var(--category-color) !important;
      --el-button-hover-border-color: var(--category-color) !important;
    }

    @include tablet-desktop {
      &:not(:first-child, :last-child) {
        border-radius: 0;
      }

      &:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      &:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }

  &__total {
    margin-top: 18px;
    color: #6b7280;
    font-size: 16px;
  }
}
</style>
