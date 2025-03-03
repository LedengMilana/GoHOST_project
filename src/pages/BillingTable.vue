<template>
  <v-container class="table-container">
    <v-card class="custom-table">
      <v-card-title class="d-flex justify-space-between pa-4">
        <div class="d-flex align-center">
          <v-icon size="24" class="mr-2">mdi-file-multiple</v-icon>
          <h2 class="font-weight-bold">{{ $t("billing.name") }}</h2>
        </div>
        <div class="search-container">
          <v-text-field v-model="search" density="compact" variant="solo-filled" hide-details
            prepend-inner-icon="mdi-magnify" class="search-input flex-grow-1"></v-text-field>

           <!-- v-menu с v-model для контроля отображения -->
           <v-menu v-model="menuVisible">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" class="ml-2 align-center" v-bind="props">
                {{ $t("billing.order") }}
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="selectOption('Хостинг')">
                <v-list-item-title>{{ $t("billing.hosting") }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="selectOption('Домены')">
                <v-list-item-title>{{ $t("billing.domens") }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="selectOption('VPS')">
                <v-list-item-title>{{ $t("billing.vps") }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="selectOption('SSL')">
                <v-list-item-title>{{ $t("billing.ssl") }}</v-list-item-title>
              </v-list-item>
          </v-list>
          </v-menu>


        </div>
      </v-card-title>

      <!-- Таблица -->
      <v-data-table v-model:sort-by="sortBy" :headers="headers" :items="ticketsStore.tickets" :search="search"
        class="elevation-1" density="comfortable" item-key="id" :items-per-page="5">
        <template v-slot:item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" dark rounded="sm">
            {{ item.status }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="editTicket(item)">
            <v-icon size="24" class="m-edit">mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTicketsStore } from "../stores/ticketStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";



const { t } = useI18n();
const ticketsStore = useTicketsStore();
const dialog = ref(false);
const router = useRouter();
const search = ref("");
const sortBy = ref([{ key: "id", order: "asc" }]);

const menuVisible = ref(false); // Состояние меню
const selectOption = (option) => {
  console.log(`Выбрана опция: ${option}`);
  menuVisible.value = false; 
  if (option === 'Хостинг') {
    router.push('/hosting'); 
  }
};


onMounted(() => {
  ticketsStore.loadTickets();
});

const headers = computed(() => [
  { title: t("table.id"), key: "id", sortable: true },
  { title: t("table.status"), key: "status", sortable: true },
  { title: t("table.maturitydate"), key: "maturitydate", sortable: true },
  { title: t("table.invoicedate"), key: "invoicedate", sortable: true },
  { title: t("table.payment"), key: "payment", sortable: true }
]);

const getStatusColor = (status) => {
  return ticketsStore.getStatusColor(status);
};

const translatedDepartments = computed(() =>
  ticketsStore.departments.map(dep => t(dep))
);

const translatedServices = computed(() =>
  ticketsStore.services.map(service => t(service))
);

const translatedPriorities = computed(() =>
  ticketsStore.priorities.map(priority => t(priority))
);




</script>

<style scoped></style>
