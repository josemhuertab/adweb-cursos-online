// AdminCoursesManager.vue (Refactorizado)

<template>
  <v-card elevation="4" rounded="lg" class="mb-5">
    <v-card-text>
      
      <v-alert v-if="alertMessage" :type="alertType.includes('success') ? 'success' : (alertType.includes('danger') ? 'error' : 'info')" variant="tonal" class="mb-4" closable @click:close="clearAlert">
        {{ alertMessage }}
      </v-alert>

      <v-row align="end" class="mb-4">
        <v-col cols="12" sm="6" md="5" lg="6">
          <v-text-field 
            v-model="searchTerm" 
            label="Búsqueda por Código, Nombre o Descripción" 
            density="compact"
            hide-details
            clearable
            variant="outlined"
          >
            <template v-slot:prepend-inner>
              <v-icon>mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </v-col>
        
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-select 
            v-model="filterStatus" 
            :items="statusItems" 
            item-title="text" 
            item-value="value" 
            label="Filtrar por Estado" 
            density="compact"
            hide-details
            variant="outlined"
          />
        </v-col>
        
        <v-col cols="12" md="3" lg="3" class="text-md-right">
          <v-btn color="primary" @click="openAddModal" block prepend-icon="mdi-plus">
            Agregar Nuevo Curso
          </v-btn>
        </v-col>
      </v-row>

      <v-table class="align-middle rounded-lg elevation-1">
        <thead>
          <tr>
            <th class="text-left">Código</th>
            <th class="text-left">Nombre</th>
            <th class="text-left">Estado</th>
            <th class="text-left">Precio</th>
            <th class="text-left">Duración</th>
            <th class="text-left">Cupos</th>
            <th class="text-left">Inscritos</th>
            <th class="text-left">Asignados</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in filteredCourses" :key="course.id">
            <td>{{ course.code }}</td>
            <td class="font-weight-medium">{{ course.name }}</td>
            <td>
              <v-chip :color="statusColor(course.status)" label size="small">{{ getStatusText(course.status) }}</v-chip>
            </td>
            <td class="font-weight-bold">{{ currency(course.price) }}</td>
            <td>{{ course.duration }}</td>
            <td>{{ course.cupos }}</td>
            <td>{{ course.inscritos }}</td>
            <td style="max-width: 250px;">
              <div class="d-flex flex-wrap" style="gap: 4px;">
                <v-chip v-for="m in course.assignedMembers" :key="m" color="secondary" size="x-small">{{ m }}</v-chip>
              </div>
            </td>
            <td class="text-right">
              <v-btn variant="text" color="primary" size="small" class="mr-1" @click="editCourseRedirect(course)" icon="mdi-pencil"></v-btn>
              <v-btn variant="text" color="error" size="small" @click="confirmDeleteCourse(course)" icon="mdi-delete"></v-btn>
            </td>
          </tr>
          <tr v-if="filteredCourses.length === 0">
            <td colspan="9" class="text-center text-caption py-4">
              No se encontraron cursos con los filtros aplicados.
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-dialog v-model="addModalOpen" max-width="900" persistent>
        <v-card rounded="lg">
          <v-card-title class="bg-primary text-white d-flex align-center justify-space-between">
            <span>Agregar Nuevo Curso</span>
            <v-btn icon="mdi-close" variant="text" color="white" @click="closeAddModal"></v-btn>
          </v-card-title>
          
          <v-card-text class="pa-5">
            <v-form @submit.prevent="addCourseWithConfirmation">
              <v-row dense>
                
                <v-col cols="12" md="3">
                  <v-text-field label="Código" v-model="newCourse.code" required variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field label="Nombre" v-model="newCourse.name" required variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" md="5">
                  <v-text-field label="URL de Imagen" v-model="newCourse.imageUrl" required variant="outlined" density="comfortable" />
                </v-col>

                <v-col cols="12" md="3">
                  <v-select label="Estado" v-model="newCourse.status" :items="statuses" required variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field label="Cupos" type="number" v-model.number="newCourse.cupos" required min="0" variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field label="Inscritos" type="number" v-model.number="newCourse.inscritos" required min="0" variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field label="Duración" v-model="newCourse.duration" required variant="outlined" density="comfortable" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field label="Costo ($)" type="number" v-model.number="newCourse.price" required min="0" variant="outlined" density="comfortable" />
                </v-col>
                <v-col cols="12" md="6">
                  </v-col>

                <v-col cols="12">
                  <v-textarea label="Descripción" v-model="newCourse.description" rows="3" required variant="outlined" density="comfortable" />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          
          <v-divider />

          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn color="secondary" variant="text" @click="closeAddModal">Cancelar</v-btn>
            <v-btn color="primary" @click="addCourseWithConfirmation" prepend-icon="mdi-plus" :disabled="!isNewCourseValid">Agregar Curso</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useCoursesStore } from '@/stores/coursesStore';

export default {
  name: 'AdminCoursesManager',
  
  data() {
    return {
      searchTerm: '',
      filterStatus: '',
      statuses: ['disponible', 'en_revision', 'cerrado'],
      newCourse: { 
        code: '', name: '', status: 'disponible', price: 0, 
        duration: '', description: '', cupos: 0, inscritos: 0, imageUrl: '' 
      },
      addModalOpen: false,
      alertMessage: '',
      alertType: '',
    }
  },
  
  computed: {
    ...mapState(useCoursesStore, {
      allCourses: 'getCourses',
    }),
    
    // Lista de ítems para el v-select de estado (incluye 'Todos')
    statusItems() {
      return [
        { text: 'Todos', value: '' },
        { text: 'Disponible', value: 'disponible' },
        { text: 'En Revisión', value: 'en_revision' },
        { text: 'Cerrado', value: 'cerrado' },
      ];
    },

    // Validación simple para habilitar el botón de agregar
    isNewCourseValid() {
      return this.newCourse.code && this.newCourse.name && this.newCourse.duration && this.newCourse.description;
    },

    filteredCourses() {
      return this.allCourses.filter(course => {
        const matchesSearch = this.searchTerm 
          ? [course.code, course.name, course.description].some(field => 
              field && field.toLowerCase().includes(this.searchTerm.toLowerCase())
            ) 
          : true;
        
        const matchesStatus = this.filterStatus 
          ? course.status === this.filterStatus 
          : true;

        return matchesSearch && matchesStatus;
      });
    }
  },
  
  methods: {
    ...mapActions(useCoursesStore, ['addCourse', 'deleteCourse']),

    currency(val) {
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(val || 0)
    },
    
    statusColor(status) {
        switch (status) {
            case 'disponible': return 'success';
            case 'en_revision': return 'warning';
            case 'cerrado': return 'error';
            default: return 'secondary';
        }
    },

    getStatusText(status) {
        switch (status) {
            case 'disponible': return 'Disponible';
            case 'en_revision': return 'En Revisión';
            case 'cerrado': return 'Cerrado';
            default: return 'Desconocido';
        }
    },

    showAlert(message, type = 'alert-success') {
      this.alertMessage = message;
      this.alertType = type;
      setTimeout(() => this.clearAlert(), 5000);
    },
    clearAlert() {
      this.alertMessage = '';
      this.alertType = '';
    },

    openAddModal() {
      this.clearAlert();
      // Resetear el formulario al abrir
      this.newCourse = { code: '', name: '', status: 'disponible', price: 0, duration: '', description: '', cupos: 0, inscritos: 0, imageUrl: '' };
      this.addModalOpen = true;
    },
    closeAddModal() {
      this.addModalOpen = false;
    },

    async addCourseWithConfirmation() {
      if (!this.isNewCourseValid) {
        this.showAlert('❌ Por favor, complete todos los campos requeridos (Código, Nombre, Duración, Descripción).', 'alert-danger');
        return;
      }
      
      const confirmAdd = window.confirm(`¿Desea agregar el curso "${this.newCourse.name}" (Costo: ${this.currency(this.newCourse.price)}) a la base de datos?`);

      if (confirmAdd) {
        const courseData = {
          code: this.newCourse.code.trim(),
          name: this.newCourse.name.trim(),
          imageUrl: this.newCourse.imageUrl.trim() || 'https://picsum.photos/id/' + (Math.floor(Math.random() * 999) + 1) + '/800/600',
          cupos: Number(this.newCourse.cupos) || 0,
          inscritos: Number(this.newCourse.inscritos) || 0,
          duration: this.newCourse.duration.trim(),
          price: Number(this.newCourse.price) || 0,
          description: this.newCourse.description.trim(),
          status: this.newCourse.status || 'disponible',
          assignedMembers: [],
        };
        
        const result = await this.addCourse(courseData);
        
        if (result.success) {
          this.closeAddModal();
          this.showAlert(`✅ Curso "${this.newCourse.name}" agregado correctamente.`, 'alert-success');
        } else {
          this.showAlert(`❌ Error al agregar curso: ${result.error}`, 'alert-danger');
        }
      }
    },

    editCourseRedirect(course) {
      this.$router.push({ name: 'EditarCurso', params: { id: course.id } });
    },

    async confirmDeleteCourse(course) {
      this.clearAlert();
      
      const confirmDelete = window.confirm(`⚠️ ¿Desea realmente eliminar el curso "${course.name}"? Esta acción es irreversible.`);
      
      if (confirmDelete) {
        const result = await this.deleteCourse(course.id);
        
        if (result.success) {
          this.showAlert(`✅ Curso "${course.name}" eliminado correctamente.`, 'alert-success');
        } else {
          this.showAlert(`❌ Error al eliminar curso: ${result.error}`, 'alert-danger');
        }
      }
    }
  },

};
</script>

<style scoped>
/* Las clases de Vuetify como elevation-4 y rounded-lg manejan la presentación */
/* No es necesario un CSS específico si se usan las clases de utilidad */
</style>