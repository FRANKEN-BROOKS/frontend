'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { courseApi, orderApi, paymentApi } from '@/lib/api/services';
import { Course, Order } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { CreditCard, Lock, Loader2, AlertCircle } from 'lucide-react';
import Script from 'next/script';
import { getErrorMessage } from '@/lib/utils/formatters';

declare global {
  interface Window {
    Omise: any;
    OmiseCard: any;
  }
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [omiseReady, setOmiseReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchCourse();
  }, [params.courseId, isAuthenticated]);

  const fetchCourse = async () => {
    try {
      const data = await courseApi.getCourseById(params.courseId as string);
      setCourse(data);
    } catch (error) {
      console.error('Failed to fetch course:', error);
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleOmiseScriptLoad = () => {
    if (window.Omise) {
      window.Omise.setPublicKey(
        process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY || ''
      );
      setOmiseReady(true);
    }
  };

  const handlePayment = async () => {
    if (!course || !omiseReady) return;

    setProcessing(true);
    setError('');

    try {
      // Create order first
      const order = await orderApi.createOrder(course.id);

      // Configure Omise
      window.OmiseCard.configure({
        defaultPaymentMethod: 'credit_card',
        otherPaymentMethods: ['internet_banking', 'promptpay'],
      });

      // Open Omise payment form
      window.OmiseCard.open({
        amount: Math.round((course.discountPrice || course.price) * 100), // Convert to satang
        currency: 'THB',
        defaultPaymentMethod: 'credit_card',
        onCreateTokenSuccess: async (token: string) => {
          try {
            // Create charge with the token
            const payment = await paymentApi.createCharge({
              amount: Math.round((course.discountPrice || course.price) * 100),
              currency: 'THB',
              description: `Payment for ${course.title}`,
              returnUri: `${window.location.origin}/payment-success?orderId=${order.id}`,
              metadata: {
                orderId: order.id,
                courseId: course.id,
                userId: user?.id,
              },
            });

            // Redirect to success page
            router.push(`/payment-success?orderId=${order.id}`);
          } catch (err: unknown) {
            setError(getErrorMessage(err));
            setProcessing(false);
          }
        },
        onFormClosed: () => {
          setProcessing(false);
        },
      });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      setProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
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

  const finalPrice = course.discountPrice || course.price;

  return (
    <>
      <Script
        src="https://cdn.omise.co/omise.js"
        onLoad={handleOmiseScriptLoad}
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gray-50 py-12">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Complete Your Purchase
              </h1>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Order Summary */}
                <div className="lg:col-span-2">
                  <div className="card p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Order Summary
                    </h2>
                    <div className="flex gap-4">
                      <div className="w-32 h-20 bg-gray-200 rounded flex-shrink-0">
                        {course.thumbnailUrl && (
                          <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          by {course.instructor?.firstName}{' '}
                          {course.instructor?.lastName}
                        </p>
                      </div>
                      <div className="text-right">
                        {course.discountPrice &&
                        course.discountPrice < course.price ? (
                          <>
                            <div className="text-sm text-gray-500 line-through">
                              {formatPrice(course.price)}
                            </div>
                            <div className="text-xl font-bold text-primary-600">
                              {formatPrice(course.discountPrice)}
                            </div>
                          </>
                        ) : (
                          <div className="text-xl font-bold text-gray-900">
                            {formatPrice(course.price)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="card p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Payment Method
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="text-center">
                          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Click below to proceed with secure payment
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Lock className="h-4 w-4" />
                        <span>Secured by Omise - PCI DSS Compliant</span>
                      </div>

                      <div className="text-xs text-gray-500">
                        We support credit cards, internet banking, and PromptPay
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="lg:col-span-1">
                  <div className="card p-6 sticky top-24">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Price Details
                    </h2>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-gray-700">
                        <span>Course Price</span>
                        <span>{formatPrice(course.price)}</span>
                      </div>
                      {course.discountPrice &&
                        course.discountPrice < course.price && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>
                              -{formatPrice(course.price - course.discountPrice)}
                            </span>
                          </div>
                        )}
                      <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span>{formatPrice(finalPrice)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={processing || !omiseReady}
                      className="w-full btn-primary py-3 text-lg mb-4"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2 inline" />
                          Processing...
                        </>
                      ) : (
                        'Proceed to Payment'
                      )}
                    </button>

                    <p className="text-xs text-gray-600 text-center">
                      30-day money-back guarantee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}