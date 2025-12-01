-- PostgreSQL schema for Integrated Police & Immigration Management System (IPIMS)
-- Requires: pgcrypto for encryption utilities
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- ============================================
-- RESIDENTS / CITIZENS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity Documents
  nrc TEXT UNIQUE, -- National Registration Card (for Zambian citizens)
  passport_number TEXT, -- Passport number
  national_id_hash TEXT UNIQUE, -- Hashed NRC for secure lookups
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female')),
  date_of_birth DATE NOT NULL,
  
  -- Nationality & Residency
  nationality TEXT NOT NULL DEFAULT 'Zambia',
  residency_status TEXT DEFAULT 'citizen' CHECK (residency_status IN ('citizen', 'resident', 'visitor', 'refugee')),
  
  -- Contact Information
  phone TEXT,
  email CITEXT,
  address TEXT,
  
  -- Additional Details
  occupation TEXT,
  marital_status TEXT CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  
  -- Digital Identity (for QR verification)
  card_id TEXT UNIQUE,
  qr_code_signature TEXT,
  
  -- Password for login (optional, for citizen portal)
  password_hash TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_residents_nrc ON residents(nrc);
CREATE INDEX IF NOT EXISTS idx_residents_passport ON residents(passport_number);
CREATE INDEX IF NOT EXISTS idx_residents_email ON residents(email);
CREATE INDEX IF NOT EXISTS idx_residents_national_id_hash ON residents(national_id_hash);

-- ============================================
-- POLICE OFFICERS TABLE
-- ============================================
CREATE TYPE officer_rank AS ENUM ('constable', 'sergeant', 'inspector', 'superintendent', 'commissioner');

CREATE TABLE IF NOT EXISTS officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  officer_id TEXT NOT NULL UNIQUE, -- Badge number
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  rank officer_rank NOT NULL,
  department TEXT,
  station TEXT,
  email CITEXT UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_officers_officer_id ON officers(officer_id);
CREATE INDEX IF NOT EXISTS idx_officers_email ON officers(email);

-- ============================================
-- IMMIGRATION OFFICERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS immigration_officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  officer_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  office_location TEXT,
  email CITEXT UNIQUE,
  phone TEXT,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_immigration_officers_email ON immigration_officers(email);

-- ============================================
-- POLICE CASES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'theft', 'assault', 'fraud', etc.
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'closed', 'archived')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  location TEXT,
  reported_by UUID REFERENCES residents(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES officers(id) ON DELETE SET NULL,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_assigned_to ON cases(assigned_to);

-- ============================================
-- SUSPECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS suspects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES residents(id) ON DELETE SET NULL,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  alias TEXT,
  description TEXT,
  last_known_location TEXT,
  status TEXT DEFAULT 'wanted' CHECK (status IN ('wanted', 'in_custody', 'released', 'convicted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_suspects_case_id ON suspects(case_id);
CREATE INDEX IF NOT EXISTS idx_suspects_resident_id ON suspects(resident_id);

-- ============================================
-- IMMIGRATION PERMITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS permits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permit_number TEXT NOT NULL UNIQUE,
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('work', 'student', 'business', 'residence', 'temporary')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  issued_by UUID REFERENCES immigration_officers(id) ON DELETE SET NULL,
  issue_date DATE,
  expiry_date DATE,
  purpose TEXT,
  employer_details JSONB, -- For work permits
  institution_details JSONB, -- For student permits
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_permits_resident_id ON permits(resident_id);
CREATE INDEX IF NOT EXISTS idx_permits_status ON permits(status);
CREATE INDEX IF NOT EXISTS idx_permits_expiry_date ON permits(expiry_date);

-- ============================================
-- VISAS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS visas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visa_number TEXT NOT NULL UNIQUE,
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('tourist', 'business', 'transit', 'diplomatic')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  issued_by UUID REFERENCES immigration_officers(id) ON DELETE SET NULL,
  issue_date DATE,
  expiry_date DATE,
  entry_date DATE,
  exit_date DATE,
  purpose TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_visas_resident_id ON visas(resident_id);
CREATE INDEX IF NOT EXISTS idx_visas_status ON visas(status);

-- ============================================
-- FINGERPRINT APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS fingerprint_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  nrc TEXT NOT NULL,
  phone TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('police_clearance', 'visa', 'employment', 'other')),
  preferred_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fingerprint_applications_resident_id ON fingerprint_applications(resident_id);
CREATE INDEX IF NOT EXISTS idx_fingerprint_applications_status ON fingerprint_applications(status);

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- ============================================
-- AUDIT LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Can reference officers, immigration_officers, or admin_users
  user_type TEXT, -- 'officer', 'immigration_officer', 'admin', 'resident'
  action TEXT NOT NULL,
  entity_type TEXT, -- 'case', 'permit', 'visa', etc.
  entity_id UUID,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- FUNCTIONS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for all tables with updated_at
CREATE TRIGGER update_residents_updated_at BEFORE UPDATE ON residents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_officers_updated_at BEFORE UPDATE ON officers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_immigration_officers_updated_at BEFORE UPDATE ON immigration_officers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suspects_updated_at BEFORE UPDATE ON suspects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_permits_updated_at BEFORE UPDATE ON permits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_visas_updated_at BEFORE UPDATE ON visas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fingerprint_applications_updated_at BEFORE UPDATE ON fingerprint_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
