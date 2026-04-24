-- College File Approval System - Supabase Schema
-- This is the only backend you need. No Express, no Prisma, just Supabase!

-- ============================================
-- 1. TABLES
-- ============================================

-- Profiles table (extended from auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('staff', 'principal', 'president')),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  current_stage TEXT NOT NULL DEFAULT 'principal' CHECK (current_stage IN ('principal', 'president', 'completed', 'rejected')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Approval history table
CREATE TABLE IF NOT EXISTS approval_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL REFERENCES files (id) ON DELETE CASCADE,
  action_by UUID NOT NULL REFERENCES profiles (id),
  role TEXT NOT NULL CHECK (role IN ('staff', 'principal', 'president')),
  action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'uploaded')),
  remark TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS files_created_by_idx ON files (created_by);
CREATE INDEX IF NOT EXISTS files_current_stage_idx ON files (current_stage);
CREATE INDEX IF NOT EXISTS files_status_idx ON files (status);
CREATE INDEX IF NOT EXISTS approval_history_file_id_idx ON approval_history (file_id);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles (role);

-- ============================================
-- 2. FUNCTIONS
-- ============================================

-- Function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', new.email), 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'staff')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_history ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
-- Everyone can read all profiles
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Files RLS Policies
-- Staff can only view their own files
CREATE POLICY "Staff see only own files" ON files
  FOR SELECT TO authenticated
  USING (
    (auth.uid() = created_by AND 
     (SELECT role FROM profiles WHERE id = auth.uid()) = 'staff')
    OR
    -- Principal can see files in principal stage or later stages
    ((SELECT role FROM profiles WHERE id = auth.uid()) = 'principal' 
     AND current_stage IN ('principal', 'president', 'completed', 'rejected'))
    OR
    -- President can see files in president stage or later stages
    ((SELECT role FROM profiles WHERE id = auth.uid()) = 'president' 
     AND current_stage IN ('president', 'completed', 'rejected'))
  );

-- Staff can insert (upload) files
CREATE POLICY "Staff can upload files" ON files
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = created_by AND 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'staff'
  );

-- Only authenticated users can update files (for approval workflows)
CREATE POLICY "Authenticated users can update files" ON files
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Approval History RLS Policies
-- Everyone can view approval history for files they can access
CREATE POLICY "Approval history viewable with file access" ON approval_history
  FOR SELECT TO authenticated
  USING (
    file_id IN (
      SELECT id FROM files WHERE
      (auth.uid() = created_by AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'staff')
      OR ((SELECT role FROM profiles WHERE id = auth.uid()) = 'principal' AND current_stage IN ('principal', 'president', 'completed', 'rejected'))
      OR ((SELECT role FROM profiles WHERE id = auth.uid()) = 'president' AND current_stage IN ('president', 'completed', 'rejected'))
    )
  );

-- Authenticated users can insert approval history
CREATE POLICY "Insert approval history" ON approval_history
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = action_by);

-- ============================================
-- 4. STORAGE BUCKET SETUP
-- ============================================

-- This needs to be done in Supabase Dashboard:
-- 1. Go to Storage
-- 2. Create new bucket: "documents"
-- 3. Make it Private
-- 4. Add the following RLS policies in Storage section

-- Storage Policy: Authenticated users can upload
-- Storage Policy: Users can only access their own files
-- Storage Policy: Users can delete their own files
