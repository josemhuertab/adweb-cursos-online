import { defineStore } from 'pinia'
import { enrollmentService } from '@/services/enrollments'

export const useEnrollmentStore = defineStore('enrollment', {
  state: () => ({
    userEnrollments: [],
    pendingEnrollments: [],
    adminNotifications: [],
    loading: false,
    error: null
  }),

  getters: {
    getUserEnrollments: (state) => state.userEnrollments,
    getPendingEnrollments: (state) => state.pendingEnrollments,
    getAdminNotifications: (state) => state.adminNotifications,
    getUnreadNotifications: (state) => state.adminNotifications.filter(n => !n.read),
    getUnreadCount: (state) => state.adminNotifications.filter(n => !n.read).length,
    
    isUserEnrolledInCourse: (state) => (courseId) => {
      return state.userEnrollments.some(
        enrollment => enrollment.courseId === courseId && 
        (enrollment.status === 'approved' || enrollment.status === 'pending')
      )
    },
    
    getUserEnrollmentStatus: (state) => (courseId) => {
      const enrollment = state.userEnrollments.find(e => e.courseId === courseId)
      return enrollment ? enrollment.status : null
    }
  },

  actions: {
    setLoading(status) {
      this.loading = status
    },

    setError(error) {
      this.error = error
    },

    setUserEnrollments(enrollments) {
      this.userEnrollments = enrollments
    },

    setPendingEnrollments(enrollments) {
      this.pendingEnrollments = enrollments
    },

    setAdminNotifications(notifications) {
      this.adminNotifications = notifications
    },

    async requestEnrollment(userId, userEmail, courseId, courseName, coursePrice) {
      this.setLoading(true)
      try {
        const result = await enrollmentService.createEnrollment(
          userId, userEmail, courseId, courseName, coursePrice
        )
        
        if (result.success) {
          // Actualizar enrollments del usuario
          await this.loadUserEnrollments(userId)
        }
        
        return result
      } catch (error) {
        this.setError(error.message)
        return { success: false, error: error.message }
      } finally {
        this.setLoading(false)
      }
    },

    async approveEnrollment(enrollmentId, adminEmail) {
      try {
        const result = await enrollmentService.approveEnrollment(enrollmentId, adminEmail)
        
        if (result.success) {
          // Actualizar pending enrollments
          await this.loadPendingEnrollments()
        }
        
        return result
      } catch (error) {
        this.setError(error.message)
        return { success: false, error: error.message }
      }
    },

    async rejectEnrollment(enrollmentId, adminEmail, reason) {
      try {
        const result = await enrollmentService.rejectEnrollment(enrollmentId, adminEmail, reason)
        
        if (result.success) {
          // Actualizar pending enrollments
          await this.loadPendingEnrollments()
        }
        
        return result
      } catch (error) {
        this.setError(error.message)
        return { success: false, error: error.message }
      }
    },

    async loadUserEnrollments(userId) {
      if (!userId) {
        console.warn('No userId provided to loadUserEnrollments')
        return
      }
      
      try {
        const enrollments = await enrollmentService.getUserEnrollments(userId)
        this.setUserEnrollments(enrollments)
      } catch (error) {
        console.error('Error loading user enrollments:', error)
        this.setError(error.message)
        // No lanzar el error para evitar que rompa la UI
      }
    },

    async loadPendingEnrollments() {
      try {
        const enrollments = await enrollmentService.getPendingEnrollments()
        this.setPendingEnrollments(enrollments)
      } catch (error) {
        this.setError(error.message)
      }
    },

    async loadAdminNotifications() {
      try {
        const notifications = await enrollmentService.getAdminNotifications()
        this.setAdminNotifications(notifications)
      } catch (error) {
        this.setError(error.message)
      }
    },

    subscribeToPendingEnrollments() {
      return enrollmentService.subscribeToPendingEnrollments((snapshot) => {
        const enrollments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        this.setPendingEnrollments(enrollments)
      })
    },

    subscribeToAdminNotifications() {
      return enrollmentService.subscribeToAdminNotifications((snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate())
        this.setAdminNotifications(notifications)
      })
    },

    async markNotificationAsRead(notificationId) {
      try {
        const result = await enrollmentService.markNotificationAsRead(notificationId)
        
        if (result.success) {
          // Actualizar notificación localmente
          const notification = this.adminNotifications.find(n => n.id === notificationId)
          if (notification) {
            notification.read = true
          }
        }
        
        return result
      } catch (error) {
        this.setError(error.message)
        return { success: false, error: error.message }
      }
    }
  }
})