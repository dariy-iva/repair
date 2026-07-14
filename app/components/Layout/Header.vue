<script setup lang="ts">
const route = useRoute()

const links = [
  { label: 'Главная', to: '/' },
  { label: 'Проект', to: '/project' },
  { label: 'Категории', to: '/expense' }
]
</script>

<template>
  <el-affix :offset="0">
    <el-header
      height="auto"
      class="header"
    >
      <div class="header__inner">
        <div class="header__top">
          <h1 class="header__title">
            Мой ремонт
          </h1>

          <LayoutThemeToggle />
        </div>

        <nav class="header__nav">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="header__nav-link"
            :class="{ 'header__nav-link--active': route.path === link.to }"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>
    </el-header>
  </el-affix>
</template>

<style scoped lang="scss">
.header {
  background-color: var(--app-surface);
  border-bottom: 1px solid var(--app-border);
  padding: 12px 20px 0;

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  &__nav-link {
    display: flex;
    align-items: center;
    padding: 16px 0;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--app-text);
    text-decoration: none;
    border-bottom: 3px solid transparent;
    transition: color 0.2s, border-color 0.2s;

    &:hover {
      color: var(--app-primary);
    }

    &--active {
      color: var(--app-primary);
      border-bottom-color: var(--app-primary);
    }
  }
}
</style>
