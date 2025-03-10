<template>
    <v-container>
        <v-row class="fill-height align-center justify-center">
            <!-- Изображение с информацией -->
            <v-col cols="12" md="5" class="d-flex justify-center align-center">
                <v-img src="@/assets/hosting.png" alt="Hosting image" />
            </v-col>

            <!-- Текстовое описание -->
            <v-col cols="12" md="7">
                <h1 class="font-weight-bold">{{ $t("hosting.title") }}</h1>
                <p class="mb-20">{{ $t("hosting.description1") }}</p>
                <p class="mb-20">{{ $t("hosting.description2") }}</p>
                <v-btn class="text-button mt-4 mx-auto d-block" variant="text" @click="scrollToSection">
                    {{ $t("hosting.button") }}
                </v-btn>
            </v-col>
        </v-row>

        <v-row class="d-flex justify-center mb-4">
            <v-col cols="12" ref="targetSection">
                <h1 class="font-weight-bold text-center">{{ $t("hosting.locationTitle") }}</h1>
                <p class="caption">{{ $t("hosting.locationDescription1") }}</p>
                <p class="caption">{{ $t("hosting.locationDescription2") }}</p>
            </v-col>
        </v-row>
        <!-- Карточки с тарифами -->
        <v-row class="d-flex justify-center">
            <v-col id="target-section" cols="12" md="3" v-for="plan in hostingPlans" :key="plan.id">
                <v-card :class="getCardClass(plan.id)" hover>
                    <v-card-item class="d-flex justify-center align-center">
                        <v-icon class="mr-2" size="32">mdi-cloud</v-icon>
                    </v-card-item>

                    <v-card-title class="d-flex justify-center align-center">{{ plan.name }}</v-card-title>

                    <v-card-title class="price">
                        <span class="display-1">{{ plan.price }} {{ $t("plans.currency") }}</span> / {{ $t("plans.perMonth") }}
                    </v-card-title>

                    <v-card-subtitle class="text-center">
                        <p class="caption">{{ $t("plans.perYear", { price: plan.annualPrice }) }}</p>
                        <p>{{ $t("plans.savings", { savings: plan.savings }) }}</p>
                    </v-card-subtitle>

                    <v-card-text>
                        <!-- Описание тарифа -->
                        <div class="text-center">
                            <p v-for="(feature, index) in plan.features" :key="index">{{ feature }}</p>
                        </div>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                        <v-btn color="primary" @click="orderPlan(plan.id)"><router-link class="link-to"
                                :to="`/basket/${plan.price}`">{{ $t("billing.order") }}</router-link></v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const targetSection = ref(null);
const { t } = useI18n();

const scrollToSection = () => {
    const section = document.getElementById("target-section");
    if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
};

const hostingPlans = computed(() => [
    {
        id: 1,
        name: t("plans.shared1000"),
        price: '100',
        annualPrice: '1000',
        savings: '200',
        features: [
            t("plans.features.space", { value: "1000 Mb" }),
            t("plans.features.ram", { value: "512 Mb" }),
            t("plans.features.sites", { value: "5" }),
            t("plans.features.databases"),
            t("plans.features.emails"),
            t("plans.features.backup"),
        ],
    },
    {
        id: 2,
        name: t("plans.shared10000"),
        price: '250',
        annualPrice: '2500',
        savings: '500',
        features: [
            t("plans.features.space", { value: "10 Gb" }),
            t("plans.features.ram", { value: "1536 Mb" }),
            t("plans.features.sites", { value: "10" }),
            t("plans.features.databases"),
            t("plans.features.emails"),
            t("plans.features.backup"),
        ],
    },
    {
        id: 3,
        name: t("plans.shared20000"),
        price: '320',
        annualPrice: '3200',
        savings: '640',
        features: [
            t("plans.features.space", { value: "20 Gb" }),
            t("plans.features.ram", { value: "2560 Mb" }),
            t("plans.features.sites", { value: "15" }),
            t("plans.features.databases"),
            t("plans.features.emails"),
            t("plans.features.backup"),
        ],
    },
    {
        id: 4,
        name: t("plans.shared30000"),
        price: '390',
        annualPrice: '3900',
        savings: '780',
        features: [
            t("plans.features.space", { value: "30 Gb" }),
            t("plans.features.ram", { value: "3072 Mb" }),
            t("plans.features.sites", { value: "20" }),
            t("plans.features.databases"),
            t("plans.features.emails"),
            t("plans.features.backup"),
        ],
    },
]);

const orderPlan = (id) => {
    console.log(`Выбран план с ID: ${id}`);
    // Логика оформления заказа
};

const getCardClass = (planId) => {
    return planId === 2 || planId === 4 ? 'blue-border' : '';
};
</script>


<style scoped>
.v-card {
    max-width: 300px;
    min-height: 400px;
}

.v-row {
    margin-bottom: 40px;
}

.v-card-title {
    font-size: 24px;
    color: #000;
    text-align: center;
    justify-content: center;
}

.v-card-subtitle {
    font-size: 20px;
    color: #333;
}

.v-card-text {
    font-size: 12px;
}

.v-btn {
    border-radius: 8px;
    font-size: 16px;
    text-decoration: none !important;
}

.v-img {
    max-width: 360px;
    height: auto;
}

h1 {
    font-size: 32px;
    margin-bottom: 20px;
}

p {
    font-size: 16px;
}

.caption {
    font-size: 16px;
    color: #333;
    margin-bottom: 8px;
}

.price {
    color: #1565c0;
    text-align: center;
}

.blue-border {
    border: 1px solid #1565c0;
}

.link-to {
    text-decoration: none;
    color: #1565c0;
}
[targetSection] {
    scroll-margin-top: 80px;
}
</style>