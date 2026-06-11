from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ActionItem(BaseModel):
    text: str
    assignee: str | None = None
    due_date: str | None = None


class MeetingCreate(BaseModel):
    title: str
    transcript: str


class MeetingResponse(BaseModel):
    id: UUID
    title: str
    transcript: str
    summary: str | None
    action_items: list[ActionItem]
    created_at: datetime
    updated_at: datetime


class MeetingListItem(BaseModel):
    id: UUID
    title: str
    summary: str | None
    action_items: list[ActionItem]
    created_at: datetime


class QuestionRequest(BaseModel):
    question: str


class QuestionResponse(BaseModel):
    answer: str
