<script setup lang="ts">
import { useExpensesStore } from '@/stores/expenses'
import type { FormInstance, FormRules } from 'element-plus'
import type { CreateCategoryDto } from '@/types'

const emit = defineEmits<{
  (event: 'on-cancel'): void
}>()

const DEFAULT_CATEGORY: CreateCategoryDto = {
  name: '',
  color: '#3b82f6',
  description: ''
}

const formRef = ref<FormInstance>()
const form = ref<CreateCategoryDto>({ ...DEFAULT_CATEGORY })
const isSending = ref(false)

const expensesStore = useExpensesStore()

const rules = reactive<FormRules<CreateCategoryDto>>({
  name: [
    { required: true, trigger: 'change', message: 'Укажите название' }
  ],
  color: [
    {
      required: true,
      trigger: 'change',
      message: 'Выберите цвет'
    }
  ]
})

const handleCancelCategory = () => {
  form.value = { ...DEFAULT_CATEGORY }
  emit('on-cancel')
}

const checkValid = async (): Promise<boolean> => {
  if (!formRef.value) {
    return false
  }

  let isValid: boolean = false

  await formRef.value.validate((valid) => {
    isValid = valid
  })

  return isValid
}

const handleCreateCategory = async () => {
  const isValid = await checkValid()

  if (!isValid) {
    return
  }

  isSending.value = true
  try {
    await expensesStore.createCategory(form.value)
    handleCancelCategory()
  } catch (e) {
    console.error('Failed to create category:', e)
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <el-form
    ref="formRef"
    :rules="rules"
    :model="form"
    require-asterisk-position="right"
    label-position="top"
    class="category-form"
    @submit.prevent="handleCreateCategory"
  >
    <el-form-item
      label="Название категории"
      prop="name"
    >
      <el-input
        v-model="form.name"
        placeholder="Название категории"
        :maxlength="50"
        :disabled="isSending"
        size="large"
      />
    </el-form-item>
    <div class="category-form__row">
      <el-color-picker
        v-model="form.color"
        class="category-form__color-picker"
        :disabled="isSending"
        size="large"
      />
      <el-input
        v-model="form.description"
        placeholder="Описание (опционально)"
        :maxlength="100"
        :disabled="isSending"
        size="large"
        class="category-form__description"
      />
    </div>

    <el-button
      type="primary"
      size="large"
      native-type="submit"
      :loading="isSending"
    >
      Сохранить
    </el-button>
  </el-form>
</template>

<style scoped lang="scss">
.category-form {
    display: flex;
    flex-direction: column;

  &__row {
    display: flex;
    margin-bottom: 2rem;
    gap: 0.5rem;
  }

  &__color-picker {
    width: 5rem;
  }

  &__description {
    flex: 1;
  }
}
</style>
