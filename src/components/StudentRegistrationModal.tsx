import React, { useState, useEffect, useMemo } from 'react';
import { Institution, Student, AdmissionCategory } from '../types';
import { validateStudentRecord, normalizeApaarId, cleanApaarId } from '../services/validation';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Info,
  ShieldCheck,
  Building2,
  GraduationCap,
  Calendar,
  Layers,
  UserCheck,
} from 'lucide-react';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  institutions: Institution[];
  currentInstitutionId: string;
  existingStudents: Student[];
  onRegisterStudent: (newStudent: Student) => void;
  simulatedIntakeTotals?: Record<string, { totalAdmitted: number }>;
}

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  onClose,
  institutions,
  currentInstitutionId,
  existingStudents,
  onRegisterStudent,
  simulatedIntakeTotals = {},
}) => {
  const [name, setName] = useState('');
  const [apaarId, setApaarId] = useState('');
  const [institutionId, setInstitutionId] = useState(currentInstitutionId);
  const [registrationNo, setRegistrationNo] = useState('');
  const [course, setCourse] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [admissionDate, setAdmissionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [admissionCategory, setAdmissionCategory] = useState<AdmissionCategory>('Regular');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('2006-05-15');
  const [bloodGroup, setBloodGroup] = useState('O+');

  // Sync default institution when prop changes
  useEffect(() => {
    if (currentInstitutionId) {
      setInstitutionId(currentInstitutionId);
    }
  }, [currentInstitutionId]);

  // Set default course when institution changes
  const selectedInstitution = useMemo(() => {
    return institutions.find((i) => i.id === institutionId) || institutions[0];
  }, [institutions, institutionId]);

  useEffect(() => {
    if (selectedInstitution && selectedInstitution.courses.length > 0) {
      if (!selectedInstitution.courses.some((c) => c.courseName === course)) {
        setCourse(selectedInstitution.courses[0].courseName);
      }
    }
  }, [selectedInstitution, course]);

  // Auto-format APAAR ID input as user types
  const handleApaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = normalizeApaarId(raw);
    setApaarId(formatted);
  };

  // Run live validation on current form data
  const validation = useMemo(() => {
    return validateStudentRecord(
      {
        name,
        apaarId,
        institutionId,
        registrationNo,
        course,
        academicYear,
        admissionDate,
        admissionCategory,
      },
      existingStudents,
      institutions,
      simulatedIntakeTotals
    );
  }, [
    name,
    apaarId,
    institutionId,
    registrationNo,
    course,
    academicYear,
    admissionDate,
    admissionCategory,
    existingStudents,
    institutions,
    simulatedIntakeTotals,
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.canSubmit) return;

    const newStudent: Student = {
      id: `std-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      apaarId,
      registrationNo,
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@${selectedInstitution.shortName.toLowerCase().replace(/\s+/g, '')}.edu.in`,
      phone: phone || '+91 98765 43210',
      institutionId,
      institutionName: selectedInstitution.name,
      course,
      academicYear,
      admissionDate,
      admissionCategory,
      status: validation.suggestedStatus,
      flagReason: validation.flagReason,
      registeredAt: new Date().toISOString(),
      dob,
      bloodGroup,
    };

    onRegisterStudent(newStudent);
    onClose();
  };

  // Quick sample helpers
  const prefillValid = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const randomMiddle = Math.floor(1000 + Math.random() * 9000);
    setName('Kavya Natarajan');
    setApaarId(`8192 ${randomMiddle} ${randomSuffix}`);
    setRegistrationNo(`2024-${selectedInstitution.courses[0]?.code || 'ENG'}-${Math.floor(100 + Math.random() * 900)}`);
    setAdmissionCategory('Regular');
    setEmail('kavya.n@outlook.com');
  };

  const prefillDuplicate = () => {
    // Fill Arjun Sharma's APAAR ID which is already enrolled in DTU & BIT Mesra
    setName('Arjun Sharma (Duplicate Attempt)');
    setApaarId('7341 9023 8812');
    setRegistrationNo(`2024-DUP-${Math.floor(100 + Math.random() * 900)}`);
    setAdmissionCategory('Regular');
  };

  const prefillExcess = () => {
    // Target COEP Pune which is already at 129/120 intake
    const coep = institutions.find((i) => i.id === 'inst-2');
    if (coep) {
      setInstitutionId(coep.id);
      setCourse(coep.courses[0]?.courseName || 'Computer Engineering');
    }
    setName('Rahul Vinod Kulkarni');
    setApaarId('4491 8820 1938');
    setRegistrationNo(`2024-COEP-CE-063`);
    setAdmissionCategory('Regular');
  };

  const cleanedLength = cleanApaarId(apaarId).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Register Student Admission
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct entry with automated APAAR ID validation and national registry checks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Preset Bar */}
        <div className="px-6 py-2.5 bg-blue-50/60 dark:bg-blue-950/40 border-b border-blue-100/70 dark:border-blue-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-blue-900 dark:text-blue-300 font-medium">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Quick Sample Autofill:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prefillValid}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 font-medium text-xs shadow-2xs transition-colors cursor-pointer"
            >
              ✓ Clean Admission
            </button>
            <button
              type="button"
              onClick={prefillDuplicate}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 font-medium text-xs shadow-2xs transition-colors cursor-pointer"
            >
              ⚠ Duplicate APAAR
            </button>
            <button
              type="button"
              onClick={prefillExcess}
              className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 font-medium text-xs shadow-2xs transition-colors cursor-pointer"
            >
              ⚠ Excess Intake Case
            </button>
          </div>
        </div>

        {/* Modal Content - Two Column Layout */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: 7 cols */}
          <form id="student-form" onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya Singhania"
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            {/* APAAR ID */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  APAAR ID (12-Digit) *
                  <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
                    Automated Permanent Academic Account Registry
                  </span>
                </label>
                <span
                  className={`text-[11px] font-mono font-medium ${
                    cleanedLength === 12
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : cleanedLength > 12
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {cleanedLength}/12 digits
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={14}
                  value={apaarId}
                  onChange={handleApaarChange}
                  placeholder="e.g. 9842 1209 4431"
                  className={`w-full px-3 py-2 text-sm font-mono tracking-wider bg-white dark:bg-slate-800 rounded-lg border focus:outline-hidden focus:ring-2 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                    cleanedLength === 12
                      ? 'border-emerald-300 dark:border-emerald-700 focus:ring-emerald-500/20 focus:border-emerald-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
                <div className="absolute right-3 top-2.5 text-slate-400 dark:text-slate-500">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Format: 12 numeric digits. Auto-formatted as 4-digit groups.
              </p>
            </div>

            {/* Institution & Registration No */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  AICTE Institution *
                </label>
                <select
                  value={institutionId}
                  onChange={(e) => setInstitutionId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-slate-100"
                >
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.shortName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Registration No *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const code = selectedInstitution.courses.find((c) => c.courseName === course)?.code || 'ENG';
                      setRegistrationNo(`2024-${code}-${Math.floor(100 + Math.random() * 900)}`);
                    }}
                    className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Auto-generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  placeholder="e.g. 2024-CSE-045"
                  className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Course & Academic Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course / Department *
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-slate-100"
                >
                  {selectedInstitution.courses.map((c) => (
                    <option key={c.code} value={c.courseName}>
                      {c.courseName} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Year *
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-slate-100"
                >
                  <option value="2024-2025">2024-2025</option>
                  <option value="2023-2024">2023-2024</option>
                  <option value="2025-2026">2025-2026</option>
                </select>
              </div>
            </div>

            {/* Admission Date & Admission Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Admission Date *
                </label>
                <input
                  type="date"
                  required
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Admission Category *
                </label>
                <select
                  value={admissionCategory}
                  onChange={(e) => setAdmissionCategory(e.target.value as AdmissionCategory)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-slate-100"
                >
                  <option value="Regular">Regular (State/Central Quota)</option>
                  <option value="Supernumerary">Supernumerary (TFWS / EWS / PMSSS)</option>
                  <option value="NRI">NRI (Non-Resident Indian)</option>
                  <option value="OCI">OCI (Overseas Citizen of India)</option>
                  <option value="Foreign National">Foreign National / PIO</option>
                </select>
              </div>
            </div>

            {/* Contact Details (Email / Phone) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@institution.edu.in"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>
          </form>

          {/* Right Column: Live Validation Engine & Registry Verification Status (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-700/80 mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Simulated Validation Engine
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                  LIVE
                </span>
              </div>

              {/* Status Outcome Card */}
              <div className="mb-4">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Expected Registry Status
                </div>
                {validation.suggestedStatus === 'VERIFIED' && (
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">VERIFIED RECORD</div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                        Clean record. Ready for immediate centralized registry entry.
                      </div>
                    </div>
                  </div>
                )}
                {validation.suggestedStatus === 'FLAGGED_DUPLICATE' && (
                  <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">DUPLICATE DETECTED</div>
                      <div className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
                        {validation.flagReason}
                      </div>
                    </div>
                  </div>
                )}
                {validation.suggestedStatus === 'EXCESS_ADMISSION' && (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">EXCESS ADMISSION BREACH</div>
                      <div className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                        {validation.flagReason}
                      </div>
                    </div>
                  </div>
                )}
                {validation.suggestedStatus === 'INVALID_FORMAT' && (
                  <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-start gap-2.5">
                    <Info className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold">FORMAT INCOMPLETE</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        Provide valid 12-digit APAAR ID and complete all fields.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Individual Validation Checklist */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Real-time Rule Checks ({validation.checks.length})
                </div>

                {validation.checks.map((chk) => (
                  <div
                    key={chk.id}
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 text-xs flex items-start gap-2 shadow-2xs"
                  >
                    {chk.status === 'passed' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {chk.status === 'failed' && (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                    {chk.status === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                        <span>{chk.title}</span>
                        <span
                          className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                            chk.status === 'passed'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : chk.status === 'failed'
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {chk.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {chk.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prototype Disclaimer Badge */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Simulated prototype engine. Validates syntax, duplicates & intake caps without live Aadhaar/DigiLocker servers.</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {validation.canSubmit ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Ready to submit admission record
              </span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500">
                Complete required fields to submit record
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="student-form"
              disabled={!validation.canSubmit}
              className={`px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all ${
                validation.canSubmit
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-98'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Submit Admission Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
