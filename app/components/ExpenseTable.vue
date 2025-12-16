<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Детализация расходов</h2>
        <UButton
          v-if="!showCategoryForm"
          icon="i-lucide-plus"
          size="sm"
          variant="soft"
          @click="showCategoryForm = true"
        >
          Добавить категорию
        </UButton>
      </div>

      <UCard v-if="showCategoryForm" class="mt-4">
        <form @submit.prevent="handleCreateCategory">
          <div class="space-y-3">
            <UInput
              v-model="newCategory.name"
              placeholder="Название категории"
              :maxlength="50"
              required
            />
            <div class="flex gap-2">
              <UInput
                v-model="newCategory.color"
                type="color"
                class="w-20"
                required
              />
              <UInput
                v-model="newCategory.description"
                placeholder="Описание (опционально)"
                :maxlength="100"
                class="flex-1"
              />
            </div>
            <div class="flex gap-2">
              <UButton type="submit" :loading="loading">
                Сохранить
              </UButton>
              <UButton variant="soft" @click="handleCancelCategory">
                Отмена
              </UButton>
            </div>
          </div>
        </form>
      </UCard>
    </template>

    <div v-if="!expenses.length">
      <div v-if="loading" class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-800">
              <th class="text-left py-3 px-4 text-sm font-semibold">Категория</th>
              <th class="text-left py-3 px-4 text-sm font-semibold">Название</th>
              <th class="text-left py-3 px-4 text-sm font-semibold">Сумма</th>
              <th class="text-right py-3 px-4 text-sm font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="i in 4"
              :key="i"
              class="border-b border-gray-100 dark:border-gray-900"
            >
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <USkeleton class="w-3 h-3 rounded-full" />
                  <USkeleton class="h-4 w-20" />
                </div>
              </td>
              <td class="py-3 px-4">
                <USkeleton class="h-4 w-32" />
              </td>
              <td class="py-3 px-4">
                <USkeleton class="h-4 w-24" />
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center justify-end gap-1">
                  <USkeleton class="w-8 h-8 rounded" />
                  <USkeleton class="w-8 h-8 rounded" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="text-center text-gray-500 py-8">
        <p>Пока нет расходов</p>
      </div>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-800">
            <th class="text-left py-3 px-4 text-sm font-semibold">Категория</th>
            <th class="text-left py-3 px-4 text-sm font-semibold">Название</th>
            <th class="text-left py-3 px-4 text-sm font-semibold">Сумма</th>
            <th class="text-right py-3 px-4 text-sm font-semibold">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="expense in expenses"
            :key="expense.id"
            class="border-b border-gray-100 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900/50"
          >
            <td class="py-3 px-4">
              <div class="flex items-center gap-2">
                <div
                  class="w-3 h-3 rounded-full flex-shrink-0"
                  :style="{ backgroundColor: expense.category.color }"
                />
                <span class="text-sm">{{ expense.category.name }}</span>
              </div>
            </td>
            <td class="py-3 px-4">
              <div v-if="editingId === expense.id">
                <UInput
                  v-model="editForm.name"
                  :maxlength="250"
                  size="sm"
                />
              </div>
              <span v-else class="text-sm">{{ expense.name }}</span>
            </td>
            <td class="py-3 px-4">
              <div v-if="editingId === expense.id">
                <UInput
                  v-model.number="editForm.amount"
                  type="number"
                  size="sm"
                  placeholder="0"
                  min="1"
                  max="1000000"
                >
                  <template #trailing>
                    <span class="text-gray-500 text-sm">₽</span>
                  </template>
                </UInput>
              </div>
              <span v-else class="text-sm">{{ formatAmount(expense.amount) }} ₽</span>
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center justify-end gap-1">
                <template v-if="editingId === expense.id">
                  <UButton
                    icon="i-lucide-check"
                    size="xs"
                    variant="soft"
                    color="green"
                    @click="handleSaveEdit(expense.id)"
                    :loading="loading"
                  />
                  <UButton
                    icon="i-lucide-x"
                    size="xs"
                    variant="soft"
                    @click="handleCancelEdit"
                  />
                </template>
                <template v-else>
                  <UButton
                    icon="i-lucide-pencil"
                    size="xs"
                    variant="ghost"
                    @click="handleStartEdit(expense)"
                  />
                  <UButton
                    icon="i-lucide-trash-2"
                    size="xs"
                    variant="ghost"
                    color="red"
                    @click="handleDelete(expense.id)"
                    :loading="loading"
                  />
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { ExpenseWithCategory } from '~/types/expense'

interface Props {
  expenses: ExpenseWithCategory[]
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [id: string, data: { name?: string; amount?: number }]
  delete: [id: string]
  createCategory: [data: { name: string; color: string; description?: string }]
}>()

const editingId = ref<string | null>(null)
const editForm = ref({
  name: '',
  amount: 0
})

const showCategoryForm = ref(false)
const newCategory = ref({
  name: '',
  color: '#3b82f6',
  description: ''
})

const handleStartEdit = (expense: ExpenseWithCategory) => {
  editingId.value = expense.id
  editForm.value = {
    name: expense.name,
    amount: expense.amount
  }
}

const handleSaveEdit = async (id: string) => {
  if (!editForm.value.name.trim()) {
    return
  }

  if (editForm.value.amount <= 0 || editForm.value.amount > 1000000) {
    return
  }

  emit('update', id, {
    name: editForm.value.name,
    amount: editForm.value.amount
  })

  editingId.value = null
}

const handleCancelEdit = () => {
  editingId.value = null
  editForm.value = {
    name: '',
    amount: 0
  }
}

const handleDelete = (id: string) => {
  if (confirm('Вы уверены, что хотите удалить этот расход?')) {
    emit('delete', id)
  }
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
