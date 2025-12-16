<script setup>
useHead({
  htmlAttrs: {
    lang: 'ru'
  }
})
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <h1 class="text-xl font-bold">Расходы на ремонт</h1>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-sm text-gray-500">
          © {{ new Date().getFullYear() }}
        </p>
      </template>
    </UFooter>
  </div>
</template>
