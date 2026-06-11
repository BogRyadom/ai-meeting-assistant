"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function NewMeetingForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<"text" | "file">("text");
  const [transcript, setTranscript] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    title.trim() &&
    (mode === "text" ? transcript.trim() : file !== null) &&
    !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      if (mode === "text") {
        formData.append("transcript", transcript.trim());
      } else if (file) {
        formData.append("file", file);
      }
      const meeting = await api.meetings.create(formData);
      router.push(`/meetings/${meeting.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create meeting. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Meeting title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Q3 planning, design review..."
          disabled={loading}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
        />
      </div>

      <div>
        <div className="mb-3 flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            onClick={() => setMode("text")}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              mode === "text"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Paste text
          </button>
          <button
            onClick={() => setMode("file")}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              mode === "file"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upload .txt
          </button>
        </div>

        {mode === "text" ? (
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your meeting transcript here..."
            disabled={loading}
            rows={10}
            className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
          />
        ) : (
          <label
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
              file
                ? "border-blue-300 bg-blue-50"
                : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <input
              type="file"
              accept=".txt"
              className="hidden"
              disabled={loading}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <svg
              className={`h-8 w-8 ${file ? "text-blue-500" : "text-gray-400"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {file ? (
              <div className="text-center">
                <p className="text-sm font-medium text-blue-700">{file.name}</p>
                <p className="text-xs text-blue-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Click to upload a .txt file</p>
                <p className="text-xs text-gray-400">Plain text transcripts only</p>
              </div>
            )}
          </label>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => router.back()}
          disabled={loading}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              Processing...
            </>
          ) : (
            "Create meeting"
          )}
        </button>
      </div>
    </div>
  );
}
