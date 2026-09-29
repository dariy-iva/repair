import type { Props } from '../types'
import { getFormatedAmount, getTotalAmount } from '../utils'
import type { Chart, TooltipItem } from 'chart.js'

export default (props: Props) => {
  const totalAmount = computed<number>(() => getTotalAmount(props.items))

  const chartCanvas = ref<HTMLCanvasElement | null>(null)
  let chartInstance: Chart<'doughnut', number[], string> | null = null

  let isInitializing = false

  const initChart = async (): Promise<void> => {
    if (!chartCanvas.value || !props.items.length || chartInstance || isInitializing) {
      return
    }

    isInitializing = true

    try {
      const { Chart, ArcElement, Tooltip, Legend, DoughnutController } = await import('chart.js')
      Chart.register(ArcElement, Tooltip, Legend, DoughnutController)

      // Пока грузился chart.js, canvas мог исчезнуть (компонент свернули/размонтировали)
      if (!chartCanvas.value) {
        return
      }

      const { items } = props

      chartInstance = new Chart(chartCanvas.value, {
        type: 'doughnut',
        data: {
          labels: items.map(item => item.name),
          datasets: [
            {
              data: items.map(item => item.total),
              backgroundColor: items.map(item => item.color),
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
                label: (context: TooltipItem<'doughnut'>) => {
                  const label = context.label || ''
                  const value = context.parsed || 0
                  const percentage = ((value / totalAmount.value) * 100).toFixed(1)
                  return `${label}: ${getFormatedAmount(value)} ₽ (${percentage}%)`
                }
              }
            }
          }
        }
      })
    } catch (error) {
      console.error('Failed to initialize chart:', error)
    } finally {
      isInitializing = false
    }
  }

  const updateChart = (items: Props['items']): void => {
    if (!chartInstance) {
      return
    }

    chartInstance.data.labels = items.map(item => item.name)

    chartInstance.data.datasets[0] = {
      ...chartInstance.data.datasets[0],
      data: items.map(item => item.total),
      backgroundColor: items.map(item => item.color)
    }

    chartInstance.update()
  }

  // Единая точка инициализации: canvas появился и/или пришли данные
  watch(chartCanvas, async () => {
    // Старый инстанс привязан к удалённому canvas — пересоздаём
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }

    await initChart()
  })

  watch(() => props.items, async (items) => {
    if (!import.meta.client || !items.length) {
      return
    }

    if (chartInstance) {
      updateChart(items)
      return
    }

    await initChart()
  }, { deep: true, immediate: true })

  onUnmounted(() => {
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
  })

  return {
    totalAmount,
    chartCanvas,
    initChart,
    getFormatedAmount
  }
}
