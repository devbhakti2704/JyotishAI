-- JyotishAI data layer — DPDP-compliant consent-gated storage + anonymized aggregates.
-- Run once against your Neon database (e.g. `psql "$DATABASE_URL" -f migrations/0001_init.sql`).

create extension if not exists pgcrypto;  -- for gen_random_uuid()

-- ── Task 1: consent-gated raw storage ───────────────────────────────────────────
-- PII columns are AES-256-GCM encrypted at the app layer and stored as base64 text
-- (iv ‖ authTag ‖ ciphertext). Coarse buckets are derived at ingestion so the
-- aggregate job never needs to decrypt anything.
create table if not exists user_submissions (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  consent_given     boolean     not null,
  consent_version   text        not null,

  -- non-sensitive coarse buckets (used only for aggregation)
  region            text,          -- state/UT level only, e.g. 'Maharashtra' or 'Other'
  age_bucket        text,          -- e.g. '25-34' (never the exact birth date)
  question_category text,          -- career|love|health|finance|other (Groq-labelled)

  -- sensitive PII, encrypted at rest
  name_enc          text,
  birth_date_enc    text,
  birth_time_enc    text,
  birth_place_enc   text,
  question_text_enc text,

  deleted_at        timestamptz    -- set on erasure (we hard-delete; kept for audit symmetry)
);
create index if not exists idx_submissions_created on user_submissions (created_at);
create index if not exists idx_submissions_buckets on user_submissions (question_category, region, age_bucket);

-- ── Task 3: anonymized, k-anonymised aggregate layer (the sellable asset) ────────
-- Contains ONLY de-identified bucketed counts. No PII, no exact birth data, no raw text.
create table if not exists insights_aggregates (
  id                bigint generated always as identity primary key,
  period_month      date    not null,
  question_category text    not null,
  age_bucket        text    not null,
  region            text    not null,
  user_count        integer not null,        -- guaranteed >= K_MIN by the derive job
  generated_at      timestamptz not null default now(),
  unique (period_month, question_category, age_bucket, region)
);
