<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <el-footer class="footer">
    <div class="footer__inner">
      <p class="footer__text">
        &copy; Daria Ivanova {{ currentYear }}
      </p>
    </div>
  </el-footer>
</template>

<style scoped lang="scss">
.footer {
  height: auto;
  padding: 20px;
  border-top: 1px solid var(--app-border);
  background-color: var(--app-surface-2);

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }

  &__text {
    font-size: 0.875rem;
    color: var(--app-text-secondary);
    margin: 0;
  }
}
</style>
