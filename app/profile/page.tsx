'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth/AuthContext';
import { userApi, authApi } from '@/lib/api/services';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Camera, Lock, Save } from 'lucide-react';
import { getErrorMessage } from '@/lib/utils/formatters';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().optional(),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio || '',
      });
    }
  }, [isAuthenticated, user, reset]);

  const onSubmitProfile = async (data: ProfileFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await userApi.updateProfile(data);
      await refreshUser();
      setSuccess('Profile updated successfully!');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    setPasswordLoading(true);
    setError('');
    setSuccess('');

    try {
      await authApi.changePassword(data.oldPassword, data.newPassword);
      setSuccess('Password changed successfully!');
      resetPassword();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account information</p>
            </div>

            {/* Notifications */}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="card p-4">
                  <div className="text-center mb-4">
                    <div className="h-24 w-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mx-auto">
                      <Camera className="h-4 w-4" />
                      Change Photo
                    </button>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 ${
                        activeTab === 'profile'
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <User className="h-4 w-4" />
                      Profile Info
                    </button>
                    <button
                      onClick={() => setActiveTab('password')}
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 ${
                        activeTab === 'password'
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Lock className="h-4 w-4" />
                      Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {activeTab === 'profile' ? (
                  <div className="card p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Profile Information
                    </h2>

                    <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          error={errors.firstName?.message}
                          {...register('firstName')}
                        />
                        <Input
                          label="Last Name"
                          error={errors.lastName?.message}
                          {...register('lastName')}
                        />
                      </div>

                      <Input
                        label="Email Address"
                        type="email"
                        error={errors.email?.message}
                        {...register('email')}
                        disabled
                        helperText="Email cannot be changed"
                      />

                      <Textarea
                        label="Bio"
                        rows={4}
                        placeholder="Tell us about yourself..."
                        error={errors.bio?.message}
                        {...register('bio')}
                      />

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-2">Account Details</div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Role:</span>
                            <span className="font-medium text-gray-900">{user.role}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Member Since:</span>
                            <span className="font-medium text-gray-900">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email Verified:</span>
                            <span
                              className={`font-medium ${
                                user.isEmailVerified ? 'text-green-600' : 'text-yellow-600'
                              }`}
                            >
                              {user.isEmailVerified ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" loading={loading}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button type="button" variant="outline" onClick={() => reset()}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="card p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Change Password
                    </h2>

                    <form
                      onSubmit={handlePasswordSubmit(onSubmitPassword)}
                      className="space-y-4"
                    >
                      <Input
                        label="Current Password"
                        type="password"
                        error={passwordErrors.oldPassword?.message}
                        {...registerPassword('oldPassword')}
                      />

                      <Input
                        label="New Password"
                        type="password"
                        error={passwordErrors.newPassword?.message}
                        {...registerPassword('newPassword')}
                      />

                      <Input
                        label="Confirm New Password"
                        type="password"
                        error={passwordErrors.confirmPassword?.message}
                        {...registerPassword('confirmPassword')}
                      />

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Password Requirements:</strong>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>At least 6 characters long</li>
                            <li>Mix of letters and numbers recommended</li>
                          </ul>
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" loading={passwordLoading}>
                          <Lock className="h-4 w-4 mr-2" />
                          Update Password
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => resetPassword()}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
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