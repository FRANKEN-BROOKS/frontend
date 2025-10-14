import { apiClient } from './client';
import type { ApiResponse, Certificate } from '@/types';

interface CertificateVerificationResult {
  isValid: boolean;
  certificateNumber: string;
  userFullName: string;
  courseTitle: string;
  issueDate: string;
  expiryDate?: string;
  status: string;
}

export const certificateService = {
  async getUserCertificates(userId: string): Promise<ApiResponse<Certificate[]>> {
    return apiClient.get<ApiResponse<Certificate[]>>(
      `/api/certificates/user/${userId}`
    );
  },

  async getCertificateById(id: string): Promise<ApiResponse<Certificate>> {
    return apiClient.get<ApiResponse<Certificate>>(`/api/certificates/${id}`);
  },

  async downloadCertificate(id: string): Promise<Blob> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/certificates/${id}/download`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.blob();
  },

  async verifyCertificate(
    code: string
  ): Promise<ApiResponse<CertificateVerificationResult>> {
    return apiClient.get<ApiResponse<CertificateVerificationResult>>(
      `/api/certificates/verify/${code}`
    );
  },

  async shareCertificate(
    id: string,
    platform: string
  ): Promise<ApiResponse<boolean>> {
    return apiClient.post<ApiResponse<boolean>>(
      `/api/certificates/${id}/share`,
      { platform }
    );
  },
};