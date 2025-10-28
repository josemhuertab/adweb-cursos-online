// AdminView.vue

<template>
  <div class="admin-container">
    <v-container class="py-5">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold text-gradient">Administración de Cursos</h1>
        <p class="lead text-muted">Gestiona los cursos de la plataforma</p>
      </div>
      
      <v-row>
        <v-col cols="12">
          
          <v-alert v-if="loading" type="info" variant="tonal" class="text-center">
            <v-progress-circular indeterminate size="20" class="me-2"></v-progress-circular>
            Cargando cursos desde Firebase en tiempo real...
          </v-alert>

          <v-alert v-else-if="error" type="error" variant="tonal">
            Error al cargar cursos: {{ error }}
          </v-alert>
          
          <AdminCoursesManager v-else /> 

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import AdminCoursesManager from '@/components/AdminCoursesManager.vue';
import { useCoursesStore } from '@/stores/coursesStore';
import { onMounted, onUnmounted } from 'vue';

export default {
  name: 'AdminView',
  components: { AdminCoursesManager },

  setup() {
    const coursesStore = useCoursesStore();
    let unsubscribe = null; 

    onMounted(() => {
      unsubscribe = coursesStore.subscribeToCourses();
    });

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
    });

    return {
      // Se expone el estado para mostrar mensajes de carga y error
      loading: coursesStore.loading, 
      error: coursesStore.error, 
    }
  },
};
</script>

<style scoped>
.admin-container {
  min-height: calc(100vh - 76px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>