<script setup lang="ts">
import type { Props } from './types'
import { Plus } from '@element-plus/icons-vue'
import { usePopupStore } from '@/stores/popup'

const props = defineProps<Props>()

const { toggleCategoryModal } = usePopupStore()
const { loggedIn } = useUserSession()
</script>

<template>
  <UiSection
    title="Расходы по категориям"
    collapsible
    collapsed
    class="chart-section"
  >
    <div class="chart-section__content">
      <el-button
        v-if="loggedIn"
        type="primary"
        size="large"
        class="chart-section__button"
        @click="toggleCategoryModal(true)"
      >
        <el-icon class="chart-section__button-icon">
          <Plus />
        </el-icon>
        Добавить категорию
      </el-button>
      <Chart v-bind="props" />
    </div>
  </UiSection>
</template>

<style scoped lang="scss">
.chart-section {
  &__content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__button {
    align-self: flex-end;
    min-width: 15rem;

    @include mobile {
      width: 100%;
    }
  }

  &__button-icon {
    margin-right: 0.8rem;
  }
}
</style>
