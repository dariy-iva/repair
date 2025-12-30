<template>
  <el-card>
    <template #header>
      <div class="chart-header">
        <h2 class="chart-title">
          Расходы по категориям
        </h2>
        <p class="chart-subtitle">
          Всего: {{ formatedTotalAmount }} ₽
        </p>
      </div>
    </template>

    <div
      v-if="isLoading"
      class="loading-container"
    >
      <el-icon
        :size="32"
        class="is-loading"
      >
        <Loading />
      </el-icon>
    </div>

    <ClientOnly v-else-if="items.length > 0">
      <div class="chart-container">
        <canvas ref="chartCanvas" />
      </div>

      <template #fallback>
        <div class="fallback-container">
          <p class="fallback-text">
            Загрузка диаграммы...
          </p>
        </div>
      </template>
    </ClientOnly>

    <div
      v-else
      class="empty-state"
    >
      <p>Нет данных для отображения</p>
    </div>

    <div class="legend">
      <div
        v-for="item in items"
        :key="item.id"
        class="legend-item"
      >
        <div
          class="legend-color"
          :style="{ backgroundColor: item.color }"
        />
        <div class="legend-content">
          <div class="legend-label">
            <span class="legend-name">{{ item.name }}</span>
            <el-tooltip
              v-if="item.description"
              :content="item.description"
              placement="top"
            >
              <el-icon
                :size="12"
                class="legend-icon"
              >
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
          <span class="legend-amount">{{ getFormatedAmount(item.total) }} ₽</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Loading, QuestionFilled } from '@element-plus/icons-vue'
import useChart from './composables/useChart'
import type { Props } from './types'
import { getFormatedAmount, getTotalAmount } from './utils'

const props = defineProps<Props>()

const { chartCanvas } = useChart(props)

const formatedTotalAmount = computed<string>(() => getFormatedAmount(getTotalAmount(props.items)))
</script>

<style scoped lang="scss">
.chart-header {
  .chart-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }

  .chart-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }
}

.loading-container,
.fallback-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16rem;

  .fallback-text {
    color: #6b7280;
  }
}

.chart-container {
  position: relative;
  height: 16rem;
  padding: 1rem;
}

.empty-state {
  text-align: center;
  color: #6b7280;
  padding: 2rem 0;
}

.legend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .legend-color {
    width: 1rem;
    height: 1rem;
    border-radius: 9999px;
    flex-shrink: 0;
  }

  .legend-content {
    flex: 1;
    min-width: 0;
  }

  .legend-label {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    .legend-name {
      font-size: 0.875rem;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .legend-icon {
      color: #9ca3af;
      cursor: help;
    }
  }

  .legend-amount {
    font-size: 0.75rem;
    color: #6b7280;
  }
}
</style>
