<script setup lang="ts">
import { TopRight, Download } from '@element-plus/icons-vue'

type Document = {
  label: string
  link: string
}

const documents: Document[] = [
  {
    label: 'Электрика + потолки',
    link: '/docs/electrics+celling.pdf'
  },
  {
    label: 'Теплый пол',
    link: '/docs/warm-floor.pdf'
  }
]
</script>

<template>
  <UiSection>
    <el-card>
      <template #header>
        <h2>
          Документация
        </h2>
      </template>

      <ul class="doc-list">
        <li
          v-for="item in documents"
          :key="`document-${item.link}`"
          class="doc-list__item"
        >
          <span class="doc-list__label">{{ item.label }}</span>
          <div class="doc-list__actions">
            <el-tooltip
              content="Посмотреть"
              placement="top"
            >
              <a
                :href="item.link"
                target="_blank"
              >
                <el-button
                  :icon="TopRight"
                  circle
                />
              </a>
            </el-tooltip>
            <el-tooltip
              content="Скачать"
              placement="top"
            >
              <el-button
                :icon="Download"
                circle
                tag="a"
                :href="item.link"
                :download="item.label"
              />
            </el-tooltip>
          </div>
        </li>
      </ul>
    </el-card>
  </UiSection>
</template>

<style scoped lang="scss">
.doc-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    max-width: max-content;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    color: #6b7280;
  }

  &__label {
    font-size: 0.9375rem;
  }

  &__actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }
}
</style>
