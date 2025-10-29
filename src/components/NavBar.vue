<template>
  <div class="navbar">
    <v-app-bar 
      class="navbar__app-bar" 
      elevation="2"
      color="transparent"
    >
      <v-container class="navbar__container">
        <div class="navbar__content">
          <v-app-bar-nav-icon 
            class="navbar__mobile-menu d-lg-none" 
            color="white"
            @click.stop="drawer = !drawer"
          />

          <RouterLink 
            class="navbar__brand" 
            to="/"
            @click="handleBrandClick"
          >
            <v-icon class="navbar__brand-icon" color="white">
              mdi-school
            </v-icon>
            <span class="navbar__brand-text">ADWEB Online</span>
          </RouterLink>

          <nav class="navbar__nav d-none d-lg-flex" v-if="isAuthenticated">
            <RouterLink 
              class="navbar__nav-link" 
              to="/home"
              active-class="navbar__nav-link--active"
            >
              <v-icon class="navbar__nav-icon" color="white">mdi-home</v-icon>
              <span>Inicio</span>
            </RouterLink>
            
            <RouterLink 
              v-if="isAdmin" 
              class="navbar__nav-link" 
              to="/admin"
              active-class="navbar__nav-link--active"
            >
              <v-icon class="navbar__nav-icon" color="white">mdi-cog</v-icon>
              <span>Administración</span>
            </RouterLink>
          </nav>

          <v-spacer />

          <div class="navbar__actions">
            <template v-if="isAuthenticated">
              <NotificationBell 
                v-if="isAdmin"
                @open-enrollment-manager="openEnrollmentManager"
                class="navbar__notifications"
              />
              
              <div class="navbar__user-info d-none d-md-flex">
                <v-icon class="navbar__user-icon" color="white">mdi-account-circle</v-icon>
                <span class="navbar__user-email">{{ userEmail }}</span>
              </div>
              
              <v-btn
                class="navbar__logout-btn"
                variant="outlined"
                color="white"
                size="small"
                prepend-icon="mdi-logout"
                @click="handleLogout"
              >
                Cerrar Sesión
              </v-btn>
            </template>
            
            <template v-else>
              <v-btn
                class="navbar__auth-btn d-none d-sm-flex"
                variant="outlined"
                color="white"
                size="small"
                to="/login"
                prepend-icon="mdi-login"
              >
                Iniciar Sesión
              </v-btn>
              
              <v-btn
                class="navbar__auth-btn d-none d-sm-flex"
                color="white"
                size="small"
                to="/registro"
                prepend-icon="mdi-account-plus"
              >
                Registrarse
              </v-btn>
            </template>
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer 
      v-model="drawer" 
      temporary
      class="navbar__drawer"
    >
      <v-list class="navbar__drawer-list" nav>
        <v-list-item 
          v-if="isAuthenticated"
          class="navbar__drawer-user"
        >
          <template v-slot:prepend>
            <v-icon>mdi-account-circle</v-icon>
          </template>
          <v-list-item-title class="navbar__drawer-user-email">
            {{ userEmail }}
          </v-list-item-title>
        </v-list-item>
        
        <v-divider v-if="isAuthenticated" />

        <v-list-item 
          v-if="isAuthenticated" 
          link 
          to="/home" 
          @click="drawer = false"
          class="navbar__drawer-item"
        >
          <template v-slot:prepend>
            <v-icon>mdi-home</v-icon>
          </template>
          <v-list-item-title>Inicio</v-list-item-title>
        </v-list-item>
        
        <v-list-item 
          v-if="isAuthenticated && isAdmin" 
          link 
          to="/admin" 
          @click="drawer = false"
          class="navbar__drawer-item"
        >
          <template v-slot:prepend>
            <v-icon>mdi-cog</v-icon>
          </template>
          <v-list-item-title>Administración</v-list-item-title>
        </v-list-item>
        
        <v-divider v-if="!isAuthenticated" />

        <v-list-item 
          v-if="!isAuthenticated" 
          link 
          to="/login" 
          @click="drawer = false"
          class="navbar__drawer-item"
        >
          <template v-slot:prepend>
            <v-icon>mdi-login</v-icon>
          </template>
          <v-list-item-title>Iniciar Sesión</v-list-item-title>
        </v-list-item>
        
        <v-list-item 
          v-if="!isAuthenticated" 
          link 
          to="/registro" 
          @click="drawer = false"
          class="navbar__drawer-item"
        >
          <template v-slot:prepend>
            <v-icon>mdi-account-plus</v-icon>
          </template>
          <v-list-item-title>Registrarse</v-list-item-title>
        </v-list-item>

        <v-divider v-if="isAuthenticated" />
        
        <v-list-item 
          v-if="isAuthenticated"
          @click="handleLogout"
          class="navbar__drawer-item navbar__drawer-item--logout"
        >
          <template v-slot:prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>Cerrar Sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Enrollment Manager Dialog -->
    <EnrollmentManager 
      v-model="enrollmentManagerOpen"
    />
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { mapState, mapActions } from 'pinia'
import NotificationBell from '@/components/admin/NotificationBell.vue'
import EnrollmentManager from '@/components/admin/EnrollmentManager.vue'

export default {
  name: 'NavBar',
  components: {
    NotificationBell,
    EnrollmentManager
  },
  data() {
    return {
      drawer: false,
      enrollmentManagerOpen: false
    }
  },
  computed: {
    ...mapState(useAuthStore, {
      isAuthenticated: 'isLoggedIn',
      userEmail: 'currentUserEmail', 
      isAdmin: 'isAdmin'
    })
  },
  methods: {
    ...mapActions(useAuthStore, ['logoutUser']),
    
    handleLogout() {
      this.drawer = false
      this.logoutUser()
    },
    
    handleBrandClick() {
      if (this.isAuthenticated) {
        this.$router.push('/home')
      } else {
        this.$router.push('/login')
      }
    },
    
    openEnrollmentManager() {
      this.enrollmentManagerOpen = true
    }
  }
}
</script>

<style scoped>
.navbar__app-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.navbar__container {
  padding: 0 1rem;
}

.navbar__content {
  display: flex;
  align-items: center;
  width: 100%;
}

.navbar__brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: -0.5px;
  transition: opacity 0.3s ease;
}

.navbar__brand:hover {
  opacity: 0.9;
}

.navbar__brand-icon {
  margin-right: 0.5rem;
}

.navbar__brand-text {
  color: white;
}

.navbar__nav {
  display: flex;
  align-items: center;
  margin-left: 2rem;
  gap: 1rem;
}

.navbar__nav-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.navbar__nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.navbar__nav-link--active {
  background-color: rgba(255, 255, 255, 0.2);
}

.navbar__nav-icon {
  margin-right: 0.25rem;
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navbar__notifications {
  margin-right: 0.5rem;
}

.navbar__user-info {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.navbar__user-icon {
  margin-right: 0.25rem;
}

.navbar__user-email {
  font-size: 0.9rem;
}

.navbar__logout-btn,
.navbar__auth-btn {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.navbar__logout-btn:hover,
.navbar__auth-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.navbar__auth-btn:last-child {
  background-color: white;
  color: #764ba2;
}

.navbar__auth-btn:last-child:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.navbar__drawer-list {
  padding-top: 1rem;
}

.navbar__drawer-user {
  padding: 1rem;
  background-color: #f5f5f5;
}

.navbar__drawer-user-email {
  font-weight: bold;
  color: #333;
}

.navbar__drawer-item {
  margin: 0.25rem 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.navbar__drawer-item:hover {
  background-color: rgba(102, 126, 234, 0.1);
}

.navbar__drawer-item--logout {
  color: #f44336;
}

.navbar__drawer-item--logout:hover {
  background-color: rgba(244, 67, 54, 0.1);
}

@media (max-width: 991.98px) {
  .navbar__nav-link {
    padding: 0.75rem 0;
  }
}
</style>