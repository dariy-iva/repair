<script setup>
import ru from 'element-plus/es/locale/lang/ru'
import { Top } from '@element-plus/icons-vue'
import { useExpensesStore } from '@/stores/expenses'
import { storeToRefs } from 'pinia'

useHead({
  htmlAttrs: {
    lang: 'ru'
  }
})

const expensesStore = useExpensesStore()
const { categoriesLoaded, expensesLoaded } = storeToRefs(expensesStore)

onMounted(async () => {
  await Promise.allSettled([
    categoriesLoaded.value ? Promise.resolve() : expensesStore.loadCategories(),
    expensesLoaded.value ? Promise.resolve() : expensesStore.loadExpenses()
  ])
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
