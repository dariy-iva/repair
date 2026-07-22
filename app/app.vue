<script setup lang="ts">
import ru from 'element-plus/es/locale/lang/ru'
import { Top } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { useExpensesStore } from '@/stores/expenses'
import { storeToRefs } from 'pinia'

useHead({
  htmlAttrs: {
    lang: 'ru'
  }
})

const expensesStore = useExpensesStore()
const { categoriesLoaded, expensesLoaded } = storeToRefs(expensesStore)

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  await Promise.allSettled([
    categoriesLoaded.value ? Promise.resolve() : expensesStore.loadCategories(),
    expensesLoaded.value ? Promise.resolve() : expensesStore.loadExpenses()
  ])

  if (route.query.authError) {
    const messages: Record<string, string> = {
      unauthorized: 'Доступ запрещён: этот аккаунт Google не имеет доступа к приложению',
      failed: 'Ошибка авторизации через Google. Попробуйте ещё раз'
    }

    ElNotification({
      message: messages[route.query.authError] || 'Ошибка авторизации',
      type: 'error',
      position: 'bottom-right',
      duration: 5000
    })

    await router.replace({ query: { ...route.query, authError: undefined } })
  }
})
</script>

<template>
  <el-config-provider :locale="ru">
    <el-container
      direction="vertical"
      class="container"
    >
      <LayoutHeader />

      <el-main class="main">
        <NuxtPage />

        <el-backtop
          :right="40"
          :bottom="40"
          class="back-top"
        >
          <el-icon><Top /></el-icon>
        </el-backtop>

        <ExpenseModal />
        <CategoryModal />
      </el-main>

      <LayoutFooter />
    </el-container>
  </el-config-provider>
</template>

<style scoped lang="scss">
.container {
  min-height: 100vh;
}

.main {
  padding: 20px;
  flex: 1;
}

.back-top {
  width: 50px;
  height: 50px;
}
</style>
