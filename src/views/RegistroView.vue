<template>
  <div class="register-view">
    <v-container fluid class="register-view__container">
      <v-row class="register-view__row">
        <v-col cols="12" lg="6" class="register-view__illustration d-none d-lg-flex">
          <div class="register-view__illustration-content">
            <div class="register-view__icon-container">
              <v-icon color="primary" size="128" class="register-view__icon">
                mdi-account-plus
              </v-icon>
            </div>
            <h3 class="register-view__illustration-title">
              Únete a ADWEB Online
            </h3>
            <p class="register-view__illustration-subtitle">
              Comienza tu viaje en el desarrollo web
            </p>
            <div class="register-view__features">
              <div class="register-view__feature">
                <v-icon color="success" class="register-view__feature-icon">
                  mdi-check-circle
                </v-icon>
                <span>Registro gratuito</span>
              </div>
              <div class="register-view__feature">
                <v-icon color="success" class="register-view__feature-icon">
                  mdi-check-circle
                </v-icon>
                <span>Acceso inmediato</span>
              </div>
              <div class="register-view__feature">
                <v-icon color="success" class="register-view__feature-icon">
                  mdi-check-circle
                </v-icon>
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" lg="6" class="register-view__form-section">
          <div class="register-view__form-container">
            <div class="register-view__header">
              <div class="register-view__logo">
                <v-icon color="primary" size="48">mdi-school</v-icon>
              </div>
              <h2 class="register-view__title">Crear Cuenta</h2>
              <p class="register-view__subtitle">
                Regístrate en ADWEB Online
              </p>
            </div>

            <v-form 
              @submit.prevent="handleRegister" 
              class="register-view__form"
              ref="registerForm"
            >
              <v-text-field
                v-model="formData.name"
                label="Nombre Completo"
                :error-messages="errors.name"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                density="comfortable"
                :rules="nameRules"
                required
                class="register-view__field"
              />

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
                class="register-view__field"
              />

              <v-text-field
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                :error-messages="errors.password"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="togglePassword"
                placeholder="Mínimo 6 caracteres"
                variant="outlined"
                density="comfortable"
                :rules="passwordRules"
                required
                class="register-view__field"
              />

              <v-text-field
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                label="Confirmar Contraseña"
                :error-messages="errors.confirmPassword"
                prepend-inner-icon="mdi-lock-check"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="toggleConfirmPassword"
                variant="outlined"
                density="comfortable"
                :rules="confirmPasswordRules"
                required
                class="register-view__field"
              />

              <v-checkbox
                v-model="formData.acceptTerms"
                :error-messages="errors.acceptTerms"
                label="Acepto los términos y condiciones y la política de privacidad"
                :rules="termsRules"
                required
                class="register-view__checkbox"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                class="register-view__submit-btn"
                :loading="isLoading"
                prepend-icon="mdi-account-plus"
                block
              >
                {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
              </v-btn>

              <v-alert 
                v-if="generalError" 
                type="error" 
                variant="tonal" 
                class="register-view__error"
              >
                {{ generalError }}
              </v-alert>

              <v-alert 
                v-if="successMessage" 
                type="success" 
                variant="tonal" 
                class="register-view__success"
              >
                {{ successMessage }}
              </v-alert>

              <div class="register-view__footer">
                <p class="register-view__footer-text">
                  ¿Ya tienes una cuenta?
                  <RouterLink 
                    to="/login" 
                    class="register-view__footer-link"
                  >
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
import { useAuthStore } from '@/stores/authStore'
import { validateEmail, validatePassword } from '@/utils/helpers'

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
      showConfirmPassword: false,
      nameRules: [
        v => !!v || 'El nombre es requerido',
        v => (v && v.trim().length >= 2) || 'El nombre debe tener al menos 2 caracteres'
      ],
      emailRules: [
        v => !!v || 'El correo electrónico es requerido',
        v => validateEmail(v) || 'Ingresa un correo electrónico válido'
      ],
      passwordRules: [
        v => !!v || 'La contraseña es requerida',
        v => (v && v.length >= 6) || 'La contraseña debe tener al menos 6 caracteres',
        v => {
          const validation = validatePassword(v)
          return validation.hasLetter && validation.hasNumber || 'La contraseña debe contener al menos una letra y un número'
        }
      ],
      confirmPasswordRules: [
        v => !!v || 'Confirma tu contraseña',
        v => v === this.formData.password || 'Las contraseñas no coinciden'
      ],
      termsRules: [
        v => !!v || 'Debes aceptar los términos y condiciones'
      ]
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    
    async handleRegister() {
      this.generalError = ''
      this.successMessage = ''
      
      const { valid } = await this.$refs.registerForm.validate()
      if (!valid) return
      
      this.isLoading = true
      
      try {
        const authStore = useAuthStore()
        await authStore.registerUser(this.formData.email, this.formData.password, this.formData.name)
        
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        this.successMessage = 'Cuenta creada exitosamente.'
        this.$router.push('/home')

      } catch (error) {
        if (error.message.includes('email-already-in-use')) {
          this.generalError = 'El correo electrónico ya está en uso'
        } else if (error.message.includes('invalid-email')) {
          this.generalError = 'El correo electrónico no es válido'
        } else if (error.message.includes('weak-password')) {
          this.generalError = 'La contraseña es demasiado débil'
        } else {
          this.generalError = 'Error al crear la cuenta. Intenta nuevamente.'
        }
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.register-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #a3c4f3 0%, #b2a3f3 100%);
  display: flex;
  align-items: center;
}

.register-view__container {
  height: 100vh;
}

.register-view__row {
  height: 100%;
}

.register-view__illustration {
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.register-view__illustration-content {
  text-align: center;
  max-width: 400px;
}

.register-view__icon-container {
  margin-bottom: 2rem;
}

.register-view__icon {
  opacity: 0.8;
  animation: float 3s ease-in-out infinite;
}

.register-view__illustration-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.register-view__illustration-subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.register-view__features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.register-view__feature {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.register-view__feature-icon {
  margin-right: 0.5rem;
}

.register-view__form-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-view__form-container {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 500px;
}

.register-view__header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-view__logo {
  margin-bottom: 1rem;
  animation: fadeInDown 0.8s ease-out;
}

.register-view__title {
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.register-view__subtitle {
  color: #666;
  margin: 0;
}

.register-view__form {
  animation: fadeInUp 0.8s ease-out;
}

.register-view__field {
  margin-bottom: 1rem;
}

.register-view__checkbox {
  margin-bottom: 1.5rem;
}

.register-view__submit-btn {
  margin-bottom: 1rem;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-view__error,
.register-view__success {
  margin-bottom: 1rem;
}

.register-view__footer {
  text-align: center;
}

.register-view__footer-text {
  margin: 0;
  color: #666;
}

.register-view__footer-link {
  color: #764ba2;
  text-decoration: none;
  font-weight: 600;
}

.register-view__footer-link:hover {
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
  .register-view__form-container {
    margin: 2rem;
    padding: 2rem;
  }
  
  .register-view {
    background: white;
  }
}

@media (max-width: 575.98px) {
  .register-view__form-container {
    margin: 1rem;
    padding: 1.5rem;
    border-radius: 15px;
  }
}
</style>