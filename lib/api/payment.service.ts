import { apiClient } from './client';
import type { ApiResponse, Payment, CreateChargeRequest } from '@/types';

export const paymentService = {
  async createCharge(
    data: CreateChargeRequest
  ): Promise<ApiResponse<Payment>> {
    return apiClient.post<ApiResponse<Payment>>(
      '/api/payments/create-charge',
      data
    );
  },

  async getPaymentById(id: string): Promise<ApiResponse<Payment>> {
    return apiClient.get<ApiResponse<Payment>>(`/api/payments/${id}`);
  },

  async getUserPayments(userId: string): Promise<ApiResponse<Payment[]>> {
    return apiClient.get<ApiResponse<Payment[]>>(
      `/api/payments/user/${userId}`
    );
  },

  async requestRefund(
    paymentId: string,
    amount: number,
    reason: string
  ): Promise<ApiResponse<unknown>> {
    return apiClient.post<ApiResponse<unknown>>(
      `/api/payments/${paymentId}/refund`,
      { amount, reason }
    );
  },
};