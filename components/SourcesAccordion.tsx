import { SearchResult } from '@/lib/types';

export default function SourcesAccordion({ sources }: { sources: SearchResult[] }) {
    if (!sources || sources.length === 0) return null;
    return (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold mb-2">Sources</h3>
            <ul className="space-y-2">
                {sources.map(s => (
                    <li key={s.id} className="text-xs">
                        <strong>[{s.id}]</strong> {s.heading} - {s.excerpt}
                    </li>
                ))}
            </ul>
        </div>
    );
}
