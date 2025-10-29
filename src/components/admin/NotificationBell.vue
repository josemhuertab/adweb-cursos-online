<template>
  <div class="notification-bell">
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          v-bind="props"
          class="notification-bell__button"
          :color="unreadCount > 0 ? 'warning' : 'white'"
        >
          <v-badge
            :content="unreadCount"
            :model-value="unreadCount > 0"
            color="error"
            overlap
          >
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-card class="notification-bell__menu" min-width="350" max-width="400">
        <v-card-title class="notification-bell__header">
          <span>Notificaciones</span>
          <v-spacer />
          <v-chip size="small" color="primary">{{ unreadCount }}</v-chip>
        </v-card-title>

        <v-divider />

        <div class="notification-bell__content">
          <div v-if="loading" class="notification-bell__loading">
            <v-progress-circular indeterminate size="24" />
            <span class="ml-2">Cargando...</span>
          </div>

          <div v-else-if="notifications.length === 0" class="notification-bell__empty">
            <v-icon size="48" color="grey-lighten-1">mdi-bell-outline</v-icon>
            <p class="text-body-2 text-center mt-2">No hay notificaciones</p>
          </div>

          <v-list v-else class="notification-bell__list">
            <v-list-item
              v-for="notification in notifications.slice(0, 10)"
              :key="notification.id"
              class="notification-bell__item"
              :class="{ 'notification-bell__item--unread': !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <template v-slot:prepend>
                <v-icon 
                  :color="getNotificationColor(notification.type)"
                  size="20"
                >
                  {{ getNotificationIcon(notification.type) }}
                </v-icon>
              </template>

              <v-list-item-title class="notification-bell__title">
                {{ notification.title }}
              </v-list-item-title>
              
              <v-list-item-subtitle class="notification-bell__message">
                {{ notification.message }}
              </v-list-item-subtitle>

              <template v-slot:append>
                <div class="notification-bell__time">
                  <small>{{ formatTime(notification.createdAt) }}</small>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </div>

        <v-divider />

        <v-card-actions class="notification-bell__actions">
          <v-btn
            variant="text"
            size="small"
            @click="openEnrollmentManager"
            prepend-icon="mdi-account-multiple"
          >
            Ver solicitudes
          </v-btn>
          <v-spacer />
          <v-btn
            variant="text"
            size="small"
            @click="markAllAsRead"
            :disabled="unreadCount === 0"
          >
            Marcar como leídas
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { onMounted, onUnmounted, computed } from 'vue'
import { useEnrollmentStore } from '@/stores/enrollmentStore'

export default {
  name: 'NotificationBell',
  emits: ['open-enrollment-manager'],
  setup(props, { emit }) {
    const enrollmentStore = useEnrollmentStore()
    let unsubscribe = null

    onMounted(() => {
      enrollmentStore.loadAdminNotifications()
      unsubscribe = enrollmentStore.subscribeToAdminNotifications()
    })

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe()
      }
    })

    const notifications = computed(() => enrollmentStore.getAdminNotifications)
    const unreadCount = computed(() => enrollmentStore.getUnreadCount)
    const loading = computed(() => enrollmentStore.loading)

    return {
      enrollmentStore,
      notifications,
      unreadCount,
      loading,
      emit
    }
  },
  methods: {
    getNotificationIcon(type) {
      switch (type) {
        case 'enrollment_request': return 'mdi-account-plus'
        case 'enrollment_approved': return 'mdi-check-circle'
        case 'enrollment_rejected': return 'mdi-close-circle'
        default: return 'mdi-information'
      }
    },

    getNotificationColor(type) {
      switch (type) {
        case 'enrollment_request': return 'primary'
        case 'enrollment_approved': return 'success'
        case 'enrollment_rejected': return 'error'
        default: return 'grey'
      }
    },

    formatTime(timestamp) {
      if (!timestamp) return ''
      
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (minutes < 1) return 'Ahora'
      if (minutes < 60) return `${minutes}m`
      if (hours < 24) return `${hours}h`
      if (days < 7) return `${days}d`
      
      return date.toLocaleDateString('es-CL', { 
        month: 'short', 
        day: 'numeric' 
      })
    },

    async handleNotificationClick(notification) {
      if (!notification.read) {
        await this.enrollmentStore.markNotificationAsRead(notification.id)
      }
      
      if (notification.type === 'enrollment_request') {
        this.openEnrollmentManager()
      }
    },

    openEnrollmentManager() {
      this.$emit('open-enrollment-manager')
    },

    async markAllAsRead() {
      const unreadNotifications = this.notifications.filter(n => !n.read)
      
      for (const notification of unreadNotifications) {
        await this.enrollmentStore.markNotificationAsRead(notification.id)
      }
    }
  }
}
</script>

<style scoped>
.notification-bell__button {
  transition: all 0.3s ease;
}

.notification-bell__menu {
  max-height: 500px;
  overflow: hidden;
}

.notification-bell__header {
  padding: 1rem;
  background-color: #f5f5f5;
}

.notification-bell__content {
  max-height: 350px;
  overflow-y: auto;
}

.notification-bell__loading,
.notification-bell__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #666;
}

.notification-bell__list {
  padding: 0;
}

.notification-bell__item {
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.notification-bell__item:hover {
  background-color: #f8f9fa;
}

.notification-bell__item--unread {
  background-color: #e3f2fd;
  border-left: 3px solid #2196f3;
}

.notification-bell__title {
  font-weight: 600;
  font-size: 0.9rem;
}

.notification-bell__message {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

.notification-bell__time {
  text-align: right;
  color: #999;
}

.notification-bell__actions {
  padding: 0.5rem 1rem;
  background-color: #fafafa;
}
</style>