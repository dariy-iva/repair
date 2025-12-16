<template>
  <UCard>
    <template #header>
      <h2 class="text-xl font-semibold">Добавить расход</h2>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">
          Категория <span class="text-red-500">*</span>
        </label>
        <USelect
          v-model="form.categoryId"
          :options="categoryOptions"
          placeholder="Выберите категорию"
          size="md"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">
          Название <span class="text-red-500">*</span>
        </label>
        <UInput
          v-model="form.name"
          placeholder="Например: Цемент 50кг"
          :maxlength="250"
          size="md"
          required
        />
        <p class="text-xs text-gray-500 mt-1">
          {{ form.name.length }}/250 символов
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">
          Сумма <span class="text-red-500">*</span>
        </label>
        <UInput
          v-model.number="form.amount"
          type="number"
          placeholder="0"
          min="1"
          max="1000000"
          size="md"
          required
          @blur="handleAmountBlur"
        >
          <template #trailing>
            <span class="text-gray-500">₽</span>
          </template>
        </UInput>
        <p v-if="formattedAmount" class="text-xs text-gray-500 mt-1">
          {{ formattedAmount }} ₽
        </p>
      </div>

      <div class="flex gap-2 pt-2">
        <UButton
          type="submit"
          :loading="loading"
          :disabled="!isFormValid"
        >
          Добавить расход
        </UButton>
        <UButton
          type="button"
          variant="soft"
          @click="handleReset"
          :disabled="loading"
        >
          Очистить
        </UButton>
      </div>
    </form>
  </UCard>
</template>

<script setup lang="ts">
import type { Category, CreateExpenseDto } from '~/types/expense'

interface Props {
  categories: Category[]
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  create: [data: CreateExpenseDto]
}>()

const form = ref({
  categoryId: '',
  name: '',
  amount: 0
})

const formattedAmount = computed(() => {
  if (!form.value.amount || form.value.amount <= 0) return ''
  return new Intl.NumberFormat('ru-RU').format(form.value.amount)
})

const categoryOptions = computed(() => {
  return props.categories.map(category => ({
    value: category.id,
    label: category.name
  }))
})

const isFormValid = computed(() => {
  return form.value.categoryId &&
    form.value.name.trim().length > 0 &&
    form.value.amount > 0 &&
    form.value.amount <= 1000000
})

const handleAmountBlur = () => {
  if (form.value.amount < 1) {
    form.value.amount = 0
  } else if (form.value.amount > 1000000) {
    form.value.amount = 1000000
  }
}

const handleSubmit = () => {
  if (!isFormValid.value) return

  emit('create', {
    categoryId: form.value.categoryId,
    name: form.value.name.trim(),
    amount: form.value.amount
  })

  handleReset()
}

const handleReset = () => {
  form.value = {
    categoryId: '',
    name: '',
    amount: 0
  }
}
</script>
