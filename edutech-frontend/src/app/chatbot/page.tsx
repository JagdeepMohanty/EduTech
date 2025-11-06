import Chatbot from '@/components/Chatbot';
import Protected from '@/components/Protected';

export default function ChatbotPage() {
  return (
    <Protected>
      <Chatbot />
    </Protected>
  );
}
