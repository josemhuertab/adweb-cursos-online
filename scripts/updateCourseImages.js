import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore'

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

const imageMap = {
  "FE001": "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=600&fit=crop&crop=center", // HTML/CSS
  "FE002": "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=600&fit=crop&crop=center", // JavaScript
  "FE003": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=center", // Vue.js
  "FE004": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop&crop=center", // React
  "FE005": "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop&crop=center", // TypeScript
  "FE006": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center"  // Node.js
}

async function updateCourseImages() {
  try {
    console.log('Actualizando imágenes de cursos...')
    
    const coursesSnapshot = await getDocs(collection(db, 'courses'))
    
    for (const courseDoc of coursesSnapshot.docs) {
      const courseData = courseDoc.data()
      const newImageUrl = imageMap[courseData.code]
      
      if (newImageUrl) {
        await updateDoc(doc(db, 'courses', courseDoc.id), {
          imageUrl: newImageUrl,
          updatedAt: new Date()
        })
        console.log(`✅ Imagen actualizada para ${courseData.name}`)
      }
    }
    
    console.log('🎉 Todas las imágenes han sido actualizadas!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error actualizando imágenes:', error)
    process.exit(1)
  }
}

updateCourseImages()