<script setup lang="ts">
import { User, UserFilled } from '@element-plus/icons-vue'

const { loggedIn, user, clear } = useUserSession()

const tooltip = computed<string>(() =>
  loggedIn.value ? `${user.value?.name} · Выйти` : 'Войти через Google'
)

const handleClick = async (): Promise<void> => {
  if (loggedIn.value) {
    await clear()
  } else {
    await navigateTo('/auth/google', { external: true })
  }
}
</script>

<template>
  <ClientOnly>
    <el-tooltip
      :content="tooltip"
      placement="bottom"
    >
      <el-button
        class="auth-button"
        :class="{ 'auth-button--active': loggedIn }"
        circle
        :aria-label="tooltip"
        @click="handleClick"
      >
        <el-icon>
          <UserFilled v-if="loggedIn" />
          <User v-else />
        </el-icon>
      </el-button>
    </el-tooltip>

    <template #fallback>
      <el-button
        class="auth-button"
        circle
        aria-label="Авторизация"
      >
        <el-icon>
          <User />
        </el-icon>
      </el-button>
    </template>
  </ClientOnly>
</template>

<style scoped lang="scss">
.auth-button {
  --el-button-text-color: var(--app-text-secondary);
  --el-button-hover-text-color: var(--app-primary);
  --el-button-border-color: var(--app-border);
  --el-button-hover-border-color: var(--app-primary);
  --el-button-hover-bg-color: transparent;

  font-size: 1.125rem;

  &--active {
    --el-button-text-color: var(--app-primary);
    --el-button-border-color: var(--app-primary);
    --el-button-bg-color: color-mix(in srgb, var(--app-primary) 10%, transparent);
    --el-button-hover-bg-color: color-mix(in srgb, var(--app-primary) 15%, transparent);
  }
}
</style>
