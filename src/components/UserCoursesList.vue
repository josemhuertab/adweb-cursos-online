<template>
  <div class="user-courses-list">
    <v-alert 
      v-if="successMessage" 
      type="success" 
      variant="tonal" 
      class="user-courses-list__alert"
      closable
      @click:close="successMessage = ''"
    >
      {{ successMessage }}
    </v-alert>

    <v-row>
      <v-col
        v-for="course in courses"
        :key="course.id"
        cols="12" 
        md="6" 
        lg="4"
      >
        <CourseCard 
          :course="course" 
          :current-user-email="currentEmail"
          :enrollment-status="getEnrollmentStatus(course.id)"
          @course-access="handleCourseAccess"
          @enrollment-requested="handleEnrollmentRequested"
        />
      </v-col>
    </v-row>
    
    <div v-if="courses.length === 0" class="user-courses-list__empty">
      <v-alert type="info" variant="tonal">
        <v-alert-title>No hay cursos disponibles</v-alert-title>
        No se encontraron cursos para mostrar en este momento.
      </v-alert>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
import CourseCard from '@/components/course/CourseCard.vue'
import { useEnrollmentStore } from '@/stores/enrollmentStore'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'UserCoursesList',
  components: {
    CourseCard
  },
  props: {
    courses: { 
      type: Array, 
      required: true 
    },
    currentEmail: { 
      type: String, 
      required: false, 
      default: '' 
    }
  },
  emits: ['course-selected'],
  data() {
    return {
      successMessage: ''
    }
  },
  setup() {
    const enrollmentStore = useEnrollmentStore()
    const authStore = useAuthStore()
    
    onMounted(async () => {
      if (authStore.user && authStore.user.uid) {
        try {
          await enrollmentStore.loadUserEnrollments(authStore.user.uid)
        } catch (error) {
          console.error('Error loading user enrollments:', error)
        }
      }
    })
    
    return {
      enrollmentStore,
      authStore
    }
  },
  methods: {
    handleCourseAccess(course) {
      this.$emit('course-selected', course)
    },
    
    async handleEnrollmentRequested(course) {
      try {
        const result = await this.enrollmentStore.requestEnrollment(
          this.authStore.user.uid,
          this.authStore.user.email,
          course.id,
          course.name,
          course.price
        )
        
        if (result.success) {
          this.successMessage = `Tu solicitud de inscripción al curso "${course.name}" ha sido enviada. El administrador la revisará pronto.`
        } else {
          this.successMessage = `Error al solicitar inscripción: ${result.error}`
        }
      } catch (error) {
        this.successMessage = `Error al solicitar inscripción: ${error.message}`
      }
    },
    
    getEnrollmentStatus(courseId) {
      return this.enrollmentStore.getUserEnrollmentStatus(courseId)
    }
  }
}
</script>

<style scoped>
.user-courses-list__alert {
  margin-bottom: 1.5rem;
}

.user-courses-list__empty {
  margin-top: 2rem;
}
</style>