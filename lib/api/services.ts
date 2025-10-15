import apiClient from './client';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Course,
  CourseFilters,
  PaginatedResponse,
  Category,
  Enrollment,
  Payment,
  Order,
  Certificate,
  Topic,
  Lesson,
  Quiz,
  QuizAttempt,
  OmiseChargeRequest,
} from '@/types';

// Auth API
export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  logout: () => apiClient.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/auth/refresh-token', { refreshToken }),

  getCurrentUser: () => apiClient.get<User>('/users/me'),

  changePassword: (oldPassword: string, newPassword: string) =>
    apiClient.post('/auth/change-password', { oldPassword, newPassword }),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { token, newPassword }),

  verifyEmail: (token: string) =>
    apiClient.get(`/auth/verify-email?token=${token}`),
};

// Course API
export const courseApi = {
  getCourses: (filters?: CourseFilters) =>
    apiClient.get<PaginatedResponse<Course>>('/courses', {
      params: filters,
    }),

  getCourseById: (id: string) => apiClient.get<Course>(`/courses/${id}`),

  getCourseBySlug: (slug: string) =>
    apiClient.get<Course>(`/courses/slug/${slug}`),

  createCourse: (data: Partial<Course>) =>
    apiClient.post<Course>('/courses', data),

  updateCourse: (id: string, data: Partial<Course>) =>
    apiClient.put<Course>(`/courses/${id}`, data),

  deleteCourse: (id: string) => apiClient.delete(`/courses/${id}`),

  publishCourse: (id: string) =>
    apiClient.post<Course>(`/courses/${id}/publish`),

  getInstructorCourses: () =>
    apiClient.get<Course[]>('/courses/instructor/my-courses'),

  searchCourses: (query: string) =>
    apiClient.get<Course[]>(`/courses/search?q=${query}`),
};

// Category API
export const categoryApi = {
  getCategories: () => apiClient.get<Category[]>('/categories'),

  getCategoryById: (id: string) =>
    apiClient.get<Category>(`/categories/${id}`),

  createCategory: (data: Partial<Category>) =>
    apiClient.post<Category>('/categories', data),

  updateCategory: (id: string, data: Partial<Category>) =>
    apiClient.put<Category>(`/categories/${id}`, data),

  deleteCategory: (id: string) => apiClient.delete(`/categories/${id}`),
};

// Topic API
export const topicApi = {
  getTopicsByCourse: (courseId: string) =>
    apiClient.get<Topic[]>(`/courses/${courseId}/topics`),

  createTopic: (data: Partial<Topic>) => apiClient.post<Topic>('/topics', data),

  updateTopic: (id: string, data: Partial<Topic>) =>
    apiClient.put<Topic>(`/topics/${id}`, data),

  deleteTopic: (id: string) => apiClient.delete(`/topics/${id}`),

  reorderTopics: (courseId: string, topicIds: string[]) =>
    apiClient.post(`/courses/${courseId}/topics/reorder`, { topicIds }),
};

// Lesson API
export const lessonApi = {
  getLessonsByTopic: (topicId: string) =>
    apiClient.get<Lesson[]>(`/topics/${topicId}/lessons`),

  getLessonById: (id: string) => apiClient.get<Lesson>(`/lessons/${id}`),

  createLesson: (data: Partial<Lesson>) =>
    apiClient.post<Lesson>('/lessons', data),

  updateLesson: (id: string, data: Partial<Lesson>) =>
    apiClient.put<Lesson>(`/lessons/${id}`, data),

  deleteLesson: (id: string) => apiClient.delete(`/lessons/${id}`),

  reorderLessons: (topicId: string, lessonIds: string[]) =>
    apiClient.post(`/topics/${topicId}/lessons/reorder`, { lessonIds }),

  markLessonComplete: (lessonId: string, enrollmentId: string) =>
    apiClient.post(`/lessons/${lessonId}/complete`, { enrollmentId }),
};

// Quiz API
export const quizApi = {
  getQuizById: (id: string) => apiClient.get<Quiz>(`/quizzes/${id}`),

  createQuiz: (data: Partial<Quiz>) => apiClient.post<Quiz>('/quizzes', data),

  updateQuiz: (id: string, data: Partial<Quiz>) =>
    apiClient.put<Quiz>(`/quizzes/${id}`, data),

  deleteQuiz: (id: string) => apiClient.delete(`/quizzes/${id}`),

  submitQuiz: (quizId: string, answers: Record<string, string>) =>
    apiClient.post<QuizAttempt>(`/quizzes/${quizId}/submit`, { answers }),

  getQuizAttempts: (quizId: string) =>
    apiClient.get<QuizAttempt[]>(`/quizzes/${quizId}/attempts`),
};

// Enrollment API
export const enrollmentApi = {
  getMyEnrollments: () => apiClient.get<Enrollment[]>('/enrollments'),

  getEnrollmentById: (id: string) =>
    apiClient.get<Enrollment>(`/enrollments/${id}`),

  enrollInCourse: (courseId: string) =>
    apiClient.post<Enrollment>('/enrollments', { courseId }),

  cancelEnrollment: (id: string) =>
    apiClient.post(`/enrollments/${id}/cancel`),

  getEnrollmentProgress: (enrollmentId: string) =>
    apiClient.get(`/enrollments/${enrollmentId}/progress`),

  checkEnrollment: (courseId: string) =>
    apiClient.get<{ isEnrolled: boolean }>(`/enrollments/check/${courseId}`),
};

// Payment API
export const paymentApi = {
  createCharge: (data: OmiseChargeRequest) =>
    apiClient.post<Payment>('/payments/create-charge', data),

  getPaymentById: (id: string) => apiClient.get<Payment>(`/payments/${id}`),

  getMyPayments: () => apiClient.get<Payment[]>('/payments'),
};

// Order API
export const orderApi = {
  createOrder: (courseId: string, couponCode?: string) =>
    apiClient.post<Order>('/orders', { courseId, couponCode }),

  getOrderById: (id: string) => apiClient.get<Order>(`/orders/${id}`),

  getMyOrders: () => apiClient.get<Order[]>('/orders'),
};

// Certificate API
export const certificateApi = {
  getMyCertificates: () => apiClient.get<Certificate[]>('/certificates'),

  getCertificateById: (id: string) =>
    apiClient.get<Certificate>(`/certificates/${id}`),

  downloadCertificate: (id: string) =>
    apiClient.get(`/certificates/${id}/download`, {
      responseType: 'blob',
    }),

  verifyCertificate: (code: string) =>
    apiClient.get<Certificate>(`/certificates/verify/${code}`),
};

// User API
export const userApi = {
  getUsers: (page: number = 1, pageSize: number = 20) =>
    apiClient.get<PaginatedResponse<User>>('/users', {
      params: { page, pageSize },
    }),

  getUserById: (id: string) => apiClient.get<User>(`/users/${id}`),

  updateUser: (id: string, data: Partial<User>) =>
    apiClient.put<User>(`/users/${id}`, data),

  updateProfile: (data: Partial<User>) =>
    apiClient.put<User>('/users/me/profile', data),

  deleteUser: (id: string) => apiClient.delete(`/users/${id}`),

  assignRole: (userId: string, role: string) =>
    apiClient.post('/users/assign-role', { userId, role }),
};

// Admin API
export const adminApi = {
  getDashboardStats: () =>
    apiClient.get('/admin/dashboard/stats'),

  getPendingCourses: () =>
    apiClient.get<Course[]>('/admin/courses/pending'),

  approveCourse: (courseId: string) =>
    apiClient.post(`/admin/courses/${courseId}/approve`),

  rejectCourse: (courseId: string, reason: string) =>
    apiClient.post(`/admin/courses/${courseId}/reject`, { reason }),
};