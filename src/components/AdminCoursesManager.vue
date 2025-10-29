<template>
  <div class="admin-courses-manager">
    <v-card elevation="4" rounded="lg" class="admin-courses-manager__card">
      <v-card-text class="admin-courses-manager__content">
        
        <v-alert 
          v-if="alertMessage" 
          :type="alertType.includes('success') ? 'success' : (alertType.includes('danger') ? 'error' : 'info')" 
          variant="tonal" 
          class="admin-courses-manager__alert" 
          closable 
          @click:close="clearAlert"
        >
          {{ alertMessage }}
        </v-alert>

        <div class="admin-courses-manager__filters">
          <v-row align="end" class="mb-4">
            <v-col cols="12" sm="6" md="5" lg="6">
              <v-text-field 
                v-model="searchTerm" 
                label="Búsqueda por Código, Nombre o Descripción" 
                density="compact"
                hide-details
                clearable
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
              />
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
              <v-btn 
                color="primary" 
                @click="openAddModal" 
                block 
                prepend-icon="mdi-plus"
                class="admin-courses-manager__add-btn mb-2"
              >
                Agregar Nuevo Curso
              </v-btn>
              <v-btn 
                color="secondary" 
                @click="openManualAssignment" 
                block 
                prepend-icon="mdi-account-plus"
                class="admin-courses-manager__assign-btn"
              >
                Asignar Manualmente
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <v-data-table
          :headers="tableHeaders"
          :items="filteredCourses"
          :loading="loading"
          class="admin-courses-manager__table"
          item-key="id"
          :items-per-page="10"
          :search="searchTerm"
        >
          <template v-slot:item.name="{ item }">
            <div class="admin-courses-manager__course-name">
              <strong>{{ item.name }}</strong>
              <br>
              <small class="text-medium-emphasis">{{ item.code }}</small>
            </div>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip 
              :color="getStatusColor(item.status)" 
              label 
              size="small"
              class="admin-courses-manager__status-chip"
            >
              {{ getStatusText(item.status) }}
            </v-chip>
          </template>

          <template v-slot:item.price="{ item }">
            <span class="admin-courses-manager__price">
              {{ formatCurrency(item.price) }}
            </span>
          </template>

          <template v-slot:item.assignedMembers="{ item }">
            <div class="admin-courses-manager__members">
              <v-chip 
                v-for="member in item.assignedMembers.slice(0, 2)" 
                :key="member" 
                color="secondary" 
                size="x-small"
                class="admin-courses-manager__member-chip"
              >
                {{ member }}
              </v-chip>
              <v-chip 
                v-if="item.assignedMembers.length > 2"
                color="grey"
                size="x-small"
                class="admin-courses-manager__member-chip"
              >
                +{{ item.assignedMembers.length - 2 }}
              </v-chip>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="admin-courses-manager__actions">
              <v-btn
                variant="text"
                color="primary"
                size="small"
                icon="mdi-pencil"
                @click="editCourseRedirect(item)"
              />
              <v-btn
                variant="text"
                color="error"
                size="small"
                icon="mdi-delete"
                @click="confirmDeleteCourse(item)"
              />
            </div>
          </template>

          <template v-slot:no-data>
            <div class="admin-courses-manager__no-data">
              <v-icon size="48" color="grey">mdi-school-outline</v-icon>
              <p class="text-h6 mt-4">No hay cursos disponibles</p>
              <p class="text-body-2 text-medium-emphasis">
                Comienza agregando tu primer curso
              </p>
            </div>
          </template>
        </v-data-table>

        <v-dialog 
          v-model="addModalOpen" 
          max-width="900" 
          persistent
          class="admin-courses-manager__dialog"
        >
          <v-card rounded="lg">
            <v-card-title class="admin-courses-manager__dialog-header">
              <span>Agregar Nuevo Curso</span>
              <v-btn 
                icon="mdi-close" 
                variant="text" 
                color="white" 
                @click="closeAddModal"
              />
            </v-card-title>
            
            <v-card-text class="admin-courses-manager__dialog-content">
              <v-form @submit.prevent="addCourseWithConfirmation">
                <v-row dense>
                  <v-col cols="12" md="3">
                    <v-text-field 
                      label="Código" 
                      v-model="newCourse.code" 
                      required 
                      variant="outlined" 
                      density="comfortable" 
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field 
                      label="Nombre" 
                      v-model="newCourse.name" 
                      required 
                      variant="outlined" 
                      density="comfortable" 
                    />
                  </v-col>
                  <v-col cols="12" md="5">
                    <v-text-field 
                      label="URL de Imagen" 
                      v-model="newCourse.imageUrl" 
                      variant="outlined" 
                      density="comfortable" 
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-select 
                      label="Estado" 
                      v-model="newCourse.status" 
                      :items="statuses" 
                      required 
                      variant="outlined" 
                      density="comfortable" 
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field 
                      label="Cupos" 
                      type="number" 
                      v-model.number="newCourse.cupos" 
                      required 
                      min="0" 
                      variant="outlined" 
                      density="comfortable" 
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field 
                      label="Inscritos" 
                      type="number" 
                      v-model.number="newCourse.inscritos" 
                      required 
                      min="0" 
                      variant="outlined" 
                      density="comfortable" 
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field 
                      label="Duración" 
                      v-model="newCourse.duration" 
                      required 
                      variant="outlined" 
                      density="comfortable" 
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field 
                      label="Costo ($)" 
                      type="number" 
                      v-model.number="newCourse.price" 
                      required 
                      min="0" 
                      variant="outlined" 
                      density="comfortable" 
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                  </v-col>

                  <v-col cols="12">
                    <v-textarea 
                      label="Descripción" 
                      v-model="newCourse.description" 
                      rows="3" 
                      required 
                      variant="outlined" 
                      density="comfortable" 
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            
            <v-divider />

            <v-card-actions class="admin-courses-manager__dialog-actions">
              <v-spacer />
              <v-btn 
                color="secondary" 
                variant="text" 
                @click="closeAddModal"
              >
                Cancelar
              </v-btn>
              <v-btn 
                color="primary" 
                @click="addCourseWithConfirmation" 
                prepend-icon="mdi-plus" 
                :disabled="!isNewCourseValid"
              >
                Agregar Curso
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Manual Assignment Dialog -->
        <ManualAssignment 
          v-model="manualAssignmentOpen"
          @assignment-completed="handleAssignmentCompleted"
        />
        
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useCoursesStore } from '@/stores/coursesStore'
import { formatCurrency } from '@/utils/helpers'
import { COURSE_STATUS, COURSE_STATUS_LABELS, COURSE_STATUS_COLORS } from '@/utils/constants'
import ManualAssignment from '@/components/admin/ManualAssignment.vue'

export default {
  name: 'AdminCoursesManager',
  components: {
    ManualAssignment
  },
  
  data() {
    return {
      searchTerm: '',
      filterStatus: '',
      statuses: [COURSE_STATUS.AVAILABLE, COURSE_STATUS.UNDER_REVIEW, COURSE_STATUS.CLOSED],
      newCourse: { 
        code: '', 
        name: '', 
        status: COURSE_STATUS.AVAILABLE, 
        price: 0, 
        duration: '', 
        description: '', 
        cupos: 0, 
        inscritos: 0, 
        imageUrl: '' 
      },
      addModalOpen: false,
      manualAssignmentOpen: false,
      alertMessage: '',
      alertType: '',
      loading: false,
      tableHeaders: [
        { title: 'Curso', key: 'name', sortable: true },
        { title: 'Estado', key: 'status', sortable: true },
        { title: 'Precio', key: 'price', sortable: true },
        { title: 'Duración', key: 'duration', sortable: true },
        { title: 'Cupos', key: 'cupos', sortable: true },
        { title: 'Inscritos', key: 'inscritos', sortable: true },
        { title: 'Asignados', key: 'assignedMembers', sortable: false },
        { title: 'Acciones', key: 'actions', sortable: false, align: 'center' }
      ]
    }
  },
  
  computed: {
    ...mapState(useCoursesStore, {
      allCourses: 'getCourses',
    }),
    
    statusItems() {
      return [
        { text: 'Todos', value: '' },
        { text: 'Disponible', value: COURSE_STATUS.AVAILABLE },
        { text: 'En Revisión', value: COURSE_STATUS.UNDER_REVIEW },
        { text: 'Cerrado', value: COURSE_STATUS.CLOSED },
      ]
    },

    isNewCourseValid() {
      return this.newCourse.code && 
             this.newCourse.name && 
             this.newCourse.duration && 
             this.newCourse.description
    },

    filteredCourses() {
      return this.allCourses.filter(course => {
        const matchesSearch = this.searchTerm 
          ? [course.code, course.name, course.description].some(field => 
              field && field.toLowerCase().includes(this.searchTerm.toLowerCase())
            ) 
          : true
        
        const matchesStatus = this.filterStatus 
          ? course.status === this.filterStatus 
          : true

        return matchesSearch && matchesStatus
      })
    }
  },
  
  methods: {
    ...mapActions(useCoursesStore, ['addCourse', 'deleteCourse']),

    formatCurrency,
    
    getStatusColor(status) {
      return COURSE_STATUS_COLORS[status] || 'secondary'
    },

    getStatusText(status) {
      return COURSE_STATUS_LABELS[status] || 'Desconocido'
    },

    showAlert(message, type = 'alert-success') {
      this.alertMessage = message
      this.alertType = type
      setTimeout(() => this.clearAlert(), 5000)
    },
    
    clearAlert() {
      this.alertMessage = ''
      this.alertType = ''
    },

    openAddModal() {
      this.clearAlert()
      this.newCourse = { 
        code: '', 
        name: '', 
        status: COURSE_STATUS.AVAILABLE, 
        price: 0, 
        duration: '', 
        description: '', 
        cupos: 0, 
        inscritos: 0, 
        imageUrl: '' 
      }
      this.addModalOpen = true
    },
    
    closeAddModal() {
      this.addModalOpen = false
    },

    openManualAssignment() {
      this.clearAlert()
      this.manualAssignmentOpen = true
    },

    handleAssignmentCompleted(assignmentData) {
      this.showAlert(`Usuario ${assignmentData.userEmail} asignado exitosamente al curso "${assignmentData.course.name}"`, 'alert-success')
    },

    async addCourseWithConfirmation() {
      if (!this.isNewCourseValid) {
        this.showAlert('Por favor, complete todos los campos requeridos (Código, Nombre, Duración, Descripción).', 'alert-danger')
        return
      }
      
      const confirmAdd = window.confirm(`¿Desea agregar el curso "${this.newCourse.name}" (Costo: ${this.formatCurrency(this.newCourse.price)}) a la base de datos?`)

      if (confirmAdd) {
        const courseData = {
          code: this.newCourse.code.trim(),
          name: this.newCourse.name.trim(),
          imageUrl: this.newCourse.imageUrl.trim() || `https://picsum.photos/id/${Math.floor(Math.random() * 999) + 1}/800/600`,
          cupos: Number(this.newCourse.cupos) || 0,
          inscritos: Number(this.newCourse.inscritos) || 0,
          duration: this.newCourse.duration.trim(),
          price: Number(this.newCourse.price) || 0,
          description: this.newCourse.description.trim(),
          status: this.newCourse.status || COURSE_STATUS.AVAILABLE,
          assignedMembers: [],
        }
        
        const result = await this.addCourse(courseData)
        
        if (result.success) {
          this.closeAddModal()
          this.showAlert(`Curso "${this.newCourse.name}" agregado correctamente.`, 'alert-success')
        } else {
          this.showAlert(`Error al agregar curso: ${result.error}`, 'alert-danger')
        }
      }
    },

    editCourseRedirect(course) {
      this.$router.push({ name: 'EditarCurso', params: { id: course.id } })
    },

    async confirmDeleteCourse(course) {
      this.clearAlert()
      
      const confirmDelete = window.confirm(`¿Desea realmente eliminar el curso "${course.name}"? Esta acción es irreversible.`)
      
      if (confirmDelete) {
        const result = await this.deleteCourse(course.id)
        
        if (result.success) {
          this.showAlert(`Curso "${course.name}" eliminado correctamente.`, 'alert-success')
        } else {
          this.showAlert(`Error al eliminar curso: ${result.error}`, 'alert-danger')
        }
      }
    }
  }
}
</script>

<style scoped>
.admin-courses-manager__card {
  margin-bottom: 2rem;
}

.admin-courses-manager__alert {
  margin-bottom: 1rem;
}

.admin-courses-manager__add-btn {
  font-weight: 600;
}

.admin-courses-manager__table {
  border-radius: 8px;
  overflow: hidden;
}

.admin-courses-manager__course-name {
  min-width: 200px;
}

.admin-courses-manager__status-chip {
  font-weight: 500;
}

.admin-courses-manager__price {
  font-weight: bold;
  color: #2e7d32;
}

.admin-courses-manager__members {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 200px;
}

.admin-courses-manager__member-chip {
  margin: 2px;
}

.admin-courses-manager__actions {
  display: flex;
  gap: 4px;
}

.admin-courses-manager__no-data {
  text-align: center;
  padding: 3rem 1rem;
}

.admin-courses-manager__dialog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-courses-manager__dialog-content {
  padding: 2rem;
}

.admin-courses-manager__dialog-actions {
  padding: 1rem 2rem;
}
</style>