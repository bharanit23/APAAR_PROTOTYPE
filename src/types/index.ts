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
  | 'INVALID_FORMAT'
  | 'TRANSFERRED'
  | 'REQUIRES_MANUAL_REVIEW';

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
  // Novel Graph & Academic History Attributes
  enrolmentNature?: 'Regular' | 'Overlapping Duplicate' | 'Legitimate Transfer' | 'Unusual Record Pattern';
  transferDetails?: {
    fromInstitution?: string;
    toInstitution?: string;
    transferDate?: string;
    migrationCertNo?: string;
    nocStatus?: 'Verified NOC' | 'Pending NOC' | 'No NOC Found';
    remarks?: string;
  };
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

// Novel Cross-Institution Student Identity Graph Types
export type GraphNodeType = 'student' | 'institution' | 'course';

export interface GraphNode {
  id: string;
  label: string;
  sublabel?: string;
  type: GraphNodeType;
  x: number;
  y: number;
  data: any;
  status?: string;
  flagged?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'enrolled' | 'duplicate_overlap' | 'legitimate_transfer' | 'unusual_pattern';
  label?: string;
  details?: string;
  isWarning?: boolean;
}

// Intake Configurator
export interface IntakeConfig {
  includeSupernumerary: boolean;
  includeNri: boolean;
  includeForeign: boolean;
}

// Compliance Alerts
export interface ComplianceAlert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  targetView: string;
  institutionName?: string;
}
