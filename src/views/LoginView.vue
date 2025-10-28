<template>
  <div class="login-container">
    <v-container fluid class="h-100">
      <v-row class="h-100">
        <v-col cols="12" lg="6" class="d-flex align-center justify-center">
          <div class="login-form-container">
            <div class="text-center mb-4">
              <div class="logo-container mb-3">
                <v-icon color="primary" size="48">mdi-school</v-icon>
              </div>
              <h2 class="fw-bold text-dark mb-2">Iniciar Sesión</h2>
              <p class="text-muted">Accede a tu cuenta de ADWEB Online</p>
            </div>

            <v-form @submit.prevent="handleLogin" class="login-form">
              <v-text-field
                v-model="formData.email"
                label="Correo Electrónico"
                type="email"
                :error="!!errors.email"
                :error-messages="errors.email ? [errors.email] : []"
                prepend-inner-icon="mdi-email"
                density="comfortable"
                required
              />

              <v-text-field
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                :error="!!errors.password"
                :error-messages="errors.password ? [errors.password] : []"
                prepend-inner-icon="mdi-lock"
                append-inner-icon="mdi-eye"
                @click:append-inner="togglePassword"
                density="comfortable"
                required
              />

              <v-checkbox
                v-model="formData.rememberMe"
                label="Recordar mi sesión"
                class="mb-4"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                class="w-100 mb-3"
                :loading="isLoading"
                prepend-icon="mdi-login"
              >
                {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
              </v-btn>

              <v-alert v-if="generalError" type="error" variant="tonal" class="mb-3">
                {{ generalError }}
              </v-alert>

              <div class="text-center">
                <p class="mb-0">
                  ¿No tienes una cuenta?
                  <RouterLink to="/registro" class="text-primary text-decoration-none fw-semibold">
                    Regístrate aquí
                  </RouterLink>
                </p>
              </div>
            </v-form>
          </div>
        </v-col>

        <v-col cols="12" lg="6" class="d-none d-lg-flex align-center justify-center bg-light">
          <div class="text-center">
            <div class="illustration-container mb-4">
              <v-icon color="primary" size="128" style="opacity: 0.8;">mdi-laptop</v-icon>
            </div>
            <h3 class="fw-bold text-dark mb-3">Aprende con ADWEB Online</h3>
            <p class="text-muted fs-5 mb-4">
              Accede a cursos de programación web de alta calidad
            </p>
            <div class="features-list">
              <div class="feature-item mb-2">
                <v-icon color="success" class="me-2">mdi-check-circle</v-icon>
                <span>Cursos actualizados</span>
              </div>
              <div class="feature-item mb-2">
                <v-icon color="success" class="me-2">mdi-check-circle</v-icon>
                <span>Instructores expertos</span>
              </div>
              <div class="feature-item">
                <v-icon color="success" class="me-2">mdi-check-circle</v-icon>
                <span>Certificados oficiales</span>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// ... (script content is unchanged)
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'LoginView',
  data() {
    return {
      formData: {
        email: '',
        password: '',
        rememberMe: false
      },
      errors: {},
      generalError: '',
      isLoading: false,
      showPassword: false
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      // Email validation
      if (!this.formData.email) {
        this.errors.email = 'El correo electrónico es requerido'
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = 'Ingresa un correo electrónico válido'
      }
      
      // Password validation
      if (!this.formData.password) {
        this.errors.password = 'La contraseña es requerida'
      } else if (this.formData.password.length < 6) {
        this.errors.password = 'La contraseña debe tener al menos 6 caracteres'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    async handleLogin() {
      this.generalError = ''
      
      if (!this.validateForm()) {
        return
      }
      
      this.isLoading = true
      
      try {
        const authStore = useAuthStore()
        await authStore.loginUser(this.formData.email, this.formData.password)
        
        // Redirigir según el rol del usuario
        if (authStore.isAdmin) {
          this.$router.push('/admin')
        } else {
          this.$router.push('/home')
        }
        
      } catch (error) {
        console.error('Login error:', error)
        this.generalError = 'Error al iniciar sesión. Verifica tus credenciales.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  /* Cambio a un gradiente más suave (tonos pastel de azul/lila) */
  min-height: 100vh;
  background: linear-gradient(135deg, #a3c4f3 0%, #b2a3f3 100%);
  height: 100vh;
  display: flex;
  align-items: center;
}

.login-form-container {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); /* Sombra más sutil */
  width: 100%;
  max-width: 450px;
}

.logo-container {
  animation: fadeInDown 0.8s ease-out;
}

.login-form {
  animation: fadeInUp 0.8s ease-out;
}



.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.illustration-container {
  animation: float 3s ease-in-out infinite;
}

.feature-item {
  font-size: 1.1rem;
  font-weight: 500;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@media (max-width: 991.98px) {
  .login-form-container {
    margin: 2rem;
    padding: 2rem;
  }
  
  .login-container {
    /* Fondo blanco en móvil para mejor contraste con la tarjeta */
    background: white;
  }
}

@media (max-width: 575.98px) {
  .login-form-container {
    margin: 1rem;
    padding: 1.5rem;
    border-radius: 15px;
  }
}
  
  /* Centrado vertical total (ya estaba bien definido) */
  /* .login-container {
    height: 100vh;
    display: flex;
    align-items: center;
  } */
</style>