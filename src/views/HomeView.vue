<template>
  <div class="home-view">
    <v-container class="home-view__container">
      <PageHeader 
        :title="pageTitle"
        :subtitle="pageSubtitle"
      />

      <div class="home-view__content">
        <LoadingSpinner 
          v-if="loading" 
          message="Cargando cursos..." 
          size="60"
        />
        
        <v-alert 
          v-else-if="error" 
          type="error" 
          variant="tonal"
          class="home-view__error"
        >
          <v-alert-title>Error al cargar cursos</v-alert-title>
          {{ error }}
        </v-alert>

        <AdminCoursesManager
          v-else-if="isAdmin"
          class="home-view__admin-content"
        />

        <UserCoursesList
          v-else
          :courses="courses"
          :current-email="currentEmail"
          @course-selected="handleCourseSelected"
          class="home-view__user-content"
        />
      </div>
    </v-container>
  </div>
</template>

<script>
import { onMounted, onUnmounted, computed } from 'vue'
import AdminCoursesManager from '@/components/AdminCoursesManager.vue'
import UserCoursesList from '@/components/UserCoursesList.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useCoursesStore } from '@/stores/coursesStore'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'HomeView',
  components: { 
    AdminCoursesManager, 
    UserCoursesList,
    PageHeader,
    LoadingSpinner
  },
  setup() {
    const coursesStore = useCoursesStore()
    const authStore = useAuthStore()
    let unsubscribe = null
    
    onMounted(() => {
      unsubscribe = coursesStore.subscribeToCourses()
    })

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe()
      }
    })

    const courses = computed(() => coursesStore.getCourses)
    const isAdmin = computed(() => authStore.isAdmin)
    const currentEmail = computed(() => authStore.currentUserEmail)
    const loading = computed(() => coursesStore.loading)
    const error = computed(() => coursesStore.error)

    const pageTitle = computed(() => {
      return isAdmin.value ? 'Panel de Administración' : 'Mis Cursos'
    })

    const pageSubtitle = computed(() => {
      return isAdmin.value 
        ? 'Gestiona los cursos de la plataforma ADWEB Online'
        : 'Explora y accede a tus cursos disponibles'
    })

    const handleCourseSelected = (course) => {
      console.log('Curso seleccionado:', course)
    }

    return {
      courses,
      isAdmin,
      currentEmail,
      loading,
      error,
      pageTitle,
      pageSubtitle,
      handleCourseSelected
    }
  }
}
</script>

<style scoped>
.home-view {
  min-height: calc(100vh - 64px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.home-view__container {
  padding: 2rem 1rem;
}

.home-view__content {
  margin-top: 1rem;
}

.home-view__error {
  margin-bottom: 2rem;
}

.home-view__admin-content,
.home-view__user-content {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .home-view__container {
    padding: 1rem 0.5rem;
  }
}
</style>