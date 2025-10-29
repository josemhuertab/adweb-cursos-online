import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyD-UNctI2YvYg7ZTG7PZ9tuzBJAPbA2QcE",
  authDomain: "adweb-cursos-online.firebaseapp.com",
  projectId: "adweb-cursos-online",
  storageBucket: "adweb-cursos-online.firebasestorage.app",
  messagingSenderId: "512127636297",
  appId: "1:512127636297:web:c9f312633e9995e6f88098"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

async function createAdminUser() {
  try {
    console.log('Creando usuario administrador...')
    
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@adweb.cl', 
      '123456'
    )
    
    console.log('✅ Usuario administrador creado exitosamente!')
    console.log('📧 Email: admin@adweb.cl')
    console.log('🔑 Contraseña: 123456')
    console.log('🆔 UID:', userCredential.user.uid)
    
    process.exit(0)
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  El usuario administrador ya existe')
      console.log('📧 Email: admin@adweb.cl')
      console.log('🔑 Contraseña: 123456')
    } else {
      console.error('❌ Error creando usuario administrador:', error.message)
    }
    process.exit(1)
  }
}

createAdminUser()