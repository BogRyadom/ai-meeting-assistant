import asyncio
import json
from uuid import UUID

import asyncpg

from app.db.database import get_pool
from app.models.meeting import ActionItem, MeetingCreate, MeetingListItem, MeetingResponse
from app.services import ai_service


def _parse_action_items(raw) -> list[ActionItem]:
    if isinstance(raw, str):
        data = json.loads(raw)
    else:
        data = raw or []
    return [ActionItem(**item) for item in data]


def _row_to_response(row: asyncpg.Record) -> MeetingResponse:
    return MeetingResponse(
        id=row["id"],
        title=row["title"],
        transcript=row["transcript"],
        summary=row["summary"],
        action_items=_parse_action_items(row["action_items"]),
        created_at=row["created_at"],
        updated_at=row["updated_at"],
    )


def _row_to_list_item(row: asyncpg.Record) -> MeetingListItem:
    return MeetingListItem(
        id=row["id"],
        title=row["title"],
        summary=row["summary"],
        action_items=_parse_action_items(row["action_items"]),
        created_at=row["created_at"],
    )


async def create_meeting(data: MeetingCreate) -> MeetingResponse:
    summary, action_items = await asyncio.gather(
        ai_service.generate_summary(data.transcript),
        ai_service.extract_action_items(data.transcript),
    )

    pool = get_pool()
    row = await pool.fetchrow(
        """
        INSERT INTO meetings (title, transcript, summary, action_items)
        VALUES ($1, $2, $3, $4::jsonb)
        RETURNING *
        """,
        data.title,
        data.transcript,
        summary,
        json.dumps(action_items),
    )
    return _row_to_response(row)


async def get_meeting(meeting_id: UUID) -> MeetingResponse | None:
    pool = get_pool()
    row = await pool.fetchrow("SELECT * FROM meetings WHERE id = $1", meeting_id)
    if row is None:
        return None
    return _row_to_response(row)


async def list_meetings(search: str | None = None) -> list[MeetingListItem]:
    pool = get_pool()
    if search:
        rows = await pool.fetch(
            """
            SELECT id, title, summary, action_items, created_at
            FROM meetings
            WHERE to_tsvector('english', title || ' ' || transcript || ' ' || COALESCE(summary, ''))
                  @@ plainto_tsquery('english', $1)
            ORDER BY created_at DESC
            """,
            search,
        )
    else:
        rows = await pool.fetch(
            "SELECT id, title, summary, action_items, created_at FROM meetings ORDER BY created_at DESC"
        )
    return [_row_to_list_item(row) for row in rows]


async def delete_meeting(meeting_id: UUID) -> bool:
    pool = get_pool()
    result = await pool.execute("DELETE FROM meetings WHERE id = $1", meeting_id)
    return result == "DELETE 1"
