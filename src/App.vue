<template>
  <v-app>
    <component :is="layoutComponent">
      <router-view />
    </component>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Layout from '@/components/Layout.vue'

const route = useRoute()

const layoutComponent = computed(() => {
  // Путь "/login" — без Layout
  return route.path === '/login' ? 'div' : Layout
})
</script>
