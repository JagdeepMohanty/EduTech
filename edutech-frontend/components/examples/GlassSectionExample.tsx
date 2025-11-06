/**
 * Glassmorphism Section Example
 * =============================
 * 
 * This component demonstrates how to use glassmorphism styles for page sections.
 * Copy and adapt this example for your own sections.
 */

'use client';

import React from 'react';

const GlassSectionExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Standard Glass Section */}
        <section className="glass-section">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Standard Glass Section
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This is a standard glassmorphism section with semi-transparent background,
            backdrop blur, and soft shadows. Perfect for content sections, feature highlights,
            or information displays.
          </p>
          <div className="flex gap-4 mt-6">
            <button className="glass-btn-primary">Primary Action</button>
            <button className="glass-btn-secondary">Secondary Action</button>
          </div>
        </section>

        {/* Strong Glass Section */}
        <section className="glass-section-strong">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Strong Glass Section
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This section uses the <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">glass-section-strong</code> class,
            which provides a more opaque background and stronger blur effect. Ideal for
            important content that needs to stand out.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="glass-card">
              <h3 className="font-semibold mb-2">Feature 1</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Description here</p>
            </div>
            <div className="glass-card">
              <h3 className="font-semibold mb-2">Feature 2</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Description here</p>
            </div>
            <div className="glass-card">
              <h3 className="font-semibold mb-2">Feature 3</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Description here</p>
            </div>
          </div>
        </section>

        {/* Dark Theme Section */}
        <section className="glass-section-dark">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Dark Glass Section
          </h2>
          <p className="text-gray-300 mb-4">
            This section uses the dark variant of glassmorphism, perfect for dark-themed
            pages or when you want a different visual style.
          </p>
          <button className="glass-btn-dark mt-4">Dark Button</button>
        </section>

        {/* Usage Code Example */}
        <section className="glass-section">
          <h2 className="text-2xl font-bold mb-4">Code Example</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{`<section className="glass-section">
  <h2 className="text-2xl font-bold mb-4">Section Title</h2>
  <p>Your content here...</p>
  <button className="glass-btn-primary">Action</button>
</section>`}</code>
          </pre>
        </section>
      </div>
    </div>
  );
};

export default GlassSectionExample;

