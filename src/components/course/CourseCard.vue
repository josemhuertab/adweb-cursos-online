<template>
  <v-card
    class="course-card"
    :class="{ 'course-card--disabled': !isAccessible }"
    elevation="4"
    rounded="lg"
  >
    <v-card-title class="course-card__header">
      <h5 class="course-card__title">{{ course.name }}</h5>
      <span class="course-card__code">{{ course.code }}</span>
    </v-card-title>

    <v-card-text class="course-card__content">
      <div class="course-card__image-container">
        <img 
          :src="course.imageUrl" 
          :alt="`Imagen del curso ${course.name}`"
          class="course-card__image"
        >
      </div>
      
      <div class="course-card__body">
        <div class="course-card__status">
          <v-chip 
            :color="getStatusColor(course.status)" 
            label 
            size="small"
          >
            <v-icon start size="18">mdi-tag</v-icon>
            {{ getStatusText(course.status) }}
          </v-chip>
        </div>

        <p class="course-card__description">{{ course.description }}</p>
        
        <div class="course-card__features">
          <div class="course-card__feature">
            <p class="course-card__feature-value">{{ course.duration }}</p>
            <small class="course-card__feature-label">Duración</small>
          </div>
          <v-divider vertical />
          <div class="course-card__feature">
            <p class="course-card__feature-value course-card__feature-value--price">
              {{ course.price === 0 ? 'Gratis' : formatCurrency(course.price) }}
            </p>
            <small class="course-card__feature-label">Precio</small>
          </div>
          <v-divider vertical />
          <div class="course-card__feature">
            <p class="course-card__feature-value course-card__feature-value--info">
              {{ course.cupos - course.inscritos }}
            </p>
            <small class="course-card__feature-label">Cupos</small>
          </div>
        </div>
      </div>
    </v-card-text>

    <v-card-actions class="course-card__actions">
      <div class="course-card__status-container">
        <v-chip 
          v-if="enrollmentStatus"
          :color="getEnrollmentStatusColor(enrollmentStatus)"
          size="small"
          variant="tonal"
        >
          {{ getEnrollmentStatusText(enrollmentStatus) }}
        </v-chip>
        <small 
          v-else-if="isAccessible"
          class="text-success course-card__status-text"
        >
          ¡Inscrito!
        </small>
      </div>
      
      <!-- Botón para acceder al curso (usuario ya inscrito) -->
      <v-btn
        v-if="isAccessible"
        color="primary"
        variant="tonal"
        size="small"
        prepend-icon="mdi-play-circle"
        @click="$emit('course-access', course)"
      >
        Ir al curso
      </v-btn>
      
      <!-- Botón para inscribirse (usuario no inscrito y sin solicitud pendiente) -->
      <v-btn
        v-else-if="!enrollmentStatus"
        color="success"
        variant="elevated"
        size="small"
        prepend-icon="mdi-cart-plus"
        :loading="enrolling"
        @click="handleEnrollment"
      >
        Inscribirse
      </v-btn>
      
      <!-- Botón para solicitud pendiente -->
      <v-btn
        v-else-if="enrollmentStatus === 'pending'"
        color="warning"
        variant="tonal"
        size="small"
        prepend-icon="mdi-clock"
        disabled
      >
        Pendiente
      </v-btn>
      
      <!-- Botón para solicitud rechazada -->
      <v-btn
        v-else-if="enrollmentStatus === 'rejected'"
        color="error"
        variant="outlined"
        size="small"
        prepend-icon="mdi-close-circle"
        @click="handleEnrollment"
      >
        Solicitar Nuevamente
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'CourseCard',
  props: {
    course: {
      type: Object,
      required: true
    },
    currentUserEmail: {
      type: String,
      default: ''
    },
    enrollmentStatus: {
      type: String,
      default: null
    }
  },
  emits: ['course-access', 'enrollment-requested'],
  data() {
    return {
      enrolling: false
    }
  },
  computed: {
    isAccessible() {
      const assigned = Array.isArray(this.course.assignedMembers) && this.currentUserEmail
        ? this.course.assignedMembers.map(s => s.toLowerCase()).includes(this.currentUserEmail.toLowerCase())
        : false
      return assigned && this.course.status === 'disponible'
    }
  },
  mounted() {
    // Debug logs
    console.log('CourseCard mounted:', {
      courseName: this.course.name,
      currentUserEmail: this.currentUserEmail,
      enrollmentStatus: this.enrollmentStatus,
      isAccessible: this.isAccessible,
      assignedMembers: this.course.assignedMembers
    })
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('es-CL', { 
        style: 'currency', 
        currency: 'CLP', 
        minimumFractionDigits: 0 
      }).format(value || 0)
    },
    getStatusColor(status) {
      switch (status) {
        case 'disponible': return 'success'
        case 'en_revision': return 'warning'
        case 'cerrado': return 'error'
        default: return 'secondary'
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'disponible': return 'Disponible'
        case 'en_revision': return 'En Revisión'
        case 'cerrado': return 'Cerrado'
        default: return 'Próximamente'
      }
    },
    getEnrollmentStatusColor(status) {
      switch (status) {
        case 'pending': return 'warning'
        case 'approved': return 'success'
        case 'rejected': return 'error'
        default: return 'secondary'
      }
    },
    getEnrollmentStatusText(status) {
      switch (status) {
        case 'pending': return 'Pendiente de aprobación'
        case 'approved': return 'Inscripción aprobada'
        case 'rejected': return 'Inscripción rechazada'
        default: return 'Estado desconocido'
      }
    },
    handleEnrollment() {
      this.$emit('enrollment-requested', this.course)
    }
  }
}
</script>

<style scoped>
.course-card {
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #dee2e6;
}

.course-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.course-card--disabled {
  opacity: 0.7;
}

.course-card__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 70px;
}

.course-card__title {
  margin: 0;
  font-weight: bold;
}

.course-card__code {
  opacity: 0.8;
  font-size: 0.9rem;
}

.course-card__content {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.course-card__image-container {
  height: 150px;
  overflow: hidden;
}

.course-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-card__body {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.course-card__status {
  margin-bottom: 1rem;
}

.course-card__description {
  color: #666;
  flex-grow: 1;
  margin-bottom: 1rem;
}

.course-card__features {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1rem;
}

.course-card__feature {
  text-align: center;
}

.course-card__feature-value {
  margin: 0;
  font-weight: bold;
  color: #764ba2;
}

.course-card__feature-value--price {
  color: #4caf50;
}

.course-card__feature-value--info {
  color: #2196f3;
}

.course-card__feature-label {
  color: #666;
}

.course-card__actions {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.course-card__status-container {
  flex-grow: 1;
}

.course-card__status-text {
  font-weight: 600;
}
</style>