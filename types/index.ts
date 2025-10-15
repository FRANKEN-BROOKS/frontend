// Auth Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  profilePicture?: string;
  bio?: string;
  createdAt: string;
}

export enum UserRole {
  STUDENT = 'Student',
  INSTRUCTOR = 'Instructor',
  ADMIN = 'Admin',
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  price: number;
  discountPrice?: number;
  level: CourseLevel;
  language: string;
  categoryId: string;
  category?: Category;
  instructorId: string;
  instructor?: User;
  isPublished: boolean;
  topics?: Topic[];
  totalLessons: number;
  totalDuration: number;
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
}

export interface Topic {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  description?: string;
  contentType: LessonContentType;
  videoUrl?: string;
  documentUrl?: string;
  content?: string;
  duration: number;
  orderIndex: number;
  isFree: boolean;
  quizId?: string;
  quiz?: Quiz;
}

export enum LessonContentType {
  VIDEO = 'Video',
  DOCUMENT = 'Document',
  TEXT = 'Text',
  QUIZ = 'Quiz',
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  questions?: Question[];
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  questionType: QuestionType;
  orderIndex: number;
  options?: QuestionOption[];
  correctAnswer?: string;
  points: number;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MultipleChoice',
  TRUE_FALSE = 'TrueFalse',
  SHORT_ANSWER = 'ShortAnswer',
}

export interface QuestionOption {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
}

// Enrollment Types
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  course?: Course;
  enrolledAt: string;
  completedAt?: string;
  progress: number;
  lastAccessedAt?: string;
  certificateId?: string;
}

export interface EnrollmentProgress {
  enrollmentId: string;
  completedLessons: string[];
  quizAttempts: QuizAttempt[];
  overallProgress: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  passed: boolean;
  submittedAt: string;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
}

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
}

export enum PaymentStatus {
  PENDING = 'Pending',
  SUCCESSFUL = 'Successful',
  FAILED = 'Failed',
  REFUNDED = 'Refunded',
}

export interface Order {
  id: string;
  userId: string;
  courseId: string;
  course?: Course;
  totalAmount: number;
  discountAmount?: number;
  finalAmount: number;
  status: OrderStatus;
  paymentId?: string;
  createdAt: string;
}

export enum OrderStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface OmiseChargeRequest {
  amount: number;
  currency: string;
  description: string;
  returnUri: string;
  metadata?: Record<string, any>;
}

// Certificate Types
export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  course?: Course;
  enrollmentId: string;
  verificationCode: string;
  issuedAt: string;
  certificateUrl?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
  message?: string;
}

// Filter and Search Types
export interface CourseFilters {
  categoryId?: string;
  level?: CourseLevel;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sortBy?: 'price' | 'rating' | 'popularity' | 'newest';
  page?: number;
  pageSize?: number;
}

// Form Types
export interface CourseFormData {
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  level: CourseLevel;
  language: string;
  categoryId: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
}

export interface TopicFormData {
  title: string;
  description?: string;
  orderIndex: number;
}

export interface LessonFormData {
  title: string;
  description?: string;
  contentType: LessonContentType;
  videoUrl?: string;
  documentUrl?: string;
  content?: string;
  duration: number;
  orderIndex: number;
  isFree: boolean;
}