<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <section class="section">
    <div class="section__header">
      <div class="section__header-column">
        <h1
          v-if="title"
          class="section__title"
          v-text="title"
        />
        <p
          v-if="subtitle"
          class="section__subtitle"
          v-text="subtitle"
        />
      </div>

      <slot name="header" />
    </div>

    <slot name="default" />
  </section>
</template>

<style scoped lang="scss">
.section {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  &__header,
  &__header-column {
    display: flex;
    gap: 1rem;
  }

  &__header-column {
    flex-direction: column;
  }

  &__title {
    font-size: 1.6rem;
    font-weight: 600;
    margin: 0;
  }

  &__subtitle {
    font-size: 1.2rem;
    color: #6b7280;
  }
}
</style>
