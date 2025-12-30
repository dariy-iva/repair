<script setup lang="ts"></script>

<template>
  <el-affix :offset="0">
    <el-header
      height="60px"
      class="header"
    >
      <h1 class="header__title">
        Мой ремонт
      </h1>
    </el-header>
  </el-affix>
</template>

<style scoped lang="scss">
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  padding: 0 20px;

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }
}
</style>
