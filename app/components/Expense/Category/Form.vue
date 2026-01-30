<script setup lang="ts">
const emit = defineEmits<{
  (event: 'on-cancel'): void
}>()

const DEFAULT_CATEGORY = {
  name: '',
  color: '#3b82f6',
  description: ''
}

const newCategory = ref({ ...DEFAULT_CATEGORY })

const { createCategory } = useExpenses()

const handleCreateCategory = async () => {
  if (!newCategory.value.name.trim()) {
    return
  }

  try {
    await createCategory({
      name: newCategory.value.name,
      color: newCategory.value.color,
      description: newCategory.value.description || undefined
    })
  } catch (e) {
    console.error('Failed to create category:', e)
  }
}

const handleCancelCategory = () => {
  newCategory.value = { ...DEFAULT_CATEGORY }
  emit('on-cancel')
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
          <el-button
            type="primary"
            native-type="submit"
            :loading="loading"
          >
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
