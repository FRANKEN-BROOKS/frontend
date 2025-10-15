'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth/AuthContext';
import { enrollmentApi, certificateApi } from '@/lib/api/services';
import { Enrollment, Certificate } from '@/types';
import {
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  PlayCircle,
  Loader2,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [enrollmentsData, certificatesData] = await Promise.all([
        enrollmentApi.getMyEnrollments(),
        certificateApi.getMyCertificates(),
      ]);
      setEnrollments(enrollmentsData);
      setCertificates(certificatesData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    coursesEnrolled: enrollments.length,
    coursesCompleted: enrollments.filter((e) => e.completedAt).length,
    certificatesEarned: certificates.length,
    averageProgress:
      enrollments.length > 0
        ? Math.round(
            enrollments.reduce((sum, e) => sum + e.progress, 0) /
              enrollments.length
          )
        : 0,
  };

  const continueWatching = enrollments
    .filter((e) => !e.completedAt && e.progress > 0)
    .sort(
      (a, b) =>
        new Date(b.lastAccessedAt || b.enrolledAt).getTime() -
        new Date(a.lastAccessedAt || a.enrolledAt).getTime()
    )
    .slice(0, 4);

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
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-2">
              Continue your learning journey
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.coursesEnrolled}
              </div>
              <div className="text-sm text-gray-600">Courses Enrolled</div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.averageProgress}%
              </div>
              <div className="text-sm text-gray-600">Average Progress</div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.coursesCompleted}
              </div>
              <div className="text-sm text-gray-600">Courses Completed</div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.certificatesEarned}
              </div>
              <div className="text-sm text-gray-600">Certificates</div>
            </div>
          </div>

          {/* Continue Watching */}
          {continueWatching.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Continue Learning
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {continueWatching.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    onClick={() =>
                      router.push(`/learn/${enrollment.courseId}`)
                    }
                    className="card overflow-hidden cursor-pointer hover:shadow-lg transition"
                  >
                    <div className="relative h-40 bg-gray-200">
                      {enrollment.course?.thumbnailUrl && (
                        <img
                          src={enrollment.course.thumbnailUrl}
                          alt={enrollment.course.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <PlayCircle className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {enrollment.course?.title}
                      </h3>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(enrollment.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* All Courses */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                My Courses
              </h2>
              <button
                onClick={() => router.push('/courses')}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Browse More
              </button>
            </div>

            {enrollments.length === 0 ? (
              <div className="card p-12 text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No courses yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start learning by enrolling in a course
                </p>
                <button
                  onClick={() => router.push('/courses')}
                  className="btn-primary"
                >
                  Explore Courses
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="card overflow-hidden">
                    <div className="relative h-48 bg-gray-200">
                      {enrollment.course?.thumbnailUrl && (
                        <img
                          src={enrollment.course.thumbnailUrl}
                          alt={enrollment.course.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {enrollment.completedAt && (
                        <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          Completed
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {enrollment.course?.title}
                      </h3>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(enrollment.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          router.push(`/learn/${enrollment.courseId}`)
                        }
                        className="w-full btn-primary"
                      >
                        {enrollment.completedAt
                          ? 'Review Course'
                          : 'Continue Learning'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Certificates */}
          {certificates.length > 0 && (
            <section className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  My Certificates
                </h2>
                <button
                  onClick={() => router.push('/certificates')}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  View All
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {certificates.slice(0, 3).map((certificate) => (
                  <div
                    key={certificate.id}
                    className="card p-6 cursor-pointer hover:shadow-lg transition"
                    onClick={() =>
                      router.push(`/certificates/${certificate.id}`)
                    }
                  >
                    <Award className="h-12 w-12 text-yellow-600 mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {certificate.course?.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Earned on{' '}
                      {new Date(certificate.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}