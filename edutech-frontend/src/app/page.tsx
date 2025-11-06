import Link from 'next/link'
import Logo from '@/components/Logo'
import './globals.css'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 pb-20">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mt-6">
        <div className="glass rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center gap-6">
          {/* Left: text */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <div className="neumorphism rounded-lg p-2 w-12 h-12 flex items-center justify-center">
                <Logo size={36} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduTech — Learn Smarter
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Adaptive lessons • AI summarizer • Quizzes • Progress tracking</p>
              </div>
            </div>

            <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-xl">
              Build your skills with bite-sized lessons, instant summarization, and adaptive quizzes. Track progress and get help from an AI tutor whenever you need it.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3 justify-center md:justify-start">
              <Link href="/register" className="inline-block">
                <span className="inline-flex items-center justify-center rounded-lg px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-md hover:opacity-95 transition">
                  Get Started
                </span>
              </Link>

              <Link href="/quizzes" className="inline-block">
                <span className="inline-flex items-center justify-center rounded-lg px-4 py-3 border border-transparent neumorphism text-gray-800 dark:text-gray-200 hover:neumorphism-pressed transition">
                  Explore Quizzes
                </span>
              </Link>

              <Link href="/summarize" className="inline-block">
                <span className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm text-blue-600 hover:underline">
                  Try Summarizer →
                </span>
              </Link>
            </div>
          </div>

          {/* Right: highlight card */}
          <div className="w-full md:w-80">
            <div className="glass-strong rounded-2xl p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">Today’s Focus</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Complete a 10-min quiz to keep your streak going.</p>
              <Link href="/quizzes">
                <button className="w-full rounded-md px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold hover:from-indigo-700 hover:to-emerald-600 transition">
                  Start Quiz
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid (kept concise) */}
      <section className="w-full max-w-6xl mt-10">
        <h2 className="text-xl font-bold mb-4 text-center">Core Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-5 text-center">
            <div className="neumorphism rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18" />
              </svg>
            </div>
            <h4 className="font-semibold">AI Chatbot</h4>
            <p className="text-sm text-gray-600">Get instant answers and learning guidance.</p>
          </div>

          <div className="glass rounded-xl p-5 text-center">
            <div className="neumorphism rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6" />
              </svg>
            </div>
            <h4 className="font-semibold">Smart Summarizer</h4>
            <p className="text-sm text-gray-600">Quickly digest long articles and notes.</p>
          </div>

          <div className="glass rounded-xl p-5 text-center">
            <div className="neumorphism rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5" />
              </svg>
            </div>
            <h4 className="font-semibold">Progress Tracking</h4>
            <p className="text-sm text-gray-600">See your growth with easy-to-read metrics.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
