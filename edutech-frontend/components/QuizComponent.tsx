'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Quiz, Question, QuizResult } from '@/types/quiz';
import { quizService } from '@/services/quiz';

interface QuizComponentProps {
  quizId: string;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quizId }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const data = await quizService.getQuiz(quizId);
      setQuiz(data);
      setAnswers(new Array(data.questions.length).fill(-1));
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      const quizResult = await quizService.submitQuizAttempt(quiz.id!, { answers });
      setResult(quizResult);
      setShowResult(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading quiz...</div>;
  }

  if (!quiz) {
    return <div className="text-center">Quiz not found.</div>;
  }

  if (showResult && result) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Quiz Results</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">{quiz.title}</h2>
          <div className="text-lg mb-4">
            <p>Score: {result.score} / {result.total_questions}</p>
            <p>Percentage: {result.percentage.toFixed(1)}%</p>
          </div>
          <p className="text-gray-700 mb-6">{result.feedback}</p>
          <button
            onClick={() => router.push('/quizzes')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Glassmorphism header */}
      <div className="glass rounded-3xl p-6 mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {quiz.title}
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Test your knowledge with this interactive quiz
        </p>
      </div>

      {/* Main quiz container with neumorphism */}
      <div className="neumorphism rounded-3xl p-8 shadow-2xl">
        {/* Progress indicator with glassmorphism */}
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}% Complete
            </span>
          </div>
          {/* Progress bar with neumorphism */}
          <div className="neumorphism-inset rounded-full h-2">
            <div
              className="neumorphism rounded-full h-2 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question with neumorphism */}
        <div className="neumorphism-inset rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {currentQuestion.question_text}
          </h2>

          {/* Options with neumorphic styling */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  answers[currentQuestionIndex] === index
                    ? 'neumorphism-active bg-blue-50 dark:bg-blue-900/20'
                    : 'neumorphism-hover'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={index}
                  checked={answers[currentQuestionIndex] === index}
                  onChange={() => handleAnswerSelect(currentQuestionIndex, index)}
                  className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation buttons with neumorphism */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="neumorphism neumorphism-hover neumorphism-active disabled:neumorphism-pressed disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold text-gray-600 hover:text-gray-700 transition-all duration-200"
          >
            ← Previous
          </button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={answers.includes(-1)}
              className="neumorphism neumorphism-hover neumorphism-active disabled:neumorphism-pressed disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold text-green-600 hover:text-green-700 transition-all duration-200"
            >
              Submit Quiz ✓
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={answers[currentQuestionIndex] === -1}
              className="neumorphism neumorphism-hover neumorphism-active disabled:neumorphism-pressed disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold text-blue-600 hover:text-blue-700 transition-all duration-200"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;
