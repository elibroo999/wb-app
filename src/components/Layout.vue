<template>
  <v-app>
    <v-app-bar app flat>
      <v-toolbar-title>WB Аналитика</v-toolbar-title>
      <v-spacer />

      <v-btn
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        text
        component="router-link"
      >
        {{ link.label }}
      </v-btn>

      <v-btn v-if="isLoggedIn" text color="red" @click="logout">
        Выйти
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const links = [
  { to: '/app/incomes', label: 'Доходы' },
  { to: '/app/orders', label: 'Заказы' },
  { to: '/app/sales', label: 'Продажи' },
  { to: '/app/stocks', label: 'Склады' }
]

const router = useRouter()
const isLoggedIn = ref(false)

onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('loggedInUser')
})

const logout = () => {
  localStorage.removeItem('loggedInUser')
  isLoggedIn.value = false
  router.push('/login')
}
</script>
