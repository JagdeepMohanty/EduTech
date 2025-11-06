import QuizComponent from '@/components/QuizComponent';

interface QuizPageProps {
  params: {
    id: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  return <QuizComponent quizId={params.id} />;
}
