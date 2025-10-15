import Link from 'next/link';
import Image from 'next/image';
import { Course } from '@/types';
import { Clock, Users, Star, BookOpen } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <Link href={`/courses/${course.id}`}>
      <div className="card overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-48 bg-gray-200">
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-gray-400" />
            </div>
          )}
          {course.level && (
            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-semibold">
              {course.level}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category */}
          {course.category && (
            <div className="text-xs text-primary-600 font-semibold mb-2 uppercase">
              {course.category.name}
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>

          {/* Description */}
          {course.shortDescription && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {course.shortDescription}
            </p>
          )}

          {/* Instructor */}
          {course.instructor && (
            <div className="text-xs text-gray-600 mb-3">
              by {course.instructor.firstName} {course.instructor.lastName}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-gray-600 mb-3 mt-auto">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(course.totalDuration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>{course.totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{course.enrollmentCount}</span>
            </div>
          </div>

          {/* Rating and Price */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="font-semibold text-sm">
                {course.rating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-600">
                ({course.reviewCount})
              </span>
            </div>
            <div className="text-right">
              {course.discountPrice && course.discountPrice < course.price ? (
                <>
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(course.price)}
                  </div>
                  <div className="text-lg font-bold text-primary-600">
                    {formatPrice(course.discountPrice)}
                  </div>
                </>
              ) : (
                <div className="text-lg font-bold text-gray-900">
                  {course.price > 0 ? formatPrice(course.price) : 'Free'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}