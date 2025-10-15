'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { courseApi, enrollmentApi } from '@/lib/api/services';
import { Course } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Clock,
  Users,
  Star,
  BookOpen,
  PlayCircle,
  CheckCircle,
  Globe,
  Award,
  Loader2,
} from 'lucide-react';
import ReactPlayer from 'react-player';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse();
    if (isAuthenticated) {
      checkEnrollment();
    }
  }, [params.id, isAuthenticated]);

  const fetchCourse = async () => {
    try {
      const data = await courseApi.getCourseById(params.id as string);
      setCourse(data);
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const { isEnrolled: enrolled } = await enrollmentApi.checkEnrollment(
        params.id as string
      );
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Failed to check enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (course?.price && course.price > 0) {
      router.push(`/checkout/${course.id}`);
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentApi.enrollInCourse(course!.id);
      setIsEnrolled(true);
      router.push(`/learn/${course!.id}`);
    } catch (error) {
      console.error('Failed to enroll:', error);
    } finally {
      setEnrolling(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-600">Course not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Course Header */}
        <div className="bg-gray-900 text-white py-12">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Course Info */}
              <div className="lg:col-span-2">
                {course.category && (
                  <div className="text-primary-400 font-semibold mb-2 uppercase text-sm">
                    {course.category.name}
                  </div>
                )}
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl text-gray-300 mb-6">
                  {course.shortDescription}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">
                      {course.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-400">
                      ({course.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>{course.enrollmentCount} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{formatDuration(course.totalDuration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{course.totalLessons} lessons</span>
                  </div>
                </div>

                {/* Instructor */}
                {course.instructor && (
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center text-lg font-semibold">
                      {course.instructor.firstName[0]}
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Created by</div>
                      <div className="font-semibold">
                        {course.instructor.firstName}{' '}
                        {course.instructor.lastName}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Preview/Enroll Card */}
              <div className="lg:sticky lg:top-24 h-fit">
                <div className="card bg-white text-gray-900 overflow-hidden">
                  {/* Preview Video */}
                  {course.previewVideoUrl && (
                    <div className="aspect-video bg-black">
                      <ReactPlayer
                        url={course.previewVideoUrl}
                        width="100%"
                        height="100%"
                        controls
                        light={course.thumbnailUrl}
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Price */}
                    <div className="mb-6">
                      {course.discountPrice &&
                      course.discountPrice < course.price ? (
                        <>
                          <div className="text-3xl font-bold text-primary-600">
                            {formatPrice(course.discountPrice)}
                          </div>
                          <div className="text-lg text-gray-500 line-through">
                            {formatPrice(course.price)}
                          </div>
                        </>
                      ) : (
                        <div className="text-3xl font-bold">
                          {course.price > 0 ? formatPrice(course.price) : 'Free'}
                        </div>
                      )}
                    </div>

                    {/* Enroll Button */}
                    {isEnrolled ? (
                      <button
                        onClick={() => router.push(`/learn/${course.id}`)}
                        className="w-full btn-primary py-3 text-lg mb-4"
                      >
                        Go to Course
                      </button>
                    ) : (
                      <button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="w-full btn-primary py-3 text-lg mb-4"
                      >
                        {enrolling
                          ? 'Enrolling...'
                          : course.price > 0
                          ? 'Buy Now'
                          : 'Enroll for Free'}
                      </button>
                    )}

                    {/* Course Includes */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="h-5 w-5 text-gray-600" />
                        <span>
                          {formatDuration(course.totalDuration)} on-demand video
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-gray-600" />
                        <span>{course.totalLessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-gray-600" />
                        <span>Full lifetime access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-gray-600" />
                        <span>Certificate of completion</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="container-custom py-12">
          <div className="lg:pr-96">
            {/* Description */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this course
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700">{course.description}</p>
              </div>
            </section>

            {/* Curriculum */}
            {course.topics && course.topics.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Course Curriculum
                </h2>
                <div className="space-y-4">
                  {course.topics.map((topic, index) => (
                    <div key={topic.id} className="card">
                      <div className="p-4 bg-gray-50 border-b">
                        <h3 className="font-semibold text-gray-900">
                          {index + 1}. {topic.title}
                        </h3>
                        {topic.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {topic.description}
                          </p>
                        )}
                      </div>
                      {topic.lessons && topic.lessons.length > 0 && (
                        <div className="p-4">
                          <ul className="space-y-2">
                            {topic.lessons.map((lesson) => (
                              <li
                                key={lesson.id}
                                className="flex items-center gap-3"
                              >
                                <CheckCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-700">
                                  {lesson.title}
                                </span>
                                <span className="text-sm text-gray-500 ml-auto">
                                  {formatDuration(lesson.duration)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}