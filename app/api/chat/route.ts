import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { getContext, SearchResult } from '@/lib/rag';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    try {
        const userName = process.env.NEXT_PUBLIC_USER_NAME || 'the candidate';
        const body = await req.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        const lastMessage = messages[messages.length - 1];
        const userQuery = lastMessage.content;

        function normalizeQuery(query: string): string {
            const namePattern = new RegExp(`\\b${userName.split(' ')[0]}'?s?\\b`, 'gi');
            return query
                .replace(namePattern, 'your')
                .replace(/\bhis\b/gi, 'your')
                .replace(/\bhe\b/gi, 'you')
                .replace(/\bhim\b/gi, 'you');
        }

        const normalizedQuery = normalizeQuery(userQuery);
        const contextChunks: SearchResult[] = await getContext(normalizedQuery, 6);

        const systemPrompt = `
You are an AI assistant representing \${userName}, specifically designed to interact with recruiters. You answer questions about \${userName}'s professional profile based strictly on the provided context.

RULES:
1. Answer ONLY using the facts from the CONTEXT above.
2. If the answer is not in context, politely refuse.
3. Cite sources using [source: id].
4. Max 180 words.

CONTEXT:
\${contextChunks.map(c => \`[source: \${c.id}] (Section: \${c.heading})\\n\${c.text}\`).join('\\n\\n')}

User Question: \${userQuery}
    \`.trim();

        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
            messages: [{ role: 'system', content: systemPrompt }],
            temperature: 0.3,
            max_tokens: 300,
        });

        const answer = response.choices[0].message.content;

        return NextResponse.json({
            answer,
            sources: contextChunks.map(c => ({
                id: c.id,
                heading: c.heading,
                excerpt: c.text.substring(0, 100) + '...',
                fullText: c.text,
                source: c.source
            }))
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
