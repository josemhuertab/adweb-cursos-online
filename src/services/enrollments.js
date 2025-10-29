import { db } from '@/firebase/config'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore'

export const enrollmentService = {
  async createEnrollment(userId, userEmail, courseId, courseName, coursePrice) {
    try {
      const enrollmentData = {
        userId,
        userEmail,
        courseId,
        courseName,
        coursePrice,
        status: 'pending', // pending, approved, rejected
        requestedAt: new Date(),
        approvedAt: null,
        approvedBy: null
      }
      
      const docRef = await addDoc(collection(db, 'enrollments'), enrollmentData)
      
      // Crear notificación para el admin
      await this.createNotification({
        type: 'enrollment_request',
        title: 'Nueva solicitud de inscripción',
        message: `${userEmail} solicita inscribirse al curso "${courseName}"`,
        enrollmentId: docRef.id,
        userId,
        courseId,
        createdAt: new Date(),
        read: false
      })
      
      return { success: true, id: docRef.id }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  async approveEnrollment(enrollmentId, adminEmail) {
    try {
      const enrollmentRef = doc(db, 'enrollments', enrollmentId)
      
      // Obtener datos de la inscripción
      const enrollmentDoc = await getDocs(query(
        collection(db, 'enrollments'),
        where('__name__', '==', enrollmentId)
      ))
      
      if (enrollmentDoc.empty) {
        throw new Error('Inscripción no encontrada')
      }
      
      const enrollment = enrollmentDoc.docs[0].data()
      
      // Actualizar inscripción
      await updateDoc(enrollmentRef, {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: adminEmail
      })
      
      // Agregar usuario al curso
      const courseRef = doc(db, 'courses', enrollment.courseId)
      await updateDoc(courseRef, {
        assignedMembers: arrayUnion(enrollment.userEmail),
        inscritos: increment(1)
      })
      
      // Crear notificación para el usuario
      await this.createNotification({
        type: 'enrollment_approved',
        title: 'Inscripción aprobada',
        message: `Tu inscripción al curso "${enrollment.courseName}" ha sido aprobada`,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        createdAt: new Date(),
        read: false
      })
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  async rejectEnrollment(enrollmentId, adminEmail, reason = '') {
    try {
      const enrollmentRef = doc(db, 'enrollments', enrollmentId)
      
      // Obtener datos de la inscripción
      const enrollmentDoc = await getDocs(query(
        collection(db, 'enrollments'),
        where('__name__', '==', enrollmentId)
      ))
      
      if (enrollmentDoc.empty) {
        throw new Error('Inscripción no encontrada')
      }
      
      const enrollment = enrollmentDoc.docs[0].data()
      
      // Actualizar inscripción
      await updateDoc(enrollmentRef, {
        status: 'rejected',
        rejectedAt: new Date(),
        rejectedBy: adminEmail,
        rejectionReason: reason
      })
      
      // Crear notificación para el usuario
      await this.createNotification({
        type: 'enrollment_rejected',
        title: 'Inscripción rechazada',
        message: `Tu inscripción al curso "${enrollment.courseName}" ha sido rechazada${reason ? ': ' + reason : ''}`,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        createdAt: new Date(),
        read: false
      })
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },

  async getUserEnrollments(userId) {
    if (!userId) {
      return []
    }
    
    try {
      const q = query(
        collection(db, 'enrollments'),
        where('userId', '==', userId)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error getting user enrollments:', error)
      return []
    }
  },

  async getPendingEnrollments() {
    try {
      const q = query(
        collection(db, 'enrollments'),
        where('status', '==', 'pending')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      throw new Error(error.message)
    }
  },

  subscribeToPendingEnrollments(callback) {
    const q = query(
      collection(db, 'enrollments'),
      where('status', '==', 'pending')
    )
    return onSnapshot(q, callback)
  },

  async createNotification(notificationData) {
    try {
      await addDoc(collection(db, 'notifications'), notificationData)
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  },

  async getAdminNotifications() {
    try {
      const q = query(collection(db, 'notifications'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.createdAt - a.createdAt)
    } catch (error) {
      throw new Error(error.message)
    }
  },

  subscribeToAdminNotifications(callback) {
    const q = query(collection(db, 'notifications'))
    return onSnapshot(q, callback)
  },

  async markNotificationAsRead(notificationId) {
    try {
      const notificationRef = doc(db, 'notifications', notificationId)
      await updateDoc(notificationRef, { read: true })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}