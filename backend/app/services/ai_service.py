import json
import re

from groq import AsyncGroq

from app.config import settings

_client: AsyncGroq | None = None


def get_client() -> AsyncGroq:
    global _client
    if _client is None:
        _client = AsyncGroq(api_key=settings.groq_api_key)
    return _client


async def generate_summary(transcript: str) -> str:
    response = await get_client().chat.completions.create(
        model=settings.groq_model,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a meeting assistant. Summarize the meeting transcript in "
                    "3-5 sentences, focusing on key decisions, topics discussed, and outcomes."
                ),
            },
            {"role": "user", "content": f"Transcript:\n{transcript}"},
        ],
        temperature=0.3,
        max_tokens=500,
    )
    return response.choices[0].message.content.strip()


async def extract_action_items(transcript: str) -> list[dict]:
    response = await get_client().chat.completions.create(
        model=settings.groq_model,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a meeting assistant. Extract all action items from the meeting transcript.\n"
                    "Return a JSON array of objects with these fields:\n"
                    '- "text": description of the action item (required)\n'
                    '- "assignee": person responsible (string or null)\n'
                    '- "due_date": due date if mentioned (string or null)\n'
                    "Return ONLY the JSON array, no markdown, no explanation."
                ),
            },
            {"role": "user", "content": f"Transcript:\n{transcript}"},
        ],
        temperature=0.1,
        max_tokens=1000,
    )
    content = response.choices[0].message.content.strip()
    content = re.sub(r"^```(?:json)?\s*", "", content)
    content = re.sub(r"\s*```$", "", content)
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return []


async def answer_question(transcript: str, question: str) -> str:
    response = await get_client().chat.completions.create(
        model=settings.groq_model,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a meeting assistant. Answer questions about the meeting transcript "
                    "accurately and concisely. If the answer is not in the transcript, say so clearly."
                ),
            },
            {
                "role": "user",
                "content": f"Transcript:\n{transcript}\n\nQuestion: {question}",
            },
        ],
        temperature=0.3,
        max_tokens=500,
    )
    return response.choices[0].message.content.strip()
