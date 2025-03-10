<template>
    <v-container>
        <div class="breadcrumbs">
            <router-link class="breadcrumb" to="/">Главная</router-link>
            <span class="separator">/</span>
            <span class="breadcrumb active">Корзина</span>
        </div>

        <v-row>
            <v-col cols="12" md="7">
                <v-card class="pa-4">
                    <v-card-title>
                        Продукт / Услуга:
                        <v-btn icon color="red" class="float-right">
                            <router-link to="/hosting" style="color: white !important;"><v-icon>mdi-delete</v-icon></router-link>
                        </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <div class="service-info">
                            <strong>Хостинг - Shared-10000</strong>
                            <span class="price clr2">1 месяц - {{ amount }} ₽</span>
                        </div>
                        <p class="clr1">Укажите домен</p>

                        <v-radio-group v-model="domainOption">
                            <v-radio label="Использовать свой домен:" value="own"></v-radio>
                            <v-text-field v-if="domainOption === 'own'" label="Укажите имя домена"></v-text-field>
                            <p v-if="domainOption === 'own'" class="text-caption">
                                У домена должны быть следующие name-сервера:<br>
                                ns1.hostora.ru, ns2.hostora.ru, ns3.hostora.ru
                            </p>
                            <v-radio label="Подобрать новое доменное имя:" value="new"></v-radio>
                            <v-text-field v-if="domainOption === 'new'" label="Введите имя домена"></v-text-field>
                            <v-btn v-if="domainOption === 'new'" color="primary">Проверить</v-btn>
                        </v-radio-group>
                    </v-card-text>
                </v-card>
            </v-col>
            
            <v-col cols="12" md="5">
                <v-card class="pa-4 blue lighten-5">
                    <v-card-title>К оплате:</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <div class="service-info">
                            <strong>Хостинг - Shared-10000</strong>
                            <span class="price">1 месяц - {{ amount }} ₽</span>
                        </div>
                        <v-text-field label="Введите промо-код, если он у вас есть" class="mt-2"></v-text-field>
                        <v-btn color="blue">Применить</v-btn>
                        <v-radio-group v-model="paymentMethod">
                            <v-radio label="Онлайн оплата картой" value="card"></v-radio>
                            <v-radio label="Банковский перевод (оплата по счету)" value="bank"></v-radio>
                        </v-radio-group>
                        <h3 class="font-weight-bold">Итого: {{ amount }} ₽</h3>
                        <v-btn :disabled="!paymentMethod" color="primary" block @click="payAndSaveBilling">Оплатить</v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const amount = ref(route.params.amount);
const domainOption = ref('own');
const paymentMethod = ref(null);
const router = useRouter()

const payAndSaveBilling = async () => {
  try {
    const token = localStorage.getItem("token");
    const payload = {
      status: "Не оплачено",
      maturitydate: "2025-05-01",
      invoicedate: new Date().toISOString().split("T")[0], 
      amount: amount.value 
    };

    const response = await axios.post("http://localhost:5000/billing", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("Создана запись billing c ID:", response.data.id);
    
    router.push("/billing");
  } catch (error) {
    console.error("Ошибка при отправке данных в billing:", error);
  }
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
.clr1 {
    color: #1565c0;
}
.clr2 {
    color: #002357;
}
.service-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
.price {
    font-weight: bold;
}
</style>
