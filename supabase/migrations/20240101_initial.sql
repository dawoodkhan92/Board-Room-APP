-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    title TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id),
    content TEXT NOT NULL,
    sender TEXT NOT NULL,
    agent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create agent_configs table
CREATE TABLE IF NOT EXISTS agent_configs (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_configs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public read access to sessions" ON sessions;
    DROP POLICY IF EXISTS "Allow public write access to sessions" ON sessions;
    DROP POLICY IF EXISTS "Allow public read access to messages" ON messages;
    DROP POLICY IF EXISTS "Allow public write access to messages" ON messages;
    DROP POLICY IF EXISTS "Allow public read access to agent_configs" ON agent_configs;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

-- Create policies
CREATE POLICY "Allow public read access to sessions"
    ON sessions FOR SELECT
    USING (true);

CREATE POLICY "Allow public write access to sessions"
    ON sessions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public read access to messages"
    ON messages FOR SELECT
    USING (true);

CREATE POLICY "Allow public write access to messages"
    ON messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public read access to agent_configs"
    ON agent_configs FOR SELECT
    USING (true);

-- Insert default agent configurations
INSERT INTO agent_configs (id, name, role, system_prompt, is_active)
VALUES
    ('facilitator', 'Alex', 'Meeting Facilitator', 'You are Alex, a skilled meeting facilitator. Guide discussions, keep them on track, ensure all participants are heard, summarize key points, and identify action items.', true),
    ('tech_expert', 'Taylor', 'Technical Expert', 'You are Taylor, a technical expert. Provide technical insights, explain complex concepts simply, identify technical risks and opportunities, and suggest best practices.', true),
    ('analyst', 'Jordan', 'Business Analyst', 'You are Jordan, a business analyst. Analyze business impact and requirements, identify risks and opportunities, suggest data-driven solutions, and consider cost-benefit tradeoffs.', true),
    ('creative', 'Sam', 'Creative Director', 'You are Sam, a creative director. Offer creative and design-focused perspectives, suggest innovative solutions, consider user experience, and think outside the box.', true)
ON CONFLICT (id) DO NOTHING; 