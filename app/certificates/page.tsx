'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth/AuthContext';
import { certificateApi } from '@/lib/api/services';
import { Certificate } from '@/types';
import { Award, Download, ExternalLink, Calendar, Loader2 } from 'lucide-react';

export default function CertificatesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCertificates();
  }, [isAuthenticated]);

  const fetchCertificates = async () => {
    try {
      const data = await certificateApi.getMyCertificates();
      setCertificates(data);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId: string) => {
    try {
      const blob = await certificateApi.downloadCertificate(certificateId);
      const url = window.URL.createObjectURL(blob as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download certificate:', error);
      alert('Failed to download certificate');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
            <p className="text-gray-600 mt-2">
              View and download your earned certificates
            </p>
          </div>

          {/* Certificates Grid */}
          {certificates.length === 0 ? (
            <div className="card p-12 text-center">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No certificates yet
              </h3>
              <p className="text-gray-600 mb-6">
                Complete courses to earn certificates
              </p>
              <button
                onClick={() => router.push('/courses')}
                className="btn-primary"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="card overflow-hidden hover:shadow-lg transition"
                >
                  {/* Certificate Preview */}
                  <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10">
                      <Award className="h-32 w-32" />
                    </div>
                    <div className="relative">
                      <Award className="h-12 w-12 mb-4" />
                      <h3 className="text-sm font-semibold mb-1 opacity-90">
                        Certificate of Completion
                      </h3>
                      <p className="text-xs opacity-75">
                        {certificate.certificateNumber}
                      </p>
                    </div>
                  </div>

                  {/* Certificate Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Issued on{' '}
                        {new Date(certificate.completionDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Verification Code: {certificate.verificationCode}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(certificate.id)}
                        className="flex-1 btn-primary text-sm py-2"
                      >
                        <Download className="h-4 w-4 mr-1 inline" />
                        Download
                      </button>
                      <button
                        onClick={() => router.push(`/certificates/${certificate.id}`)}
                        className="btn-outline text-sm py-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Verification Section */}
          {certificates.length > 0 && (
            <div className="card p-6 mt-8">
              <h3 className="font-semibold text-gray-900 mb-2">
                Verify a Certificate
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Enter a verification code to check if a certificate is authentic
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter verification code"
                  className="input-field flex-1"
                />
                <button className="btn-primary">Verify</button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}