/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'STUDENT' | 'PROFESSOR' | 'COMPANY' | 'ADMIN';

export type RecommendationStatus = 'NONE' | 'PENDING' | 'VERIFIED';
export type CompanyVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Resume {
  bio: string;
  skills: string[];
  education: string;
  experience?: string;
  projects?: string;
  fileName?: string;
  fileSize?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  resume: Resume;
  recommendationStatus: RecommendationStatus;
  recommendationId?: string;
  requestedProfessorName?: string;
  requestedProfessorEmail?: string;
  verifiedAt?: string;
  profileImageUrl?: string;
  createdAt: string;
}

export interface Professor {
  id: string;
  name: string;
  email: string;
  university: string;
  department: string;
  createdAt: string;
}

export interface RecommendationCode {
  code: string;
  professorId: string;
  professorName: string;
  professorEmail: string;
  issuedForEmail?: string;
  createdAt: string;
  isUsed: boolean;
  usedByEmail?: string;
  relationship: string; // "지도교수" (Advisor) or "교과목 수업 교수" (Course Teacher)
}

export interface Company {
  id: string;
  name: string;
  email: string;
  businessId: string; // 사업자등록번호 (10 digits)
  website: string;
  logoUrl?: string;
  description: string;
  industry: string;
  address: string;
  verificationStatus: CompanyVerificationStatus;
  documentFileName?: string; // Uploaded business register file
  verifiedAt?: string;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  studentId?: string; // can be empty if code was generated before student signup
  studentEmail: string;
  studentName: string;
  professorId: string;
  professorName: string;
  professorEmail: string;
  relationship: string; // "지도교수" | "교과목 수업 교수"
  courseName?: string;  // if relationship is Course Teacher
  content: string;      // The actual recommendation letter content
  tags: string[];       // e.g. ["성실함", "코딩능력", "문제해결력", "팀워크"]
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  verifiedCode?: string; // If approved via pre-generated code
  createdAt: string;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  requirements: string[];
  preferences: string[];
  location: string;
  salary: string;
  status: 'ACTIVE' | 'CLOSED';
  createdAt: string;
  applicantsCount: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentMajor: string;
  studentUniversity: string;
  resume: Resume;
  recommendation?: Recommendation;
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';
  feedback?: string;
  appliedAt: string;
}
