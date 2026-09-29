<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'

interface Props {
  title?: string
  subtitle?: string
  collapsible?: boolean
  collapsed?: boolean
}

const props = defineProps<Props>()

const isCollapsed = ref<boolean>(props.collapsed)
// Контент монтируется при первом раскрытии, дальше только скрывается — без пересоздания
const isContentMounted = ref<boolean>(!props.collapsed)

const toggleCollapse = async (): Promise<void> => {
  if (!isContentMounted.value) {
    // Монтируем свёрнутым и раскрываем в следующем кадре, чтобы сработала анимация
    isContentMounted.value = true
    await nextTick()
    requestAnimationFrame(() => {
      isCollapsed.value = false
    })
    return
  }

  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <section class="section">
    <div
      v-if="title || subtitle || $slots.header"
      class="section__header"
    >
      <div class="section__header-column">
        <h1
          v-if="title"
          class="section__title"
        >
          <button
            v-if="collapsible"
            type="button"
            class="section__toggle"
            :aria-expanded="!isCollapsed"
            @click="toggleCollapse"
          >
            {{ title }}
            <el-icon
              class="section__toggle-icon"
              :class="{ 'section__toggle-icon--collapsed': isCollapsed }"
            >
              <ArrowDown />
            </el-icon>
          </button>
          <template v-else>
            {{ title }}
          </template>
        </h1>
        <p
          v-if="subtitle"
          class="section__subtitle"
          v-text="subtitle"
        />
      </div>

      <slot name="header" />
    </div>

    <div
      v-if="collapsible && isContentMounted"
      class="section__collapse"
      :class="{ 'section__collapse--collapsed': isCollapsed }"
    >
      <div class="section__collapse-inner">
        <slot name="default" />
      </div>
    </div>
    <slot
      v-else-if="!collapsible"
      name="default"
    />
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

  &__header {
    @include tablet-desktop {
      justify-content: space-between;
    }

    @include mobile {
      flex-direction: column;
    }
  }

  &__header-column {
    flex-direction: column;
  }

  &__title {
    font-size: 1.6rem;
    font-weight: 600;
    margin: 0;
  }

  // Высота анимируется через grid-template-rows: 1fr ↔ 0fr, без JS и замеров
  &__collapse {
    display: grid;
    grid-template-rows: 1fr;
    transition:
      grid-template-rows 0.3s ease,
      opacity 0.3s ease,
      margin-top 0.3s ease,
      visibility 0.3s;

    &--collapsed {
      grid-template-rows: 0fr;
      // Компенсируем gap секции, чтобы свёрнутый блок не давал лишний отступ
      margin-top: -2rem;
      opacity: 0;
      visibility: hidden;
    }
  }

  &__collapse-inner {
    min-height: 0;
    overflow: hidden;
    // Запас под тень карточек, иначе overflow её обрезает
    padding: 1.6rem;
    margin: -1.6rem;
  }

  &__toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    text-align: left;
  }

  &__toggle-icon {
    font-size: 1.6rem;
    transition: transform 0.2s ease;

    &--collapsed {
      transform: rotate(-90deg);
    }
  }

  &__subtitle {
    font-size: 1.2rem;
    color: var(--app-text-secondary);
  }
}
</style>
