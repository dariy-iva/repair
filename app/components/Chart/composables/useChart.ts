import type { Props } from '../types'
import { getFormatedAmount, getTotalAmount } from '../utils'
import type { Chart, TooltipItem } from 'chart.js'

export default (props: Props) => {
  const totalAmount = computed<number>(() => getTotalAmount(props.items))

  const chartCanvas = ref<HTMLCanvasElement | null>(null)
  let chartInstance: Chart<'doughnut', number[], string> | null = null

  const initChart = async (): Promise<void> => {
    if (!chartCanvas.value || !props.items.length) {
      return
    }

    try {
      const { Chart, ArcElement, Tooltip, Legend, DoughnutController } = await import('chart.js')
      Chart.register(ArcElement, Tooltip, Legend, DoughnutController)

      if (chartInstance) {
        chartInstance.destroy()
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
    }
  }

  // Инициализация при появлении данных
  watch(() => props.items, async (newData) => {
    if (!import.meta.client || !newData.length) {
      return
    }

    // Если диаграмма уже создана, просто обновляем данные
    if (chartInstance) {
      chartInstance.data.labels = newData.map(item => item.name)

      chartInstance.data.datasets[0] = {
        ...chartInstance.data.datasets[0],
        data: newData.map(item => item.total),
        backgroundColor: newData.map(item => item.color)
      }

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

  return {
    totalAmount,
    chartCanvas,
    initChart,
    getFormatedAmount
  }
}
