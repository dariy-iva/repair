<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { usePopupStore } from '@/stores/popup'

const popupStore = usePopupStore()

const handleAddExpense = (): void => {
  popupStore.openExpenseModal()
}
</script>

<template>
  <el-button
    type="primary"
    size="large"
    class="expense-add-button"
    @click="handleAddExpense"
  >
    <el-icon class="button-icon">
      <Plus />
    </el-icon>
    Добавить расход
  </el-button>
</template>

<style scoped lang="scss">
.expense-add-button {
  min-width: 15rem;

  @include mobile {
    width: 100%;
  }

  .button-icon {
    margin-right: 8px;
  }
}
</style>
