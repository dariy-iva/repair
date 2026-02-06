<script setup lang="ts">
import { usePopupStore } from '@/stores/popup'

const popupStore = usePopupStore()

const visible = computed({
  get: () => popupStore.isCategoryModalVisible,
  set: (value: boolean) => {
    if (!value) {
      popupStore.toggleCategoryModal()
    }
  }
})

const handleClose = () => {
  popupStore.closeExpenseModal()
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="Добавить категорию"
    width="500px"
    align-center
    @closed="handleClose"
  >
    <CategoryForm v-if="visible" />
  </el-dialog>
</template>

<style scoped lang="scss"></style>
