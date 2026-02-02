<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import type { Props as IProps } from './types'
import { getFormatedAmount } from './utils'

type Props = Pick<IProps, 'items'>

const props = defineProps<Props>()

const sortedItems = computed<Props['items']>(() => props.items.toSorted((itemA, itemB) => itemB.total - itemA.total))
</script>

<template>
  <ul class="legend-list">
    <li
      v-for="item in sortedItems"
      :key="item.id"
      class="legend-item"
    >
      <div
        class="legend-item__color"
        :style="{ backgroundColor: item.color }"
      />

      <div class="legend-item__content">
        <div class="legend-item__label">
          <span class="legend-item__name">{{ item.name }}</span>
          <el-tooltip
            v-if="item.description"
            :content="item.description"
            placement="top"
          >
            <el-icon
              :size="12"
              class="legend-item__icon"
            >
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </div>

        <span class="legend-item__amount">{{ getFormatedAmount(item.total) }} ₽</span>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.legend-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &__color {
    width: 1rem;
    height: 1rem;
    border-radius: 9999px;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__name {
    font-size: 0.875rem;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__icon {
    color: #9ca3af;
    cursor: help;
  }

  &__amount {
    font-size: 0.75rem;
    color: #6b7280;
  }
}
</style>
