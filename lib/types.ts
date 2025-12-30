export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    sources?: SearchResult[];
}

export interface SearchResult {
    id: string;
    heading: string;
    excerpt: string;
    fullText: string;
    source: string;
}

export interface ChatResponse {
    answer: string;
    sources: SearchResult[];
}
