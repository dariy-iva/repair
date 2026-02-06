<template>
  <el-card v-loading="isLoading">
    <template #header>
      <h2 class="chart-subtitle">
        Всего: {{ formatedTotalAmount }} ₽
      </h2>
    </template>

    <ClientOnly v-if="hasExpenses">
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
      <p>Расходов пока нет</p>
    </div>

    <ChartLegendList :items="items" />
  </el-card>
</template>

<script setup lang="ts">
import useChart from './composables/useChart'
import type { Props } from './types'
import { getFormatedAmount, getTotalAmount } from './utils'

const props = defineProps<Props>()

const { chartCanvas } = useChart(props)

const totalAmount = computed(() => getTotalAmount(props.items))
const hasExpenses = computed(() => totalAmount.value > 0)
const formatedTotalAmount = computed<string>(() => getFormatedAmount(totalAmount.value))
</script>

<style scoped lang="scss">
.chart-subtitle {
  font-size: 1.1rem;
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
