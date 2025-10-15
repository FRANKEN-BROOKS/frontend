import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          <div className="h-1 w-32 bg-primary-600 mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            <Search className="h-5 w-5" />
            Browse Courses
          </Link>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">
            Here are some helpful links:
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/courses"
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                Browse all courses
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                Go to your dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                Learn about us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                Contact support
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}