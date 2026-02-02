<script setup>
useHead({
  htmlAttrs: {
    lang: 'ru'
  }
})
</script>

<template>
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
  </el-container>
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
