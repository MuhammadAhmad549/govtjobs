-- jobs table schema
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  apply_link TEXT NOT NULL,
  title TEXT,
  company TEXT,
  location TEXT,
  posted_date TEXT,
  description TEXT,
  job_type TEXT,
  remote BOOLEAN,
  raw_html TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS jobs_apply_link_idx ON jobs (apply_link);