<script setup lang="ts">
import { ArrowLeft, ArrowRight, Close } from '@element-plus/icons-vue'

interface Props {
  index: number
  list: string[]
}

interface Emits {
  (event: 'close'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

const index = ref<number>(props.index || 0)
const currentImage = computed<string>(() => props.list[index.value] || '')

const lightboxPrev = (): void => {
  index.value = (index.value - 1 + props.list.length) % props.list.length
}

const lightboxNext = (): void => {
  index.value = (index.value + 1) % props.list.length
}

const onKey = (e: KeyboardEvent): void => {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowLeft') lightboxPrev()
  if (e.key === 'ArrowRight') lightboxNext()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div
    class="lightbox"
    @click.self="emit('close')"
  >
    <button
      class="lightbox__close"
      aria-label="Закрыть"
      @click="emit('close')"
    >
      <el-icon><Close /></el-icon>
    </button>

    <button
      class="lightbox__arrow lightbox__arrow--prev"
      aria-label="Предыдущее фото"
      @click="lightboxPrev"
    >
      <el-icon><ArrowLeft /></el-icon>
    </button>

    <Transition
      name="lb-img"
      mode="out-in"
    >
      <img
        :key="currentImage"
        :src="currentImage"
        class="lightbox__img"
        alt=""
      >
    </Transition>

    <button
      class="lightbox__arrow lightbox__arrow--next"
      aria-label="Следующее фото"
      @click="lightboxNext"
    >
      <el-icon><ArrowRight /></el-icon>
    </button>

    <div class="lightbox__counter">
      {{ index + 1 }} / {{ list.length }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;

  &__img {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
    user-select: none;
  }

  &__close {
    position: absolute;
    top: 20px;
    right: 24px;
    background: none;
    border: none;
    color: #fff;
    font-size: 1.75rem;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
    line-height: 1;

    &:hover { opacity: 1; }
  }

  &__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s;
    padding: 0 16px;
    user-select: none;
    outline: none;

    .el-icon {
      font-size: 2.5rem;
    }

    &:hover { opacity: 1; }
    &--prev { left: 0; }
    &--next { right: 0; }
  }

  &__counter {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
  }
}
</style>
