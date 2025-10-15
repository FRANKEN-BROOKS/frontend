import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BookOpen, Users, Award, TrendingUp, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
          <div className="container-custom text-center">
            <h1 className="text-5xl font-bold mb-6">About E-Learning Platform</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Empowering learners worldwide with quality education and
              transforming lives through accessible online learning.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="card p-8">
                <Target className="h-12 w-12 text-primary-600 mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To democratize education by providing affordable, high-quality
                  online courses that enable anyone, anywhere to learn new skills
                  and advance their careers.
                </p>
              </div>

              <div className="card p-8">
                <Heart className="h-12 w-12 text-red-600 mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Vision
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To become the world's leading online learning platform,
                  connecting millions of learners with expert instructors and
                  creating a global community of lifelong learners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gray-50 py-20">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Impact in Numbers
              </h2>
              <p className="text-xl text-gray-600">
                Building a better future through education
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">10,000+</div>
                <div className="text-gray-600">Courses Available</div>
              </div>

              <div className="text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">500K+</div>
                <div className="text-gray-600">Active Students</div>
              </div>

              <div className="text-center">
                <Award className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">50K+</div>
                <div className="text-gray-600">Certificates Issued</div>
              </div>

              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container-custom max-w-4xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                Founded in 2020, E-Learning Platform started with a simple idea: make
                quality education accessible to everyone, everywhere. What began as a
                small project has grown into a thriving community of learners and
                educators from around the world.
              </p>
              <p className="text-gray-700 mb-6">
                We believe that education is a fundamental right, not a privilege. Our
                platform removes barriers to learning by offering affordable courses
                taught by industry experts, accessible on any device, at any time.
              </p>
              <p className="text-gray-700">
                Today, we're proud to serve hundreds of thousands of students across
                multiple countries, helping them achieve their personal and
                professional goals through high-quality online education.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-gray-50 py-20">
          <div className="container-custom">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Our Core Values
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card p-6 text-center">
                <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Quality First
                </h3>
                <p className="text-gray-600">
                  We're committed to providing the highest quality content and
                  learning experience for our students.
                </p>
              </div>

              <div className="card p-6 text-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Community Driven
                </h3>
                <p className="text-gray-600">
                  We foster a supportive community where learners and instructors
                  can connect and grow together.
                </p>
              </div>

              <div className="card p-6 text-center">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Continuous Innovation
                </h3>
                <p className="text-gray-600">
                  We constantly evolve our platform with the latest technology to
                  enhance the learning experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-4xl font-bold mb-4">
              Join Our Learning Community
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Start your learning journey today and unlock your potential
            </p>
            <a
              href="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
            >
              Get Started Free
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}