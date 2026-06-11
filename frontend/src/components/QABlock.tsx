"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

type QAPair = { question: string; answer: string };

export default function QABlock({ meetingId }: { meetingId: string }) {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<QAPair[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const handleAsk = async () => {
    const q = question.trim();
    if (!q || loading) return;
    setQuestion("");
    setError(null);
    setLoading(true);
    try {
      const res = await api.meetings.ask(meetingId, q);
      setHistory((prev) => [...prev, { question: q, answer: res.answer }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to get an answer. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
        Ask about this meeting
      </h2>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {history.length === 0 && !loading ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-gray-400">Ask anything about this meeting</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-5 max-h-96 overflow-y-auto">
            {history.map((pair, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-end">
                  <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-2.5">
                    <p className="text-sm text-white">{pair.question}</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-2.5">
                    <p className="text-sm text-gray-800 leading-relaxed">{pair.answer}</p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3">
                  <LoadingSpinner size="sm" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {error && (
          <div className="px-4 pb-3">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="border-t border-gray-100 p-3 flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder="Ask a question..."
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:text-gray-400"
          />
          <button
            onClick={handleAsk}
            disabled={!question.trim() || loading}
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ask
          </button>
        </div>
      </div>
    </section>
  );
}
