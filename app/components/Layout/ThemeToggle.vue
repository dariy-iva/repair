<script setup lang="ts">
import { Sunny, Moon, Monitor } from '@element-plus/icons-vue'

type ThemePreference = 'light' | 'dark' | 'system'

const colorMode = useColorMode()

const ORDER: ThemePreference[] = ['light', 'dark', 'system']

const LABELS: Record<ThemePreference, string> = {
  light: 'Светлая тема',
  dark: 'Тёмная тема',
  system: 'Системная тема'
}

const ICONS = {
  light: Sunny,
  dark: Moon,
  system: Monitor
}

const preference = computed<ThemePreference>(() => colorMode.preference as ThemePreference)

const currentIcon = computed(() => ICONS[preference.value])
const currentLabel = computed<string>(() => LABELS[preference.value])

const handleToggle = (): void => {
  const nextIndex = (ORDER.indexOf(preference.value) + 1) % ORDER.length
  colorMode.preference = ORDER[nextIndex] as string
}
</script>

<template>
  <ClientOnly>
    <el-tooltip
      :content="currentLabel"
      placement="bottom"
    >
      <el-button
        class="theme-toggle"
        circle
        :aria-label="currentLabel"
        @click="handleToggle"
      >
        <el-icon>
          <component :is="currentIcon" />
        </el-icon>
      </el-button>
    </el-tooltip>

    <template #fallback>
      <el-button
        class="theme-toggle"
        circle
        aria-label="Тема"
      >
        <el-icon>
          <Monitor />
        </el-icon>
      </el-button>
    </template>
  </ClientOnly>
</template>

<style scoped lang="scss">
.theme-toggle {
  --el-button-text-color: var(--app-text-secondary);
  --el-button-hover-text-color: var(--app-primary);
  --el-button-border-color: var(--app-border);
  --el-button-hover-border-color: var(--app-primary);
  --el-button-hover-bg-color: transparent;

  font-size: 1.125rem;
}
</style>
