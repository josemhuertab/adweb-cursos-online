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
/* * ATENCIÓN: Se eliminó todo el CSS global (*, body, #app, main)
 * que entraba en conflicto con el reset de Vuetify.
 * El v-app/v-main ahora controlan el layout y el fondo.
*/

/* UTILIDADES Y HELPERS DE COLOR (MANTENER SOLO SI SON ABSOLUTAMENTE NECESARIOS) */
.text-gradient {
  /* Se mantiene el gradiente de texto, ya que Vuetify no lo ofrece por defecto. */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* SCROLLBAR PERSONALIZADO (No conflictivo, se mantiene) */
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

/* ANIMACIONES GLOBALES (Se mantienen, si se usan en RouterView) */
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


/* Estados Focus, Shadows, Radius, Containers (¡ELIMINADOS!) */
/* Usa las clases y componentes de Vuetify en su lugar:
 * - Sombras: Usa clases como `elevation-5`.
 * - Radio: Usa `rounded` o `rounded-xl`.
 * - Focus: Vuetify maneja el focus en sus componentes (v-btn, v-text-field).
 * - Responsive: Usa `<v-container>`, `<v-row>`, `<v-col>` y sus props.
*/

/* Spinner (Mantener si no se usa el v-progress-circular de Vuetify) */
.spinner-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #667eea; /* Color secundario de tu tema */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Blur para modal (Se mantiene, es un helper para un estado global) */
body.modal-open main {
  filter: blur(3px);
}

.modal-backdrop.show {
  opacity: 0.5;
}
</style>