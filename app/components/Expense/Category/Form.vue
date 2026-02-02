<script setup lang="ts">
import { useExpensesStore } from '@/stores/expenses'

const emit = defineEmits<{
  (event: 'on-cancel'): void
}>()

const DEFAULT_CATEGORY = {
  name: '',
  color: '#3b82f6',
  description: ''
}

const newCategory = ref({ ...DEFAULT_CATEGORY })
const isSending = ref(false)

const expensesStore = useExpensesStore()

const handleCancelCategory = () => {
  newCategory.value = { ...DEFAULT_CATEGORY }
  emit('on-cancel')
}

const handleCreateCategory = async () => {
  if (!newCategory.value.name.trim()) {
    return
  }

  isSending.value = true
  try {
    await expensesStore.createCategory(newCategory.value)
    handleCancelCategory()
  } catch (e) {
    console.error('Failed to create category:', e)
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <el-card
    class="category-form-card"
    shadow="never"
  >
    <form @submit.prevent="handleCreateCategory">
      <div class="form-content">
        <el-input
          v-model="newCategory.name"
          placeholder="Название категории"
          :maxlength="50"
          :disabled="isSending"
          required
        />
        <div class="form-row">
          <el-color-picker
            v-model="newCategory.color"
            class="color-picker"
            :disabled="isSending"
          />
          <el-input
            v-model="newCategory.description"
            placeholder="Описание (опционально)"
            :maxlength="100"
            :disabled="isSending"
            class="description-input"
          />
        </div>
        <div class="form-actions">
          <el-button
            type="primary"
            native-type="submit"
            :loading="isSending"
          >
            Сохранить
          </el-button>
          <el-button
            :disabled="isSending"
            @click="handleCancelCategory"
          >
            Отмена
          </el-button>
        </div>
      </div>
    </form>
  </el-card>
</template>

<style scoped lang="scss">
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
</style>
