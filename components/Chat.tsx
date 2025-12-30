'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, ChatResponse } from '@/lib/types';
import MessageBubble from './MessageBubble';

const userName = process.env.NEXT_PUBLIC_USER_NAME || 'the candidate';
const userFirstName = userName.split(' ')[0];

const EXAMPLE_QUESTIONS = [
\`Our job role requirement is (..........), is \${userFirstName} a good candidate?\`,
    \`What is \${userFirstName}'s educational background?\`,
    \`What is their professional background and current focus area?\`,
    \`Give me a brief overview of \${userFirstName}'s AI projects\`,
    \`Tell me about its key AI projects\`,
    \`What's \${userFirstName}'s experience with RAG systems?\`
];

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            });

            if (!res.ok) throw new Error('Failed to fetch response');
            const data: ChatResponse = await res.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.answer,
                sources: data.sources,
            }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: \`I apologize, but I encountered an error. Please try again.\`,
                sources: []
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[80vh] w-full max-w-3xl mx-auto bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl backdrop-blur-sm overflow-hidden text-gray-900 dark:text-gray-100">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    {process.env.NEXT_PUBLIC_USER_TITLE || 'AI Assistant'}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {process.env.NEXT_PUBLIC_USER_GUIDANCE || 'Ask anything about my professional background'}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                        <p className="text-sm font-medium">Hello! I&apos;m {userFirstName}&apos;s AI agent.</p>
                        <p className="text-xs">Ask me anything!</p>
                    </div>
                )}
                {messages.map((m, i) => <MessageBubble key={i} message={m} />)}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={\`Ask about \${userFirstName}'s skills...\`}
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl">Send</button>
                </form>
            </div>
        </div>
    );
}
