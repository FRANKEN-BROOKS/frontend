'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { courseApi, topicApi, lessonApi } from '@/lib/api/services';
import { Course, Topic, Lesson } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  PlayCircle,
  FileText,
  ArrowLeft,
  Save,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { getErrorMessage } from '@/lib/utils/formatters';

interface TopicFormData {
  title: string;
  description?: string;
  orderIndex: number;
}

interface LessonFormData {
  title: string;
  description?: string;
  contentType: string;
  videoUrl?: string;
  documentUrl?: string;
  content?: string;
  duration: number;
  orderIndex: number;
  isFree: boolean;
}

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedTopicForLesson, setSelectedTopicForLesson] = useState<string | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [params.id]);

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

  const handleAddTopic = () => {
    setSelectedTopic(null);
    setShowTopicModal(true);
  };

  const handleEditTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowTopicModal(true);
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;

    try {
      await topicApi.deleteTopic(topicId);
      fetchCourse();
    } catch (error) {
      console.error('Failed to delete topic:', error);
    }
  };

  const handleAddLesson = (topicId: string) => {
    setSelectedTopicForLesson(topicId);
    setShowLessonModal(true);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    try {
      await lessonApi.deleteLesson(lessonId);
      fetchCourse();
    } catch (error) {
      console.error('Failed to delete lesson:', error);
    }
  };

  const handlePublish = async () => {
    if (!course) return;

    try {
      await courseApi.publishCourse(course.id);
      alert('Course published successfully!');
      router.push('/instructor/courses');
    } catch (error) {
      console.error('Failed to publish course:', error);
      alert('Failed to publish course');
    }
  };

  if (loading || !course) {
    return <div>Loading...</div>;
  }

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
              Back to Courses
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-gray-600 mt-2">Manage your course curriculum</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                {!course.isPublished && (
                  <Button onClick={handlePublish}>
                    Publish Course
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Course Curriculum */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Course Curriculum
              </h2>
              <Button onClick={handleAddTopic} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Topic
              </Button>
            </div>

            {course.topics && course.topics.length > 0 ? (
              <div className="space-y-4">
                {course.topics.map((topic, topicIndex) => (
                  <div key={topic.id} className="border rounded-lg">
                    {/* Topic Header */}
                    <div className="bg-gray-50 p-4 flex items-center justify-between border-b">
                      <div className="flex items-center gap-3 flex-1">
                        <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {topicIndex + 1}. {topic.title}
                          </h3>
                          {topic.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {topic.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddLesson(topic.id)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          <Plus className="h-4 w-4 inline mr-1" />
                          Add Lesson
                        </button>
                        <button
                          onClick={() => handleEditTopic(topic)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Lessons */}
                    {topic.lessons && topic.lessons.length > 0 && (
                      <div className="p-4 space-y-2">
                        {topic.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.contentType === 'Video' ? (
                                <PlayCircle className="h-5 w-5 text-gray-400" />
                              ) : (
                                <FileText className="h-5 w-5 text-gray-400" />
                              )}
                              <div>
                                <span className="text-sm font-medium text-gray-900">
                                  {topicIndex + 1}.{lessonIndex + 1} {lesson.title}
                                </span>
                                <div className="text-xs text-gray-500 mt-1">
                                  {lesson.contentType} • {Math.floor(lesson.duration / 60)}m
                                  {lesson.isFree && ' • Free preview'}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  No topics yet. Start building your course curriculum.
                </p>
                <Button onClick={handleAddTopic}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Topic
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Topic Modal */}
      <TopicModal
        isOpen={showTopicModal}
        onClose={() => setShowTopicModal(false)}
        courseId={course.id}
        topic={selectedTopic}
        onSuccess={fetchCourse}
      />

      {/* Lesson Modal */}
      <LessonModal
        isOpen={showLessonModal}
        onClose={() => setShowLessonModal(false)}
        topicId={selectedTopicForLesson}
        onSuccess={fetchCourse}
      />

      <Footer />
    </div>
  );
}

// Topic Modal Component
function TopicModal({
  isOpen,
  onClose,
  courseId,
  topic,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  topic: Topic | null;
  onSuccess: () => void;
}) {
  const { register, handleSubmit, reset } = useForm<TopicFormData>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (topic) {
      reset(topic);
    } else {
      reset({ title: '', description: '', orderIndex: 0 });
    }
  }, [topic, reset]);

  const onSubmit = async (data: TopicFormData) => {
    setLoading(true);
    try {
      if (topic) {
        await topicApi.updateTopic(topic.id, data);
      } else {
        await topicApi.createTopic({ ...data, courseId });
      }
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Failed to save topic:', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={topic ? 'Edit Topic' : 'Add Topic'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Topic Title" {...register('title')} required />
        <Textarea label="Description" {...register('description')} rows={3} />
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {topic ? 'Update' : 'Create'} Topic
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Lesson Modal Component
function LessonModal({
  isOpen,
  onClose,
  topicId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  topicId: string | null;
  onSuccess: () => void;
}) {
  const { register, handleSubmit, reset } = useForm<LessonFormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LessonFormData) => {
    if (!topicId) return;

    setLoading(true);
    try {
      await lessonApi.createLesson({
        ...data,
        topicId,
        duration: parseInt(data.duration.toString()) * 60, // Convert minutes to seconds
      });
      onSuccess();
      onClose();
      reset();
    } catch (error: unknown) {
      console.error('Failed to create lesson:', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Lesson" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Lesson Title" {...register('title')} required />
        <Textarea label="Description" {...register('description')} rows={3} />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Type
            </label>
            <select {...register('contentType')} className="input-field" required>
              <option value="Video">Video</option>
              <option value="Document">Document</option>
              <option value="Text">Text</option>
            </select>
          </div>
          <Input
            label="Duration (minutes)"
            type="number"
            {...register('duration')}
            required
          />
        </div>

        <Input label="Video URL" {...register('videoUrl')} placeholder="https://..." />
        <Textarea label="Text Content" {...register('content')} rows={4} />

        <div className="flex items-center gap-2">
          <input type="checkbox" {...register('isFree')} className="rounded" />
          <label className="text-sm text-gray-700">Free preview lesson</label>
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Lesson
          </Button>
        </div>
      </form>
    </Modal>
  );
}