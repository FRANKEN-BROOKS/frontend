// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 30000;

// App Configuration
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'E-Learning Platform';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 100;

// File Upload Limits
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
export const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Course Configuration
export const MIN_COURSE_PRICE = 0;
export const MAX_COURSE_PRICE = 100000;
export const FREE_COURSE_PRICE = 0;

// Password Requirements
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 128;

// User Roles
export const ROLE_STUDENT = 'Student';
export const ROLE_INSTRUCTOR = 'Instructor';
export const ROLE_ADMIN = 'Admin';

// Course Levels
export const COURSE_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
} as const;

// Lesson Content Types
export const CONTENT_TYPES = {
  VIDEO: 'Video',
  DOCUMENT: 'Document',
  TEXT: 'Text',
  QUIZ: 'Quiz',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  SUCCESSFUL: 'Successful',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
} as const;

// Course Sort Options
export const COURSE_SORT_OPTIONS = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price', label: 'Price: Low to High' },
] as const;

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Currency
export const DEFAULT_CURRENCY = 'THB';
export const CURRENCY_SYMBOL = '฿';

// Quiz Configuration
export const MIN_PASSING_SCORE = 50;
export const MAX_PASSING_SCORE = 100;
export const DEFAULT_PASSING_SCORE = 70;

// Certificate Configuration
export const CERTIFICATE_VALIDITY_YEARS = 2;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
} as const;

// Email Regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// URL Regex
export const URL_REGEX = /^https?:\/\/.+/;

// Routes
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/courses',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
];

export const AUTH_ROUTES = [
  '/dashboard',
  '/profile',
  '/my-learning',
  '/certificates',
  '/checkout',
  '/learn',
];

export const INSTRUCTOR_ROUTES = [
  '/instructor/courses',
  '/instructor/analytics',
];

export const ADMIN_ROUTES = [
  '/admin',
  '/admin/users',
  '/admin/courses',
  '/admin/categories',
  '/admin/analytics',
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
} as const;