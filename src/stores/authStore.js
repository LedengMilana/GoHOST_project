import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
    isLoggedIn: false,
    error: null,
  }),
  actions: {
    async checkAuth() {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        this.token = null;
        this.user = null;
        this.isLoggedIn = false;
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/auth/userinfo", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        this.token = storedToken;
        this.user = response.data;
        this.isLoggedIn = true;
      } catch (err) {
        console.warn("Не удалось получить данные пользователя:", err);
        localStorage.removeItem("token");
        this.token = null;
        this.user = null;
        this.isLoggedIn = false;
      }
    },

    logout() {
      localStorage.removeItem("token");
      this.token = null;
      this.user = null;
      this.isLoggedIn = false;
    },
  },
});
