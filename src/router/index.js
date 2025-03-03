import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "../layouts/default.vue"; 
import Tickets from "../pages/Tickets.vue";
import EditTicket from "../pages/EditTicket.vue";
import BillingTable from "../pages/BillingTable.vue";
import HostingRate from "../pages/HostingRate.vue";

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: 'tickets', component: Tickets },
      { path: 'edit-ticket/:id', component: EditTicket, props: true },
      { path: 'billing', component: BillingTable },
      { path: 'hosting', component: HostingRate}
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
