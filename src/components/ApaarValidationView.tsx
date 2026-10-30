import React, { useState, useMemo } from 'react';
import { Student, Institution } from '../types';
import { validateStudentRecord, normalizeApaarId, cleanApaarId } from '../services/validation';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info,
  Search,
  FileCheck2,
  ArrowRight,
  RefreshCw,
  Building2,
  UserCheck,
} from 'lucide-react';

interface ApaarValidationViewProps {
  students: Student[];
  institutions: Institution[];
  onOpenRegister: () => void;
  onViewStudent: (student: Student) => void;
}

export const ApaarValidationView: React.FC<ApaarValidationViewProps> = ({
  students,
  institutions,
  onOpenRegister,
  onViewStudent,
}) => {
  // Test workbench interactive state
  const [testApaar, setTestApaar] = useState('7341 9023 8812');
  const [testName, setTestName] = useState('Arjun Sharma');
  const [testInstId, setTestInstId] = useState('inst-1');
  const [testCourse, setTestCourse] = useState('Computer Science & Engineering');
  const [testRegNo, setTestRegNo] = useState('2024-TEST-001');
  const [testCategory, setTestCategory] = useState('Regular');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const selectedInst = institutions.find((i) => i.id === testInstId) || institutions[0];

  const workbenchValidation = useMemo(() => {
    return validateStudentRecord(
      {
        name: testName,
        apaarId: testApaar,
        institutionId: testInstId,
        registrationNo: testRegNo,
        course: testCourse,
        academicYear: '2024-2025',
        admissionDate: '2024-08-01',
        admissionCategory: testCategory,
      },
      students,
      institutions
    );
  }, [testName, testApaar, testInstId, testRegNo, testCourse, testCategory, students, institutions]);

  // Presets for judges
  const loadPreset = (preset: 'clean' | 'format_err' | 'missing' | 'duplicate_cross' | 'excess') => {
    if (preset === 'clean') {
      setTestName('Kavya Natarajan');
      setTestApaar('8192 4820 9182');
      setTestInstId('inst-1');
      setTestRegNo('2024-CSE-990');
      setTestCategory('Regular');
    } else if (preset === 'format_err') {
      setTestName('Sanjay Kumar');
      setTestApaar('9842 1209'); // Only 8 digits!
      setTestInstId('inst-3');
      setTestRegNo('2024-EEE-019');
      setTestCategory('Regular');
    } else if (preset === 'missing') {
      setTestName(''); // Missing name
      setTestApaar('9842 1209 4431');
      setTestInstId('inst-1');
      setTestRegNo(''); // Missing reg no
      setTestCategory('Regular');
    } else if (preset === 'duplicate_cross') {
      setTestName('Arjun Sharma');
      setTestApaar('7341 9023 8812'); // Already in DTU and BIT Mesra
      setTestInstId('inst-5'); // Attempt to admit at RVCE!
      setTestRegNo('2024-RVCE-DUP-01');
      setTestCategory('Regular');
    } else if (preset === 'excess') {
      setTestName('Devendra J. Joshi');
      setTestApaar('4910 2938 4710');
      setTestInstId('inst-2'); // COEP Pune (already 129/120)
      setTestRegNo('2024-COEP-CE-065');
      setTestCategory('Regular');
    }
  };

  const filteredRoster = students.filter((s) => {
    if (statusFilter === 'all') return true;
    return s.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
              Automated Integrity Protocol
            </span>
            <span className="text-slate-400 text-xs">• Simulated AICTE Rule Engine</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Intelligent APAAR Validation Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Multi-stage validation checking 12-digit format syntax, missing required attributes, duplicate APAAR collision across institutions, and intake ceiling breaches.
          </p>
        </div>

        <button
          onClick={onOpenRegister}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          Register New Student
        </button>
      </div>

      {/* Interactive Testing Sandbox Workbench */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Interactive Rule Engine Tester
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] mr-1">Fast Preset:</span>
            <button
              onClick={() => loadPreset('clean')}
              className="px-2.5 py-1 rounded bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px] cursor-pointer"
            >
              ✓ Valid Record
            </button>
            <button
              onClick={() => loadPreset('format_err')}
              className="px-2.5 py-1 rounded bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-[11px] cursor-pointer"
            >
              ⚠ Invalid Format (8 digits)
            </button>
            <button
              onClick={() => loadPreset('missing')}
              className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-[11px] cursor-pointer"
            >
              ⚠ Incomplete Record
            </button>
            <button
              onClick={() => loadPreset('duplicate_cross')}
              className="px-2.5 py-1 rounded bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-[11px] cursor-pointer"
            >
              ⚠ Potential Duplicate
            </button>
            <button
              onClick={() => loadPreset('excess')}
              className="px-2.5 py-1 rounded bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px] cursor-pointer"
            >
              ⚠ Requires Manual Review
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Inputs (6 cols) */}
          <div className="lg:col-span-6 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Full Name
              </label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Enter student name..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  12-Digit APAAR ID
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  {cleanApaarId(testApaar).length}/12 Digits
                </span>
              </div>
              <input
                type="text"
                value={testApaar}
                onChange={(e) => setTestApaar(normalizeApaarId(e.target.value))}
                placeholder="XXXX XXXX XXXX"
                className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target AICTE College
                </label>
                <select
                  value={testInstId}
                  onChange={(e) => setTestInstId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                >
                  {institutions.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.shortName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={testRegNo}
                  onChange={(e) => setTestRegNo(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course / Branch
                </label>
                <select
                  value={testCourse}
                  onChange={(e) => setTestCourse(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                >
                  {selectedInst.courses.map((c) => (
                    <option key={c.code} value={c.courseName}>
                      {c.courseName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admission Category
                </label>
                <select
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                >
                  <option value="Regular">Regular</option>
                  <option value="Supernumerary">Supernumerary (TFWS/EWS)</option>
                  <option value="NRI">NRI</option>
                  <option value="OCI">OCI</option>
                  <option value="Foreign National">Foreign National</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Live Verdict (6 cols) */}
          <div className="lg:col-span-6 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">
                Simulated Rule Engine Assessment
              </div>

              {/* Status Outcome Card */}
              <div className="mb-3">
                {workbenchValidation.suggestedStatus === 'VERIFIED' && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold uppercase">
                        VERDICT: VALID RECORD
                      </div>
                      <div className="text-[11px] text-emerald-700 mt-0.5">
                        Clean 12-digit format, all mandatory details supplied, no collision in national registry.
                      </div>
                    </div>
                  </div>
                )}

                {workbenchValidation.suggestedStatus === 'FLAGGED_DUPLICATE' && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5">
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold uppercase">
                        VERDICT: POTENTIAL DUPLICATE DETECTED
                      </div>
                      <div className="text-[11px] text-rose-700 mt-0.5">
                        {workbenchValidation.flagReason}
                      </div>
                    </div>
                  </div>
                )}

                {workbenchValidation.suggestedStatus === 'INVALID_FORMAT' && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold uppercase">
                        VERDICT: INVALID APAAR FORMAT
                      </div>
                      <div className="text-[11px] text-rose-700 mt-0.5">
                        {workbenchValidation.flagReason || 'Identifier does not meet 12-digit numeric standard.'}
                      </div>
                    </div>
                  </div>
                )}

                {workbenchValidation.suggestedStatus === 'EXCESS_ADMISSION' && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold uppercase">
                        VERDICT: REQUIRES MANUAL REVIEW (EXCESS INTAKE)
                      </div>
                      <div className="text-[11px] text-amber-800 mt-0.5">
                        {workbenchValidation.flagReason}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Checklist */}
              <div className="space-y-1.5">
                {workbenchValidation.checks.map((chk) => (
                  <div
                    key={chk.id}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-xs flex items-start gap-2"
                  >
                    {chk.status === 'passed' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {chk.status === 'failed' && (
                      <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    {chk.status === 'warning' && (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 flex justify-between">
                        <span>{chk.title}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            chk.status === 'passed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : chk.status === 'failed'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {chk.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{chk.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prototype Notice */}
            <div className="mt-3 pt-2 border-t border-slate-200/80 text-[10px] text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Simulated prototype verification. Distinguishes client format validation from central registry checks.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Registry Roster with Status Filter (Valid, Duplicate, Review, Incomplete) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              National Validation Roster ({filteredRoster.length} Records)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Centralized register of verified, duplicate, and review-flagged entries
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Verdicts</option>
              <option value="VERIFIED">Valid Records</option>
              <option value="FLAGGED_DUPLICATE">Potential Duplicates</option>
              <option value="EXCESS_ADMISSION">Excess Intake</option>
              <option value="REQUIRES_MANUAL_REVIEW">Requires Manual Review</option>
              <option value="TRANSFERRED">Transferred</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">APAAR ID</th>
                <th className="py-2.5 px-4">Institution</th>
                <th className="py-2.5 px-4">Course</th>
                <th className="py-2.5 px-4 text-center">Validation Verdict</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoster.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {s.name}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    {s.apaarId}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {s.institutionName}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {s.course}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {s.status === 'VERIFIED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        VALID RECORD
                      </span>
                    )}
                    {s.status === 'FLAGGED_DUPLICATE' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        POTENTIAL DUPLICATE
                      </span>
                    )}
                    {s.status === 'EXCESS_ADMISSION' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                        EXCESS ADMISSION
                      </span>
                    )}
                    {s.status === 'REQUIRES_MANUAL_REVIEW' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        MANUAL REVIEW
                      </span>
                    )}
                    {s.status === 'TRANSFERRED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        TRANSFERRED
                      </span>
                    )}
                    {s.status === 'PENDING' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        PENDING
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onViewStudent(s)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
