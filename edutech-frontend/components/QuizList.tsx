'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Quiz } from '@/types/quiz';
import { quizService } from '@/services/quiz';

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, [subject]);

  const fetchQuizzes = async () => {
    try {
      const data = await quizService.getQuizzes(subject || undefined);
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading quizzes...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Quizzes</h1>

      <div className="mb-6">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Subject:
        </label>
        <select
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Subjects</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Literature">Literature</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
            <p className="text-gray-600 mb-4">{quiz.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">Subject: {quiz.subject}</span>
              <span className="text-sm text-gray-500">{quiz.questions.length} questions</span>
            </div>
            <Link
              href={`/quiz/${quiz.id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block w-full text-center"
            >
              Take Quiz
            </Link>
          </div>
        ))}
      </div>

      {quizzes.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No quizzes available for the selected subject.
        </div>
      )}
    </div>
  );
};

export default QuizList;
