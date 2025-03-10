<template>
  <v-container class="table-container">
    <div class="breadcrumbs">
      <router-link class="breadcrumb" to="/">{{ $t("breadcrumb.homep") }}</router-link>
      <span class="separator">/</span>
      <span class="breadcrumb active">{{ $t("breadcrumb.ticket") }}</span>
    </div>
    <v-card class="custom-table">
      <v-card-title class="d-flex justify-space-between pa-4">
        <div class="d-flex align-center">
          <v-icon size="32" class="mr-2">mdi-ticket-account</v-icon>
          <h2 class="font-weight-bold">{{ $t("table.title") }}</h2>
        </div>
        <div class="search-container">
          <v-text-field v-model="search" density="compact" variant="solo-filled" hide-details
            prepend-inner-icon="mdi-magnify" class="search-input flex-grow-1"></v-text-field>
          <v-btn color="primary" class="ml-2 align-center" @click="dialog = true">
            {{ $t("buttons.openTicket") }}
          </v-btn>
        </div>
      </v-card-title>

      <!-- Таблица -->
      <v-data-table v-model:sort-by="sortBy" :headers="headers" :items="ticketsStore.tickets" :search="search"
        class="elevation-1" density="comfortable">
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

    <!-- Модалка -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="modal-header">
          <span class="modal-title"> {{ $t("modal.title") }} </span>
          <v-btn icon class="close-btn" @click="dialog = false">
            <v-icon size="18" color="red">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="modal-text">
          <v-form ref="form">
            <div class="field-group">
              <label class="field-label">{{ $t("modal.name") }}:</label>
              <v-text-field v-model="ticket.name" variant="outlined" density="compact" class="v-input"></v-text-field>
            </div>
            <div class="field-group">
              <label class="field-label">{{ $t("modal.email") }}:</label>
              <v-text-field v-model="ticket.email" variant="outlined" density="compact"></v-text-field>
            </div>
            <div class="field-group">
              <label class="field-label">{{ $t("modal.topic") }}:</label>
              <v-text-field variant="outlined" v-model="ticket.subject" density="compact"></v-text-field>
            </div>

            <v-row>
              <v-col cols="6">
                <div class="field-group">
                  <label class="field-label">{{ $t("modal.department") }}:</label>
                  <v-select v-model="ticket.department" :items="translatedDepartments" variant="outlined"
                    density="compact"></v-select>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="field-group">
                  <label class="field-label">{{ $t("modal.service") }}:</label>
                  <v-select v-model="ticket.service" :items="translatedServices" variant="outlined"
                    density="compact"></v-select>
                </div>
              </v-col>
            </v-row>
            <div class="field-group">
              <label class="field-label">{{ $t("modal.priority") }}:</label>
              <v-select v-model="ticket.priority" :items="translatedPriorities" variant="outlined"
                density="compact"></v-select>
            </div>

            <div class="field-group">
              <label class="field-label">{{ $t("modal.message") }}:</label>
              <v-textarea variant="outlined" v-model="ticket.message" density="compact"></v-textarea>
            </div>
            <div class="field-group">
              <label class="field-label">{{ $t("modal.attachment") }}:</label>
              <v-file-input variant="outlined" v-model="ticket.attachment" density="compact"></v-file-input>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="modal-actions">
          <v-btn class="btn-cancel" color="default" variant="outlined" rounded="lg" @click="dialog = false">
            {{ $t("buttons.cancel") }}</v-btn>
          <v-btn class="btn-confirm" color="primary" variant="elevated" rounded="lg" @click="submitTicket">{{
            $t("buttons.submit") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
const search = ref("");
const sortBy = ref([{ key: "id", order: "asc" }]);


onMounted(() => {
  ticketsStore.loadTickets();
});

const headers = computed(() => [
  { title: t("table.id"), key: "id", sortable: true },
  { title: t("table.status"), key: "status", sortable: true },
  { title: t("table.updated"), key: "updated_at", sortable: true },
  { title: t("table.subject"), key: "subject", sortable: true },
  { title: t("table.department"), key: "department", sortable: true },
  { title: t("table.actions"), key: "actions", sortable: false }
]);

// Доступ к getStatusColor через хранилище
const getStatusColor = (status) => {
  return ticketsStore.getStatusColor(status); // Используем метод из хранилища
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

const ticket = ref({
  name: "",
  email: "",
  subject: "",
  department: t("departments.support"),
  service: "None",
  priority: t("priorities.medium"),
  message: "",
  attachment: null,
});

const submitTicket = () => {
  console.log("Тикет отправлен", ticket.value);
  ticketsStore.createTickets(ticket.value)
  dialog.value = false;
};

const router = useRouter();

const editTicket = (ticket) => {
  console.log("Редактирование тикета:", ticket.id); // Проверка
  const path = `/edit-ticket/${ticket.id}`;
  console.log("Переход по маршруту:", path);  // Выводим путь
  router.push(path);  // Используем полный путь
};

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
