<template>
  <UCard>
    <template #header>
      <h2 class="text-xl font-semibold">Расходы по категориям</h2>
      <p class="text-sm text-gray-500 mt-1">Всего: {{ formatAmount(totalAmount) }} ₽</p>
    </template>

    <div v-if="loading" class="flex items-center justify-center h-64">
      <UIcon name="i-lucide-loader-circle" class="animate-spin h-8 w-8 text-primary" />
    </div>

    <ClientOnly v-else-if="expensesByCategory.length > 0">
      <div class="relative h-64 md:h-80 p-4">
        <canvas ref="chartCanvas" />
      </div>

      <template #fallback>
        <div class="flex items-center justify-center h-64">
          <p class="text-gray-500">Загрузка диаграммы...</p>
        </div>
      </template>
    </ClientOnly>

    <div v-else class="text-center text-gray-500 py-8">
      <p>Нет данных для отображения</p>
    </div>

    <template #footer>
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="item in expensesByCategory"
          :key="item.category.id"
          class="flex items-center gap-2"
        >
          <div
            class="w-4 h-4 rounded-full flex-shrink-0"
            :style="{ backgroundColor: item.category.color }"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1">
              <span class="text-sm font-medium truncate">{{ item.category.name }}</span>
              <UIcon
                v-if="item.category.description"
                name="i-lucide-help-circle"
                class="h-3 w-3 text-gray-400 flex-shrink-0 cursor-help"
                :title="item.category.description"
              />
            </div>
            <span class="text-xs text-gray-500">{{ formatAmount(item.total) }} ₽</span>
          </div>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
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
