'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User, LogOut, BookOpen, Award } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              E-Learning
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/courses"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Courses
            </Link>
            {isAuthenticated && user?.roles.includes('Instructor') && (
              <Link
                href="/instructor/courses"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                My Courses
              </Link>
            )}
            {isAuthenticated && user?.roles.includes('Admin') && (
              <Link
                href="/admin/dashboard"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>{user?.firstName}</span>
                </Link>
                <Link href="/certificates">
                  <Button variant="outline" size="sm">
                    <Award className="h-4 w-4 mr-2" />
                    Certificates
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/courses"
              className="block text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/certificates"
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Certificates
                </Link>
                <button
                  className="block w-full text-left text-gray-700 hover:text-blue-600"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}