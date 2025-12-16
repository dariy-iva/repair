<template>
  <el-card>
    <template #header>
      <div class="chart-header">
        <h2 class="chart-title">Расходы по категориям</h2>
        <p class="chart-subtitle">Всего: {{ formatAmount(totalAmount) }} ₽</p>
      </div>
    </template>

    <div v-if="loading" class="loading-container">
      <el-icon :size="32" class="is-loading">
        <Loading />
      </el-icon>
    </div>

    <ClientOnly v-else-if="expensesByCategory.length > 0">
      <div class="chart-container">
        <canvas ref="chartCanvas" />
      </div>

      <template #fallback>
        <div class="fallback-container">
          <p class="fallback-text">Загрузка диаграммы...</p>
        </div>
      </template>
    </ClientOnly>

    <div v-else class="empty-state">
      <p>Нет данных для отображения</p>
    </div>

    <div class="legend">
      <div
        v-for="item in expensesByCategory"
        :key="item.category.id"
        class="legend-item"
      >
        <div
          class="legend-color"
          :style="{ backgroundColor: item.category.color }"
        />
        <div class="legend-content">
          <div class="legend-label">
            <span class="legend-name">{{ item.category.name }}</span>
            <el-tooltip v-if="item.category.description" :content="item.category.description" placement="top">
              <el-icon :size="12" class="legend-icon">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
          <span class="legend-amount">{{ formatAmount(item.total) }} ₽</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Loading, QuestionFilled } from '@element-plus/icons-vue'

interface Props {
  expensesByCategory: Array<{
    category: { id: string; name: string; color: string; description?: string }
    total: number
    count: number
  }>
  totalAmount: number
  loading?: boolean
}

const props = defineProps<Props>()
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: any = null

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU').format(amount)
}

const initChart = async () => {
  if (!chartCanvas.value || !props.expensesByCategory.length) return

  try {
    const { Chart, ArcElement, Tooltip, Legend, DoughnutController } = await import('chart.js')
    Chart.register(ArcElement, Tooltip, Legend, DoughnutController)

    if (chartInstance) {
      chartInstance.destroy()
    }

    chartInstance = new Chart(chartCanvas.value, {
      type: 'doughnut',
      data: {
        labels: props.expensesByCategory.map(item => item.category.name),
        datasets: [
          {
            data: props.expensesByCategory.map(item => item.total),
            backgroundColor: props.expensesByCategory.map(item => item.category.color),
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label || ''
                const value = context.parsed || 0
                const percentage = ((value / props.totalAmount) * 100).toFixed(1)
                return `${label}: ${formatAmount(value)} ₽ (${percentage}%)`
              }
            }
          }
        }
      }
    })
  } catch (error) {
    console.error('Failed to initialize chart:', error)
  }
}

// Инициализация при появлении данных
watch(() => props.expensesByCategory, async (newData) => {
  if (!import.meta.client || !newData.length) return

  // Если диаграмма уже создана, просто обновляем данные
  if (chartInstance) {
    chartInstance.data.labels = newData.map(item => item.category.name)
    chartInstance.data.datasets[0].data = newData.map(item => item.total)
    chartInstance.data.datasets[0].backgroundColor = newData.map(item => item.category.color)
    chartInstance.update()
    return
  }

  // Создаем диаграмму при первой загрузке данных
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 150))
  await initChart()
}, { deep: true, immediate: true })

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
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
