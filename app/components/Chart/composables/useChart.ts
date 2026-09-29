import type { Props } from '../types'
import { getFormatedAmount, getTotalAmount } from '../utils'
import type { Chart, TooltipItem } from 'chart.js'

type ChartJsModule = typeof import('chart.js')

let chartJsPromise: Promise<ChartJsModule> | null = null

// chart.js грузим и регистрируем один раз на всё приложение
const loadChartJs = (): Promise<ChartJsModule> => {
  chartJsPromise ??= import('chart.js').then((module) => {
    const { Chart, ArcElement, Tooltip, Legend, DoughnutController } = module
    Chart.register(ArcElement, Tooltip, Legend, DoughnutController)
    return module
  })

  return chartJsPromise
}

export default (props: Props) => {
  const totalAmount = computed<number>(() => getTotalAmount(props.items))

  const chartCanvas = ref<HTMLCanvasElement | null>(null)
  let chartInstance: Chart<'doughnut', number[], string> | null = null

  const destroyChart = (): void => {
    chartInstance?.destroy()
    chartInstance = null
  }

  const updateChart = (chart: Chart<'doughnut', number[], string>, items: Props['items']): void => {
    const [dataset] = chart.data.datasets

    chart.data.labels = items.map(item => item.name)

    if (dataset) {
      dataset.data = items.map(item => item.total)
      dataset.backgroundColor = items.map(item => item.color)
    }

    chart.update()
  }

  // Приводит диаграмму к текущему состоянию canvas и данных.
  // Решение принимается после await, поэтому параллельные вызовы не создают дубликатов.
  const syncChart = async (): Promise<void> => {
    if (!chartCanvas.value || !props.items.length) {
      return
    }

    try {
      const { Chart } = await loadChartJs()
      const canvas = chartCanvas.value
      const { items } = props

      if (!canvas || !items.length) {
        return
      }

      if (chartInstance?.canvas === canvas) {
        updateChart(chartInstance, items)
        return
      }

      // Старый инстанс привязан к удалённому canvas — пересоздаём
      destroyChart()

      chartInstance = new Chart(canvas, {
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

  // items из стора — computed, при изменении приходит новый массив, deep не нужен
  watch([chartCanvas, () => props.items], syncChart)

  onUnmounted(destroyChart)

  return {
    totalAmount,
    chartCanvas
  }
}
