'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth/AuthContext';
import { courseApi } from '@/lib/api/services';
import { Course, UserRole } from '@/types';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  DollarSign,
  TrendingUp,
  Loader2,
} from 'lucide-react';

export default function InstructorCoursesPage() {
  const { user, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    publishedCourses: 0,
  });

  useEffect(() => {
    if (!isAuthenticated || !hasRole(UserRole.INSTRUCTOR)) {
      router.push('/dashboard');
      return;
    }
    fetchCourses();
  }, [isAuthenticated]);

  const fetchCourses = async () => {
    try {
      const data = await courseApi.getInstructorCourses();
      setCourses(data);

      // Calculate stats
      const totalStudents = data.reduce(
        (sum, course) => sum + course.enrollmentCount,
        0
      );
      const totalRevenue = data.reduce(
        (sum, course) => sum + course.price * course.enrollmentCount,
        0
      );
      const publishedCourses = data.filter((c) => c.isPublished).length;

      setStats({
        totalCourses: data.length,
        totalStudents,
        totalRevenue,
        publishedCourses,
      });
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await courseApi.deleteCourse(courseId);
      fetchCourses();
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Failed to delete course');
    }
  };

  const handlePublishCourse = async (courseId: string) => {
    try {
      await courseApi.publishCourse(courseId);
      fetchCourses();
    } catch (error) {
      console.error('Failed to publish course:', error);
      alert('Failed to publish course');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Courses
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and create your courses
              </p>
            </div>
            <button
              onClick={() => router.push('/instructor/courses/create')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Course
            </button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalCourses}
              </div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.publishedCourses}
              </div>
              <div className="text-sm text-gray-600">Published</div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalStudents}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {formatPrice(stats.totalRevenue)}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>

          {/* Courses List */}
          {courses.length === 0 ? (
            <div className="card p-12 text-center">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No courses yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start creating your first course
              </p>
              <button
                onClick={() => router.push('/instructor/courses/create')}
                className="btn-primary"
              >
                Create Course
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="card p-6">
                  <div className="flex gap-6">
                    {/* Thumbnail */}
                    <div className="w-48 h-28 bg-gray-200 rounded flex-shrink-0">
                      {course.thumbnailUrl && (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {course.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {course.shortDescription}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {course.isPublished ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                              Published
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded">
                              Draft
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.enrollmentCount} students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatPrice(course.price)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            router.push(`/instructor/courses/${course.id}/edit`)
                          }
                          className="btn-outline text-sm"
                        >
                          <Edit className="h-4 w-4 mr-1 inline" />
                          Edit
                        </button>
                        <button
                          onClick={() => router.push(`/courses/${course.id}`)}
                          className="btn-outline text-sm"
                        >
                          <Eye className="h-4 w-4 mr-1 inline" />
                          View
                        </button>
                        {!course.isPublished && (
                          <button
                            onClick={() => handlePublishCourse(course.id)}
                            className="btn-primary text-sm"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-600 hover:bg-red-50 px-3 py-1 rounded text-sm"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}