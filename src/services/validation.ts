import { Student, Institution, ValidationResult, ValidationCheck, VerificationStatus } from '../types';

export function normalizeApaarId(input: string): string {
  // Strip non-digits
  const digitsOnly = input.replace(/\D/g, '').slice(0, 12);
  // Format as XXXX XXXX XXXX
  const parts = [];
  for (let i = 0; i < digitsOnly.length; i += 4) {
    parts.push(digitsOnly.slice(i, i + 4));
  }
  return parts.join(' ');
}

export function cleanApaarId(input: string): string {
  return input.replace(/\s+/g, '').trim();
}

export function isValidApaarFormat(input: string): boolean {
  const cleaned = cleanApaarId(input);
  // Must be exactly 12 numeric digits and not trivial dummy numbers like 000000000000
  if (!/^\d{12}$/.test(cleaned)) return false;
  if (/^0{12}$/.test(cleaned) || /^(\d)\1{11}$/.test(cleaned)) return false;
  return true;
}

export interface StudentFormData {
  name: string;
  apaarId: string;
  institutionId: string;
  registrationNo: string;
  course: string;
  academicYear: string;
  admissionDate: string;
  admissionCategory: string;
  email?: string;
  phone?: string;
  dob?: string;
  bloodGroup?: string;
}

export function validateStudentRecord(
  data: Partial<StudentFormData>,
  existingStudents: Student[],
  institutions: Institution[],
  simulatedIntakeTotals: Record<string, { totalAdmitted: number }> = {},
  editingStudentId?: string
): ValidationResult {
  const checks: ValidationCheck[] = [];
  let suggestedStatus: VerificationStatus = 'VERIFIED';
  let flagReason: string | undefined = undefined;

  // 1. Mandatory Fields Completeness
  const missingFields: string[] = [];
  if (!data.name?.trim()) missingFields.push('Student Name');
  if (!data.apaarId?.trim()) missingFields.push('APAAR ID');
  if (!data.institutionId?.trim()) missingFields.push('Institution Name');
  if (!data.registrationNo?.trim()) missingFields.push('Registration Number');
  if (!data.course?.trim()) missingFields.push('Course / Department');
  if (!data.academicYear?.trim()) missingFields.push('Academic Year');
  if (!data.admissionDate?.trim()) missingFields.push('Admission Date');
  if (!data.admissionCategory?.trim()) missingFields.push('Admission Category');

  if (missingFields.length > 0) {
    checks.push({
      id: 'completeness',
      title: 'Mandatory Student Details',
      status: 'failed',
      detail: `Missing required fields: ${missingFields.join(', ')}`,
    });
  } else {
    checks.push({
      id: 'completeness',
      title: 'Mandatory Student Details',
      status: 'passed',
      detail: 'All required demographic and academic fields provided.',
    });
  }

  // 2. APAAR ID Format Check (12 Digits)
  const cleanedApaar = cleanApaarId(data.apaarId || '');
  if (!data.apaarId?.trim()) {
    checks.push({
      id: 'apaar-format',
      title: 'APAAR ID Format Validation',
      status: 'failed',
      detail: 'APAAR ID is missing. A 12-digit numeric identifier is required.',
    });
  } else if (!/^\d{12}$/.test(cleanedApaar)) {
    checks.push({
      id: 'apaar-format',
      title: 'APAAR ID Format Validation',
      status: 'failed',
      detail: `Invalid format: Entered ${cleanedApaar.length} digits. Must be exactly 12 digits (e.g. 9842 1209 4431).`,
    });
    suggestedStatus = 'INVALID_FORMAT';
    flagReason = 'Invalid APAAR format: identifier does not meet national 12-digit specification.';
  } else if (/^(\d)\1{11}$/.test(cleanedApaar)) {
    checks.push({
      id: 'apaar-format',
      title: 'APAAR ID Format Validation',
      status: 'failed',
      detail: 'Invalid APAAR ID: Repeated identical digits sequence detected.',
    });
    suggestedStatus = 'INVALID_FORMAT';
    flagReason = 'Suspicious APAAR identifier: repeated digits sequence.';
  } else {
    checks.push({
      id: 'apaar-format',
      title: 'APAAR ID Format Validation',
      status: 'passed',
      detail: 'Format valid: 12-digit standard National Student ID structure confirmed.',
    });
  }

  // 3. Centralized Duplicate APAAR Detection (Cross-Institution & Same Institution)
  const formattedInputApaar = normalizeApaarId(cleanedApaar);
  const matchingStudents = existingStudents.filter(
    (s) =>
      cleanApaarId(s.apaarId) === cleanedApaar &&
      (!editingStudentId || s.id !== editingStudentId)
  );

  if (matchingStudents.length > 0) {
    const crossInst = matchingStudents.filter((s) => s.institutionId !== data.institutionId);
    if (crossInst.length > 0) {
      const otherInstNames = Array.from(new Set(crossInst.map((s) => s.institutionName))).join(', ');
      checks.push({
        id: 'duplicate-check',
        title: 'Cross-Institution Duplicate Detection',
        status: 'failed',
        detail: `CRITICAL ALERT: APAAR ID already enrolled in another institution (${otherInstNames}). Dual regular admissions are strictly restricted.`,
      });
      suggestedStatus = 'FLAGGED_DUPLICATE';
      flagReason = `Dual Admission Detected: Student already registered at ${otherInstNames}.`;
    } else {
      checks.push({
        id: 'duplicate-check',
        title: 'Institutional Duplicate Detection',
        status: 'failed',
        detail: `APAAR ID is already enrolled within this institution under Reg No: ${matchingStudents[0].registrationNo}.`,
      });
      suggestedStatus = 'FLAGGED_DUPLICATE';
      flagReason = `Duplicate Record: APAAR ID already allocated to Reg No ${matchingStudents[0].registrationNo}.`;
    }
  } else {
    checks.push({
      id: 'duplicate-check',
      title: 'Cross-Institution Duplicate Detection',
      status: 'passed',
      detail: 'Clear: No matching APAAR ID found across registered AICTE institutions.',
    });
  }

  // 4. Registration Number Uniqueness
  if (data.registrationNo?.trim()) {
    const regExists = existingStudents.some(
      (s) =>
        s.institutionId === data.institutionId &&
        s.registrationNo.toLowerCase() === data.registrationNo?.trim().toLowerCase() &&
        (!editingStudentId || s.id !== editingStudentId)
    );
    if (regExists) {
      checks.push({
        id: 'reg-check',
        title: 'Registration Number Check',
        status: 'failed',
        detail: `Registration number "${data.registrationNo}" already exists in this institution.`,
      });
    } else {
      checks.push({
        id: 'reg-check',
        title: 'Registration Number Check',
        status: 'passed',
        detail: 'Unique within the selected institution.',
      });
    }
  }

  // 5. Approved Intake Capacity Monitoring
  if (data.institutionId) {
    const inst = institutions.find((i) => i.id === data.institutionId);
    if (inst) {
      const simulatedTotal = simulatedIntakeTotals[inst.id]?.totalAdmitted;
      const countInDb = existingStudents.filter((s) => s.institutionId === inst.id).length;
      const effectiveCount = simulatedTotal !== undefined ? simulatedTotal : countInDb;

      // Check course level or institution level
      if (effectiveCount >= inst.totalApprovedIntake) {
        checks.push({
          id: 'intake-capacity',
          title: 'AICTE Approved Intake Audit',
          status: 'warning',
          detail: `Excess Intake Warning: Institution has reached/exceeded approved intake (${effectiveCount}/${inst.totalApprovedIntake}). Record will be flagged as Excess Admission for audit.`,
        });
        if (suggestedStatus === 'VERIFIED') {
          suggestedStatus = 'EXCESS_ADMISSION';
          flagReason = `Approved Intake Exceeded: Institution has enrolled ${effectiveCount} students against approved capacity of ${inst.totalApprovedIntake}.`;
        }
      } else {
        const remaining = inst.totalApprovedIntake - effectiveCount;
        checks.push({
          id: 'intake-capacity',
          title: 'AICTE Approved Intake Audit',
          status: 'passed',
          detail: `Within Approved Intake: ${effectiveCount} enrolled out of ${inst.totalApprovedIntake} (${remaining} seats remaining).`,
        });
      }
    }
  }

  const hasFatalError = checks.some(
    (c) => c.status === 'failed' && (c.id === 'completeness' || c.id === 'apaar-format')
  );

  return {
    isValid: !hasFatalError,
    canSubmit: missingFields.length === 0 && isValidApaarFormat(data.apaarId || ''),
    checks,
    suggestedStatus,
    flagReason,
  };
}
