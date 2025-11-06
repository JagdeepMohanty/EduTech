/**
 * Glassmorphism Form Example
 * ===========================
 * 
 * This component demonstrates how to use glassmorphism styles for forms.
 * Forms include inputs, textareas, selects, and buttons with glassmorphism effects.
 */

'use client';

import React, { useState } from 'react';

const GlassFormExample: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted! Check console for data.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Glassmorphism Forms
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Standard Form */}
          <form className="glass-form" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center">Contact Form</h2>
            
            <div className="glass-form-group">
              <label htmlFor="name" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="glass-input"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="glass-form-group">
              <label htmlFor="email" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="glass-input"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="glass-form-group">
              <label htmlFor="subject" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="glass-select"
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="glass-form-group">
              <label htmlFor="message" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="glass-textarea"
                placeholder="Enter your message here..."
                rows={5}
                required
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="glass-btn-primary flex-1">
                Submit
              </button>
              <button type="button" className="glass-btn flex-1">
                Cancel
              </button>
            </div>
          </form>

          {/* Login Form */}
          <form className="glass-form-strong" onSubmit={(e) => { e.preventDefault(); alert('Login form submitted!'); }}>
            <h2 className="text-2xl font-bold mb-6 text-center">Login Form</h2>
            
            <div className="glass-form-group">
              <label htmlFor="login-email" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="login-email"
                className="glass-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="glass-form-group">
              <label htmlFor="login-password" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="login-password"
                className="glass-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="glass-form-group flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
            </div>

            <button type="submit" className="glass-btn-primary w-full mb-4">
              Sign In
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <a href="#" className="text-blue-600 hover:underline font-medium">Sign up</a>
              </p>
            </div>
          </form>
        </div>

        {/* Input Variants */}
        <div className="glass-section mb-12">
          <h2 className="text-2xl font-bold mb-6">Input Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">Standard Input</label>
              <input type="text" className="glass-input" placeholder="Standard glass input" />
            </div>
            <div>
              <label className="block mb-2 font-medium">Dark Input</label>
              <input type="text" className="glass-input-dark" placeholder="Dark glass input" />
            </div>
            <div>
              <label className="block mb-2 font-medium">Textarea</label>
              <textarea className="glass-textarea" placeholder="Glass textarea" rows={3} />
            </div>
            <div>
              <label className="block mb-2 font-medium">Select Dropdown</label>
              <select className="glass-select">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
        </div>

        {/* Button Variants */}
        <div className="glass-section mb-12">
          <h2 className="text-2xl font-bold mb-6">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <button className="glass-btn">Standard Button</button>
            <button className="glass-btn-primary">Primary Button</button>
            <button className="glass-btn-secondary">Secondary Button</button>
            <button className="glass-btn-dark">Dark Button</button>
            <button className="glass-btn" disabled>Disabled Button</button>
          </div>
        </div>

        {/* Code Example */}
        <div className="glass-section">
          <h2 className="text-2xl font-bold mb-4">Code Example</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{`<form className="glass-form" onSubmit={handleSubmit}>
  <div className="glass-form-group">
    <label className="block mb-2">Email</label>
    <input 
      type="email" 
      className="glass-input" 
      placeholder="Enter email" 
      required 
    />
  </div>
  
  <div className="glass-form-group">
    <label className="block mb-2">Message</label>
    <textarea 
      className="glass-textarea" 
      placeholder="Your message"
      rows={5}
    />
  </div>
  
  <button type="submit" className="glass-btn-primary w-full">
    Submit
  </button>
</form>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default GlassFormExample;

