import { defineStore } from "pinia";
import { coursesService } from "@/services/firebase";

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
      return coursesService.subscribeToCollection((snapshot) => {
        const coursesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        this.setCourses(coursesList);
        this.setLoading(false);
      });
    },

    async addCourse(newCourseData) {
      const result = await coursesService.addCourse(newCourseData);
      if (!result.success) {
        this.setError(result.error);
      }
      return result;
    },

    async deleteCourse(courseId) {
      const result = await coursesService.deleteCourse(courseId);
      if (!result.success) {
        this.setError(result.error);
      }
      return result;
    },

    async updateCourse(courseId, updatedData) {
      const result = await coursesService.updateCourse(courseId, updatedData);
      if (!result.success) {
        this.setError(result.error);
      }
      return result;
    }
  }
});