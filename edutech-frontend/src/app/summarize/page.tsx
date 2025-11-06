import Summarizer from '@/components/Summarizer';
import Protected from '@/components/Protected';

export default function SummarizePage() {
  return (
    <Protected>
      <Summarizer />
    </Protected>
  );
}
