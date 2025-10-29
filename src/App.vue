<template>
  <v-app>
    <NavBar v-if="showNavBar" />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from './components/NavBar.vue'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'App',
  components: {
    NavBar
  },
  computed: {
    showNavBar() {
      const hiddenRoutes = ['/login', '/registro']
      return !hiddenRoutes.includes(this.$route.path)
    }
  },
  created() {
    const authStore = useAuthStore();
    authStore.subscribeToAuthState();
  }
}
</script>

<style>
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>