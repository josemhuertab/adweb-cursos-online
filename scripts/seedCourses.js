import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD-UNctI2YvYg7ZTG7PZ9tuzBJAPbA2QcE",
  authDomain: "adweb-cursos-online.firebaseapp.com",
  projectId: "adweb-cursos-online",
  storageBucket: "adweb-cursos-online.firebasestorage.app",
  messagingSenderId: "512127636297",
  appId: "1:512127636297:web:c9f312633e9995e6f88098"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const courses = [
  {
    code: "FE001",
    name: "Fundamentos de HTML y CSS",
    description: "Aprende las bases del desarrollo web con HTML5 y CSS3. Desde la estructura básica hasta layouts responsivos con Flexbox y Grid.",
    imageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop&crop=center",
    price: 89000,
    duration: "6 semanas",
    cupos: 25,
    inscritos: 0,
    status: "disponible",
    assignedMembers: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: "FE002", 
    name: "JavaScript Moderno ES6+",
    description: "Domina JavaScript moderno con ES6+, incluyendo arrow functions, destructuring, async/await, modules y más.",
    imageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=600&fit=crop&crop=center",
    price: 125000,
    duration: "8 semanas",
    cupos: 20,
    inscritos: 0,
    status: "disponible",
    assignedMembers: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: "FE003",
    name: "Vue.js 3 Completo",
    description: "Curso completo de Vue.js 3 con Composition API, Pinia, Vue Router y mejores prácticas para aplicaciones modernas.",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=center", 
    price: 150000,
    duration: "10 semanas",
    cupos: 18,
    inscritos: 0,
    status: "disponible",
    assignedMembers: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: "FE004",
    name: "React Hooks y Context",
    description: "Aprende React moderno con Hooks, Context API, y patrones avanzados para crear aplicaciones escalables.",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop&crop=center",
    price: 145000,
    duration: "9 semanas", 
    cupos: 22,
    inscritos: 0,
    status: "disponible",
    assignedMembers: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: "FE005",
    name: "TypeScript para Frontend",
    description: "Domina TypeScript aplicado al desarrollo frontend. Tipos, interfaces, generics y integración con frameworks modernos.",
    imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop&crop=center",
    price: 110000,
    duration: "7 semanas",
    cupos: 20,
    inscritos: 0,
    status: "disponible", 
    assignedMembers: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: "FE006",
    name: "Desarrollo Full Stack con Node.js",
    description: "Conecta tu frontend con backend usando Node.js, Express, APIs REST y bases de datos. Proyecto completo incluido.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center",
    price: 180000,
    duration: "12 semanas",
    cupos: 15,
    inscritos: 0,
    status: "disponible",
    assignedMembers: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedCourses() {
  try {
    console.log('Iniciando creación de cursos...')
    
    for (const course of courses) {
      const docRef = await addDoc(collection(db, 'courses'), course)
      console.log(`✅ Curso creado: ${course.name} (ID: ${docRef.id})`)
    }
    
    console.log('🎉 Todos los cursos han sido creados exitosamente!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creando cursos:', error)
    process.exit(1)
  }
}

seedCourses()