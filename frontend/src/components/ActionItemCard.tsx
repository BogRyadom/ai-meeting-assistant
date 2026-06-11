import type { ActionItem } from "@/types/meeting";

export default function ActionItemCard({ item }: { item: ActionItem }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <rect x="3" y="3" width="18" height="18" rx="3" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800">{item.text}</p>
        {(item.assignee || item.due_date) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {item.assignee && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 px-2 py-0.5 text-xs text-gray-600">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {item.assignee}
              </span>
            )}
            {item.due_date && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-gray-200 px-2 py-0.5 text-xs text-gray-600">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {item.due_date}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
