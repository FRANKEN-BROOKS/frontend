import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  PlayCircle,
  CheckCircle,
  Star,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
          <div className="container-custom">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6">
                Learn Without Limits
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                Build skills with courses, certificates, and degrees from
                world-class universities and companies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/courses"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-center"
                >
                  Explore Courses
                </Link>
                <Link
                  href="/register"
                  className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <BookOpen className="h-12 w-12 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-gray-600">Courses</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">500K+</div>
                <div className="text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Award className="h-12 w-12 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">50K+</div>
                <div className="text-gray-600">Certificates</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <TrendingUp className="h-12 w-12 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose Us?
              </h2>
              <p className="text-xl text-gray-600">
                The best platform for online learning
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card p-6">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <PlayCircle className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                  Learn at Your Pace
                </h3>
                <p className="text-gray-600 text-center">
                  Access courses anytime, anywhere. Learn on your schedule with
                  lifetime access to course materials.
                </p>
              </div>

              <div className="card p-6">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                  Expert Instructors
                </h3>
                <p className="text-gray-600 text-center">
                  Learn from industry experts and experienced professionals who
                  are passionate about teaching.
                </p>
              </div>

              <div className="card p-6">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <Award className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                  Earn Certificates
                </h3>
                <p className="text-gray-600 text-center">
                  Get recognized for your achievements with certificates you can
                  share with employers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Popular Categories
              </h2>
              <p className="text-xl text-gray-600">
                Explore our most sought-after course categories
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                'Web Development',
                'Data Science',
                'Business',
                'Design',
                'Marketing',
                'Photography',
                'Music',
                'Health & Fitness',
              ].map((category) => (
                <Link
                  key={category}
                  href={`/courses/category/${category.toLowerCase().replace(' ', '-')}`}
                  className="card p-6 hover:shadow-md transition text-center"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {category}
                  </h3>
                  <p className="text-sm text-gray-600">1000+ courses</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What Our Students Say
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    This platform has transformed my career. The courses are
                    well-structured and the instructors are amazing!
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      S
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Student Name
                      </div>
                      <div className="text-sm text-gray-600">
                        Web Developer
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Join thousands of students already learning on our platform
            </p>
            <Link
              href="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
            >
              Sign Up For Free
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}