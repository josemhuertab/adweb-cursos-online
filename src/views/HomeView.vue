<template>
  <div class="home-container">
    <v-container class="py-4">
      <div class="d-flex align-center justify-space-between mb-4">
        <div>
          <h1 class="h3 text-gradient mb-1">Inicio</h1>
          <p class="text-dark mb-0">Gestiona y explora los cursos de ADWEB Online</p>
        </div>
      </div>

      <AdminCoursesManager
        v-if="role === isAdmin"
        :courses="courses"
        @courses-change="courses"
      />

      <UserCoursesList
        v-else
        :courses="courses"
        :current-email="currentEmail"
      />
    </v-container>
  </div>
</template>

<script>
import AdminCoursesManager from '@/components/AdminCoursesManager.vue'
import UserCoursesList from '@/components/UserCoursesList.vue'
import { useCoursesStore } from '@/stores/coursesStore';
import { useAuthStore } from '@/stores/authStore';
import { onMounted, onUnmounted, computed } from 'vue';

export default {
  name: 'HomeView',
  components: { AdminCoursesManager, UserCoursesList },
  setup() {
    // 1. Inicializar Pinia Stores
    const coursesStore = useCoursesStore();
    const authStore = useAuthStore();
    let unsubscribe = null; 
    
    // 2. Iniciar y Detener Suscripción a Firebase
    onMounted(() => {
      // Iniciar la suscripción a cursos (onSnapshot) al montar el componente
      // Esto hará que el store se llene con los datos de Firebase en tiempo real.
      unsubscribe = coursesStore.subscribeToCourses();
    });

    onUnmounted(() => {
      // Desuscribirse cuando el componente se destruye
      if (unsubscribe) {
        unsubscribe();
      }
    });

    // 3. Obtener datos desde los stores
    const courses = computed(() => coursesStore.getCourses);
    const role = computed(() => authStore.role);
    const isAdmin = computed(() => authStore.isAdmin);
    const currentEmail = computed(() => authStore.currentUserEmail);

    return {
      // Datos de usuario desde authStore
      role,
      isAdmin,
      currentEmail,
      // Datos de Pinia Store (reactivos)
      courses,
      loading: computed(() => coursesStore.loading),
      error: computed(() => coursesStore.error),
    }
  },
  
  // Se eliminan los métodos y propiedades de data/created relacionados con localStorage y datos mock
  // ... (Se eliminan data, created, methods: seedInitialCourses, loadCourses, saveCourses, updateCourses, handleRoleChange)
}
  
</script setup>

<style scoped>
.home-container {
  min-height: calc(100vh - 76px);
  /* Mantenemos un fondo limpio */
  background: #f8f9fa; 
}

/* GRADIENTE Y COLOR MORADO */
.text-gradient {
  /* Aplicamos el gradiente morado/púrpura */
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); 
  
  /* CLAVE: Esto hace que el fondo (el gradiente) sea el color del texto */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* TAMAÑO Y FUENTE */
.h3.fw-bold { 
    font-family: 'Impact', sans-serif;
    font-size: 40px;
}

/* --- Estilos para el GRID (Necesario aquí) --- */
.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.gap-2 { gap: 0.5rem; }
</style>