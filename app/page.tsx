'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { courseService } from '@/lib/api/course.service';
import type { Course } from '@/types';

export default function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedCourses();
  }, []);

  const loadFeaturedCourses = async () => {
    try {
      const response = await courseService.getFeaturedCourses(6);
      if (response.success) {
        setFeaturedCourses(response.data);
      }
    } catch (error) {
      console.error('Failed to load featured courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Learn Without Limits
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Access thousands of courses taught by industry experts. Build your skills and advance your career.
            </p>
            <div className="flex space-x-4">
              <Link href="/courses">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <BookOpen className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">1000+</h3>
                <p className="text-gray-600">Courses Available</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">50K+</h3>
                <p className="text-gray-600">Active Students</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">25K+</h3>
                <p className="text-gray-600">Certificates Issued</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">95%</h3>
                <p className="text-gray-600">Success Rate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Courses</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    {course.thumbnailUrl && (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <CardContent className="p-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.shortDescription}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-600">
                          ฿{course.effectivePrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {course.level}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link href="/courses">
              <Button size="lg">
                View All Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students already learning on our platform
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}