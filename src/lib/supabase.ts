import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Student, Professor, Company, Recommendation, RecommendationCode, Job, JobApplication } from '../types';

// Retrieve environment variables with compatibility for Vite (VITE_) and Vercel/Next.js (NEXT_PUBLIC_) prefixes
const meta = import.meta as any;
const supabaseUrl = (meta.env?.VITE_SUPABASE_URL || meta.env?.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (meta.env?.VITE_SUPABASE_ANON_KEY || meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

let supabaseInstance: SupabaseClient | null = null;

/**
 * Returns true if Supabase configuration is present.
 */
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

/**
 * Lazily initializes and returns the Supabase client.
 * Returns null if keys are not configured, rather than throwing immediately,
 * so the application doesn't crash on startup and can guide the user.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
}

// Additional debugging configurations
export const SUPABASE_CONFIG_INFO = {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 12)}...` : 'Not Configured',
  hasKey: !!supabaseAnonKey,
};

// ==========================================
// DB Mappings (CamelCase <=> snake_case)
// ==========================================

export function mapStudentFromDB(db: any): Student {
  return {
    id: db.id,
    name: db.name,
    email: db.email,
    university: db.university,
    major: db.major,
    resume: db.resume || { bio: '', skills: [], education: '' },
    recommendationStatus: db.recommendation_status || 'NONE',
    recommendationId: db.recommendation_id || undefined,
    requestedProfessorName: db.requested_professor_name || undefined,
    requestedProfessorEmail: db.requested_professor_email || undefined,
    verifiedAt: db.verified_at || undefined,
    profileImageUrl: db.profile_image_url || undefined,
    createdAt: db.created_at,
  };
}

export function mapStudentToDB(st: Student): any {
  return {
    id: st.id,
    name: st.name,
    email: st.email?.trim(),
    university: st.university,
    major: st.major,
    resume: st.resume,
    recommendation_status: st.recommendationStatus,
    recommendation_id: st.recommendationId || null,
    requested_professor_name: st.requestedProfessorName || null,
    requested_professor_email: st.requestedProfessorEmail || null,
    verified_at: st.verifiedAt || null,
    profile_image_url: st.profileImageUrl || null,
    created_at: st.createdAt,
  };
}

export function mapProfessorFromDB(db: any): Professor {
  return {
    id: db.id,
    name: db.name,
    email: db.email,
    university: db.university,
    department: db.department,
    createdAt: db.created_at,
  };
}

export function mapProfessorToDB(pr: Professor): any {
  return {
    id: pr.id,
    name: pr.name,
    email: pr.email?.trim(),
    university: pr.university,
    department: pr.department,
    created_at: pr.createdAt,
  };
}

export function mapCompanyFromDB(db: any): Company {
  return {
    id: db.id,
    name: db.name,
    email: db.email,
    businessId: db.business_id,
    website: db.website,
    logoUrl: db.logo_url || '🏢',
    description: db.description || '',
    industry: db.industry,
    address: db.address,
    verificationStatus: db.verification_status || 'PENDING',
    documentFileName: db.document_file_name || undefined,
    verifiedAt: db.verified_at || undefined,
    createdAt: db.created_at,
  };
}

export function mapCompanyToDB(co: Company): any {
  return {
    id: co.id,
    name: co.name,
    email: co.email?.trim(),
    business_id: co.businessId,
    website: co.website,
    logo_url: co.logoUrl || '🏢',
    description: co.description,
    industry: co.industry,
    address: co.address,
    verification_status: co.verificationStatus,
    document_file_name: co.documentFileName || null,
    verified_at: co.verifiedAt || null,
    created_at: co.createdAt,
  };
}

export function mapRecommendationFromDB(db: any): Recommendation {
  return {
    id: db.id,
    studentId: db.student_id || undefined,
    studentEmail: db.student_email,
    studentName: db.student_name,
    professorId: db.professor_id,
    professorName: db.professor_name,
    professorEmail: db.professor_email,
    relationship: db.relationship,
    courseName: db.course_name || undefined,
    content: db.content || '',
    tags: db.tags || [],
    status: db.status || 'PENDING',
    verifiedCode: db.verified_code || undefined,
    createdAt: db.created_at,
  };
}

export function mapRecommendationToDB(re: Recommendation): any {
  return {
    id: re.id,
    student_id: re.studentId || null,
    student_email: re.studentEmail,
    student_name: re.studentName,
    professor_id: re.professorId,
    professor_name: re.professorName,
    professor_email: re.professorEmail,
    relationship: re.relationship,
    course_name: re.courseName || null,
    content: re.content,
    tags: re.tags,
    status: re.status,
    verified_code: re.verifiedCode || null,
    created_at: re.createdAt,
  };
}

export function mapRecommendationCodeFromDB(db: any): RecommendationCode {
  return {
    code: db.code,
    professorId: db.professor_id,
    professorName: db.professor_name,
    professorEmail: db.professor_email,
    issuedForEmail: db.issued_for_email || undefined,
    createdAt: db.created_at,
    isUsed: db.is_used || false,
    usedByEmail: db.used_by_email || undefined,
    relationship: db.relationship,
  };
}

export function mapRecommendationCodeToDB(rc: RecommendationCode): any {
  return {
    code: rc.code,
    professor_id: rc.professorId,
    professor_name: rc.professorName,
    professor_email: rc.professorEmail,
    issued_for_email: rc.issuedForEmail || null,
    created_at: rc.createdAt,
    is_used: rc.isUsed,
    used_by_email: rc.usedByEmail || null,
    relationship: rc.relationship,
  };
}

export function mapJobFromDB(db: any): Job {
  return {
    id: db.id,
    companyId: db.company_id,
    companyName: db.company_name,
    companyLogo: db.company_logo || undefined,
    title: db.title,
    description: db.description,
    requirements: db.requirements || [],
    preferences: db.preferences || [],
    location: db.location,
    salary: db.salary,
    status: db.status || 'ACTIVE',
    createdAt: db.created_at,
    applicantsCount: db.applicants_count || 0,
  };
}

export function mapJobToDB(jb: Job): any {
  return {
    id: jb.id,
    company_id: jb.companyId,
    company_name: jb.companyName,
    company_logo: jb.companyLogo || null,
    title: jb.title,
    description: jb.description,
    requirements: jb.requirements,
    preferences: jb.preferences,
    location: jb.location,
    salary: jb.salary,
    status: jb.status,
    created_at: jb.createdAt,
    applicants_count: jb.applicantsCount,
  };
}

export function mapJobApplicationFromDB(db: any): JobApplication {
  return {
    id: db.id,
    jobId: db.job_id,
    jobTitle: db.job_title,
    companyId: db.company_id,
    companyName: db.company_name,
    studentId: db.student_id,
    studentName: db.student_name,
    studentEmail: db.student_email,
    studentMajor: db.student_major,
    studentUniversity: db.student_university,
    resume: db.resume || { bio: '', skills: [], education: '' },
    recommendation: db.recommendation || undefined,
    status: db.status || 'PENDING',
    feedback: db.feedback || undefined,
    appliedAt: db.applied_at,
  };
}

export function mapJobApplicationToDB(ap: JobApplication): any {
  return {
    id: ap.id,
    job_id: ap.jobId,
    job_title: ap.jobTitle,
    company_id: ap.companyId,
    company_name: ap.companyName,
    student_id: ap.studentId,
    student_name: ap.studentName,
    student_email: ap.studentEmail,
    student_major: ap.studentMajor,
    student_university: ap.studentUniversity,
    resume: ap.resume,
    recommendation: ap.recommendation || null,
    status: ap.status,
    feedback: ap.feedback || null,
    applied_at: ap.appliedAt,
  };
}

// ==========================================
// Real-Time Supabase Sync APIs
// ==========================================

export interface SupabaseSyncResult {
  students: Student[];
  professors: Professor[];
  companies: Company[];
  recommendations: Recommendation[];
  recommendationCodes: RecommendationCode[];
  jobs: Job[];
  applications: JobApplication[];
  isTableMissing: boolean;
  missingTablesList: string[];
}

/**
 * Loads all data tables from Supabase.
 * If tables are missing, returns the current data with a list of missing tables so the user can easily create them.
 */
export async function loadAllFromSupabase(defaults: {
  students: Student[];
  professors: Professor[];
  companies: Company[];
  recommendations: Recommendation[];
  recommendationCodes: RecommendationCode[];
  jobs: Job[];
  applications: JobApplication[];
}): Promise<SupabaseSyncResult> {
  const supabase = getSupabase();
  const result: SupabaseSyncResult = {
    students: [...defaults.students],
    professors: [...defaults.professors],
    companies: [...defaults.companies],
    recommendations: [...defaults.recommendations],
    recommendationCodes: [...defaults.recommendationCodes],
    jobs: [...defaults.jobs],
    applications: [...defaults.applications],
    isTableMissing: false,
    missingTablesList: [],
  };

  if (!supabase) {
    return result;
  }

  // 1. Fetch Students
  try {
    const { data, error } = await supabase.from('students').select('*');
    if (error) {
      if (error.code === '42P01') result.missingTablesList.push('students');
      else console.error('Error fetching students:', error);
    } else if (data && data.length > 0) {
      result.students = data.map(mapStudentFromDB);
    }
  } catch (err) {
    console.error('Fetch students connection error:', err);
  }

  // 2. Fetch Professors
  try {
    const { data, error } = await supabase.from('professors').select('*');
    if (error) {
      if (error.code === '42P01') result.missingTablesList.push('professors');
      else console.error('Error fetching professors:', error);
    } else if (data && data.length > 0) {
      result.professors = data.map(mapProfessorFromDB);
    }
  } catch (err) {
    console.error('Fetch professors connection error:', err);
  }

  // 3. Fetch Companies
  try {
    const { data, error } = await supabase.from('companies').select('*');
    if (error) {
      if (error.code === '42P01') result.missingTablesList.push('companies');
      else console.error('Error fetching companies:', error);
    } else if (data && data.length > 0) {
      result.companies = data.map(mapCompanyFromDB);
    }
  } catch (err) {
    console.error('Fetch companies connection error:', err);
  }

  // 4. Fetch Recommendations
  try {
    const { data, error } = await supabase.from('recommendations').select('*');
    if (error) {
      if (error.code === '42P01') result.missingTablesList.push('recommendations');
      else console.error('Error fetching recommendations:', error);
    } else if (data && data.length > 0) {
      result.recommendations = data.map(mapRecommendationFromDB);
    }
  } catch (err) {
    console.error('Fetch recommendations connection error:', err);
  }

  // 5. Fetch Recommendation Codes
  try {
    const { data, error } = await supabase.from('recommendation_codes').select('*');
    if (error) {
      if (error.code === '42P01') result.missingTablesList.push('recommendation_codes');
      else console.error('Error fetching recommendation_codes:', error);
    } else if (data && data.length > 0) {
      result.recommendationCodes = data.map(mapRecommendationCodeFromDB);
    }
  } catch (err) {
    console.error('Fetch recommendation_codes connection error:', err);
  }

  // 6. Fetch Jobs
  try {
    const { data, error } = await supabase.from('jobs').select('*');
    if (error) {
      if (error.code === '42P01') result.missingTablesList.push('jobs');
      else console.error('Error fetching jobs:', error);
    } else if (data && data.length > 0) {
      result.jobs = data.map(mapJobFromDB);
    }
  } catch (err) {
    console.error('Fetch jobs connection error:', err);
  }

  // 7. Fetch Applications
  try {
    const { data, error } = await supabase.from('applications').select('*');
    if (error) {
      if (error.code === '42P01') result.missingTablesList.push('applications');
      else console.error('Error fetching applications:', error);
    } else if (data && data.length > 0) {
      result.applications = data.map(mapJobApplicationFromDB);
    }
  } catch (err) {
    console.error('Fetch applications connection error:', err);
  }

  result.isTableMissing = result.missingTablesList.length > 0;
  return result;
}

/**
 * Upserts a student record in the Supabase students table.
 */
export async function saveStudentToSupabase(student: Student): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    const dbData = mapStudentToDB(student);
    const { error } = await supabase.from('students').upsert(dbData);
    if (error) {
      console.error('Error saving student to Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Supabase write crash:', e);
    return false;
  }
}

/**
 * Upserts a professor record in the Supabase professors table.
 */
export async function saveProfessorToSupabase(professor: Professor): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    const dbData = mapProfessorToDB(professor);
    const { error } = await supabase.from('professors').upsert(dbData);
    if (error) {
      console.error('Error saving professor to Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Supabase write crash:', e);
    return false;
  }
}

/**
 * Upserts a company record in the Supabase companies table.
 */
export async function saveCompanyToSupabase(company: Company): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    const dbData = mapCompanyToDB(company);
    const { error } = await supabase.from('companies').upsert(dbData);
    if (error) {
      console.error('Error saving company to Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Supabase write crash:', e);
    return false;
  }
}

/**
 * Upserts a recommendation record in the Supabase recommendations table.
 */
export async function saveRecommendationToSupabase(reco: Recommendation): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    const dbData = mapRecommendationToDB(reco);
    const { error } = await supabase.from('recommendations').upsert(dbData);
    if (error) {
      console.error('Error saving recommendation to Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Supabase write crash:', e);
    return false;
  }
}

/**
 * Upserts a recommendation code record in the Supabase recommendation_codes table.
 */
export async function saveRecommendationCodeToSupabase(code: RecommendationCode): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    const dbData = mapRecommendationCodeToDB(code);
    const { error } = await supabase.from('recommendation_codes').upsert(dbData);
    if (error) {
      console.error('Error saving recommendation code to Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Supabase write crash:', e);
    return false;
  }
}

/**
 * Upserts a job in the Supabase jobs table.
 */
export async function saveJobToSupabase(job: Job): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    const dbData = mapJobToDB(job);
    const { error } = await supabase.from('jobs').upsert(dbData);
    if (error) {
      console.error('Error saving job to Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Supabase write crash:', e);
    return false;
  }
}

/**
 * Upserts an application in the Supabase applications table.
 */
export async function saveApplicationToSupabase(app: JobApplication): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  try {
    const dbData = mapJobApplicationToDB(app);
    const { error } = await supabase.from('applications').upsert(dbData);
    if (error) {
      console.error('Error saving application to Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Supabase write crash:', e);
    return false;
  }
}

// Copyable SQL setup statements
export const SUPABASE_SQL_DDL_SCRIPT = `-- ==========================================
-- TEEDLAB Academic Matcher - Database Schema
-- ==========================================

-- 1. Create Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    university TEXT NOT NULL,
    major TEXT NOT NULL,
    resume JSONB NOT NULL,
    recommendation_status TEXT DEFAULT 'NONE',
    recommendation_id TEXT,
    requested_professor_name TEXT,
    requested_professor_email TEXT,
    verified_at TIMESTAMPTZ,
    profile_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public write students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update students" ON public.students FOR UPDATE USING (true);

-- 2. Create Professors Table
CREATE TABLE IF NOT EXISTS public.professors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    university TEXT NOT NULL,
    department TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read professors" ON public.professors FOR SELECT USING (true);
CREATE POLICY "Allow public write professors" ON public.professors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update professors" ON public.professors FOR UPDATE USING (true);

-- 3. Create Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    business_id TEXT NOT NULL,
    website TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    industry TEXT NOT NULL,
    address TEXT NOT NULL,
    verification_status TEXT DEFAULT 'PENDING',
    document_file_name TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Allow public write companies" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update companies" ON public.companies FOR UPDATE USING (true);

-- 4. Create Recommendations Table
CREATE TABLE IF NOT EXISTS public.recommendations (
    id TEXT PRIMARY KEY,
    student_id TEXT,
    student_email TEXT NOT NULL,
    student_name TEXT NOT NULL,
    professor_id TEXT NOT NULL,
    professor_name TEXT NOT NULL,
    professor_email TEXT NOT NULL,
    relationship TEXT NOT NULL,
    course_name TEXT,
    content TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'PENDING',
    verified_code TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read recommendations" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public write recommendations" ON public.recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update recommendations" ON public.recommendations FOR UPDATE USING (true);

-- 5. Create Recommendation Codes Table
CREATE TABLE IF NOT EXISTS public.recommendation_codes (
    code TEXT PRIMARY KEY,
    professor_id TEXT NOT NULL,
    professor_name TEXT NOT NULL,
    professor_email TEXT NOT NULL,
    issued_for_email TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    is_used BOOLEAN DEFAULT false,
    used_by_email TEXT,
    relationship TEXT NOT NULL
);

ALTER TABLE public.recommendation_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read recommendation_codes" ON public.recommendation_codes FOR SELECT USING (true);
CREATE POLICY "Allow public write recommendation_codes" ON public.recommendation_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update recommendation_codes" ON public.recommendation_codes FOR UPDATE USING (true);

-- 6. Create Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_logo TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[],
    preferences TEXT[],
    location TEXT NOT NULL,
    salary TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    applicants_count INT DEFAULT 0
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Allow public write jobs" ON public.jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update jobs" ON public.jobs FOR UPDATE USING (true);

-- 7. Create Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    job_title TEXT NOT NULL,
    company_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_email TEXT NOT NULL,
    student_major TEXT NOT NULL,
    student_university TEXT NOT NULL,
    resume JSONB NOT NULL,
    recommendation JSONB,
    status TEXT DEFAULT 'PENDING',
    feedback TEXT,
    applied_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read applications" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Allow public write applications" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update applications" ON public.applications FOR UPDATE USING (true);
`;
