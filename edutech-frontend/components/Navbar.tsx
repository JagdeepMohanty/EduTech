'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const { user, token, logout } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/quizzes', label: 'Quizzes' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/feedback', label: 'Feedback' },
    { href: '/chatbot', label: 'Chatbot' },
    { href: '/summarize', label: 'Summarizer' },
  ];

  return (
    <nav className="glass sticky top-0 z-50 w-full px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: navigation links (hidden on small screens) */}
        <div className="hidden md:flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="neumorphism-inset rounded-md px-3 py-2 text-gray-700 dark:text-gray-300 hover:neumorphism transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Center: Logo + Title */}
        <div className="flex-1 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="neumorphism rounded-lg p-2 w-10 h-10 flex items-center justify-center">
              <Logo size={28} />
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduTech
            </span>
          </Link>
        </div>

        {/* Right: auth buttons */}
        <div className="flex items-center gap-3">
          {token ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300">Welcome, {user?.username || 'User'}</span>
              <button
                onClick={logout}
                className="neumorphism rounded-md px-4 py-2 text-red-600 hover:neumorphism-pressed transition-all duration-150"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="neumorphism rounded-md px-4 py-2 text-blue-600 hover:neumorphism-pressed transition-all duration-150">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="neumorphism rounded-md px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-150">
                  Sign Up
                </button>
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="neumorphism rounded-md p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
