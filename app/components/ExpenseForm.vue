<script setup lang="ts">
import type { Expense } from '@/types/expense'
import type { FormInstance, FormRules } from 'element-plus'
import { ElNotification } from 'element-plus'
import { useExpensesStore } from '@/stores/expenses'

interface Props {
  categories: Expense.Category[]
  expense?: Expense.Model
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'submit'): void
}>()

const isEditMode = computed(() => !!props.expense)

const ruleFormRef = ref<FormInstance>()

const form = reactive<Expense.ModelNew>({
  categoryId: props.expense?.categoryId || '',
  name: props.expense?.name || '',
  amount: props.expense?.amount || 0,
  date: props.expense?.date || ''
})
const isSending = ref<boolean>(false)

const rules = reactive<FormRules<Expense.ModelNew>>({
  categoryId: [
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
  ],
  date: [
    {
      required: true,
      message: 'Выберите дату',
      trigger: 'change'
    }
  ]
})

const categoryOptions = computed(() => {
  return props.categories.map(category => ({
    value: category.id,
    label: category.name
  }))
})

const disableFutureDate = (date: Date): boolean => {
  return date.getTime() > Date.now()
}

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

const { createExpense, updateExpense } = useExpensesStore()

const handleSubmit = async (): Promise<void> => {
  const isValid = await checkValid()

  if (!isValid) {
    return
  }

  isSending.value = true

  const data = {
    categoryId: form.categoryId,
    name: form.name.trim(),
    amount: form.amount,
    date: form.date
  }
  const isEditing = isEditMode.value && props.expense

  try {
    if (isEditing) {
      await updateExpense(props.expense.id, { ...data, id: props.expense.id })
    } else {
      await createExpense(data)
    }
    ElNotification({
      message: `Расход сохранен`,
      type: 'success',
      position: 'bottom-right'
    })
    emit('submit')
  } catch (e) {
    ElNotification({
      message: `При сохранении расхода произошла ошибка`,
      type: 'error',
      position: 'bottom-right'
    })
  } finally {
    isSending.value = false
  }
}
</script>

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
      prop="categoryId"
    >
      <el-select
        v-model="form.categoryId"
        placeholder="Выберите категорию"
        size="large"
        :disabled="isSending"
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
        :disabled="isSending"
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
        :disabled="isSending"
        @input="handleAmountInput"
      >
        <template #suffix>
          <span class="currency">₽</span>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item
      label="Дата"
      prop="date"
    >
      <el-date-picker
        v-model="form.date"
        type="date"
        placeholder="Выберите дату"
        format="DD.MM.YYYY"
        value-format="YYYY-MM-DD"
        size="large"
        :disabled="isSending"
        :disabled-date="disableFutureDate"
      />
    </el-form-item>

    <el-button
      type="primary"
      native-type="submit"
      :loading="isSending"
      size="large"
    >
      {{ isEditMode ? 'Сохранить' : 'Добавить расход' }}
    </el-button>
  </el-form>
</template>

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
