"use client";

import Link from "next/link";
import type { MeetingListItem } from "@/types/meeting";

type MeetingCardProps = {
  meeting: MeetingListItem;
  onDelete: (id: string) => void;
  deleting?: boolean;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MeetingCard({ meeting, onDelete, deleting }: MeetingCardProps) {
  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <Link
          href={`/meetings/${meeting.id}`}
          className="flex-1 min-w-0"
        >
          <h2 className="truncate text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors">
            {meeting.title}
          </h2>
        </Link>
        <button
          onClick={() => onDelete(meeting.id)}
          disabled={deleting}
          className="shrink-0 rounded-md p-1.5 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
          title="Delete meeting"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {meeting.summary && (
        <p className="line-clamp-2 text-sm text-gray-500">{meeting.summary}</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{formatDate(meeting.created_at)}</span>
        {meeting.action_items.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {meeting.action_items.length} action{meeting.action_items.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}
