import { Student, Institution, DuplicateCluster } from '../types';
import { INITIAL_INSTITUTIONS, INITIAL_STUDENTS, INSTITUTION_SIMULATED_TOTALS } from '../data/mockData';
import { cleanApaarId } from './validation';

const STORAGE_KEY_STUDENTS = 'apaar_nexus_students_v1';
const STORAGE_KEY_INSTITUTIONS = 'apaar_nexus_institutions_v1';

export function loadStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load students from localStorage:', err);
  }
  return [...INITIAL_STUDENTS];
}

export function saveStoredStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  } catch (err) {
    console.error('Failed to save students to localStorage:', err);
  }
}

export function loadStoredInstitutions(): Institution[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INSTITUTIONS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load institutions from localStorage:', err);
  }
  return [...INITIAL_INSTITUTIONS];
}

export function saveStoredInstitutions(institutions: Institution[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_INSTITUTIONS, JSON.stringify(institutions));
  } catch (err) {
    console.error('Failed to save institutions to localStorage:', err);
  }
}

export function resetAllDataToDefault(): { students: Student[]; institutions: Institution[] } {
  localStorage.removeItem(STORAGE_KEY_STUDENTS);
  localStorage.removeItem(STORAGE_KEY_INSTITUTIONS);
  return {
    students: [...INITIAL_STUDENTS],
    institutions: [...INITIAL_INSTITUTIONS],
  };
}

export interface InstitutionIntakeStats {
  institution: Institution;
  approvedIntake: number;
  actualEnrolment: number;
  remainingSeats: number;
  excessAdmissions: number;
  isExcess: boolean;
  utilizationRate: number;
  detailedStudentsCount: number;
}

export function calculateInstitutionIntake(
  inst: Institution,
  allStudents: Student[]
): InstitutionIntakeStats {
  const matchingStudents = allStudents.filter((s) => s.institutionId === inst.id);
  const countInDb = matchingStudents.length;

  // For realism and exact matching to prompt example:
  // inst-2 (COEP) is configured with approved 120 and actual enrolment 129 (excess: 9).
  // Any dynamically added students for inst-2 increment this total!
  const baseSimulated = INSTITUTION_SIMULATED_TOTALS[inst.id]?.totalAdmitted;
  const initialBaseInDb = INITIAL_STUDENTS.filter((s) => s.institutionId === inst.id).length;
  const delta = Math.max(0, countInDb - initialBaseInDb);

  const actualEnrolment = (baseSimulated !== undefined ? baseSimulated : countInDb) + delta;
  const approvedIntake = inst.totalApprovedIntake;
  const excessAdmissions = Math.max(0, actualEnrolment - approvedIntake);
  const remainingSeats = Math.max(0, approvedIntake - actualEnrolment);
  const isExcess = excessAdmissions > 0;
  const utilizationRate = Math.round((actualEnrolment / approvedIntake) * 100);

  return {
    institution: inst,
    approvedIntake,
    actualEnrolment,
    remainingSeats,
    excessAdmissions,
    isExcess,
    utilizationRate,
    detailedStudentsCount: countInDb,
  };
}

export function findDuplicateClusters(students: Student[]): DuplicateCluster[] {
  const map = new Map<string, Student[]>();

  for (const s of students) {
    const key = cleanApaarId(s.apaarId);
    if (!key) continue;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(s);
  }

  const clusters: DuplicateCluster[] = [];
  for (const [apaar, group] of map.entries()) {
    if (group.length > 1) {
      const instIds = new Set(group.map((s) => s.institutionId));
      const instNames = Array.from(new Set(group.map((s) => s.institutionName)));
      clusters.push({
        apaarId: group[0].apaarId,
        studentName: group[0].name,
        records: group,
        isCrossInstitution: instIds.size > 1,
        institutions: instNames,
      });
    }
  }

  return clusters;
}
