-- Migration 001: initial schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS meetings (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT        NOT NULL,
    transcript  TEXT        NOT NULL,
    summary     TEXT,
    action_items JSONB      NOT NULL DEFAULT '[]',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS meetings_created_at_idx ON meetings (created_at DESC);
CREATE INDEX IF NOT EXISTS meetings_search_idx ON meetings USING GIN (
    to_tsvector('english', title || ' ' || transcript || ' ' || COALESCE(summary, ''))
);
