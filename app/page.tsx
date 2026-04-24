'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/supabaseService';
import { FileText, CheckCircle, Users, Shield } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">College File Approval</h1>
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Streamlined File Approval Workflow
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A secure, role-based system for managing file approvals across staff, principal, and president levels.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="#features"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card">
              <FileText className="w-12 h-12 text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Easy Upload</h4>
              <p className="text-gray-600">
                Staff can easily upload files with title and description for review.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card">
              <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Multi-Level Approval</h4>
              <p className="text-gray-600">
                Principal and President review and approve files with complete audit trail.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card">
              <Shield className="w-12 h-12 text-indigo-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Secure & RLS</h4>
              <p className="text-gray-600">
                Row-Level Security ensures users only access files relevant to their role.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full font-bold mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Staff Upload</h4>
              <p className="text-gray-600">Staff uploads a file and it is assigned to Principal for review</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full font-bold mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Principal Review</h4>
              <p className="text-gray-600">Principal approves or requests changes. If approved, goes to President</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full font-bold mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">President Final Approval</h4>
              <p className="text-gray-600">President gives final approval or rejection with remarks</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold mb-4">Ready to streamline your approval process?</h3>
          <p className="text-lg mb-8 opacity-90">
            Sign in with your credentials to access the system
          </p>
          <Link
            href="/login"
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Login Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 College File Approval System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
