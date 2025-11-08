'use client';

import { useParams } from 'next/navigation';
import QuizComponent from '@/components/QuizComponent';

export default function QuizPage() {
  const params = useParams();
  const quizId = params.id as string;

  return <QuizComponent quizId={quizId} />;
}