<template>
  <v-container class="auth-container">
    <div class="tabs-container">
      <div
        :class="['tab-item', currentTab === 'login' ? 'active-tab' : '']"
        @click="currentTab = 'login'"
      >
      {{ $t("login.login") }}
      </div>
      <div
        :class="['tab-item', currentTab === 'registration' ? 'active-tab' : '']"
        @click="currentTab = 'registration'"
      >
      {{ $t("login.signup") }}
      </div>
    </div>

    <div v-if="currentTab === 'login'">
      <v-form>
        <v-text-field
          :label="$t('login.log')"
          v-model="username"
          outlined
          class="mb-3"
        />
        <v-text-field
          :label="$t('login.password')"
          type="password"
          v-model="password"
          outlined
          class="mb-3"
        />
        <v-btn
          class="mt-4 login-btn mx-auto d-block"
          @click="handleLogin"
        >
        {{ $t("login.tologin") }}
        </v-btn>
      </v-form>
    </div>

    <div v-else>
      <v-form>
        <v-text-field
          label="Email"
          v-model="email"
          outlined
          class="mb-3"
        />
        <v-text-field
          :label="$t('modal.name')"
          v-model="name"
          outlined
          class="mb-3"
        />
        <v-text-field
          :label="$t('login.password')"
          type="password"
          v-model="regPassword"
          outlined
          class="mb-3"
        />
        <v-text-field
          :label="$t('login.repeatpassw')"
          type="password"
          v-model="passwordRepeat"
          outlined
          class="mb-3"
        />
        <v-btn
          class="mt-4 login-btn mx-auto d-block"
          @click="handleRegistration"
        >
        {{ $t("login.tosignup") }}
        </v-btn>
      </v-form>
    </div>

    <v-snackbar
      v-model="snackbarVisible"
      :color="snackColor ? 'green' : 'red'"
      top
      center
    >
        <div class="d-flex justify-space-between align-center flex-grow-1">
            <span>{{ errorForSnack }}</span>
            <v-btn icon class="black--text" @click="snackbarVisible = false">
                <v-icon class="blacks">mdi-close</v-icon>
            </v-btn>
        </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const currentTab = ref('login')

const username = ref('')
const password = ref('')

const email = ref('')
const name = ref('')
const regPassword = ref('')
const passwordRepeat = ref('')

const snackbarVisible = ref(false)
const snackColor = ref(false) 
const errorForSnack = ref('')

const router = useRouter()

async function handleLogin() {
  try {
    const response = await axios.post('http://localhost:5000/auth/login', {
      email: username.value,
      password: password.value
    })
    localStorage.setItem('token', response.data.token)
    await authStore.checkAuth()
    router.push('/account')
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errorForSnack.value =
        error.response.data.errors.errors[0]?.msg || error.response.data.message
    } else if (error.response) {
      errorForSnack.value = error.response.data.message
    } else {
      errorForSnack.value = 'Произошла ошибка при входе'
    }
    snackColor.value = false
    snackbarVisible.value = true
  }
}

async function handleRegistration() {
  if (!email.value.trim() || !name.value.trim() || !regPassword.value.trim() || !passwordRepeat.value.trim()) {
    errorForSnack.value = 'Заполните все поля!'
    snackColor.value = false
    snackbarVisible.value = true
    return
  }
  if (regPassword.value !== passwordRepeat.value) {
    errorForSnack.value = 'Пароли не совпадают!'
    snackColor.value = false
    snackbarVisible.value = true
    return
  }

  try {
    const response = await axios.post('http://localhost:5000/auth/registration', {
      email: email.value,
      name: name.value,
      password: regPassword.value
    })
    errorForSnack.value = response.data.message || 'Пользователь успешно зарегистрирован'
    snackColor.value = true
    snackbarVisible.value = true
    email.value = ""
    name.value = ""
    regPassword.value = ""
    passwordRepeat.value = ""
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errorForSnack.value =
        error.response.data.errors.errors[0]?.msg || error.response.data.message
    } else if (error.response) {
      errorForSnack.value = error.response.data.message
    } else {
      errorForSnack.value = 'Произошла ошибка при регистрации'
    }
    snackColor.value = false
    snackbarVisible.value = true
  }
}
</script>

<style scoped>
    .auth-container {
    max-width: 400px;
    }

    .tabs-container {
    display: flex;
    margin-bottom: 1rem;
    }

    .tab-item {
    flex: 1;
    text-align: center;
    padding: 8px 0;
    cursor: pointer;
    border: 1px solid #eee;
    }

    .active-tab {
    background-color: #f2f4f8;
    font-weight: 500;
    }
    .blacks {
        color: white !important;
    }
</style>
  