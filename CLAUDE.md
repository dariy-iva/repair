# CLAUDE.md

Приложение для учёта и управления расходами на ремонт («Мой ремонт»). Nuxt 4 + Element Plus + Pinia, PWA, интерфейс на русском языке.

## Общение

Отвечай в чате на русском языке.

## Команды

```bash
npm run dev        # dev-сервер на http://localhost:3000
npm run build      # прод-сборка
npm run preview    # локальный превью прод-сборки
npm run lint       # eslint .
npm run lint:fix   # eslint . --fix
npm run typecheck  # nuxt typecheck (vue-tsc)
```

PWA-модуль (`@vite-pwa/nuxt`) подключается **только в production** (см. `nuxt.config.ts`).

## Стек

- **Nuxt 4** (`app/`-directory структура, `compatibilityDate: '2025-01-15'`), Vue 3 `<script setup>`.
- **Element Plus** (`@element-plus/nuxt`) — вся UI-библиотека, компоненты автоимпортятся (`el-*`), иконки из `@element-plus/icons-vue`.
- **Pinia** (`@pinia/nuxt`) — стейт, стиль setup-store.
- **`@nuxtjs/color-mode`** — темизация light/dark/system; выбор персистится модулем (cookie+localStorage), класс `dark`/`light` вешается на `<html>` (`classSuffix: ''`). Доступ к режиму — `useColorMode()`.
- **Chart.js** — диаграммы (динамический импорт, см. `useChart.ts`).
- **SCSS** — стили, миксины автоинжектятся во все `<style lang="scss">` (`additionalData` в `nuxt.config.ts`), поэтому импортировать `mixins.scss` вручную не нужно.

## Структура (`app/`)

- `pages/` — роуты (`index`, `expense`, `project`).
- `components/` — сгруппированы по домену в PascalCase-папки (`Expense/`, `Chart/`, `Layout/`, `Gallery/`, `Category/`, `Document/`, `Ui/`). Автоимпорт по пути: `Expense/Form.vue` → `<ExpenseForm>`, `Layout/Page.vue` → `<LayoutPage>`. Внутри домена бывают подпапки `composables/`, `types/`, `utils/`, `constants/`.
- `stores/` — Pinia setup-stores (`expenses`, `popup`).
- `services/api.ts` — HTTP-слой, класс-сервис + синглтон-экспорт.
- `types/` — типы; `index.ts` реэкспортит домены (`export * from './expense'`).
- `utils/` — общие хелперы (default-export функции).
- `assets/css/` — `main.scss` (глобальные стили, подключён в `nuxt.config.ts`), `mixins.scss`.
- Оболочка приложения — `app.vue` (папок `layouts/`, глобальной `composables/` и `plugins/` нет). Переключатель темы — `components/Layout/ThemeToggle.vue`.

## Конвенции кода (ВАЖНО — соблюдай при написании нового кода)

### Форматирование (eslint stylistic)
- **Без точек с запятой** (`semi: false`), **одинарные кавычки**, `commaDangle: 'never'` (без висячих запятых), `braceStyle: '1tbs'`.
- Отступ 2 пробела, LF, финальный перевод строки (`.editorconfig`).
- Всегда прогоняй `npm run lint:fix` после правок.

### TypeScript
- Типизируй явно: `ref<string>()`, `computed<number>(...)`, возвращаемые типы функций (`: void`, `: Promise<boolean>`).
- Доменные типы группируй в `namespace` (см. `Expense` в `types/expense.ts`): `Expense.Model`, `Expense.Category`, `Expense.ModelNew` (`Omit<Model, 'id'>`), `Expense.ModelWithCategory`. Правило `@typescript-eslint/no-namespace` отключено намеренно.
- DTO-типы — отдельными интерфейсами (`CreateCategoryDto`).
- Импорты через алиас `@/` (`@/types`, `@/stores/...`, `@/services/api`).

### Vue-компоненты
- Порядок в файле: `<script setup lang="ts">`, затем `<template>`, затем `<style scoped lang="scss">`.
- Пропсы через `interface Props` + `defineProps<Props>()` (или `withDefaults(defineProps<Props>(), {...})`).
- Эмиты — типизированный `defineEmits<{ (event: 'submit'): void }>()`.
- Константы уровня страницы капсом: `const TITLE = '...'`; заголовок вкладки — `useHead({ title: TITLE })`.
- Обработчики именуй `handleSubmit`, `handleAmountInput`, `toggleCategory` и т.п.
- Тексты интерфейса — на русском.

### Стили
- **БЭМ** с `&__element` / `&--modifier`, корневой класс = имя компонента в kebab-case (`.expense-form`, `.expense-detail-page`).
- Адаптив только через миксины: `@include mobile`, `@include tablet-desktop`, `@include desktop`, `@include hover` и др. (см. `mixins.scss`). Своих `@media` не пиши.
- Брейкпоинты: mobile ≤767px, tablet 768–1023px, desktop ≥1024px.
- **Цвета — только через семантические CSS-переменные, hex не хардкодить.** Переменные объявлены в `main.scss` на `:root` (светлая) и `html.dark` (тёмная): `--app-bg`, `--app-surface`, `--app-surface-2`, `--app-border`, `--app-text`, `--app-text-secondary`, `--app-text-muted`, `--app-primary`, `--app-primary-hover`. Так цвета автоматически адаптируются под тему.
- Фирменный цвет — `--app-primary` (`#0052a2`, hover `--app-primary-hover` `#0070c0`), приглушённый текст — `--app-text-secondary`. Кастомизация Element Plus — через CSS-переменные `--el-*`; тёмные `--el-*` подключены из `element-plus/theme-chalk/dark/css-vars.css` и активируются классом `dark` на `<html>`.

### Стор (Pinia setup-store)
- Приватный `reactive`/`ref` стейт, наружу — `computed`-геттеры и экшены; см. паттерн `ListState<T> { list, isLoading }` в `stores/expenses.ts`.
- Async-экшены: `try/catch`, `console.error('Failed to ...:', e)`, флаг загрузки в `finally`. Мутирующие экшены пробрасывают ошибку (`throw e`), загрузка — глотает.
- Из стора отдавай `readonly(...)` для внутренних ref, где не нужна внешняя мутация (см. `stores/popup.ts`).
- В компонентах доставай реактивные значения через `storeToRefs`, экшены — деструктуризацией.

### API
- Весь HTTP — через `expenseApi` (`services/api.ts`). Приватный дженерик `request<TResponse, TBody>`, базовый URL и роуты — `static readonly` поля класса.
- Новые сущности добавляй методами в сервис в том же стиле (`getX`/`createX`/`updateX`/`deleteX`).
- ID генерируй `generateUniqueId(list)` (`utils/generateUniqueId.ts`, uuid v4 с проверкой на коллизию).

### Уведомления
- Успех/ошибку показывай через `ElNotification({ message, type, position: 'bottom-right' })`.