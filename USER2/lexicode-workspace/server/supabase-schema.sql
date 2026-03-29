-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Files Table (Virtual File System)
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path TEXT NOT NULL, -- e.g., "src/index.js"
  type TEXT NOT NULL, -- "md", "json", "js", etc.
  content TEXT,
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Version History (Storing Diffs)
CREATE TABLE file_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  patch JSONB NOT NULL, -- Delta change
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  summary TEXT -- AI generated summary of change
);
