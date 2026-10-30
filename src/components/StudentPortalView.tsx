import React, { useState } from 'react';
import { Student } from '../types';
import { DigitalIdCard } from './DigitalIdCard';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Layers,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  Download,
  CheckCircle2,
} from 'lucide-react';

interface StudentPortalViewProps {
  students: Student[];
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({ students }) => {
  // Let user switch which sample student they are viewing as
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || ''
  );

  const currentStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];

  if (!currentStudent) {
    return (
      <div className="p-8 text-center text-slate-500">
        No student records available in prototype.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Student Switcher Banner (For Demo Purpose) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              Student Self-Service Portal
            </div>
            <h1 className="text-sm font-bold text-slate-900">
              Viewing as: {currentStudent.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium shrink-0">
            Switch Profile:
          </label>
          <select
            value={currentStudent.id}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
          >
            {students.slice(0, 10).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.institutionName.split('(')[0].trim()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Left ID Card, Right Academic Profile & Credits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Digital ID Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <DigitalIdCard student={currentStudent} showActions={true} />
        </div>

        {/* Right Column: Academic Details, ABC Credits, Admission Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Institution & Enrolment Summary Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Enrolled Program Details
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Enrolment
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Institution</span>
                <span className="text-slate-900 font-bold block mt-0.5">
                  {currentStudent.institutionName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Department</span>
                <span className="text-slate-900 font-bold block mt-0.5">
                  {currentStudent.course}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Registration Number</span>
                <span className="font-mono text-slate-800 font-bold block mt-0.5">
                  {currentStudent.registrationNo}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">APAAR 12-Digit ID</span>
                <span className="font-mono text-blue-600 font-bold block mt-0.5">
                  {currentStudent.apaarId}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Admission Category</span>
                <span className="text-slate-800 font-medium block mt-0.5">
                  {currentStudent.admissionCategory} Quota
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Admission Date</span>
                <span className="text-slate-800 font-medium block mt-0.5">
                  {currentStudent.admissionDate}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Bank of Credits (ABC) Simulated Integration */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Academic Bank of Credits (ABC) Bridge
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                NEP 2020 COMPLIANT
              </span>
            </div>

            <p className="text-xs text-slate-500">
              APAAR ID seamlessly anchors credit transfers and digital transcripts across recognized Indian higher education institutions.
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Earned Credits
                </span>
                <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                  44 / 160
                </div>
                <span className="text-[10px] text-slate-500">Semester 1 & 2</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Current CGPA
                </span>
                <div className="text-xl font-bold font-mono text-blue-600 mt-1">
                  8.84
                </div>
                <span className="text-[10px] text-slate-500">First Class Dist.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  DigiLocker Status
                </span>
                <div className="text-sm font-bold text-emerald-600 mt-2 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Linked
                </div>
                <span className="text-[10px] text-slate-500">KYC Verified</span>
              </div>
            </div>
          </div>

          {/* Admission Audit Note if Flagged */}
          {currentStudent.flagReason && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
              <span className="font-bold block mb-1">
                Registry Compliance Notice:
              </span>
              <p>{currentStudent.flagReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
