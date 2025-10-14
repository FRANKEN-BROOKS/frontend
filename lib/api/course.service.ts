import { apiClient } from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  Course,
  Category,
  CreateCourseRequest,
  UpdateCourseRequest,
} from '@/types';

export const courseService = {
  async getAllCourses(params: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    categoryId?: string;
    level?: string;
  }): Promise<PaginatedResponse<Course>> {
    const query = new URLSearchParams();
    if (params.pageNumber) query.append('pageNumber', params.pageNumber.toString());
    if (params.pageSize) query.append('pageSize', params.pageSize.toString());
    if (params.searchTerm) query.append('searchTerm', params.searchTerm);
    if (params.categoryId) query.append('categoryId', params.categoryId);
    if (params.level) query.append('level', params.level);

    return apiClient.get<PaginatedResponse<Course>>(
      `/api/courses?${query.toString()}`
    );
  },

  async getCourseById(id: string): Promise<ApiResponse<Course>> {
    return apiClient.get<ApiResponse<Course>>(`/api/courses/${id}`);
  },

  async getCourseBySlug(slug: string): Promise<ApiResponse<Course>> {
    return apiClient.get<ApiResponse<Course>>(`/api/courses/slug/${slug}`);
  },

  async getFeaturedCourses(count: number = 10): Promise<ApiResponse<Course[]>> {
    return apiClient.get<ApiResponse<Course[]>>(
      `/api/courses/featured?count=${count}`
    );
  },

  async getInstructorCourses(instructorId: string): Promise<ApiResponse<Course[]>> {
    return apiClient.get<ApiResponse<Course[]>>(
      `/api/courses/instructor/${instructorId}`
    );
  },

  async createCourse(data: CreateCourseRequest): Promise<ApiResponse<Course>> {
    return apiClient.post<ApiResponse<Course>>('/api/courses', data);
  },

  async updateCourse(
    id: string,
    data: UpdateCourseRequest
  ): Promise<ApiResponse<Course>> {
    return apiClient.put<ApiResponse<Course>>(`/api/courses/${id}`, data);
  },

  async publishCourse(id: string): Promise<ApiResponse<Course>> {
    return apiClient.post<ApiResponse<Course>>(`/api/courses/${id}/publish`);
  },

  async deleteCourse(id: string): Promise<ApiResponse<boolean>> {
    return apiClient.delete<ApiResponse<boolean>>(`/api/courses/${id}`);
  },

  // Categories
  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get<ApiResponse<Category[]>>('/api/categories');
  },

  async getCategoryById(id: string): Promise<ApiResponse<Category>> {
    return apiClient.get<ApiResponse<Category>>(`/api/categories/${id}`);
  },
};