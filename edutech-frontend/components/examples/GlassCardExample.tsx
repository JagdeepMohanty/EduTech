/**
 * Glassmorphism Card Example
 * ==========================
 * 
 * This component demonstrates how to use glassmorphism styles for cards.
 * Cards are perfect for displaying content, features, statistics, or any
 * grouped information.
 */

'use client';

import React from 'react';

const GlassCardExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Glassmorphism Cards
        </h1>

        {/* Standard Glass Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="glass-card glass-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <span className="text-sm text-gray-500">New</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Course Card
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Learn advanced concepts with our comprehensive course materials.
            </p>
            <button className="glass-btn w-full">Enroll Now</button>
          </div>

          <div className="glass-card-strong glass-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <span className="text-sm text-gray-500">Popular</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Quiz Card
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Test your knowledge with interactive quizzes and get instant feedback.
            </p>
            <button className="glass-btn-primary w-full">Start Quiz</button>
          </div>

          <div className="glass-card glass-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <span className="text-sm text-gray-500">Analytics</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Progress Card
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Track your learning progress and see detailed analytics.
            </p>
            <button className="glass-btn-secondary w-full">View Stats</button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="glass-card text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">1,234</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">567</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Courses</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">89%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-4xl font-bold text-pink-600 mb-2">4.8</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
          </div>
        </div>

        {/* Feature Cards with Icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="glass-card-strong">
            <div className="flex items-start gap-4">
              <div className="glass-subtle p-3 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Fast Learning</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Accelerate your learning with our optimized curriculum and interactive content.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card-strong">
            <div className="flex items-start gap-4">
              <div className="glass-subtle p-3 rounded-lg">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your data is protected with enterprise-grade security and privacy measures.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="glass-section">
          <h2 className="text-2xl font-bold mb-4">Code Example</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{`<div className="glass-card glass-hover">
  <h3 className="text-xl font-semibold mb-2">Card Title</h3>
  <p className="text-gray-700 dark:text-gray-300">
    Card content goes here...
  </p>
  <button className="glass-btn-primary mt-4">Action</button>
</div>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default GlassCardExample;

