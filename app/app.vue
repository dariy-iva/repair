<script setup>
useHead({
  htmlAttrs: {
    lang: 'ru'
  }
})
</script>

<template>
  <el-container direction="vertical" class="app-container">
    <el-header height="60px" class="app-header">
      <h1 class="app-title">Мой ремонт</h1>
    </el-header>

    <el-main class="app-main">
      <NuxtPage />
    </el-main>

    <el-footer height="50px" class="app-footer">
      <p class="app-footer-text">
        &copy; Daria Ivanova {{ new Date().getFullYear() }}
      </p>
    </el-footer>
  </el-container>
</template>

<style scoped lang="scss">
.app-container {
  min-height: 100vh;
}

.app-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.app-main {
  padding: 20px;
  flex: 1;
}

.app-footer {
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.app-footer-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}
</style>
