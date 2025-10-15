'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth/AuthContext';
import { adminApi } from '@/lib/api/services';
import { UserRole } from '@/types';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Award,
  Loader2,
} from 'lucide-react';

interface DashboardStats {
  totalUsers?: number;
  newUsersThisMonth?: number;
  totalCourses?: number;
  pendingCourses?: number;
  totalEnrollments?: number;
  enrollmentsThisMonth?: number;
  totalRevenue?: number;
  revenueThisMonth?: number;
  recentUsers?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }>;
  recentPendingCourses?: Array<{
    id: string;
    title: string;
    instructor?: {
      firstName: string;
      lastName: string;
    };
  }>;
}

export default function AdminDashboard() {
  const { hasRole, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !hasRole(UserRole.ADMIN)) {
      router.push('/dashboard');
      return;
    }
    fetchStats();
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your e-learning platform
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => router.push('/admin/users')}
              className="card p-6 hover:shadow-lg transition text-left"
            >
              <Users className="h-8 w-8 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Users</h3>
              <p className="text-sm text-gray-600">Manage users</p>
            </button>

            <button
              onClick={() => router.push('/admin/courses')}
              className="card p-6 hover:shadow-lg transition text-left"
            >
              <BookOpen className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Courses</h3>
              <p className="text-sm text-gray-600">Review courses</p>
            </button>

            <button
              onClick={() => router.push('/admin/categories')}
              className="card p-6 hover:shadow-lg transition text-left"
            >
              <TrendingUp className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Categories</h3>
              <p className="text-sm text-gray-600">Manage categories</p>
            </button>

            <button
              onClick={() => router.push('/admin/analytics')}
              className="card p-6 hover:shadow-lg transition text-left"
            >
              <Award className="h-8 w-8 text-yellow-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
              <p className="text-sm text-gray-600">View reports</p>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats?.totalUsers || 0}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
              <div className="text-xs text-green-600 mt-2">
                +{stats?.newUsersThisMonth || 0} this month
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats?.totalCourses || 0}
              </div>
              <div className="text-sm text-gray-600">Total Courses</div>
              <div className="text-xs text-yellow-600 mt-2">
                {stats?.pendingCourses || 0} pending approval
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats?.totalEnrollments || 0}
              </div>
              <div className="text-sm text-gray-600">Total Enrollments</div>
              <div className="text-xs text-green-600 mt-2">
                +{stats?.enrollmentsThisMonth || 0} this month
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ฿{(stats?.totalRevenue || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xs text-green-600 mt-2">
                +฿{(stats?.revenueThisMonth || 0).toLocaleString()} this month
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="card">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Recent Users</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {stats?.recentUsers?.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-semibold">
                            {user.firstName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{user.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="card">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Pending Course Approvals</h3>
                <button
                  onClick={() => router.push('/admin/courses')}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="p-4">
                {stats?.pendingCourses > 0 ? (
                  <div className="space-y-3">
                    {stats?.recentPendingCourses?.map((course: any) => (
                      <div key={course.id} className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            by {course.instructor?.firstName} {course.instructor?.lastName}
                          </div>
                        </div>
                        <button className="btn-primary text-sm">Review</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">
                    No pending approvals
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}