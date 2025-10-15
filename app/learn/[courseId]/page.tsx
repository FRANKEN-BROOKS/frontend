'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { courseApi, lessonApi, enrollmentApi } from '@/lib/api/services';
import { Course, Lesson, Enrollment } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  ChevronLeft,
  CheckCircle,
  PlayCircle,
  FileText,
  Loader2,
  Menu,
  X,
} from 'lucide-react';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCourseData();
  }, [params.courseId, isAuthenticated]);

  const fetchCourseData = async () => {
    try {
      const [courseData, enrollmentsData] = await Promise.all([
        courseApi.getCourseById(params.courseId as string),
        enrollmentApi.getMyEnrollments(),
      ]);

      setCourse(courseData);

      const currentEnrollment = enrollmentsData.find(
        (e) => e.courseId === params.courseId
      );

      if (!currentEnrollment) {
        router.push(`/courses/${params.courseId}`);
        return;
      }

      setEnrollment(currentEnrollment);

      // Set first lesson as current
      if (courseData.topics && courseData.topics.length > 0) {
        const firstTopic = courseData.topics[0];
        if (firstTopic.lessons && firstTopic.lessons.length > 0) {
          setCurrentLesson(firstTopic.lessons[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async (lessonId: string) => {
    if (!enrollment) return;

    try {
      await lessonApi.markLessonComplete(lessonId, enrollment.id);
      setCompletedLessons((prev) => new Set([...prev, lessonId]));

      // Fetch updated enrollment progress
      const enrollmentsData = await enrollmentApi.getMyEnrollments();
      const updatedEnrollment = enrollmentsData.find(
        (e) => e.courseId === params.courseId
      );
      if (updatedEnrollment) {
        setEnrollment(updatedEnrollment);
      }
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
    }
  };

  const selectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const goToNextLesson = () => {
    if (!course?.topics || !currentLesson) return;

    let foundCurrent = false;
    for (const topic of course.topics) {
      if (!topic.lessons) continue;
      for (const lesson of topic.lessons) {
        if (foundCurrent) {
          selectLesson(lesson);
          return;
        }
        if (lesson.id === currentLesson.id) {
          foundCurrent = true;
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Course not available</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="hover:text-gray-300"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <div>
            <h1 className="font-semibold">{course.title}</h1>
            <p className="text-sm text-gray-400">
              {Math.round(enrollment?.progress || 0)}% complete
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-sm">
            <div className="w-48 bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full"
                style={{ width: `${enrollment?.progress || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Course Content */}
        <div
          className={`${
            sidebarOpen ? 'w-full lg:w-80' : 'hidden'
          } bg-white border-r overflow-y-auto absolute lg:relative z-10 h-full`}
        >
          <div className="p-4">
            <h2 className="font-semibold text-gray-900 mb-4">
              Course Content
            </h2>
            <div className="space-y-2">
              {course.topics?.map((topic, topicIndex) => (
                <div key={topic.id} className="mb-4">
                  <div className="font-semibold text-sm text-gray-700 mb-2 px-2">
                    {topicIndex + 1}. {topic.title}
                  </div>
                  {topic.lessons?.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => selectLesson(lesson)}
                      className={`w-full text-left px-4 py-3 rounded-lg mb-1 flex items-center gap-3 ${
                        currentLesson.id === lesson.id
                          ? 'bg-primary-50 text-primary-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {completedLessons.has(lesson.id) ? (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : lesson.contentType === 'Video' ? (
                        <PlayCircle className="h-5 w-5 flex-shrink-0" />
                      ) : (
                        <FileText className="h-5 w-5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {lesson.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.floor(lesson.duration / 60)}m
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {/* Video Player */}
            {currentLesson.contentType === 'Video' &&
              currentLesson.videoUrl && (
                <div className="bg-black aspect-video">
                  <ReactPlayer
                    url={currentLesson.videoUrl}
                    width="100%"
                    height="100%"
                    controls
                    onEnded={() => handleLessonComplete(currentLesson.id)}
                  />
                </div>
              )}

            {/* Lesson Content */}
            <div className="max-w-4xl mx-auto p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentLesson.title}
              </h2>

              {currentLesson.description && (
                <p className="text-gray-700 mb-6">
                  {currentLesson.description}
                </p>
              )}

              {currentLesson.content && (
                <div className="prose max-w-none">
                  <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                </div>
              )}

              {/* Complete Lesson Button */}
              {!completedLessons.has(currentLesson.id) && (
                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => handleLessonComplete(currentLesson.id)}
                    className="btn-primary"
                  >
                    Mark as Complete
                  </button>
                  <button onClick={goToNextLesson} className="btn-outline">
                    Next Lesson
                  </button>
                </div>
              )}

              {completedLessons.has(currentLesson.id) && (
                <div className="mt-8">
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5" />
                    <span>Lesson completed!</span>
                  </div>
                  <button onClick={goToNextLesson} className="btn-primary">
                    Next Lesson
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}