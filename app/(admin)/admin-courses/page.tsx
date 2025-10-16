'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth/AuthContext';
import { adminApi, courseApi } from '@/lib/api/services';
import { Course, UserRole } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  Users, 
  DollarSign,
  Loader2 
} from 'lucide-react';

export default function AdminCoursesPage() {
  const { hasRole, isAuthenticated } = useAuth();
  const router = useRouter();
  const [pendingCourses, setPendingCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  useEffect(() => {
    if (!isAuthenticated || !hasRole(UserRole.ADMIN)) {
      router.push('/dashboard');
      return;
    }
    fetchCourses();
  }, [isAuthenticated]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const [pending, all] = await Promise.all([
        adminApi.getPendingCourses(),
        courseApi.getCourses({ page: 1, pageSize: 100 }),
      ]);
      setPendingCourses(pending);
      setAllCourses(all.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to approve this course?')) return;

    try {
      await adminApi.approveCourse(courseId);
      await fetchCourses();
      alert('Course approved successfully!');
    } catch (error) {
      console.error('Failed to approve course:', error);
      alert('Failed to approve course');
    }
  };

  const handleRejectCourse = async () => {
    if (!selectedCourse || !rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      await adminApi.rejectCourse(selectedCourse.id, rejectReason);
      await fetchCourses();
      setShowRejectModal(false);
      setRejectReason('');
      alert('Course rejected successfully!');
    } catch (error) {
      console.error('Failed to reject course:', error);
      alert('Failed to reject course');
    }
  };

  const openRejectModal = (course: Course) => {
    setSelectedCourse(course);
    setShowRejectModal(true);
  };

  const coursesToDisplay = activeTab === 'pending' ? pendingCourses : allCourses;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
            <p className="text-gray-600 mt-2">
              Review and approve courses submitted by instructors
            </p>
          </div>

          {/* Tabs */}
          <div className="card mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'pending'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pending Approval ({pendingCourses.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'all'
                    ? 'border-b-2 border-primary-600 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Courses ({allCourses.length})
              </button>
            </div>
          </div>

          {/* Courses List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : coursesToDisplay.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-600">
                {activeTab === 'pending' 
                  ? 'No courses pending approval' 
                  : 'No courses found'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {coursesToDisplay.map((course) => (
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
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {course.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            by {course.instructor?.firstName} {course.instructor?.lastName}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {course.isPublished ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                              Published
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Stats */}
                      <div className="flex gap-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.enrollmentCount} students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{Math.floor(course.totalDuration / 60)} hours</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>
                            {new Intl.NumberFormat('th-TH', {
                              style: 'currency',
                              currency: 'THB',
                            }).format(course.price)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/courses/${course.id}`)}
                          className="btn-outline text-sm"
                        >
                          <Eye className="h-4 w-4 mr-1 inline" />
                          View
                        </button>
                        {!course.isPublished && activeTab === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveCourse(course.id)}
                              className="btn-primary text-sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-1 inline" />
                              Approve
                            </button>
                            <button
                              onClick={() => openRejectModal(course)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                            >
                              <XCircle className="h-4 w-4 mr-1 inline" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectReason('');
        }}
        title="Reject Course"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Please provide a reason for rejecting this course. This will be sent to
            the instructor.
          </p>

          <Textarea
            label="Rejection Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            placeholder="Explain why this course cannot be approved..."
          />

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleRejectCourse}
              disabled={!rejectReason.trim()}
            >
              Reject Course
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}