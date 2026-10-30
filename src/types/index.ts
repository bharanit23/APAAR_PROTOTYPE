export type AdmissionCategory =
  | 'Regular'
  | 'Supernumerary'
  | 'NRI'
  | 'OCI'
  | 'Foreign National';

export type VerificationStatus =
  | 'VERIFIED'
  | 'PENDING'
  | 'FLAGGED_DUPLICATE'
  | 'EXCESS_ADMISSION'
  | 'INVALID_FORMAT';

export interface CourseIntake {
  courseName: string;
  code: string;
  approvedIntake: number;
}

export interface Institution {
  id: string;
  code: string;
  name: string;
  shortName: string;
  state: string;
  city: string;
  type: 'Central Govt' | 'State Govt' | 'Autonomous' | 'Private deemed';
  totalApprovedIntake: number;
  courses: CourseIntake[];
}

export interface Student {
  id: string;
  apaarId: string; // 12-digit format, e.g., "9842 1209 4431"
  registrationNo: string;
  name: string;
  email: string;
  phone?: string;
  institutionId: string;
  institutionName: string;
  course: string;
  academicYear: string;
  admissionDate: string;
  admissionCategory: AdmissionCategory;
  status: VerificationStatus;
  flagReason?: string;
  registeredAt: string;
  dob?: string;
  bloodGroup?: string;
}

export type UserRole =
  | 'aicte_admin'
  | 'college_admin'
  | 'student'
  | 'verifier';

export interface ValidationCheck {
  id: string;
  title: string;
  status: 'passed' | 'failed' | 'warning' | 'pending';
  detail: string;
}

export interface ValidationResult {
  isValid: boolean;
  canSubmit: boolean;
  checks: ValidationCheck[];
  suggestedStatus: VerificationStatus;
  flagReason?: string;
}

export interface DuplicateCluster {
  apaarId: string;
  studentName: string;
  records: Student[];
  isCrossInstitution: boolean;
  institutions: string[];
}
