'use client';

import React, { useState, useEffect } from 'react';
import { UserProgress, ProgressHistory, SubjectPerformance } from '@/types/progress';
import { progressService } from '@/services/progress';

const Dashboard: React.FC = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [progressHistory, setProgressHistory] = useState<ProgressHistory[]>([]);
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [progress, history, subjects] = await Promise.all([
        progressService.getUserProgress(),
        progressService.getProgressHistory(selectedPeriod),
        progressService.getSubjectPerformance(),
      ]);
      setUserProgress(progress);
      setProgressHistory(history);
      setSubjectPerformance(subjects);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userProgress) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No progress data available yet. Take some quizzes to see your analytics!</p>
      </div>
    );
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '↗️';
      case 'declining': return '↘️';
      default: return '➡️';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Glassmorphism header */}
      <div className="glass rounded-3xl p-8 mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Learning Dashboard
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Track your progress and discover insights about your learning journey
        </p>
      </div>

      {/* Overview Cards with neumorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="neumorphism rounded-2xl p-6 hover:neumorphism-hover transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="neumorphism rounded-xl p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Total Quizzes</h3>
          <p className="text-3xl font-bold text-blue-600">{userProgress.total_quizzes_taken}</p>
        </div>

        <div className="neumorphism rounded-2xl p-6 hover:neumorphism-hover transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="neumorphism rounded-xl p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Average Score</h3>
          <p className="text-3xl font-bold text-green-600">{userProgress.average_score}%</p>
        </div>

        <div className="neumorphism rounded-2xl p-6 hover:neumorphism-hover transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="neumorphism rounded-xl p-3">
              <span className="text-2xl">{getTrendIcon(userProgress.improvement_trend)}</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Improvement Trend</h3>
          <p className={`text-xl font-bold ${getTrendColor(userProgress.improvement_trend)}`}>
            {userProgress.improvement_trend}
          </p>
        </div>

        <div className="neumorphism rounded-2xl p-6 hover:neumorphism-hover transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="neumorphism rounded-xl p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Recommended Level</h3>
          <p className="text-xl font-bold text-purple-600 capitalize">{userProgress.recommended_difficulty}</p>
        </div>
      </div>

      {/* Progress Chart with glassmorphism */}
      <div className="glass-strong rounded-3xl p-8 mb-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Progress Over Time</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="neumorphism-inset rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
        {progressHistory.length > 0 ? (
          <div className="neumorphism-inset rounded-2xl p-6">
            <div className="h-64 flex items-end space-x-2">
              {progressHistory.map((entry, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="neumorphism rounded-t-xl w-full transition-all duration-500 hover:neumorphism-hover"
                    style={{ height: `${(entry.average_score / 100) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="neumorphism-inset rounded-2xl p-12 text-center">
            <div className="neumorphism rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-500">No progress data for the selected period.</p>
          </div>
        )}
      </div>

      {/* Subject Performance with neumorphism */}
      <div className="glass rounded-3xl p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Subject Performance</h2>
        {subjectPerformance.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectPerformance.map((subject) => (
              <div key={subject.subject} className="neumorphism rounded-2xl p-6 hover:neumorphism-hover transition-all duration-200">
                <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">{subject.subject}</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Average Score:</span>
                    <span className="font-bold text-green-600">{subject.average_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Quizzes:</span>
                    <span className="font-bold">{subject.total_quizzes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Best Score:</span>
                    <span className="font-bold text-blue-600">{subject.best_score}%</span>
                  </div>
                </div>
                <div className="neumorphism-inset rounded-full h-3">
                  <div
                    className="neumorphism rounded-full h-3 transition-all duration-1000"
                    style={{ width: `${subject.average_score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="neumorphism-inset rounded-2xl p-12 text-center">
            <p className="text-gray-500">No subject performance data available.</p>
          </div>
        )}
      </div>

      {/* Strengths and Weaknesses with glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-8">
          <div className="flex items-center mb-6">
            <div className="neumorphism rounded-2xl p-3 mr-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-green-600">Strengths</h2>
          </div>
          {userProgress.strengths.length > 0 ? (
            <ul className="space-y-3">
              {userProgress.strengths.map((strength, index) => (
                <li key={index} className="neumorphism-inset rounded-xl p-4 flex items-center">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="neumorphism-inset rounded-xl p-8 text-center">
              <p className="text-gray-500">No strengths identified yet.</p>
            </div>
          )}
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="flex items-center mb-6">
            <div className="neumorphism rounded-2xl p-3 mr-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-orange-600">Areas for Improvement</h2>
          </div>
          {userProgress.weaknesses.length > 0 ? (
            <ul className="space-y-3">
              {userProgress.weaknesses.map((weakness, index) => (
                <li key={index} className="neumorphism-inset rounded-xl p-4 flex items-center">
                  <span className="text-orange-500 mr-3 text-xl">⚠</span>
                  <span className="text-gray-700 dark:text-gray-300">{weakness}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="neumorphism-inset rounded-xl p-8 text-center">
              <p className="text-gray-500">No weaknesses identified. Great job!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
