"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Meeting } from "@/types/meeting";
import MeetingDetail from "@/components/MeetingDetail";
import QABlock from "@/components/QABlock";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import * as React from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function MeetingPage({ params }: PageProps) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  useEffect(() => { 
    api.meetings
      .get(id)
      .then(setMeeting)
      .catch((e) => setError(e instanceof Error ? e.message : "Meeting not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this meeting? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.meetings.delete(id);
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete.");
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/"
                className="flex shrink-0 items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                All meetings
              </Link>
              {meeting && (
                <>
                  <span className="text-gray-300">/</span>
                  <h1 className="truncate text-base font-semibold text-gray-900">{meeting.title}</h1>
                </>
              )}
            </div>
            {meeting && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {loading ? (
          <div className="py-16">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : meeting ? (
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-sm text-gray-400">{formatDate(meeting.created_at)}</p>
            </div>
            <MeetingDetail meeting={meeting} />
            <QABlock meetingId={meeting.id} />
          </div>
        ) : null}
      </main>
    </div>
  );
}
