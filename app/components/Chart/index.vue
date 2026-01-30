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

    <ChartLegendList :items="items" />
  </el-card>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'
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
</style>
