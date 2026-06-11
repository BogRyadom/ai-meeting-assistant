"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { MeetingListItem } from "@/types/meeting";
import SearchBar from "@/components/SearchBar";
import MeetingCard from "@/components/MeetingCard";
import EmptyState from "@/components/EmptyState";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMeetings = useCallback(async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.meetings.list(q || undefined);
      setMeetings(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load meetings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings(search);
  }, [search, fetchMeetings]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setMeetings((prev) => prev.filter((m) => m.id !== id));
    try {
      await api.meetings.delete(id);
    } catch {
      fetchMeetings(search);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Meeting Assistant</h1>
              <p className="text-xs text-gray-400">AI-powered transcripts</p>
            </div>
            <Link
              href="/new"
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New meeting
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by title or content..." />
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {loading ? (
          <div className="py-16">
            <LoadingSpinner />
          </div>
        ) : meetings.length === 0 ? (
          <EmptyState
            title={search ? "No meetings found" : "No meetings yet"}
            description={
              search
                ? `Nothing matched "${search}". Try a different search.`
                : "Upload your first meeting transcript to get started."
            }
            action={
              !search
                ? { label: "New meeting", onClick: () => router.push("/new") }
                : undefined
            }
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-1">
            {meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onDelete={handleDelete}
                deleting={deletingId === meeting.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
