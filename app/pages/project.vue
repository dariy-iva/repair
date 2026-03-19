<script setup lang="ts">
useHead({ title: 'Проект' })

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
</script>

<template>
  <LayoutPage title="Проект">
    <div class="sections">
      <DocumentSection />

      <UiSection
        v-for="section in sections"
        :key="section.title"
        :title="section.title"
        class="section"
      >
        <GalleryCarousel
          :list="section.photos"
          class="section__carousel"
        />
      </UiSection>
    </div>
  </LayoutPage>
</template>

<style scoped lang="scss">
.sections {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.section {
  :deep(.carousel) {
    @media (max-width: 767px) {
        margin-left: -20px;
        margin-right: -20px;
    }
  }
}
</style>
