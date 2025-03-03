<template>
  <v-container class="mt-60">
    <v-row>
      <!-- Информация о тикете -->
      <v-col cols="12" md="4">
        <v-card class="ticket-card">
          <v-card-title>
            <v-chip :color="getStatusColor(ticket.status)" dark v-if="ticket">{{ ticket.status }}</v-chip>
          </v-card-title>

          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle v-if="ticket"><strong>{{ ticket.subject }} - {{ ticket.id
                }}</strong></v-list-item-subtitle>
                <v-divider></v-divider>

                <v-list-item-subtitle v-if="ticket">
                  <strong>{{ $t("table.department") }}:</strong> {{ ticket.department }}
                </v-list-item-subtitle>
                <v-divider></v-divider>

                <v-list-item-subtitle v-if="ticket">
                  <strong>{{ $t("table.sent") }}:</strong> {{ formatDate(ticket.created_at) }}
                </v-list-item-subtitle>
                <v-divider></v-divider>

                <v-list-item-subtitle v-if="ticket && isUpdated">
                  <strong>{{ $t("table.updated") }}:</strong> {{ formatDistance(ticket.updated_at) }}
                </v-list-item-subtitle>
                <v-divider v-if="ticket && isUpdated"></v-divider>

                <v-list-item-subtitle v-if="ticket">
                  <strong>{{ $t("table.priority") }}:</strong> {{ ticket.priority }}
                </v-list-item-subtitle>

              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-card-actions class="actions">
            <v-btn class="btn-reply" @click="toggleReplyForm">{{ $t("buttons.reply") }}</v-btn>
            <v-btn class="btn-close" @click="closeTicket">{{ $t("buttons.close") }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Форма для ответа-->
      <v-col cols="12" md="8">
        <v-expand-transition>
          <v-card class="reply-form" :style="showReplyForm ? { maxHeight: '600px' } : { maxHeight: '64px' }">
            <v-card-title>
              {{ $t("modal-answer.title") }}
              <!-- Кнопка для сворачивания/раскрытия -->
              <v-btn icon @click="toggleReplyForm">
                <v-icon>{{ showReplyForm ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field v-model="user.name" :label="$t('modal.name')" readonly />
                <v-text-field v-model="user.email" :label="$t('modal.email')" readonly />
                <v-textarea v-model="form.message" :label="$t('modal.message')" />

                <v-file-input v-model="form.attachments" :label="$t('modal.file')" accept="image/*,application/pdf"
                  multiple show-size outlined @change="handleFileChange" />
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-btn class="btn-confirm" @click="submitReply">{{ $t("buttons.submit") }}</v-btn>
              <v-btn class="btn-cancel" @click="cancelReply">{{ $t("buttons.cancel") }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-expand-transition>
      </v-col>

      <v-row justify="end">
        <v-col cols="12" md="8">
          <v-card class="reply-list">
            <v-card-title>{{ $t("ticket.answers") }}</v-card-title>
            <v-list>
              <v-list-item v-for="(reply, index) in replies" :key="index">
                <v-list-item-content>
                  <v-row class="m-0">
                    <v-col cols="9" class="message-content m-0 p-l-0">
                      <v-avatar class="message-avatar">
                        <v-icon>mdi-account</v-icon>
                      </v-avatar>
                      <div class="message-info">
                        <strong>{{ user.name }}</strong>
                        <div class="message-role">{{ $t("ticket.client") }}</div>
                      </div>
                    </v-col>
                    <v-col cols="3" class="m-0">
                      <span class="message-date">{{ formatReplyDate(reply.created_at) }}</span>
                    </v-col>
                  </v-row>
                  <div class="message-text">{{ reply.comment_text }}</div>

                  <div v-if="reply.attachments && reply.attachments.length">
                    <span>{{ $t("modal.att_file") }}:</span>
                    <ul>
                      <li v-for="(file, index) in reply.attachments" :key="index">
                        <a :href="file.url" target="_blank">{{ file.name }}</a>
                      </li>
                    </ul>
                  </div>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useTicketsStore } from "../stores/ticketStore";
import { format } from 'date-fns';
import { formatDistanceToNow } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

const route = useRoute();
const ticketsStore = useTicketsStore();
const ticket = ref(null);
const replies = ref([]);
const { locale } = useI18n();
const user = ticketsStore.user;

onMounted(async () => {
  const id = Number(route.params.id);
  const fetchedTicket = await ticketsStore.fetchTicketById(id);

  if (fetchedTicket) {
    ticket.value = { 
      ...fetchedTicket,
      priority: fetchedTicket.priority || "Medium"
    };

    replies.value = fetchedTicket.comments || [];
  } else {
    console.error("Тикет не найден");
  }
});

// Форма для ответа
const form = ref({
  message: "",
  attachments: [], 
});

// Состояние для отображения формы
const showReplyForm = ref(false);
const isUpdated = ref(false); // Флаг для отслеживания изменений


// Функции для кнопок

const toggleReplyForm = () => {
  showReplyForm.value = !showReplyForm.value; // Плавное появление/скрытие формы
};
const closeTicket = () => {
  ticket.value.status = "Closed";

  ticket.value.updated_at = new Date().toISOString();
  isUpdated.value = true; // Устанавливаем флаг обновления

  const fullData = {
    ...ticket.value,           
    status: "Closed",          
    updated_at: new Date(),   
  };
  ticketsStore.updateTicket(ticket.value.id, fullData);
};

const submitReply = async () => {
  if (form.value.message.trim() !== "") {
    await ticketsStore.addComment(
      ticket.value.id, 
      form.value.message,
      form.value.attachments
    );
    const updated = await ticketsStore.fetchTicketById(ticket.value.id);
    if (updated) {
      ticket.value = updated;
      replies.value = updated.comments || [];
    }
    form.value.message = "";
    form.value.attachments = [];
  }
};

const cancelReply = () => {
  form.value.message = "";
  form.value.attachments = [];
  console.log("Отмена ответа");
};

const formatDate = (dateString) => {
  if (!dateString) return 'Invalid date';  

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.log(`Invalid date format: ${dateString}`);  
    return 'Invalid date';  
  }
  const currentLocale = locale.value; 
  
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return date.toLocaleDateString(currentLocale, options);  
};

const formatDistance = (dateString) => {
  const date = new Date(dateString);
  const currentLocale = locale.value === 'ru' ? ru : enUS; 
  return formatDistanceToNow(date, { addSuffix: true, locale: currentLocale });
};

const getStatusColor = (status) => {
  return ticketsStore.getStatusColor(status); 
};

const formatReplyDate = (dateString) => {
  if (!dateString) return 'Invalid date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return format(date, 'dd-MM-yyyy (HH:mm)');
};

</script>
