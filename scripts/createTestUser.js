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

async function createTestUser() {
  try {
    console.log('Creando usuario de prueba...')
    
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'estudiante@test.com', 
      '123456'
    )
    
    console.log('✅ Usuario de prueba creado exitosamente!')
    console.log('📧 Email: estudiante@test.com')
    console.log('🔑 Contraseña: 123456')
    console.log('🆔 UID:', userCredential.user.uid)
    
    process.exit(0)
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  El usuario de prueba ya existe')
      console.log('📧 Email: estudiante@test.com')
      console.log('🔑 Contraseña: 123456')
    } else {
      console.error('❌ Error creando usuario de prueba:', error.message)
    }
    process.exit(1)
  }
}

createTestUser()