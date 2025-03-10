<template>
  <v-container class="table-container">
    <div class="breadcrumbs">
      <router-link class="breadcrumb" to="/">{{ $t("breadcrumb.homep") }}</router-link>
      <span class="separator">/</span>
      <span class="breadcrumb active">{{ $t("breadcrumb.billing") }}</span>
    </div>
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

      <v-data-table
        :items="billings"
        :headers="headers"
        item-key="id"
      >
        <template v-slot:header.status>Статус</template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="item.status === 'Open' ? 'blue' : 'green'">
            {{ item.status }}
          </v-chip>
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
import axios from "axios"


const { t } = useI18n();
const ticketsStore = useTicketsStore();
const dialog = ref(false);
const router = useRouter();
const search = ref("");
const sortBy = ref([{ key: "id", order: "asc" }]);
const billings = ref([]);

function loadBilling() {
  const token = localStorage.getItem("token");
  axios.get("http://localhost:5000/billing", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
    .then(response => {
      billings.value = response.data;
    })
    .catch(err => {
      console.error("Ошибка при загрузке billing:", err);
    });
}

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
  loadBilling()
});

const headers = computed(() => [
  { title: t("table.id"), key: "id", sortable: true },
  { title: t("table.status"), key: "status", sortable: true },
  { title: t("table.maturitydate"), key: "maturitydate", sortable: true },
  { title: t("table.invoicedate"), key: "invoicedate", sortable: true },
  { title: t("table.payment"), key: "amount", sortable: true }
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

<style scoped>
  .breadcrumbs {
      display: flex;
      align-items: center;
      font-size: 14px;
      margin-bottom: 16px;
  }
  .breadcrumb {
      color: #1565c0;
      text-decoration: none;
  }
  .breadcrumb.active {
      color: #002357;
      font-weight: bold;
  }
  .separator {
      margin: 0 8px;
  }
</style>
