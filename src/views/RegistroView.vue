<template>
  <div class="register-container">
    <v-container fluid class="h-100">
      <v-row class="h-100">
        <v-col cols="12" lg="6" class="d-none d-lg-flex align-center justify-center bg-light">
          <div class="text-center">
            <div class="illustration-container mb-4">
              <v-icon color="primary" size="128" style="opacity: 0.8;">mdi-account-plus</v-icon>
            </div>
            <h3 class="fw-bold text-dark mb-3">Únete a ADWEB Online</h3>
            <p class="text-muted fs-5 mb-4">
              Comienza tu viaje en el desarrollo web
            </p>
            <div class="features-list">
              <div class="feature-item mb-2">
                <v-icon color="success" class="me-2">mdi-check-circle</v-icon>
                <span>Registro gratuito</span>
              </div>
              <div class="feature-item mb-2">
                <v-icon color="success" class="me-2">mdi-check-circle</v-icon>
                <span>Acceso inmediato</span>
              </div>
              <div class="feature-item">
                <v-icon color="success" class="me-2">mdi-check-circle</v-icon>
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" lg="6" class="d-flex align-center justify-center">
          <div class="register-form-container">
            <div class="text-center mb-4">
              <div class="logo-container mb-3">
                <v-icon color="primary" size="48">mdi-school</v-icon>
              </div>
              <h2 class="fw-bold text-dark mb-2">Crear Cuenta</h2>
              <p class="text-muted">Regístrate en ADWEB Online</p>
            </div>

            <v-form @submit.prevent="handleRegister" class="register-form">
              <v-text-field
                v-model="formData.name"
                label="Nombre Completo"
                :error="!!errors.name"
                :error-messages="errors.name ? [errors.name] : []"
                prepend-inner-icon="mdi-account"
                density="comfortable"
                required
              />

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
                placeholder="Mínimo 6 caracteres"
                density="comfortable"
                required
              />

              <v-text-field
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                label="Confirmar Contraseña"
                :error="!!errors.confirmPassword"
                :error-messages="errors.confirmPassword ? [errors.confirmPassword] : []"
                prepend-inner-icon="mdi-lock-check"
                append-inner-icon="mdi-eye"
                @click:append-inner="toggleConfirmPassword"
                density="comfortable"
                required
              />

              <v-checkbox
                v-model="formData.acceptTerms"
                :error="!!errors.acceptTerms"
                :error-messages="errors.acceptTerms ? [errors.acceptTerms] : []"
                label="Acepto los términos y condiciones y la política de privacidad"
                class="mb-4"
                required
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                class="w-100 mb-3"
                :loading="isLoading"
                prepend-icon="mdi-account-plus"
              >
                {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
              </v-btn>

              <v-alert v-if="generalError" type="error" variant="tonal" class="mb-3">
                {{ generalError }}
              </v-alert>

              <v-alert v-if="successMessage" type="success" variant="tonal" class="mb-3">
                {{ successMessage }}
              </v-alert>

              <div class="text-center">
                <p class="mb-0">
                  ¿Ya tienes una cuenta?
                  <RouterLink to="/login" class="text-primary text-decoration-none fw-semibold">
                    Inicia sesión aquí
                  </RouterLink>
                </p>
              </div>
            </v-form>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// ... (script content is unchanged)
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'RegistroView',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      },
      errors: {},
      generalError: '',
      successMessage: '',
      isLoading: false,
      showPassword: false,
      showConfirmPassword: false
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      // Name validation
      if (!this.formData.name.trim()) {
        this.errors.name = 'El nombre es requerido'
      } else if (this.formData.name.trim().length < 2) {
        this.errors.name = 'El nombre debe tener al menos 2 caracteres'
      }
      
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
      } else if (!this.isStrongPassword(this.formData.password)) {
        this.errors.password = 'La contraseña debe contener al menos una letra y un número'
      }
      
      // Confirm password validation
      if (!this.formData.confirmPassword) {
        this.errors.confirmPassword = 'Confirma tu contraseña'
      } else if (this.formData.password !== this.formData.confirmPassword) {
        this.errors.confirmPassword = 'Las contraseñas no coinciden'
      }
      
      // Terms validation
      if (!this.formData.acceptTerms) {
        this.errors.acceptTerms = 'Debes aceptar los términos y condiciones'
      }
      
      return Object.keys(this.errors).length === 0
    },
    
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    
    isStrongPassword(password) {
      const hasLetter = /[a-zA-Z]/.test(password)
      const hasNumber = /\d/.test(password)
      return hasLetter && hasNumber
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    
    async handleRegister() {
      this.generalError = ''
      this.successMessage = ''
      
      if (!this.validateForm()) {
        return
      }
      
      this.isLoading = true
      
      try {
        const authStore = useAuthStore()
        await authStore.registerUser(this.formData.email, this.formData.password, this.formData.name)
        
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        this.successMessage = 'Cuenta creada exitosamente.'
        this.$router.push('/home')

      } catch (error) {
        console.error('Register error:', error)
        if (error === 'auth/email-already-in-use') {
          this.generalError = 'El correo electrónico ya está en uso'
        } else if (error === 'auth/invalid-email') {
          this.generalError = 'El correo electrónico no es válido'
        } else if (error === 'auth/weak-password') {
          this.generalError = 'La contraseña es demasiado débil'
        } else {
          this.generalError = 'Error al crear la cuenta. Intenta nuevamente.'
        }
        this.generalError = 'Error al crear la cuenta. Intenta nuevamente.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  /* Cambio a un gradiente más suave (tonos pastel de azul/lila) */
  min-height: 100vh;
  background: linear-gradient(135deg, #a3c4f3 0%, #b2a3f3 100%);
  height: 100vh;
  display: flex;
  align-items: center;
}

.register-form-container {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); /* Sombra más sutil */
  width: 100%;
  max-width: 500px;
}

.logo-container {
  animation: fadeInDown 0.8s ease-out;
}

.register-form {
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
  .register-form-container {
    margin: 2rem;
    padding: 2rem;
  }
  
  .register-container {
    /* Fondo blanco en móvil para mejor contraste con la tarjeta */
    background: white;
  }
}

@media (max-width: 575.98px) {
  .register-form-container {
    margin: 1rem;
    padding: 1.5rem;
    border-radius: 15px;
  }
}
  
  /* Centrado vertical total (ya estaba bien definido) */
  /* .register-container {
    height: 100vh;
    display: flex;
    align-items: center;
  } */
</style>