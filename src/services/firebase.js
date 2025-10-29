import { auth, db } from '@/firebase/config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'

export const authService = {
  async register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      return { success: true, user: userCredential.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: userCredential.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  async logout() {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback)
  }
}

export const coursesService = {
  subscribeToCollection(callback) {
    const coursesQuery = query(collection(db, 'courses'), orderBy('name'))
    return onSnapshot(coursesQuery, callback)
  },

  async addCourse(courseData) {
    try {
      const docRef = await addDoc(collection(db, 'courses'), {
        ...courseData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  async updateCourse(courseId, courseData) {
    try {
      const courseRef = doc(db, 'courses', courseId)
      await updateDoc(courseRef, {
        ...courseData,
        updatedAt: new Date()
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  async deleteCourse(courseId) {
    try {
      const courseRef = doc(db, 'courses', courseId)
      await deleteDoc(courseRef)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}