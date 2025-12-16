<template>
  <el-card>
    <template #header>
      <div class="table-header">
        <h2 class="table-title">Детализация расходов</h2>
        <el-button
          v-if="!showCategoryForm"
          type="primary"
          size="small"
          @click="showCategoryForm = true"
        >
          <el-icon class="button-icon"><Plus /></el-icon>
          Добавить категорию
        </el-button>
      </div>

      <el-card v-if="showCategoryForm" class="category-form-card" shadow="never">
        <form @submit.prevent="handleCreateCategory">
          <div class="form-content">
            <el-input
              v-model="newCategory.name"
              placeholder="Название категории"
              :maxlength="50"
              required
            />
            <div class="form-row">
              <el-color-picker
                v-model="newCategory.color"
                class="color-picker"
              />
              <el-input
                v-model="newCategory.description"
                placeholder="Описание (опционально)"
                :maxlength="100"
                class="description-input"
              />
            </div>
            <div class="form-actions">
              <el-button type="primary" native-type="submit" :loading="loading">
                Сохранить
              </el-button>
              <el-button @click="handleCancelCategory">
                Отмена
              </el-button>
            </div>
          </div>
        </form>
      </el-card>
    </template>

    <div v-if="!expenses.length">
      <div v-if="loading" class="table-container">
        <table class="expenses-table">
          <thead>
            <tr class="table-header-row">
              <th class="table-th">Категория</th>
              <th class="table-th">Название</th>
              <th class="table-th">Сумма</th>
              <th class="table-th table-th-actions">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="i in 4"
              :key="i"
              class="table-row"
            >
              <td class="table-td">
                <div class="skeleton-cell">
                  <el-skeleton :rows="0" class="skeleton-dot" animated />
                  <el-skeleton :rows="0" class="skeleton-text" animated />
                </div>
              </td>
              <td class="table-td">
                <el-skeleton :rows="0" class="skeleton-text-lg" animated />
              </td>
              <td class="table-td">
                <el-skeleton :rows="0" class="skeleton-text-md" animated />
              </td>
              <td class="table-td">
                <div class="skeleton-actions">
                  <el-skeleton :rows="0" class="skeleton-button" animated />
                  <el-skeleton :rows="0" class="skeleton-button" animated />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <p>Пока нет расходов</p>
      </div>
    </div>

    <div v-else class="table-container">
      <table class="expenses-table">
        <thead>
          <tr class="table-header-row">
            <th class="table-th">Категория</th>
            <th class="table-th">Название</th>
            <th class="table-th">Сумма</th>
            <th class="table-th table-th-actions">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="expense in expenses"
            :key="expense.id"
            class="table-row hover-row"
          >
            <td class="table-td">
              <div class="category-cell">
                <div
                  class="category-color"
                  :style="{ backgroundColor: expense.category.color }"
                />
                <span class="category-name">{{ expense.category.name }}</span>
              </div>
            </td>
            <td class="table-td">
              <span class="expense-name">{{ expense.name }}</span>
            </td>
            <td class="table-td">
              <span class="expense-amount">{{ formatAmount(expense.amount) }} ₽</span>
            </td>
            <td class="table-td">
              <div class="actions-cell">
                <el-button
                  size="small"
                  :icon="Edit"
                  @click="handleEdit(expense)"
                  circle
                />
                <el-popconfirm
                  title="Вы уверены, что хотите удалить этот расход?"
                  confirm-button-text="Удалить"
                  cancel-button-text="Отмена"
                  confirm-button-type="danger"
                  @confirm="handleDelete(expense.id)"
                >
                  <template #reference>
                    <el-button
                      size="small"
                      type="danger"
                      :icon="Delete"
                      :loading="loading"
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
  </el-card>
</template>

<style scoped lang="scss">
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .table-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }

  .button-icon {
    margin-right: 8px;
  }
}

.category-form-card {
  margin-top: 1rem;

  .form-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .form-row {
    display: flex;
    gap: 0.5rem;

    .color-picker {
      width: 5rem;
    }

    .description-input {
      flex: 1;
    }
  }

  .form-actions {
    display: flex;
    gap: 0.5rem;
  }
}

.table-container {
  overflow-x: auto;
}

.expenses-table {
  width: 100%;

  .table-header-row {
    border-bottom: 1px solid #e5e7eb;
  }

  .table-th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 600;

    &.table-th-actions {
      text-align: right;
    }
  }

  .table-row {
    border-bottom: 1px solid #f3f4f6;

    &.hover-row:hover {
      background-color: #f9fafb;
    }
  }

  .table-td {
    padding: 0.75rem 1rem;
  }
}

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

.skeleton-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .skeleton-dot {
    width: 0.75rem;
    height: 0.75rem;
  }

  .skeleton-text {
    width: 5rem;
    height: 1rem;
  }
}

.skeleton-text-lg {
  width: 8rem;
  height: 1rem;
}

.skeleton-text-md {
  width: 6rem;
  height: 1rem;
}

.skeleton-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;

  .skeleton-button {
    width: 2rem;
    height: 2rem;
  }
}

.empty-state {
  text-align: center;
  color: #6b7280;
  padding: 2rem 0;
}
</style>

<script setup lang="ts">
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { ExpenseWithCategory } from '~/types/expense'

interface Props {
  expenses: ExpenseWithCategory[]
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [expense: ExpenseWithCategory]
  delete: [id: string]
  createCategory: [data: { name: string; color: string; description?: string }]
}>()

const showCategoryForm = ref(false)
const newCategory = ref({
  name: '',
  color: '#3b82f6',
  description: ''
})

const handleEdit = (expense: ExpenseWithCategory) => {
  emit('edit', expense)
}

const handleDelete = (id: string) => {
  emit('delete', id)
}

const handleCreateCategory = () => {
  if (!newCategory.value.name.trim()) {
    return
  }

  emit('createCategory', {
    name: newCategory.value.name,
    color: newCategory.value.color,
    description: newCategory.value.description || undefined
  })

  handleCancelCategory()
}

const handleCancelCategory = () => {
  showCategoryForm.value = false
  newCategory.value = {
    name: '',
    color: '#3b82f6',
    description: ''
  }
}

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU').format(amount)
}
</script>
