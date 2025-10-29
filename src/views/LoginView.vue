<template>
  <div class="login-view">
    <v-container fluid class="login-view__container">
      <v-row class="login-view__row">
        <v-col cols="12" lg="6" class="login-view__illustration d-none d-lg-flex">
          <div class="login-view__illustration-content">
            <div class="login-view__icon-container">
              <v-icon color="primary" size="128" class="login-view__icon">
                mdi-laptop
              </v-icon>
            </div>
            <h3 class="login-view__illustration-title">
              Aprende con ADWEB Online
            </h3>
            <p class="login-view__illustration-subtitle">
              Accede a cursos de programación web de alta calidad
            </p>
            <div class="login-view__features">
              <div class="login-view__feature">
                <v-icon color="success" class="login-view__feature-icon">
                  mdi-check-circle
                </v-icon>
                <span>Cursos actualizados</span>
              </div>
              <div class="login-view__feature">
                <v-icon color="success" class="login-view__feature-icon">
                  mdi-check-circle
                </v-icon>
                <span>Instructores expertos</span>
              </div>
              <div class="login-view__feature">
                <v-icon color="success" class="login-view__feature-icon">
                  mdi-check-circle
                </v-icon>
                <span>Certificados oficiales</span>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" lg="6" class="login-view__form-section">
          <div class="login-view__form-container">
            <div class="login-view__header">
              <div class="login-view__logo">
                <v-icon color="primary" size="48">mdi-school</v-icon>
              </div>
              <h2 class="login-view__title">Iniciar Sesión</h2>
              <p class="login-view__subtitle">
                Accede a tu cuenta de ADWEB Online
              </p>
            </div>

            <v-form 
              @submit.prevent="handleLogin" 
              class="login-view__form"
              ref="loginForm"
            >
              <v-text-field
                v-model="formData.email"
                label="Correo Electrónico"
                type="email"
                :error-messages="errors.email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                density="comfortable"
                :rules="emailRules"
                required
                class="login-view__field"
              />

              <v-text-field
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                :error-messages="errors.password"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="togglePassword"
                variant="outlined"
                density="comfortable"
                :rules="passwordRules"
                required
                class="login-view__field"
              />

              <v-checkbox
                v-model="formData.rememberMe"
                label="Recordar mi sesión"
                class="login-view__checkbox"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                class="login-view__submit-btn"
                :loading="isLoading"
                prepend-icon="mdi-login"
                block
              >
                {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
              </v-btn>

              <v-alert 
                v-if="generalError" 
                type="error" 
                variant="tonal" 
                class="login-view__error"
              >
                {{ generalError }}
              </v-alert>

              <div class="login-view__footer">
                <p class="login-view__footer-text">
                  ¿No tienes una cuenta?
                  <RouterLink 
                    to="/registro" 
                    class="login-view__footer-link"
                  >
                    Regístrate aquí
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
import { useAuthStore } from '@/stores/authStore'
import { validateEmail } from '@/utils/helpers'

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
      showPassword: false,
      emailRules: [
        v => !!v || 'El correo electrónico es requerido',
        v => validateEmail(v) || 'Ingresa un correo electrónico válido'
      ],
      passwordRules: [
        v => !!v || 'La contraseña es requerida',
        v => (v && v.length >= 6) || 'La contraseña debe tener al menos 6 caracteres'
      ]
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    async handleLogin() {
      this.generalError = ''
      
      const { valid } = await this.$refs.loginForm.validate()
      if (!valid) return
      
      this.isLoading = true
      
      try {
        const authStore = useAuthStore()
        await authStore.loginUser(this.formData.email, this.formData.password)
        
        if (authStore.isAdmin) {
          this.$router.push('/admin')
        } else {
          this.$router.push('/home')
        }
        
      } catch (error) {
        this.generalError = 'Error al iniciar sesión. Verifica tus credenciales.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #a3c4f3 0%, #b2a3f3 100%);
  display: flex;
  align-items: center;
}

.login-view__container {
  height: 100vh;
}

.login-view__row {
  height: 100%;
}

.login-view__illustration {
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.login-view__illustration-content {
  text-align: center;
  max-width: 400px;
}

.login-view__icon-container {
  margin-bottom: 2rem;
}

.login-view__icon {
  opacity: 0.8;
  animation: float 3s ease-in-out infinite;
}

.login-view__illustration-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.login-view__illustration-subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.login-view__features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-view__feature {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.login-view__feature-icon {
  margin-right: 0.5rem;
}

.login-view__form-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-view__form-container {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 450px;
}

.login-view__header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-view__logo {
  margin-bottom: 1rem;
  animation: fadeInDown 0.8s ease-out;
}

.login-view__title {
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.login-view__subtitle {
  color: #666;
  margin: 0;
}

.login-view__form {
  animation: fadeInUp 0.8s ease-out;
}

.login-view__field {
  margin-bottom: 1rem;
}

.login-view__checkbox {
  margin-bottom: 1.5rem;
}

.login-view__submit-btn {
  margin-bottom: 1rem;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-view__error {
  margin-bottom: 1rem;
}

.login-view__footer {
  text-align: center;
}

.login-view__footer-text {
  margin: 0;
  color: #666;
}

.login-view__footer-link {
  color: #764ba2;
  text-decoration: none;
  font-weight: 600;
}

.login-view__footer-link:hover {
  text-decoration: underline;
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
  .login-view__form-container {
    margin: 2rem;
    padding: 2rem;
  }
  
  .login-view {
    background: white;
  }
}

@media (max-width: 575.98px) {
  .login-view__form-container {
    margin: 1rem;
    padding: 1.5rem;
    border-radius: 15px;
  }
}
</style>