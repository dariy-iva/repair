<script setup lang="ts">
interface Props {
  list: string[]
}

type CarouselInstance = { prev: () => void, next: () => void }

defineProps<Props>()

const carouselRef = ref<CarouselInstance>()
const isMobile = ref<boolean>(false)

const checkMobile = (): void => {
  isMobile.value = window.innerWidth < 768
}

const touchStart = { x: 0, y: 0 }

const onTouchStart = (e: TouchEvent): void => {
  touchStart.x = e.touches[0]?.clientX || 0
  touchStart.y = e.touches[0]?.clientY || 0
}

const onTouchEnd = (e: TouchEvent): void => {
  const element = e.changedTouches[0]

  if (!element) return

  const dx = element.clientX - touchStart.x

  if (!carouselRef.value || !isMobile.value || Math.abs(dx) < 30) return

  if (dx < 0) {
    carouselRef.value?.next()
  } else {
    carouselRef.value?.prev()
  }
}

const lightbox = ref<{ list: string[], index: number } | null>(null)

const openLightbox = (list: string[], index: number): void => {
  lightbox.value = { list, index }
}

const closeLightbox = (): void => {
  lightbox.value = null
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <el-carousel
    ref="carouselRef"
    :type="isMobile ? undefined : 'card'"
    :height="isMobile ? '460px' : '550px'"
    :autoplay="false"
    arrow="always"
    class="carousel"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <el-carousel-item
      v-for="(photo, idx) in list"
      :key="photo"
    >
      <img
        :src="photo"
        alt=""
        class="carousel__img"
        @click="openLightbox(list, idx)"
      >
    </el-carousel-item>
  </el-carousel>

  <Teleport to="body">
    <Transition name="lb">
      <GalleryLightbox
        v-if="lightbox"
        v-bind="lightbox"
        @close="closeLightbox"
      />
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.carousel {
    :deep(.el-carousel__indicators) {
      width: max-content;
      max-width: 80%;
    }

    :deep(.el-carousel__arrow) {
      width: 50px;
      height: 50px;
      background: none;

      &.el-carousel__arrow--right {
        right: 0;
      }

      &.el-carousel__arrow--left {
        left: 0;
      }

      .el-icon,
      .el-icon svg {
        width: 30px;
        height: 30px;
      }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: zoom-in;

    @media (min-width: 768px) {
      border-radius: 12px;
    }
  }
}
</style>
