import {defineStore} from "pinia";
import {db} from "@/firebase/config";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [],
    loading: false,
    error: null
  }),
  getters: {
    getCourses: (state) => state.courses
  },
  actions: {
    setCourses(courses) {
      this.courses = courses;
    },
    setLoading(status) {
      this.loading = status;
    },
    setError(err) {
      this.error = err;
    },

    subscribeToCourses() {
      this.setLoading(true);
      const coursesCol = collection(db, 'courses');
      return onSnapshot(coursesCol, (snapshot) => {
        const coursesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        this.setCourses(coursesList);
        this.setLoading(false);
      }, (error) => {
        console.error('Firestore subscription error:', error);
        this.setError(error.message);
        this.setLoading(false);
      });
    },

    async addCourse(newCourseData) {
      try {
        await addDoc(collection(db, 'courses'), newCourseData);
        return { success: true };
      } catch (error) {
        console.error('Error adding course:', error);
        this.setError(error.message);
        return { success: false, error: error.message };
      }
    },

    async deleteCourse(courseId) {
      try {
        const courseRef = doc(db, 'courses', courseId);
        await deleteDoc(courseRef);
        return { success: true };
      } catch (error) {
        console.error('Error deleting course:', error);
        this.setError(error.message);
        return { success: false, error: error.message };
      }
    },

    async updateCourse(courseId, updatedData) {
      try {
        const courseRef = doc(db, 'courses', courseId);
        await updateDoc(courseRef, updatedData);
        return { success: true };
      } catch (error) {
        console.error('Error updating course:', error);
        this.setError(error.message);
        return { success: false, error: error.message };
      }
    }
  }
});