<template>
  <v-container class="dashboard-container">
    <div class="breadcrumbs">
      <router-link class="breadcrumb" to="/">{{ $t("breadcrumb.homep") }}</router-link>
      <span class="separator">/</span>
      <span class="breadcrumb active">{{ $t("breadcrumb.account") }}</span>
    </div>

    <div class="d-flex justify-md-space-between mb-2">
      <h2 class="h2-dark-blue">{{ $t("navbar.account") }}</h2>
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

    <hr class="mb-2">
    <v-row>
      <v-col v-for="(card, index) in cards" :key="index" cols="12" sm="6" md="4">
        <div class="card" @click="goTo(card.route)">
          <div class="card-header">
            <span>{{ card.title }}</span>
            <div style="display: flex; gap: 4px;">
              <span v-if="card.count" class="badge">{{ card.count }}</span>
              <span v-else-if="card.count == 0" class="badge">{{ 0 }}</span>
              <span v-if="card.count2 !== undefined" class="badge2">{{ card.count2 }}</span>
              <span v-else-if="card.count && card.title != 'БАЛАНС'" class="badge2">{{ card.count }}</span>
            </div>
          </div>
          <p class="card-description">{{ card.description }}</p>
          <div class="card-icon" :class="card.icon"></div>
          <v-btn v-if="card.button" class="btn-fill">{{ card.button }}</v-btn>
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <div class="card dns-card">
          <div class="card-header">
            <span>DNS</span>
          </div>
          <p class="card-description">{{ $t("cards.ddns") }}</p>
          <div class="card-icon icon-dns"></div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter()
const menuVisible = ref(false);

const rawCards = ref([
    { key: "services", count: "0", description: "Обзор всех продуктов и услуг.", icon: "icon-services" },
    { key: "cloudserver", count: "0", description: "Гибкие виртуальные машины.", icon: "icon-cloud" },
    { key: "domains", count: "0", description: "Ваши уникальные адреса.", icon: "icon-domains" },
    { key: "billing", count: "0", count2: 0, description: "Финансовые операции и оплата.", icon: "icon-billing", route: "/billing" },
    { key: "tickets", count: "0", count2: 0, description: "Отслеживание запросов в поддержку.", icon: "icon-tickets", route: "/tickets" },
    { key: "balance", description: "Остаток: 0.0 руб.", icon: "icon-balance", button: "Пополнить" }
]);

// Динамически переводим заголовки и описания
const cards = computed(() =>
    rawCards.value.map(card => ({
        ...card,
        title: t(`cards.${card.key}`), // Перевод заголовка
        description: t(`cards.d${card.key}`, card.description), // Перевод описания, если оно есть
        button: card.button ? t("cards.replenish") : undefined
    }))
);

onMounted(async () => {
  try {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      return router.push("/login");
    }

    const userCheck = await axios.get("http://localhost:5000/auth/userinfo", {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    });
    console.log("Ответ от /account:", userCheck.data);

    const billingResp = await axios.get("http://localhost:5000/billing", {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    });
    const billingCard = rawCards.value.find(c => c.key === "billing");
    if (billingCard) {
      billingCard.count = billingResp.data.length;
      billingCard.count2 = 0; 
    }

    const ticketsResp = await axios.get("http://localhost:5000/tickets", {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    });
    let openCount = 0;
    let closedCount = 0;

    ticketsResp.data.forEach(ticket => {
      if (ticket.status === "Open" || ticket.status === "Активный") {
        openCount++;
      } else if (ticket.status === "Closed") {
        closedCount++;
      }
    });

    const ticketsCard = rawCards.value.find(c => c.key === "tickets");
    if (ticketsCard) {
      ticketsCard.count = openCount;
      ticketsCard.count2 = closedCount;
    }
  } catch (error) {
    console.error("Ошибка при загрузке:", error);
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      router.push("/login");
    }
  }
});
function goTo(route) {
  if (!route) return
  router.push(route)
}
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

.h2-dark-blue {
  color: #002357;
  font-weight: bold;
}

.separator {
  margin: 0 8px;
}

.dashboard-container {
  padding: 20px;
  min-height: 100vh;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  position: relative;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  min-height: 250px;
  overflow: hidden;
  transition: transform 0.5s ease-in-out;
  border: 1px solid #fff;
}

.card:hover {
  cursor: pointer;
  border: 1px solid #1565c0;
  box-shadow: 0px 22px 15px rgba(0, 0, 0, 0.1);
}

.card:hover .card-icon {
  transform: scale(1.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.badge {
  background: #8DBBFF;
  color: #fff;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 14px;
}

.badge2 {
  background: #AAAEB3;
  color: #fff;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 14px;
}

.card-description {
  margin-top: 10px;
  font-size: 14px;
  color: #555;
}

.card-icon {
  position: absolute;
  bottom: -12px;
  right: -19px;
  width: 100px;
  height: 100px;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 1;
  transition: transform 0.3s ease-in-out;
}

.icon-services {
  background-image: url('../assets/services.png');
}

.icon-cloud {
  background-image: url('../assets/cloud.png');
}

.icon-domains {
  background-image: url('../assets/domains.png');
}

.icon-billing {
  background-image: url('../assets/billing.png');
}

.icon-tickets {
  background-image: url('../assets/tickets.png');
}

.icon-balance {
  background-image: url('../assets/balance.png');
}

.icon-dns {
  background-image: url('../assets/dns.png');
}

.btn-fill {
  width: 100%;
  background: #f26522;
  color: white;
  border-radius: 6px;
  margin-top: 10px;
}
</style>