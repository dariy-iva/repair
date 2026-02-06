<script setup lang="ts">
import { Edit, Delete } from '@element-plus/icons-vue'
import type { Expense } from '@/types/expense'
import { TABLE_COLUMNS } from './constants'
import { usePopupStore } from '@/stores/popup'
import { useExpensesStore } from '@/stores/expenses'
import { ElNotification } from 'element-plus'

interface Props {
  items: Expense.ModelWithCategory[]
  isLoading?: boolean
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
</script>

<template>
  <el-table
    v-loading="isLoading"
    :data="items"
    :default-sort="{ prop: 'date', order: 'descending' }"
  >
    <el-table-column
      v-for="field in TABLE_COLUMNS"
      :key="`table-column-${field.name}`"
      :label="field.label"
      :prop="field.name"
      :formatter="field.formatter"
      :min-width="field.minWidth"
      :fixed="field.fixed"
      :sortable="field.sortable"
      empty-text="Пока нет расходов"
    >
      <template #default="{ row }">
        <div
          v-if="field.name === 'category'"
          class="category-cell"
        >
          <div
            class="category-color"
            :style="{ backgroundColor: row.category.color }"
          />
          <span class="category-name">{{ row.category.name }}</span>
        </div>
        <div
          v-else-if="field.name === 'actions'"
          class="actions-cell"
        >
          <el-button
            size="default"
            :icon="Edit"
            circle
            :disabled="deletableItems.includes(row.id)"
            @click="handleEdit(row)"
          />
          <el-popconfirm
            title="Вы уверены, что хотите удалить этот расход?"
            confirm-button-text="Удалить"
            cancel-button-text="Отмена"
            confirm-button-type="danger"
            hide-icon
            width="250"
            @confirm="handleDelete(row.id)"
          >
            <template #reference>
              <el-button
                size="default"
                type="danger"
                :icon="Delete"
                :loading="deletableItems.includes(row.id)"
                circle
              />
            </template>
          </el-popconfirm>
        </div>
        <span
          v-else
          v-text="field?.formatter?.(row) || row[field.name]"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
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
}

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
