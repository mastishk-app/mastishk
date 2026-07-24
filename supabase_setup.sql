
CREATE TABLE IF NOT EXISTS survey_responses (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name          TEXT NOT NULL,
  contact_method TEXT NOT NULL CHECK (contact_method IN ('email', 'mobile')),
  contact_value TEXT NOT NULL,
  answers       JSONB DEFAULT '{}'::jsonb,
  referral_code TEXT UNIQUE,
  referred_by   TEXT,
  session_token UUID UNIQUE
);

-- Add a comment for documentation
COMMENT ON TABLE survey_responses IS 'Stores questionnaire submissions from the Restora landing page.';

-- Enable Row Level Security (required for Supabase anon key access)
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone can submit the form)
CREATE POLICY "Allow anonymous inserts"
  ON survey_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- RPC to securely fetch a user's survey response by their secret session token
CREATE OR REPLACE FUNCTION get_my_survey(token UUID)
RETURNS SETOF survey_responses
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM survey_responses WHERE session_token = token;
$$;

-- RPC to securely update a user's survey answers by their secret session token
CREATE OR REPLACE FUNCTION update_my_answers(token UUID, new_answers JSONB)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE survey_responses SET answers = new_answers WHERE session_token = token;
$$;

-- Feature love impressions ("I love this!" on What's Coming cards)
CREATE TABLE IF NOT EXISTS feature_loves (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  feature_id     TEXT NOT NULL,
  session_token  UUID
);

COMMENT ON TABLE feature_loves IS 'Stores "I love this!" votes for upcoming feature ideas on the landing page.';

CREATE INDEX IF NOT EXISTS feature_loves_feature_id_idx ON feature_loves (feature_id);

ALTER TABLE feature_loves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous feature love inserts"
  ON feature_loves
  FOR INSERT
  TO anon
  WITH CHECK (true);

