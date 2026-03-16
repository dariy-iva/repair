<script setup lang="ts">
useHead({ title: 'Проект' })

const isMobile = ref<boolean>(false)

const checkMobile = (): void => {
  isMobile.value = window.innerWidth < 768
}

const sections = [
  {
    title: 'Прихожая',
    photos: [1, 2, 3, 4, 5, 6, 7].map(n => `/visualizations/hallway-${n}.webp`)
  },
  {
    title: 'Санузел',
    photos: [1, 2, 3, 4, 5, 6, 7].map(n => `/visualizations/bathroom-${n}.webp`)
  },
  {
    title: 'Спальня',
    photos: [1, 2, 3, 4, 5, 6].map(n => `/visualizations/bedroom-${n}.webp`)
  },
  {
    title: 'Кухня',
    photos: [1, 2, 3, 4].map(n => `/visualizations/kitchen-${n}.webp`)
  },
  {
    title: 'Гостиная',
    photos: [1, 2, 3, 4, 5, 6].map(n => `/visualizations/livingroom-${n}.webp`)
  },
  {
    title: 'Кабинет',
    photos: [1, 2, 3, 4, 5].map(n => `/visualizations/office-${n}.webp`)
  }
]

// Lightbox
const lightbox = ref<{ src: string, list: string[], index: number } | null>(null)

const openLightbox = (list: string[], index: number): void => {
  lightbox.value = { src: list[index] || '', list, index }
}

const closeLightbox = (): void => {
  lightbox.value = null
}

const lightboxPrev = (): void => {
  if (!lightbox.value) return
  const i = (lightbox.value.index - 1 + lightbox.value.list.length) % lightbox.value.list.length
  lightbox.value = { ...lightbox.value, index: i, src: lightbox.value.list[i] || '' }
}

const lightboxNext = (): void => {
  if (!lightbox.value) return
  const i = (lightbox.value.index + 1) % lightbox.value.list.length
  lightbox.value = { ...lightbox.value, index: i, src: lightbox.value.list[i] || '' }
}

const onKey = (e: KeyboardEvent): void => {
  if (!lightbox.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') lightboxPrev()
  if (e.key === 'ArrowRight') lightboxNext()
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <LayoutPage title="Проект">
    <div class="sections">
      <section
        v-for="section in sections"
        :key="section.title"
        class="section"
      >
        <h2 class="section__title">
          {{ section.title }}
        </h2>

        <el-carousel
          :type="isMobile ? undefined : 'card'"
          :direction="isMobile ? 'vertical' : 'horizontal'"
          :height="isMobile ? '460px' : '550px'"
          :autoplay="false"
          arrow="hover"
          class="section__carousel"
        >
          <el-carousel-item
            v-for="(photo, idx) in section.photos"
            :key="photo"
          >
            <img
              :src="photo"
              :alt="section.title"
              class="carousel-img"
              @click="openLightbox(section.photos, idx)"
            >
          </el-carousel-item>
        </el-carousel>
      </section>
    </div>

    <Teleport to="body">
      <Transition name="lb">
        <div
          v-if="lightbox"
          class="lightbox"
          @click.self="closeLightbox"
        >
          <button
            class="lightbox__close"
            aria-label="Закрыть"
            @click="closeLightbox"
          >
            ✕
          </button>

          <button
            class="lightbox__arrow lightbox__arrow--prev"
            aria-label="Предыдущее фото"
            @click="lightboxPrev"
          >
            ‹
          </button>

          <Transition
            name="lb-img"
            mode="out-in"
          >
            <img
              :key="lightbox.src"
              :src="lightbox.src"
              class="lightbox__img"
              alt=""
            >
          </Transition>

          <button
            class="lightbox__arrow lightbox__arrow--next"
            aria-label="Следующее фото"
            @click="lightboxNext"
          >
            ›
          </button>

          <div class="lightbox__counter">
            {{ lightbox.index + 1 }} / {{ lightbox.list.length }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </LayoutPage>
</template>

<style scoped lang="scss">
.sections {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.section {
  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 16px;
  }

  @media (max-width: 767px) {
    &__carousel {
      margin-left: -20px;
      margin-right: -20px;
    }
  }
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: zoom-in;

  @media (min-width: 768px) {
    border-radius: 12px;
  }
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.9);
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
    font-size: 5rem;
    line-height: 1;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s;
    padding: 0 16px;
    user-select: none;

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

.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.2s ease;
}
.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}

.lb-img-enter-active,
.lb-img-leave-active {
  transition: opacity 0.15s ease;
}
.lb-img-enter-from,
.lb-img-leave-to {
  opacity: 0;
}
</style>
