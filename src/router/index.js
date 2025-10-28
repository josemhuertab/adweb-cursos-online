import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegistroView from '../views/RegistroView.vue'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import EditarCursoView from '../views/EditarCursoView.vue'
import { useAuthStore } from '@/stores/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { 
        requiresAuth: false,
        title: 'Iniciar Sesión - ADWEB Online'
      }
    },
    {
      path: '/registro',
      name: 'Registro',
      component: RegistroView,
      meta: { 
        requiresAuth: false,
        title: 'Crear Cuenta - ADWEB Online'
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: HomeView,
      meta: { 
        requiresAuth: true,
        title: 'Inicio - ADWEB Online'
      }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminView,
      meta: { 
        requiresAuth: true,
        title: 'Administración - ADWEB Online'
      }
    },
    {
      path: '/editar-curso/:id?',
      name: 'EditarCurso',
      component: EditarCursoView,
      meta: { 
        requiresAuth: true,
        title: 'Editar Curso - ADWEB Online'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isLoggedIn 

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
