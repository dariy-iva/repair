<template>
  <el-form
    ref="ruleFormRef"
    :rules="rules"
    :model="form"
    require-asterisk-position="right"
    label-position="top"
    class="expense-form"
    @submit.prevent="handleSubmit"
  >
    <el-form-item
      label="Категория"
      prop="category"
    >
      <el-select
        v-model="form.category"
        placeholder="Выберите категорию"
        size="large"
      >
        <el-option
          v-for="option in categoryOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="Название"
      prop="name"
    >
      <el-input
        v-model="form.name"
        placeholder="Например: Цемент 50кг"
        :maxlength="250"
        size="large"
      />
    </el-form-item>

    <el-form-item
      label="Сумма"
      prop="amount"
    >
      <el-input
        v-model="form.amount"
        type="number"
        placeholder="0"
        :min="1"
        :max="999999"
        size="large"
        @input="handleAmountInput"
      >
        <template #suffix>
          <span class="currency">₽</span>
        </template>
      </el-input>
    </el-form-item>

    <div class="expense-form__actions">
      <el-button
        type="primary"
        native-type="submit"
        :loading="loading"
        size="large"
      >
        {{ isEditMode ? 'Сохранить' : 'Добавить расход' }}
      </el-button>
      <el-button
        :disabled="loading"
        size="large"
        @click="emit('cancel')"
      >
        Отмена
      </el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import type { Expense, CreateExpenseDto } from '~/types/expense'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  categories: Expense.Category[]
  loading?: boolean
  expense?: {
    id: string
    category: string
    name: string
    amount: number
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  create: [data: CreateExpenseDto]
  update: [id: string, data: { categoryId?: string, name?: string, amount?: number }]
  cancel: []
}>()

const isEditMode = computed(() => !!props.expense)

const ruleFormRef = ref<FormInstance>()

interface State {
  category: string
  name: string
  amount: number
}

const form = reactive<State>({
  category: props.expense?.category || '',
  name: props.expense?.name || '',
  amount: props.expense?.amount || 0
})

const rules = reactive<FormRules<State>>({
  category: [
    { required: true, trigger: 'blur' }

  ],
  name: [
    {
      required: true,
      trigger: 'blur'
    },
    { min: 5, max: 250, trigger: 'blur' }
  ],
  amount: [
    {
      required: true,
      trigger: 'blur'
    }
  ]
})

const categoryOptions = computed(() => {
  return props.categories.map(category => ({
    value: category.id,
    label: category.name
  }))
})

const handleAmountInput = (value: string): void => {
  const numberValue = +value
  if (numberValue < 1) {
    form.amount = 0
  } else if (numberValue > 999999) {
    form.amount = 999999
  } else {
    form.amount = numberValue
  }
}

const checkValid = async (): Promise<boolean> => {
  if (!ruleFormRef.value) {
    return false
  }

  let isValid: boolean = false

  await ruleFormRef.value.validate((valid) => {
    isValid = valid
  })

  return isValid
}

const handleSubmit = async (): Promise<void> => {
  const isValid = await checkValid()

  if (!isValid) {
    return
  }

  if (isEditMode.value && props.expense) {
    emit('update', props.expense.id, {
      categoryId: form.category,
      name: form.name.trim(),
      amount: form.amount
    })
  } else {
    emit('create', {
      category: form.category,
      name: form.name.trim(),
      amount: form.amount
    })
  }
}
</script>

<style scoped lang="scss">
.expense-form {
  display: flex;
  flex-direction: column;

  .currency {
    color: #6b7280;
  }

  &__actions {
    display: grid;
    padding-top: 0.5rem;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
}
</style>
