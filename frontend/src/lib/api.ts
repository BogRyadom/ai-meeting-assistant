import type { Meeting, MeetingListItem, QuestionResponse } from "@/types/meeting";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  meetings: {
    list: (search?: string) => {
      const params = search ? `?search=${encodeURIComponent(search)}` : "";
      return request<MeetingListItem[]>(`/api/meetings${params}`);
    },
    get: (id: string) => request<Meeting>(`/api/meetings/${id}`),
    create: (formData: FormData) =>
      request<Meeting>("/api/meetings", { method: "POST", body: formData }),
    delete: (id: string) =>
      request<void>(`/api/meetings/${id}`, { method: "DELETE" }),
    ask: (id: string, question: string) =>
      request<QuestionResponse>(`/api/meetings/${id}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      }),
  },
};
