<script setup lang="ts">
import { Edit, Delete } from '@element-plus/icons-vue'
import type { Expense } from '@/types/expense'
import { TABLE_COLUMNS } from './constants'
import { usePopupStore } from '@/stores/popup'
import { useExpensesStore } from '@/stores/expenses'
import { ElNotification } from 'element-plus'

interface Props {
  items: Expense.ModelWithCategory[]
}

defineProps<Props>()

const deletableItems = ref<string[]>([])

const { deleteExpense } = useExpensesStore()
const popupStore = usePopupStore()

const handleEdit = (expense: Expense.ModelWithCategory) => {
  popupStore.openExpenseModal({
    id: expense.id,
    categoryId: expense.category.id,
    name: expense.name,
    amount: expense.amount,
    date: expense.date
  })
}

const handleDelete = async (id: string) => {
  deletableItems.value.push(id)

  try {
    await deleteExpense(id)
    ElNotification({
      message: 'Расход удалён',
      type: 'success',
      position: 'bottom-right'
    })
  } catch (e) {
    console.error('Failed to delete expense:', e)
    ElNotification({
      message: 'При удалении расхода произошла ошибка',
      type: 'error',
      position: 'bottom-right'
    })
  } finally {
    deletableItems.value = deletableItems.value.filter(item => item !== id)
  }
}

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU').format(amount)
}
</script>

<template>
  <div
    class="expenses-table-container"
  >
    <table class="expenses-table">
      <thead>
        <tr class="expenses-table__row--header">
          <th
            v-for="column in TABLE_COLUMNS"
            :key="`expense-column-${column}`"
            class="expenses-table__cell expenses-table__cell--header"
            v-text="column"
          />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="expense in items"
          :key="expense.id"
          class="expenses-table__row"
        >
          <td class="expenses-table__cell">
            <div class="category-cell">
              <div
                class="category-color"
                :style="{ backgroundColor: expense.category.color }"
              />
              <span class="category-name">{{ expense.category.name }}</span>
            </div>
          </td>
          <td class="expenses-table__cell">
            <span class="expense-name">{{ expense.name }}</span>
          </td>
          <td class="expenses-table__cell">
            <span class="expense-amount">{{ formatAmount(expense.amount) }} ₽</span>
          </td>
          <td class="expenses-table__cell">
            <div class="actions-cell">
              <el-button
                size="small"
                :icon="Edit"
                circle
                :disabled="deletableItems.includes(expense.id)"
                @click="handleEdit(expense)"
              />
              <el-popconfirm
                title="Вы уверены, что хотите удалить этот расход?"
                confirm-button-text="Удалить"
                cancel-button-text="Отмена"
                confirm-button-type="danger"
                hide-icon
                width="250"
                @confirm="handleDelete(expense.id)"
              >
                <template #reference>
                  <el-button
                    size="small"
                    type="danger"
                    :icon="Delete"
                    :loading="deletableItems.includes(expense.id)"
                    circle
                  />
                </template>
              </el-popconfirm>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
@import url('./styles/index.scss');

.category-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .category-color {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 9999px;
    flex-shrink: 0;
  }

  .category-name {
    font-size: 0.875rem;
  }
}

.expense-name,
.expense-amount {
  font-size: 0.875rem;
}

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
}
</style>
