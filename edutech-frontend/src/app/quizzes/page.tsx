import QuizList from '@/components/QuizList';
import Protected from '@/components/Protected';

/**
 * Quizzes page — only accessible to authenticated users.
 */
export default function QuizzesPage() {
  return (
    <Protected>
      <QuizList />
    </Protected>
  );
}
