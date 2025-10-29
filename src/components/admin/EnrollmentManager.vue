<template>
  <v-dialog v-model="dialog" max-width="900" persistent>
    <v-card class="enrollment-manager">
      <v-card-title class="enrollment-manager__header">
        <span>Gestión de Inscripciones</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
      </v-card-title>

      <v-card-text class="enrollment-manager__content">
        <div v-if="loading" class="enrollment-manager__loading">
          <v-progress-circular indeterminate size="40" />
          <p class="mt-4">Cargando solicitudes...</p>
        </div>

        <div v-else-if="pendingEnrollments.length === 0" class="enrollment-manager__empty">
          <v-icon size="64" color="grey-lighten-1">mdi-account-check</v-icon>
          <h3 class="mt-4">No hay solicitudes pendientes</h3>
          <p class="text-body-2 text-medium-emphasis">
            Todas las solicitudes de inscripción han sido procesadas.
          </p>
        </div>

        <div v-else class="enrollment-manager__list">
          <v-card
            v-for="enrollment in pendingEnrollments"
            :key="enrollment.id"
            class="enrollment-manager__item mb-4"
            elevation="2"
          >
            <v-card-text>
              <v-row align="center">
                <v-col cols="12" md="6">
                  <div class="enrollment-manager__user-info">
                    <h4 class="enrollment-manager__course-name">
                      {{ enrollment.courseName }}
                    </h4>
                    <p class="enrollment-manager__user-email">
                      <v-icon size="16" class="mr-1">mdi-account</v-icon>
                      {{ enrollment.userEmail }}
                    </p>
                    <p class="enrollment-manager__price">
                      <v-icon size="16" class="mr-1">mdi-currency-usd</v-icon>
                      {{ formatCurrency(enrollment.coursePrice) }}
                    </p>
                    <p class="enrollment-manager__date">
                      <v-icon size="16" class="mr-1">mdi-calendar</v-icon>
                      {{ formatDate(enrollment.requestedAt) }}
                    </p>
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="text-md-right">
                  <div class="enrollment-manager__actions">
                    <v-btn
                      color="success"
                      variant="elevated"
                      size="small"
                      prepend-icon="mdi-check"
                      :loading="processingId === enrollment.id && processingAction === 'approve'"
                      @click="approveEnrollment(enrollment)"
                      class="mr-2 mb-2"
                    >
                      Aprobar
                    </v-btn>
                    
                    <v-btn
                      color="error"
                      variant="outlined"
                      size="small"
                      prepend-icon="mdi-close"
                      :loading="processingId === enrollment.id && processingAction === 'reject'"
                      @click="openRejectDialog(enrollment)"
                      class="mb-2"
                    >
                      Rechazar
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
      </v-card-text>
    </v-card>

    <!-- Dialog para rechazar inscripción -->
    <v-dialog v-model="rejectDialog" max-width="500">
      <v-card>
        <v-card-title>Rechazar Inscripción</v-card-title>
        <v-card-text>
          <p class="mb-4">
            ¿Estás seguro de que quieres rechazar la inscripción de 
            <strong>{{ selectedEnrollment?.userEmail }}</strong> 
            al curso <strong>{{ selectedEnrollment?.courseName }}</strong>?
          </p>
          
          <v-textarea
            v-model="rejectionReason"
            label="Motivo del rechazo (opcional)"
            placeholder="Explica brevemente por qué se rechaza la inscripción..."
            rows="3"
            variant="outlined"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeRejectDialog">Cancelar</v-btn>
          <v-btn 
            color="error" 
            @click="confirmRejectEnrollment"
            :loading="processingId === selectedEnrollment?.id"
          >
            Rechazar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import { onMounted, onUnmounted, computed } from 'vue'
import { useEnrollmentStore } from '@/stores/enrollmentStore'
import { useAuthStore } from '@/stores/authStore'
import { formatCurrency } from '@/utils/helpers'

export default {
  name: 'EnrollmentManager',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      rejectDialog: false,
      selectedEnrollment: null,
      rejectionReason: '',
      processingId: null,
      processingAction: null
    }
  },
  setup(props, { emit }) {
    const enrollmentStore = useEnrollmentStore()
    const authStore = useAuthStore()
    let unsubscribe = null

    onMounted(() => {
      enrollmentStore.loadPendingEnrollments()
      unsubscribe = enrollmentStore.subscribeToPendingEnrollments()
    })

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe()
      }
    })

    const dialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const pendingEnrollments = computed(() => enrollmentStore.getPendingEnrollments)
    const loading = computed(() => enrollmentStore.loading)

    return {
      enrollmentStore,
      authStore,
      dialog,
      pendingEnrollments,
      loading
    }
  },
  methods: {
    formatCurrency,

    formatDate(timestamp) {
      if (!timestamp) return ''
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    closeDialog() {
      this.dialog = false
    },

    async approveEnrollment(enrollment) {
      this.processingId = enrollment.id
      this.processingAction = 'approve'

      try {
        const result = await this.enrollmentStore.approveEnrollment(
          enrollment.id,
          this.authStore.user.email
        )

        if (result.success) {
          // Mostrar mensaje de éxito
          this.$nextTick(() => {
            // El componente padre puede manejar esto
          })
        }
      } catch (error) {
        console.error('Error aprobando inscripción:', error)
      } finally {
        this.processingId = null
        this.processingAction = null
      }
    },

    openRejectDialog(enrollment) {
      this.selectedEnrollment = enrollment
      this.rejectionReason = ''
      this.rejectDialog = true
    },

    closeRejectDialog() {
      this.rejectDialog = false
      this.selectedEnrollment = null
      this.rejectionReason = ''
    },

    async confirmRejectEnrollment() {
      if (!this.selectedEnrollment) return

      this.processingId = this.selectedEnrollment.id
      this.processingAction = 'reject'

      try {
        const result = await this.enrollmentStore.rejectEnrollment(
          this.selectedEnrollment.id,
          this.authStore.user.email,
          this.rejectionReason
        )

        if (result.success) {
          this.closeRejectDialog()
        }
      } catch (error) {
        console.error('Error rechazando inscripción:', error)
      } finally {
        this.processingId = null
        this.processingAction = null
      }
    }
  }
}
</script>

<style scoped>
.enrollment-manager__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.enrollment-manager__content {
  padding: 1.5rem;
}

.enrollment-manager__loading,
.enrollment-manager__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.enrollment-manager__item {
  border-left: 4px solid #2196f3;
}

.enrollment-manager__course-name {
  color: #333;
  margin-bottom: 0.5rem;
}

.enrollment-manager__user-email,
.enrollment-manager__price,
.enrollment-manager__date {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  color: #666;
  font-size: 0.9rem;
}

.enrollment-manager__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .enrollment-manager__actions {
    justify-content: flex-start;
    margin-top: 1rem;
  }
}
</style>