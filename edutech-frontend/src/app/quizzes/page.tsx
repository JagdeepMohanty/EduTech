'use client';

import QuizList from '@/components/QuizList';
import Protected from '@/components/Protected';

export default function QuizzesPage() {
  return (
    <Protected>
      <QuizList />
    </Protected>
  );
}