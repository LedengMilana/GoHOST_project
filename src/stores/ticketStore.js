import { defineStore } from "pinia";
import {
  fetchTickets,
  createTicket,
  getTicketById,
  updateTicket as apiUpdateTicket,
  deleteTicket,
  fetchSingleTicket 
} from "../api/ticketApi";
import axios from "axios"

export const useTicketsStore = defineStore("tickets", {
  state: () => ({
    tickets: [],
    loading: false,
    error: null,

    departments: [
      "departments.support",
      "departments.sales",
      "departments.management",
    ],
    services: [
      "services.none",
      "services.api_support",
      "services.integration",
      "services.billing",
    ],
    priorities: ["priorities.low", "priorities.medium", "priorities.high"],

    user: {
      name: "Милана Леденгская",
      email: "ledengmila04@gmail.com",
    },
  }),
  actions: {
    setUser(newUserData) {
      this.user = { ...this.user, ...newUserData };
    },

    async loadTickets() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetchTickets();
        console.log("Ответ сервера:", response);
        this.tickets = response;
      } catch (error) {
        this.error = "Ошибка при загрузке тикетов";
      } finally {
        this.loading = false;
      }
    },

    async createTickets(ticketData) {
      try {
        const result = await createTicket(ticketData);
        if (result && result.id) {
          this.tickets.push({
            ...ticketData,
            id: result.id,
            status: ticketData.status || "Open",
          });
        }
      } catch (error) {
        console.error("Ошибка при создании тикета:", error);
      }
    },

    getTicketById(id) {
      return this.tickets.find((ticket) => ticket.id === id) || null;
    },

    async fetchTicketById(id) {
      try {
        const ticket = await fetchSingleTicket(id);
        return ticket;
      } catch (error) {
        console.error("Ошибка при загрузке одного тикета:", error);
        return null;
      }
    },

    async updateTicket(id, updatedData) {
      try {
        const result = await apiUpdateTicket(id, updatedData);
        if (result && result.changes) {
          const ticketIndex = this.tickets.findIndex(
            (ticket) => ticket.id === id
          );
          if (ticketIndex !== -1) {
            this.tickets[ticketIndex] = {
              ...this.tickets[ticketIndex],
              ...updatedData,
            };
          }
        }
      } catch (error) {
        console.error("Ошибка при обновлении тикета:", error);
      }
    },

    async removeTicket(id) {
      try {
        const result = await deleteTicket(id);
        if (result && result.changes) {
          this.tickets = this.tickets.filter((ticket) => ticket.id !== id);
        }
      } catch (error) {
        console.error("Ошибка при удалении тикета:", error);
      }
    },

    async addComment(ticketId, commentText, attachment) {
      try {
        const response = await axios.post(
          `http://localhost:5000/tickets/${ticketId}/comments`, 
          {
            comment_text: commentText,
            attachment: attachment || null, 
          }
        );
        
        if (response.data && response.data.comment_id) {
          return {
            id: response.data.comment_id,
            message: commentText,
            date: new Date().toISOString(),
            attachments: attachment ? [attachment] : [],
          };
        }
        return null;
      } catch (error) {
        console.error("Ошибка при добавлении комментария:", error);
        return null;
      }
    },

    async reloadTicketById(id) {
      const updated = await this.fetchTicketById(id);
    },

    getStatusColor(status) {
      const colors = {
        Green: "green",
        Red: "red",
        Hazel: "grey",
        Amber: "orange",
        Blue: "blue",
        Brown: "brown",
        Violet: "blue lighten-3",
        Gray: "gray",
        Open: "blue lighten-2",
        Closed: "gray darken-2",
      };
      return colors[status] || "blue";
    },
  },
});


// import { defineStore } from "pinia";
// import { fetchTickets } from "../api/ticketApi";


// export const useTicketsStore = defineStore("tickets", {
//   state: () => ({
//     tickets: [],
//     loading: false,
//     error: null,
//     departments: ["departments.support", "departments.sales", "departments.management"],
//     services: ["services.none", "services.api_support", "services.integration", "services.billing"],
//     priorities: ["priorities.low", "priorities.medium", "priorities.high"],
//     user: { 
//       name: "Милана Леденгская",
//       email: "ledengmila04@gmail.com",
//     },
//   }),
//   actions: {
//     setUser(newUserData) {
//       this.user = { ...this.user, ...newUserData };
//     },
//     async loadTickets() {
//       this.loading = true;
//       this.error = null;
//       try {
//         this.tickets = await fetchTickets();
//       } catch (error) {
//         this.error = t("errors.loadTickets");
//       } finally {
//         this.loading = false;
//       }
//     },
//     createTickets(elem) {
//       const date = new Date();
//       const year = date.getFullYear();
//       const month = date.getMonth() + 1;
//       const day = date.getDate();
//       const formattedDate = `${year}-${month}-${day}`;
//       this.tickets.push({...elem, id: this.tickets.length+1, status: "Blue", updated_at: formattedDate})
//     },
//     getTicketById(id) {
//       return this.tickets.find(ticket => ticket.id === id) || null;
//     }, 
//     updateTicket(id, updatedData) {
//       const ticketIndex = this.tickets.findIndex(ticket => ticket.id === id);
//       if (ticketIndex !== -1) {
//         this.tickets[ticketIndex] = { ...this.tickets[ticketIndex], ...updatedData, updated_at: new Date().toISOString() };
//       } else {
//         console.log(`Ticket with id ${id} not found`);
//       }
//     },

//     getStatusColor(status) {
//       const colors = {
//         Green: "green",
//         Red: "red",
//         Hazel: "grey",
//         Amber: "orange",
//         Blue: "blue",
//         Brown: "brown",
//         Violet: "blue lighten-3",
//         Gray: "gray",
//         Closed: "gray darken-2",
//       };
//       return colors[status] || "blue";
//     }
//   },
// });

