import type { Expense } from '@/types/expense'
import type { DefaultRow } from 'element-plus/es/components/table/src/table/defaults'

export const TABLE_COLUMNS: Readonly<DefaultRow[]> = [
  {
    name: 'date',
    label: 'Дата покупки',
    formatter: (row: Expense.ModelWithCategory) => row?.date?.split('-').reverse().join('.'),
    minWidth: '150px',
    sortable: true
  },
  {
    name: 'category',
    label: 'Категория',
    minWidth: '150px',
    sortable: true
  },
  {
    name: 'name',
    label: 'Название',
    minWidth: '300px'
  },
  {
    name: 'amount',
    label: 'Сумма',
    formatter: (row: Expense.ModelWithCategory) => `${new Intl.NumberFormat('ru-RU').format(row.amount)} ₽`,
    minWidth: '150px',
    sortable: true
  },
  {
    name: 'actions',
    label: '',
    minWidth: '100px',
    fixed: 'right'
  }
]
