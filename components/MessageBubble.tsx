import { Message } from '@/lib/types';

export default function MessageBubble({ message }: { message: Message }) {
    const isAssistant = message.role === 'assistant';
    return (
        <div className={`flex \${isAssistant ? 'justify-start' : 'justify-end'} w-full mb-4`}>
            <div className={`max-w-[80%] p-3 rounded-2xl \${isAssistant ? 'bg-white dark:bg-gray-800' : 'bg-blue-600 text-white'}`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
        </div>
    );
}
