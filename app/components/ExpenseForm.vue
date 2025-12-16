<template>
  <form @submit.prevent="handleSubmit" class="expense-form">
    <div class="form-field">
      <label class="form-label">
        Категория <span class="required">*</span>
      </label>
      <el-select
        v-model="form.categoryId"
        placeholder="Выберите категорию"
        class="full-width"
        required
      >
        <el-option
          v-for="option in categoryOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </div>

    <div class="form-field">
      <label class="form-label">
        Название <span class="required">*</span>
      </label>
      <el-input
        v-model="form.name"
        placeholder="Например: Цемент 50кг"
        :maxlength="250"
        required
      />
      <p class="form-hint">
        {{ form.name.length }}/250 символов
      </p>
    </div>

    <div class="form-field">
      <label class="form-label">
        Сумма <span class="required">*</span>
      </label>
      <el-input
        v-model.number="form.amount"
        type="number"
        placeholder="0"
        :min="1"
        :max="1000000"
        required
        @blur="handleAmountBlur"
      >
        <template #suffix>
          <span class="currency">₽</span>
        </template>
      </el-input>
      <p v-if="formattedAmount" class="form-hint">
        {{ formattedAmount }} ₽
      </p>
    </div>

    <div class="form-actions">
      <el-button
        type="primary"
        native-type="submit"
        :loading="loading"
        :disabled="!isFormValid"
      >
        {{ isEditMode ? 'Сохранить' : 'Добавить расход' }}
      </el-button>
      <el-button
        @click="emit('cancel')"
        :disabled="loading"
      >
        Отмена
      </el-button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Category, CreateExpenseDto } from '~/types/expense'

interface Props {
  categories: Category[]
  loading?: boolean
  expense?: {
    id: string
    categoryId: string
    name: string
    amount: number
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  create: [data: CreateExpenseDto]
  update: [id: string, data: { categoryId?: string; name?: string; amount?: number }]
  cancel: []
}>()

const isEditMode = computed(() => !!props.expense)

const form = ref({
  categoryId: props.expense?.categoryId || '',
  name: props.expense?.name || '',
  amount: props.expense?.amount || 0
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

  if (isEditMode.value && props.expense) {
    emit('update', props.expense.id, {
      categoryId: form.value.categoryId,
      name: form.value.name.trim(),
      amount: form.value.amount
    })
  } else {
    emit('create', {
      categoryId: form.value.categoryId,
      name: form.value.name.trim(),
      amount: form.value.amount
    })
  }

  handleReset()
}

const handleReset = () => {
  form.value = {
    categoryId: props.expense?.categoryId || '',
    name: props.expense?.name || '',
    amount: props.expense?.amount || 0
  }
}

// Update form when expense prop changes
watch(() => props.expense, (newExpense) => {
  if (newExpense) {
    form.value = {
      categoryId: newExpense.categoryId,
      name: newExpense.name,
      amount: newExpense.amount
    }
  } else {
    form.value = {
      categoryId: '',
      name: '',
      amount: 0
    }
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.expense-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .form-field {
    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;

      .required {
        color: #ef4444;
      }
    }

    .full-width {
      width: 100%;
    }

    .form-hint {
      font-size: 0.75rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .currency {
      color: #6b7280;
    }
  }

  .form-actions {
    display: flex;
    gap: 0.5rem;
    padding-top: 0.5rem;
  }
}
</style>
