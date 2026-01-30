<script setup lang="ts">
import { TABLE_COLUMNS } from './constants'

const FAKE_COUNT = 4
</script>

<template>
  <div class="expenses-table-container">
    <table class="expenses-table">
      <thead>
        <tr class="expenses-table__row--header">
          <th
            v-for="column in TABLE_COLUMNS"
            :key="`skeleton-column-${column}`"
            class="expenses-table__cell expenses-table__cell--header"
            v-text="column"
          />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="i in FAKE_COUNT"
          :key="i"
          class="expenses-table__row"
        >
          <td class="expenses-table__cell">
            <div class="skeleton-cell">
              <el-skeleton
                :rows="0"
                class="skeleton-dot"
                animated
              />
              <el-skeleton
                :rows="0"
                class="skeleton-text"
                animated
              />
            </div>
          </td>
          <td class="expenses-table__cell">
            <el-skeleton
              :rows="0"
              class="skeleton-text-lg"
              animated
            />
          </td>
          <td class="expenses-table__cell">
            <el-skeleton
              :rows="0"
              class="skeleton-text-md"
              animated
            />
          </td>
          <td class="expenses-table__cell">
            <div class="skeleton-actions">
              <el-skeleton
                v-for="button in 2"
                :key="`skeleton-button-${button}`"
                :rows="0"
                class="skeleton-button"
                animated
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
@import url('./styles/index.scss');

.skeleton-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .skeleton-dot {
    width: 0.75rem;
    height: 0.75rem;
  }

  .skeleton-text {
    width: 5rem;
    height: 1rem;
  }
}

.skeleton-text-lg {
  width: 8rem;
  height: 1rem;
}

.skeleton-text-md {
  width: 6rem;
  height: 1rem;
}

.skeleton-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;

  .skeleton-button {
    width: 2rem;
    height: 2rem;
  }
}
</style>
