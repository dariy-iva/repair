<script setup lang="ts">
import type { Props } from './types'
import { Plus } from '@element-plus/icons-vue'
import { usePopupStore } from '@/stores/popup'

const props = defineProps<Props>()

const { toggleCategoryModal } = usePopupStore()
</script>

<template>
  <UiSection
    title="Расходы по категориям"
    class="chart-section"
  >
    <template #header>
      <el-button
        type="primary"
        class="chart-section__button"
        @click="toggleCategoryModal(true)"
      >
        <el-icon class="chart-section__button-icon">
          <Plus />
        </el-icon>
        Добавить категорию
      </el-button>
    </template>
    <Chart v-bind="props" />
  </UiSection>
</template>

<style scoped lang="scss">
.chart-section {
  &__button {
    min-width: 15rem;
    margin-left: auto;
  }

  &__button-icon {
    margin-right: 0.8rem;
  }
}
</style>
