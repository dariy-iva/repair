<script setup>
import ru from 'element-plus/es/locale/lang/ru'
import { Top } from '@element-plus/icons-vue'

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

        <el-backtop
          :right="50"
          :bottom="50"
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
</style>
