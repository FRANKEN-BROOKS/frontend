'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth/AuthContext';
import { courseApi, categoryApi } from '@/lib/api/services';
import { Category, CourseLevel, UserRole } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { ArrowLeft, Save } from 'lucide-react';
import { getErrorMessage } from '@/lib/utils/formatters';

const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  shortDescription: z.string().min(20, 'Short description must be at least 20 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  level: z.nativeEnum(CourseLevel),
  language: z.string().min(2, 'Language is required'),
  categoryId: z.string().min(1, 'Category is required'),
  thumbnailUrl: z.string().optional(),
  previewVideoUrl: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const { hasRole, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      level: CourseLevel.BEGINNER,
      language: 'English',
      price: 0,
    },
  });

  useEffect(() => {
    if (!isAuthenticated || !hasRole(UserRole.INSTRUCTOR)) {
      router.push('/dashboard');
      return;
    }
    fetchCategories();
  }, [isAuthenticated]);

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const onSubmit = async (data: CourseFormData) => {
    setLoading(true);
    setError('');

    try {
      const course = await courseApi.createCourse(data);
      router.push(`/instructor/courses/${course.id}/edit`);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    // TODO: Implement actual file upload to your backend/cloud storage
    // For now, we'll create a temporary URL
    const url = URL.createObjectURL(file);
    setValue('thumbnailUrl', url);
  };

  const handleVideoUpload = async (file: File) => {
    // TODO: Implement actual video upload
    const url = URL.createObjectURL(file);
    setValue('previewVideoUrl', url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
            <p className="text-gray-600 mt-2">
              Fill in the details below to create your course
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>

              <div className="space-y-4">
                <Input
                  label="Course Title *"
                  placeholder="e.g., Complete Web Development Bootcamp"
                  error={errors.title?.message}
                  {...register('title')}
                />

                <Textarea
                  label="Short Description *"
                  placeholder="A brief description that appears in course listings"
                  rows={2}
                  error={errors.shortDescription?.message}
                  {...register('shortDescription')}
                />

                <Textarea
                  label="Full Description *"
                  placeholder="Detailed course description, what students will learn, requirements, etc."
                  rows={6}
                  error={errors.description?.message}
                  {...register('description')}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      {...register('categoryId')}
                      className="input-field"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level *
                    </label>
                    <select
                      {...register('level')}
                      className="input-field"
                    >
                      <option value={CourseLevel.BEGINNER}>Beginner</option>
                      <option value={CourseLevel.INTERMEDIATE}>Intermediate</option>
                      <option value={CourseLevel.ADVANCED}>Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Language *"
                    placeholder="e.g., English, Thai"
                    error={errors.language?.message}
                    {...register('language')}
                  />

                  <Input
                    label="Price (THB) *"
                    type="number"
                    placeholder="0 for free course"
                    error={errors.price?.message}
                    {...register('price', { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Course Media
              </h2>

              <div className="space-y-6">
                <FileUpload
                  label="Course Thumbnail"
                  accept="image/*"
                  maxSize={5}
                  onFileSelect={handleThumbnailUpload}
                  helperText="Upload a cover image for your course (recommended: 1280x720px)"
                />

                <FileUpload
                  label="Preview Video"
                  accept="video/*"
                  maxSize={100}
                  onFileSelect={handleVideoUpload}
                  preview={false}
                  helperText="Upload a promotional video to showcase your course"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                type="submit"
                loading={loading}
                className="flex items-center gap-2"
              >
                <Save className="h-5 w-5" />
                Create Course
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}