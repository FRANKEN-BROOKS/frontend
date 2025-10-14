import { apiClient } from './client';
import type { ApiResponse, Enrollment } from '@/types';

interface CreateEnrollmentRequest {
  userId: string;
  courseId: string;
  priceThb: number;
  couponCode?: string;
}

export const enrollmentService = {
  async getUserEnrollments(userId: string): Promise<ApiResponse<Enrollment[]>> {
    return apiClient.get<ApiResponse<Enrollment[]>>(
      `/api/enrollments/user/${userId}`
    );
  },

  async getEnrollmentById(id: string): Promise<ApiResponse<Enrollment>> {
    return apiClient.get<ApiResponse<Enrollment>>(`/api/enrollments/${id}`);
  },

  async createEnrollment(
    data: CreateEnrollmentRequest
  ): Promise<ApiResponse<Enrollment>> {
    return apiClient.post<ApiResponse<Enrollment>>('/api/enrollments', data);
  },

  async cancelEnrollment(
    id: string,
    reason: string
  ): Promise<ApiResponse<boolean>> {
    return apiClient.post<ApiResponse<boolean>>(
      `/api/enrollments/${id}/cancel`,
      { reason }
    );
  },

  async completeEnrollment(id: string): Promise<ApiResponse<Enrollment>> {
    return apiClient.put<ApiResponse<Enrollment>>(
      `/api/enrollments/${id}/complete`
    );
  },

  // Wishlist
  async getUserWishlist(userId: string): Promise<ApiResponse<unknown[]>> {
    return apiClient.get<ApiResponse<unknown[]>>(`/api/wishlist/user/${userId}`);
  },

  async addToWishlist(
    userId: string,
    courseId: string,
    notes?: string
  ): Promise<ApiResponse<unknown>> {
    return apiClient.post<ApiResponse<unknown>>('/api/wishlist', {
      userId,
      courseId,
      notes,
    });
  },

  async removeFromWishlist(
    userId: string,
    courseId: string
  ): Promise<ApiResponse<boolean>> {
    return apiClient.delete<ApiResponse<boolean>>(
      `/api/wishlist?userId=${userId}&courseId=${courseId}`
    );
  },
};