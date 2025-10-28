// EditarCursoView.vue

<template>
  <div class="editar-curso-container">
    <v-container class="py-5">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold text-gradient">Editar Curso: {{ courseCache.name || 'Cargando...' }}</h1>
        <p class="lead text-muted">Modifica la información del curso</p>
      </div>
      
      <v-row justify="center">
        <v-col cols="12" lg="8">

          <v-alert v-if="alertMessage" :type="alertType.includes('success') ? 'success' : (alertType.includes('danger') ? 'error' : 'info')" variant="tonal" class="mb-3" closable @click:close="clearAlert">
            {{ alertMessage }}
          </v-alert>
          
          <v-alert v-if="loading || !courseCache.id" type="info" variant="tonal" class="text-center">
            Cargando datos del curso...
          </v-alert>
          <v-alert v-else-if="error || !course" type="error" variant="tonal">
            Curso no encontrado o error de carga: {{ error || 'ID de curso inválido.' }}
          </v-alert>
          
          <v-card v-else class="p-4" elevation="2">
            <v-form @submit.prevent="updateCourseWithConfirmation">
              <v-row class="g-3">
                
                <v-col cols="12" md="3">
                  <v-text-field label="Código" v-model="courseCache.code" required />
                </v-col>
                <v-col cols="12" md="5">
                  <v-text-field label="Nombre" v-model="courseCache.name" required />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select label="Estado" v-model="courseCache.status" :items="['disponible','en_revision','cerrado']" required />
                </v-col>
                
                <v-col cols="12" md="3">
                  <v-text-field label="Cupos" type="number" v-model.number="courseCache.cupos" required min="0" />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field label="Inscritos" type="number" v-model.number="courseCache.inscritos" required min="0" />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field label="Duración" v-model="courseCache.duration" required />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field label="Costo ($)" type="number" v-model.number="courseCache.price" required min="0" />
                </v-col>
                
                <v-col cols="12">
                  <v-text-field label="URL de Imagen" v-model="courseCache.imageUrl" />
                </v-col>
                
                <v-col cols="12">
                  <v-textarea label="Descripción" v-model="courseCache.description" rows="3" required />
                </v-col>
                
                <v-col cols="12" class="text-end mt-4">
                  <v-btn color="secondary" class="me-2" @click="$router.push({ name: 'Admin' })" prepend-icon="mdi-arrow-left">
                    Volver a Administración
                  </v-btn>
                  <v-btn color="primary" type="submit" prepend-icon="mdi-content-save">
                    Guardar Cambios
                  </v-btn>
                </v-col>

              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { useCoursesStore } from '@/stores/coursesStore';
import { computed, ref, watchEffect } from 'vue';

export default {
  name: 'EditarCursoView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useCoursesStore();
    
    const courseCache = ref({});
    const courseId = route.params.id;

    const alertMessage = ref('');
    const alertType = ref('');

    // Busca el curso en el store (reactivo)
    const course = computed(() => {
      // Usar getCourses del store
      return store.getCourses.find(c => c.id === courseId); 
    });

    // Carga los datos al iniciar o cuando el curso se actualiza en el store
    watchEffect(() => {
      if (course.value) {
        courseCache.value = JSON.parse(JSON.stringify(course.value)); // Clonar para edición
      }
    });

    const showAlert = (message, type = 'alert-success') => {
      alertMessage.value = message;
      alertType.value = type;
      setTimeout(() => clearAlert(), 5000);
    };
    const clearAlert = () => {
      alertMessage.value = '';
      alertType.value = '';
    };

    const updateCourseWithConfirmation = async () => {
      clearAlert();
      
      const updatedData = {
        code: courseCache.value.code.trim(),
        name: courseCache.value.name.trim(),
        imageUrl: courseCache.value.imageUrl.trim(),
        cupos: Number(courseCache.value.cupos) || 0,
        inscritos: Number(courseCache.value.inscritos) || 0,
        duration: courseCache.value.duration.trim(),
        price: Number(courseCache.value.price) || 0,
        description: courseCache.value.description.trim(),
        status: courseCache.value.status,
      };

      const result = await store.updateCourse(courseId, updatedData);

      if (result.success) {
        showAlert(`✅ Curso "${courseCache.value.name}" actualizado correctamente. Redirigiendo...`, 'alert-success');
        
        setTimeout(() => {
          router.push({ name: 'Admin' }); 
        }, 1500);

      } else {
        showAlert(`❌ Error al actualizar curso: ${result.error}`, 'alert-danger');
      }
    };
    
    return {
      courseCache,
      course,
      loading: computed(() => store.loading),
      error: computed(() => store.error),
      updateCourseWithConfirmation,
      alertMessage,
      alertType,
      clearAlert,
    }
  }
}
</script>

<style scoped>
.editar-curso-container {
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