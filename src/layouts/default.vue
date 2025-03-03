<template>
  <div class="container">

    <div class="nav-bar">
      <div class="account"></div>
      <v-list class="custom-list">
        <v-list-item to="/tickets">{{ $t("ticket.name") }}</v-list-item>
        <v-list-item to="/billing">{{ $t("billing.name") }}</v-list-item>
      </v-list>
    </div>

    <div class="cover">
      <div class="header">
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
</script>

<style scoped>
</style>