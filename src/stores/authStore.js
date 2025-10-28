import {defineStore} from "pinia";
import { auth } from "@/firebase/config";
import {createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged } from "firebase/auth";
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
      const adminEmails = ['admin@adweb.com', 'administrador@adweb.com', 'usuario1@mitienda.com'];
      return adminEmails.includes(state.user.email);
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
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential;
      } catch (error) {
        console.error('Registration error:', error.message);
        throw error;
      }
    },

    async loginUser(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
      } catch (error) {
        console.error('Login error:', error.message);
        throw error;
      }
    },

    async logoutUser() {
      try {
        await signOut(auth);
        router.push({ name: 'Login' });
      } catch (error) {
        console.error('Logout error:', error.message);
      }
    },

    subscribeToAuthState() {
      onAuthStateChanged(auth, (user) => {
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