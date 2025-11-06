/**
 * Glassmorphism Navbar Example
 * =============================
 * 
 * This component demonstrates how to use glassmorphism styles for navigation bars.
 * The navbar uses sticky positioning and strong glassmorphism for better visibility.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const GlassNavbarExample: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Standard Glass Navbar */}
      <nav className="glass-navbar mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="glass-subtle p-2 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduTech
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-2">
            <Link href="/" className="glass-nav-link">
              Home
            </Link>
            <Link href="/courses" className="glass-nav-link">
              Courses
            </Link>
            <Link href="/quizzes" className="glass-nav-link">
              Quizzes
            </Link>
            <Link href="/dashboard" className="glass-nav-link">
              Dashboard
            </Link>
            <Link href="/about" className="glass-nav-link">
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="glass-btn">Login</button>
            <button className="glass-btn-primary">Sign Up</button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden glass-subtle p-2 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link href="/" className="glass-nav-link block">Home</Link>
            <Link href="/courses" className="glass-nav-link block">Courses</Link>
            <Link href="/quizzes" className="glass-nav-link block">Quizzes</Link>
            <Link href="/dashboard" className="glass-nav-link block">Dashboard</Link>
            <Link href="/about" className="glass-nav-link block">About</Link>
            <div className="flex space-x-2 pt-2">
              <button className="glass-btn flex-1">Login</button>
              <button className="glass-btn-primary flex-1">Sign Up</button>
            </div>
          </div>
        )}
      </nav>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="glass-section mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Glassmorphism Navbar
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This navbar uses the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">glass-navbar</code> class
            with sticky positioning. It stays at the top when scrolling and maintains
            the glassmorphism effect throughout.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            The navigation links use <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">glass-nav-link</code> for
            a subtle glass effect that enhances on hover.
          </p>
        </div>

        {/* Scrollable Content to Test Sticky Navbar */}
        <div className="space-y-6 mb-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="glass-card">
              <h2 className="text-2xl font-semibold mb-2">Section {i}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Scroll down to see the navbar stay fixed at the top with its glassmorphism effect.
                The backdrop blur creates a beautiful frosted glass appearance that works
                well over any background.
              </p>
            </div>
          ))}
        </div>

        {/* Code Example */}
        <div className="glass-section">
          <h2 className="text-2xl font-bold mb-4">Code Example</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{`<nav className="glass-navbar">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <Link href="/" className="flex items-center space-x-2">
      <span className="text-xl font-bold">Logo</span>
    </Link>
    
    <div className="flex space-x-2">
      <Link href="/" className="glass-nav-link">Home</Link>
      <Link href="/about" className="glass-nav-link">About</Link>
    </div>
    
    <div className="flex space-x-3">
      <button className="glass-btn">Login</button>
      <button className="glass-btn-primary">Sign Up</button>
    </div>
  </div>
</nav>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default GlassNavbarExample;

