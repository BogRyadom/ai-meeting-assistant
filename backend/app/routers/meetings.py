from uuid import UUID

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query

from app.models.meeting import (
    MeetingResponse,
    MeetingListItem,
    QuestionRequest,
    QuestionResponse,
    MeetingCreate,
)
from app.services import ai_service, meeting_service

router = APIRouter()


@router.get("", response_model=list[MeetingListItem])
async def list_meetings(search: str | None = Query(default=None)):
    return await meeting_service.list_meetings(search)


@router.post("", response_model=MeetingResponse, status_code=201)
async def create_meeting(
    title: str = Form(...),
    transcript: str | None = Form(default=None),
    file: UploadFile | None = File(default=None),
):
    if file is not None and file.filename:
        content = await file.read()
        transcript_text = content.decode("utf-8")
    elif transcript is not None:
        transcript_text = transcript
    else:
        raise HTTPException(status_code=422, detail="Provide either 'transcript' or a 'file'")

    return await meeting_service.create_meeting(
        MeetingCreate(title=title, transcript=transcript_text)
    )


@router.get("/{meeting_id}", response_model=MeetingResponse)
async def get_meeting(meeting_id: UUID):
    meeting = await meeting_service.get_meeting(meeting_id)
    if meeting is None:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.delete("/{meeting_id}", status_code=204)
async def delete_meeting(meeting_id: UUID):
    deleted = await meeting_service.delete_meeting(meeting_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Meeting not found")


@router.post("/{meeting_id}/ask", response_model=QuestionResponse)
async def ask_question(meeting_id: UUID, body: QuestionRequest):
    meeting = await meeting_service.get_meeting(meeting_id)
    if meeting is None:
        raise HTTPException(status_code=404, detail="Meeting not found")
    answer = await ai_service.answer_question(meeting.transcript, body.question)
    return QuestionResponse(answer=answer)
