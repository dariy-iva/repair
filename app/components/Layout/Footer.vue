<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <el-footer class="footer">
    <p class="footer__text">
      &copy; Daria Ivanova {{ currentYear }}
    </p>
  </el-footer>
</template>

<style scoped lang="scss">
.footer {
  display: flex;
  height: auto;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;

  &__text {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }
}
</style>
