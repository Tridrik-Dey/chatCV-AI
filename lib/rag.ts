import fs from 'fs';
import path from 'path';
import { openai } from './openai';

export interface Chunk {
    id: string;
    heading: string;
    text: string;
    source: string;
    embedding: number[];
    aiRelevanceScore?: number;
}

export interface SearchResult extends Omit<Chunk, 'embedding'> {
    similarity: number;
    aiRelevanceScore?: number;
}

const INDEX_PATH = path.join(process.cwd(), 'data', 'index.json');

const AI_KEYWORDS = [
    'ai', 'ml', 'llm', 'gpt', 'neural', 'model', 'training', 'inference', 'machine learning',
    'artificial intelligence', 'deep learning', 'generative',
    'rag', 'retrieval', 'augmented', 'generation', 'embedding', 'vector', 'faiss', 'chroma',
    'pinecone', 'chromadb', 'semantic search',
    'langchain', 'pytorch', 'tensorflow', 'keras', 'scikit-learn', 'scikit', 'hugging face',
    'transformers', 'openai', 'anthropic', 'groq', 'voyage', 'numpy', 'pandas',
    'agent', 'chatbot', 'nlp', 'computer vision', 'cv', 'natural language',
    'state machine', 'browser automation', 'summarization', 'offline model',
    'jobseekerai', 'quicksum', 'chatcv', 'tridrik ai', 'xstate', 'puppeteer', 'gradio',
    't5', 'transformer', 't5-small',
    'nvidia', 'building rag agents',
    'contact', 'email', 'linkedin', 'github', 'personal', 'education', 'certification',
    'training', 'honors', 'awards', 'availability', 'notice period', 'remote',
    'hybrid', 'relocation', 'mentoring', 'leadership', 'languages',
];

function calculateAIRelevance(text: string): number {
    const lowerText = text.toLowerCase();
    let matchCount = 0;
    for (const keyword of AI_KEYWORDS) {
        if (lowerText.includes(keyword)) {
            matchCount++;
        }
    }
    return Math.min(matchCount / 3, 1.0);
}

function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

export async function getContext(query: string, topK: number = 3): Promise<SearchResult[]> {
    try {
        if (!fs.existsSync(INDEX_PATH)) return [];

        const fileContent = fs.readFileSync(INDEX_PATH, 'utf-8');
        const chunks: Chunk[] = JSON.parse(fileContent);

        const response = await openai.embeddings.create({
            model: process.env.OPENAI_EMBED_MODEL || 'text-embedding-3-small',
            input: query,
        });
        const queryEmbedding = response.data[0].embedding;

        const scoredChunks = chunks.map(chunk => {
            const baseSimilarity = cosineSimilarity(queryEmbedding, chunk.embedding);
            const aiRelevance = chunk.aiRelevanceScore ?? calculateAIRelevance(chunk.text);
            const weightedSimilarity = baseSimilarity * (1 + 0.3 * aiRelevance);

            return {
                ...chunk,
                similarity: weightedSimilarity,
                aiRelevanceScore: aiRelevance,
            };
        });

        scoredChunks.sort((a, b) => b.similarity - a.similarity);
        return scoredChunks.slice(0, topK).map(({ embedding: _embedding, ...rest }) => rest);

    } catch (error) {
        console.error('Error retrieving context:', error);
        return [];
    }
}
