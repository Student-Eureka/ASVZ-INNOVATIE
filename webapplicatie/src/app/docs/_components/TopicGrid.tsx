import type { Topic, TopicId } from '../_types/docs';

interface TopicGridProps {
  topics: Topic[];
  onSelect: (id: TopicId) => void;
}

export default function TopicGrid({ topics, onSelect }: TopicGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {topics.map((topic) => (
        <button
          key={topic.id}
          type="button"
          onClick={() => onSelect(topic.id)}
          className="bg-white/95 hover:bg-white rounded-2xl shadow-md border border-slate-200 px-4 py-4 text-left transition active:scale-[0.99]"
        >
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            {topic.subtitel || 'Info'}
          </p>
          <p className="text-sm font-semibold text-slate-900">{topic.titel}</p>
        </button>
      ))}
    </div>
  );
}
