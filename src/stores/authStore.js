import { defineStore } from "pinia";
import { authService } from "@/services/firebase";
import { ADMIN_EMAILS } from "@/utils/constants";
import router from "../router/index";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    authModalMessage: ''
  }),
  getters: {
    currentUserEmail: (state) => state.user ? state.user.email : null,
    isLoggedIn: (state) => state.isAuthenticated,
    isAdmin: (state) => {
      if (!state.user || !state.user.email) return false;
      return ADMIN_EMAILS.includes(state.user.email);
    }
  },
  actions: {
    setUser(user) {
      this.user = user;
      this.isAuthenticated = !!user;
    },
    setAuthModalMessage(message) {
      this.authModalMessage = message;
    },

    async registerUser(email, password) {
      const result = await authService.register(email, password);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.user;
    },

    async loginUser(email, password) {
      const result = await authService.login(email, password);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.user;
    },

    async logoutUser() {
      const result = await authService.logout();
      if (result.success) {
        router.push({ name: 'Login' });
      }
    },

    subscribeToAuthState() {
      return authService.onAuthStateChange((user) => {
        this.setUser(user);
        if (user) {
          this.setAuthModalMessage(`¡Bienvenido! Has ingresado como: ${user.email}`);
          if (router.currentRoute.value.name === 'Login' || router.currentRoute.value.name === 'Register') {
            router.push({ name: 'Home' });
          }
        } else {
          this.setAuthModalMessage('');
        }
      });
    }
  }
});