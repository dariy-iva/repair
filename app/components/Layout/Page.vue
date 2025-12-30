<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  error?: string
}

withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  error: ''
})
</script>

<template>
  <div class="page">
    <div class="page__content">
      <div class="page__header">
        <h1
          v-if="title"
          class="page__title"
          v-text="title"
        />
        <p
          v-if="description"
          class="page__description"
          v-text="description"
        />
      </div>

      <el-alert
        v-if="error"
        type="error"
        :closable="false"
        show-icon
      >
        {{ error }}
      </el-alert>

      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page {
  max-width: 1200px;
  margin: 0 auto;

  &__content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__title {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  &__description {
    color: #6b7280;
  }
}
</style>
