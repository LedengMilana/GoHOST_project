import { createApp } from 'vue';
import App from './App.vue';
import "./styles/Tickets.css"
import "./styles/Style.css"
import "./styles/EditTickets.css"
import "./styles/Billing.css"
//import { createPinia } from 'pinia';
import pinia from './stores'; 
import router from './router';
import { registerPlugins } from '@/plugins';
import i18n from "./plugins/i18n";

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(i18n);
registerPlugins(app);

app.mount('#app');







