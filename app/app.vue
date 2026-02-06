<script setup>
import ru from 'element-plus/es/locale/lang/ru'

useHead({
  htmlAttrs: {
    lang: 'ru'
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
      </el-main>

      <LayoutFooter />

      <ExpenseModal />
      <CategoryModal />
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
</style>
