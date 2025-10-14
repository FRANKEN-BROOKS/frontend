// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  statusCode: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  profileImageUrl?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginDate?: string;
  createdAt: string;
  roles: string[];
  permissions: string[];
  profile?: UserProfile;
}

export interface UserProfile {
  bio?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  occupation?: string;
  company?: string;
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
  phoneNumber?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  categoryId: string;
  categoryName?: string;
  instructorId: string;
  instructorName?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  level: string;
  language: string;
  priceThb: number;
  discountPriceThb?: number;
  effectivePrice: number;
  hasDiscount: boolean;
  duration: number;
  isPublished: boolean;
  publishedAt?: string;
  isFeatured: boolean;
  enrollmentCount: number;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
  topics?: CourseTopic[];
}

export interface CourseTopic {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  displayOrder: number;
  duration: number;
  isActive: boolean;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  topicId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  duration: number;
  displayOrder: number;
  isFree: boolean;
  isActive: boolean;
  resources?: LessonResource[];
}

export interface LessonResource {
  id: string;
  title: string;
  description?: string;
  resourceType: string;
  resourceUrl: string;
  fileSize?: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  topicId?: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  maxAttempts?: number;
  isActive: boolean;
  questions?: Question[];
}

export interface Question {
  id: string;
  questionText: string;
  questionType: string;
  points: number;
  explanation?: string;
  imageUrl?: string;
  options?: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  optionText: string;
  isCorrect: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  courseCount?: number;
}

// Enrollment Types
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrollmentDate: string;
  expiryDate?: string;
  status: string;
  paymentStatus: string;
  priceThb: number;
  paymentMethod?: string;
  transactionId?: string;
  lastAccessedAt?: string;
  completionPercentage: number;
  isCompleted: boolean;
  completedAt?: string;
}

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  orderId: string;
  transactionId?: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  paymentDate?: string;
}

export interface CreateChargeRequest {
  userId: string;
  courseId: string;
  amount: number;
  paymentMethod: string;
  cardToken: string;
  description: string;
  returnUri?: string;
}

// Certificate Types
export interface Certificate {
  id: string;
  certificateNumber: string;
  userId: string;
  courseId: string;
  userFullName: string;
  courseTitle: string;
  instructorName: string;
  completionDate: string;
  issueDate: string;
  expiryDate?: string;
  finalScore?: number;
  grade?: string;
  totalHours: number;
  verificationCode: string;
  status: string;
  pdfUrl?: string;
  isPublic: boolean;
}

// Form Types
export interface CreateCourseRequest {
  title: string;
  shortDescription?: string;
  description?: string;
  categoryId: string;
  instructorId: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  level: string;
  language: string;
  priceThb: number;
  discountPriceThb?: number;
}

export interface UpdateCourseRequest extends CreateCourseRequest {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}