<template>
  <v-dialog v-model="dialog" max-width="800" persistent>
    <v-card class="manual-assignment">
      <v-card-title class="manual-assignment__header">
        <span>Asignación Manual de Cursos</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" color="white" @click="closeDialog" />
      </v-card-title>

      <v-card-text class="manual-assignment__content">
        <v-form @submit.prevent="assignCourse" ref="assignmentForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="selectedCourse"
                :items="courses"
                item-title="name"
                item-value="id"
                label="Seleccionar Curso"
                prepend-icon="mdi-school"
                variant="outlined"
                :rules="courseRules"
                required
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-avatar size="40" rounded="lg">
                        <img :src="item.raw.imageUrl" :alt="item.raw.name">
                      </v-avatar>
                    </template>
                    <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.raw.code }} - {{ formatCurrency(item.raw.price) }}</v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="userEmail"
                label="Email del Usuario"
                type="email"
                prepend-icon="mdi-email"
                variant="outlined"
                :rules="emailRules"
                required
              />
            </v-col>

            <v-col cols="12" v-if="selectedCourseData">
              <v-card variant="outlined" class="manual-assignment__course-info">
                <v-card-text>
                  <v-row align="center">
                    <v-col cols="auto">
                      <v-avatar size="60" rounded="lg">
                        <img :src="selectedCourseData.imageUrl" :alt="selectedCourseData.name">
                      </v-avatar>
                    </v-col>
                    <v-col>
                      <h4>{{ selectedCourseData.name }}</h4>
                      <p class="text-body-2 text-medium-emphasis mb-1">{{ selectedCourseData.description }}</p>
                      <div class="d-flex gap-4">
                        <span><v-icon size="16">mdi-currency-usd</v-icon> {{ formatCurrency(selectedCourseData.price) }}</span>
                        <span><v-icon size="16">mdi-clock</v-icon> {{ selectedCourseData.duration }}</span>
                        <span><v-icon size="16">mdi-account-group</v-icon> {{ selectedCourseData.cupos - selectedCourseData.inscritos }} cupos disponibles</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="assignmentNote"
                label="Nota de Asignación (Opcional)"
                placeholder="Motivo de la asignación manual, comentarios adicionales..."
                rows="3"
                variant="outlined"
                prepend-icon="mdi-note-text"
              />
            </v-col>
          </v-row>
        </v-form>

        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4">
          {{ errorMessage }}
        </v-alert>

        <v-alert v-if="successMessage" type="success" variant="tonal" class="mt-4">
          {{ successMessage }}
        </v-alert>
      </v-card-text>

      <v-divider />

      <v-card-actions class="manual-assignment__actions">
        <v-spacer />
        <v-btn variant="text" @click="closeDialog">Cancelar</v-btn>
        <v-btn 
          color="primary" 
          @click="assignCourse"
          :loading="assigning"
          prepend-icon="mdi-account-plus"
        >
          Asignar Curso
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed } from 'vue'
import { useCoursesStore } from '@/stores/coursesStore'
import { useAuthStore } from '@/stores/authStore'
import { formatCurrency, validateEmail } from '@/utils/helpers'
import { coursesService } from '@/services/firebase'

export default {
  name: 'ManualAssignment',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'assignment-completed'],
  data() {
    return {
      selectedCourse: null,
      userEmail: '',
      assignmentNote: '',
      assigning: false,
      errorMessage: '',
      successMessage: '',
      courseRules: [
        v => !!v || 'Selecciona un curso'
      ],
      emailRules: [
        v => !!v || 'El email es requerido',
        v => validateEmail(v) || 'Email inválido'
      ]
    }
  },
  setup(props, { emit }) {
    const coursesStore = useCoursesStore()
    const authStore = useAuthStore()

    const dialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const courses = computed(() => coursesStore.getCourses.filter(course => course.status === 'disponible'))

    return {
      coursesStore,
      authStore,
      dialog,
      courses
    }
  },
  computed: {
    selectedCourseData() {
      return this.courses.find(course => course.id === this.selectedCourse)
    }
  },
  methods: {
    formatCurrency,

    closeDialog() {
      this.dialog = false
      this.resetForm()
    },

    resetForm() {
      this.selectedCourse = null
      this.userEmail = ''
      this.assignmentNote = ''
      this.errorMessage = ''
      this.successMessage = ''
    },

    async assignCourse() {
      const { valid } = await this.$refs.assignmentForm.validate()
      if (!valid) return

      this.assigning = true
      this.errorMessage = ''
      this.successMessage = ''

      try {
        const courseData = this.selectedCourseData
        
        // Verificar si el usuario ya está asignado
        if (courseData.assignedMembers.includes(this.userEmail.toLowerCase())) {
          this.errorMessage = 'El usuario ya está asignado a este curso'
          return
        }

        // Verificar cupos disponibles
        if (courseData.inscritos >= courseData.cupos) {
          this.errorMessage = 'No hay cupos disponibles en este curso'
          return
        }

        // Asignar el curso
        const result = await coursesService.updateCourse(this.selectedCourse, {
          assignedMembers: [...courseData.assignedMembers, this.userEmail.toLowerCase()],
          inscritos: courseData.inscritos + 1,
          updatedAt: new Date()
        })

        if (result.success) {
          // Crear notificación para el usuario (si existe el sistema de notificaciones de usuarios)
          this.successMessage = `Usuario ${this.userEmail} asignado exitosamente al curso "${courseData.name}"`
          
          this.$emit('assignment-completed', {
            course: courseData,
            userEmail: this.userEmail,
            note: this.assignmentNote
          })

          // Cerrar el dialog después de 2 segundos
          setTimeout(() => {
            this.closeDialog()
          }, 2000)
        } else {
          this.errorMessage = `Error al asignar curso: ${result.error}`
        }
      } catch (error) {
        this.errorMessage = `Error al asignar curso: ${error.message}`
      } finally {
        this.assigning = false
      }
    }
  }
}
</script>

<style scoped>
.manual-assignment__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.manual-assignment__content {
  padding: 2rem;
}

.manual-assignment__course-info {
  background-color: #f8f9fa;
}

.manual-assignment__actions {
  padding: 1rem 2rem;
}
</style>