<template>
  <div v-if="isLoading" class="auth-guard">
    <LoadingSpinner message="Verificando autenticación..." />
  </div>
  <div v-else-if="!isAuthenticated" class="auth-guard">
    <v-alert type="warning" variant="tonal">
      <v-alert-title>Acceso Restringido</v-alert-title>
      Debes iniciar sesión para acceder a esta página.
      <template v-slot:append>
        <v-btn 
          color="warning" 
          variant="tonal" 
          @click="redirectToLogin"
        >
          Iniciar Sesión
        </v-btn>
      </template>
    </v-alert>
  </div>
  <slot v-else />
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'AuthGuard',
  components: {
    LoadingSpinner
  },
  props: {
    requireAdmin: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const authStore = useAuthStore()
    const router = useRouter()

    const redirectToLogin = () => {
      router.push('/login')
    }

    return {
      isAuthenticated: authStore.isLoggedIn,
      isAdmin: authStore.isAdmin,
      isLoading: false,
      redirectToLogin
    }
  }
}
</script>

<style scoped>
.auth-guard {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 2rem;
}
</style>