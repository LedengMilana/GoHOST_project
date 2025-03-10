<template>
  <div class="container">

    <div class="nav-bar">
      <div class="account">
        <img src="../assets/logo-primary.png" alt="" class="w-80 h-100 mx-auto d-block">
      </div>
      <v-list class="custom-list">
        <v-list-item to="/account">
          <v-icon size="24" class="mr-1">mdi-home</v-icon>
          {{ $t("navbar.account") }}
        </v-list-item>
        <v-list-item to="/tickets">
          <v-icon size="24" class="mr-1">mdi-comment-account-outline</v-icon>
          {{ $t("ticket.name") }}
        </v-list-item>
        <v-list-item to="/billing">
          <v-icon size="24" class="mr-1">mdi-receipt-text-check-outline</v-icon>
          {{ $t("billing.name") }}
        </v-list-item>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-icon size="24" class="mr-1">mdi-cube</v-icon>{{ $t("navbar.projects") }}
            </v-list-item>
          </template>
        </v-list-group>

        <v-list-item>
          <v-icon size="24" class="mr-1">mdi-list-box</v-icon>
          {{ $t("navbar.allservice") }}
        </v-list-item>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-icon size="24" class="mr-1">mdi-cloud-print-outline</v-icon>
              {{ $t("navbar.hosting") }}
            </v-list-item>
          </template>
          <v-list-item>{{ $t("navbar.review") }}</v-list-item>
          <v-list-item>{{ $t("navbar.lPlesk") }}</v-list-item>
          <v-list-item>{{ $t("navbar.orderServ") }}</v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-icon size="24" class="mr-1">mdi-domain</v-icon>
              {{ $t("navbar.domains") }}
            </v-list-item>
          </template>
          <v-list-item>{{ $t("navbar.review") }}</v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-icon size="24" class="mr-1">mdi-dns-outline</v-icon>
              DNS
            </v-list-item>
          </template>
          <v-list-item>{{ $t("navbar.review") }}</v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-icon size="24" class="mr-1">mdi-shield-key-outline</v-icon>
              {{ $t("navbar.ssl") }}
            </v-list-item>
          </template>
          <v-list-item>{{ $t("navbar.review") }}</v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-icon size="24" class="mr-1">mdi-cloud-upload-outline</v-icon>
              {{ $t("navbar.cloudserver") }}
            </v-list-item>
          </template>
          <v-list-item>{{ $t("navbar.review") }}</v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <v-icon size="24" class="mr-1">mdi-cog-outline</v-icon>{{ $t("navbar.management") }}
            </v-list-item>
          </template>
          <v-list-item>
            <v-icon size="24" class="mr-1">mdi-account-group</v-icon>
            {{ $t("navbar.emplteams") }}
          </v-list-item>
          <v-list-item>
            <v-icon size="24" class="mr-1">mdi-account-lock</v-icon>
            {{ $t("navbar.roles") }}
          </v-list-item>
          <v-list-item>
            <v-icon size="24" class="mr-1">mdi-tune</v-icon>
            {{ $t("navbar.profile") }}
          </v-list-item>
        </v-list-group>
      </v-list>
    </div>

    <div class="cover">
      <div class="header">
        <v-btn class="header-btns">
          {{ $t("header.services") }}
        </v-btn>
        <v-btn class="header-btns">
          {{ $t("header.offers") }}
        </v-btn>
        <template v-if="authStore.isLoggedIn">
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-account</v-icon>
            <span class="mr-4">{{ authStore.user?.name }}</span>
            <v-btn text @click="handleLogout">
              <v-icon size="24" class="mr-1">mdi-exit-to-app</v-icon>
            </v-btn>
          </div>
        </template>
        <template v-else>
          <v-btn class="login-btn" to="/login">
            {{ $t("header.logreg") }}
          </v-btn>
        </template>
        <v-menu v-model="menuVisible">
          <template v-slot:activator="{ props }">
            <v-btn class="m-edit v-btn v-btn--elevated" color="primary" v-bind="props">
              <v-icon size="24">mdi-translate</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(item, index) in languageItems" :key="index" @click="changeLanguage(item.code)">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>


<script setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import axios from "axios"
import { useAuthStore } from '@/stores/authStore'

const { locale } = useI18n();
const languageItems = [
  { code: 'en', title: 'English' },
  { code: 'ru', title: 'Русский' }
];

const currentLanguage = ref(locale.value === 'en' ? 'English' : 'Русский');
const menuVisible = ref(false);

const changeLanguage = (languageCode) => {
  locale.value = languageCode; 
  currentLanguage.value = languageCode === 'en' ? 'English' : 'Русский'; // Обновляем текст на кнопке
};

const authStore = useAuthStore()
const router = useRouter()
const isLoggedIn = ref(false)
const userName = ref('')     

onMounted(() => {
  authStore.checkAuth()
})

function handleLogout() {
  authStore.logout()
}

</script>

<style scoped>
</style>