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

const toggleCollapse = (): void => {
  isCollapsed.value = !isCollapsed.value
  isContentMounted.value = true
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

    <el-collapse-transition v-if="collapsible">
      <div
        v-if="isContentMounted"
        v-show="!isCollapsed"
      >
        <slot name="default" />
      </div>
    </el-collapse-transition>
    <slot
      v-else
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
