import type { ContentBlock } from '../_types/docs';

interface TopicModalProps {
  content: ContentBlock;
  onClose: () => void;
}

export default function TopicModal({ content, onClose }: TopicModalProps) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 px-6 py-5 z-30">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-sm font-semibold text-slate-900">{content.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>
        </div>
        <div>{content.body}</div>
      </div>
    </div>
  );
}
