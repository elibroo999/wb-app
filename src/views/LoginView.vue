<template>
  <v-container
    class="d-flex flex-column align-center justify-center text-center"
    fluid
    style="height: 100vh;"
  >
    <h1 class="text-h6 font-weight-bold mb-4" style="color: white">
      {{ isRegistering ? 'Регистрация' : 'Авторизация' }}
    </h1>

    <div class="input-wrapper">
      <v-text-field
        v-model="username"
        label="Логин"
        variant="outlined"
        density="comfortable"
        hide-details
        color="primary"
        class="custom-input"
        :class="{ 'input-focused': isFocusedUsername }"
        @focus="isFocusedUsername = true"
        @blur="isFocusedUsername = false"
      />
    </div>

    <div class="input-wrapper">
      <v-text-field
        v-model="password"
        label="Пароль"
        variant="outlined"
        density="comfortable"
        hide-details
        color="primary"
        class="custom-input"
        :class="{ 'input-focused': isFocusedPassword }"
        @focus="isFocusedPassword = true"
        @blur="isFocusedPassword = false"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
      />
    </div>

    <v-btn @click="handleSubmit" size="small" color="primary" class="custom-button">
      {{ isRegistering ? 'Зарегистрироваться' : 'Войти' }}
    </v-btn>

    <v-btn variant="text" class="mt-2" @click="toggleMode" style="color: #7f8ff4;">
      {{ isRegistering ? 'Уже есть аккаунт? Войти' : 'Зарегистрироваться' }}
    </v-btn>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const isFocusedUsername = ref(false)
const isFocusedPassword = ref(false)
const showPassword = ref(false)
const isRegistering = ref(false)
const router = useRouter()

// Snackbar
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const showSnackbar = (text: string, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const toggleMode = () => {
  isRegistering.value = !isRegistering.value
  username.value = ''
  password.value = ''
}

const handleSubmit = () => {
  const usersRaw = localStorage.getItem('users')
  let users: { name: string; password: string }[] = []

  try {
    users = usersRaw ? JSON.parse(usersRaw) : []
  } catch {
    users = []
  }

  if (!username.value || !password.value) {
    showSnackbar('Введите логин и пароль', 'error')
    return
  }

  if (isRegistering.value) {
    const existing = users.find((u) => u.name === username.value)
    if (existing) {
      showSnackbar('Пользователь уже существует', 'error')
      return
    }

    users.push({ name: username.value, password: password.value })
    localStorage.setItem('users', JSON.stringify(users))
    showSnackbar('Регистрация успешна!')
    toggleMode()
  } else {
    const found = users.find((u) => u.name === username.value && u.password === password.value)
    if (found) {
      localStorage.setItem('loggedInUser', username.value)
      showSnackbar('Вход выполнен успешно!')
      setTimeout(() => {
        router.push('/app/incomes')
      }, 1000)
    } else {
      showSnackbar('Неверный логин или пароль', 'error')
    }
  }
}
</script>

<style scoped>
.input-wrapper {
  width: 100%;
  max-width: 450px;
  margin-bottom: 16px;
}

.custom-input .v-input__control {
  border-radius: 20px !important;
  background-color: #1a1a1a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  padding: 0 12px;
  transition: box-shadow 0.3s ease, border 0.3s ease, background-color 0.3s ease, color 0.3s ease;
  min-height: 48px;
}

.custom-input:hover .v-input__control {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}

.custom-input.input-focused .v-input__control {
  box-shadow: 0 0 0 3px rgba(93, 135, 255, 0.4),
              0 4px 12px rgba(93, 135, 255, 0.3);
}

.custom-button {
  border-radius: 20px;
  padding: 6px 24px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 10px rgba(93, 135, 255, 0.3);
  transition: all 0.3s ease;
}

.custom-button:hover {
  box-shadow: 0 6px 16px rgba(93, 135, 255, 0.4);
  transform: translateY(-1px);
}
</style>
