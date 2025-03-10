<template>
    <v-container>
        <div class="breadcrumbs">
            <router-link class="breadcrumb" to="/">{{ $t("breadcrumb.homep") }}</router-link>
            <span class="separator">/</span>
            <span class="breadcrumb active">{{ $t("breadcrumb.basket") }}</span>
        </div>

        <v-row>
            <v-col cols="12" md="7">
                <v-card class="pa-4">
                    <v-card-title>
                        {{ $t("order.productService") }}:
                        <v-btn icon color="red" class="float-right">
                            <router-link to="/hosting"
                                style="color: white !important;"><v-icon>mdi-delete</v-icon></router-link>
                        </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <div class="service-info">
                            <strong>{{ $t("order.hostingPlan", { plan: "Shared-10000" }) }}</strong>
                            <span class="price clr2">{{ $t("order.price", { amount: amount }) }}</span>
                        </div>
                        <p class="clr1">{{ $t("order.enterDomain") }}</p>

                        <v-radio-group v-model="domainOption">
                            <v-radio :label="$t('order.useOwnDomain')" value="own"></v-radio>
                            <v-text-field v-if="domainOption === 'own'"
                                :label="$t('order.enterDomainName')"></v-text-field>
                            <p v-if="domainOption === 'own'" class="text-caption">
                                {{ $t("order.nameServers") }}<br>
                                ns1.hostora.ru, ns2.hostora.ru, ns3.hostora.ru
                            </p>
                            <v-radio :label="$t('order.pickNewDomain')" value="new"></v-radio>
                            <v-text-field v-if="domainOption === 'new'"
                                :label="$t('order.enterDomainName')"></v-text-field>
                            <v-btn v-if="domainOption === 'new'" color="primary">{{ $t("order.check") }}</v-btn>
                        </v-radio-group>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="5">
                <v-card class="pa-4 blue lighten-5">
                    <v-card-title>{{ $t("payment.toPay") }}</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <div class="service-info">
                            <strong>{{ $t("payment.hostingPlan", { plan: "Shared-10000" }) }}</strong>
                            <span class="price">{{ $t("payment.price", { amount: amount }) }}</span>
                        </div>
                        <v-text-field :label="$t('payment.promoCode')" class="mt-2"></v-text-field>
                        <v-btn color="blue">{{ $t("payment.apply") }}</v-btn>
                        <v-radio-group v-model="paymentMethod">
                            <v-radio :label="$t('payment.onlineCard')" value="card"></v-radio>
                            <v-radio :label="$t('payment.bankTransfer')" value="bank"></v-radio>
                        </v-radio-group>
                        <h3 class="font-weight-bold">{{ $t("payment.total", { amount: amount }) }}</h3>
                        <v-btn :disabled="!paymentMethod" color="primary" block
                            @click="payAndSaveBilling">{{ $t("payment.pay") }}</v-btn>
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
import { useI18n } from 'vue-i18n';

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
