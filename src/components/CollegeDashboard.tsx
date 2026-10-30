import React, { useState } from 'react';
import { Institution, Student } from '../types';
import { calculateInstitutionIntake } from '../services/storage';
import {
  Building2,
  Users,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  Trash2,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface CollegeDashboardProps {
  institutions: Institution[];
  selectedInstitutionId: string;
  onSelectInstitution: (id: string) => void;
  students: Student[];
  onOpenRegister: () => void;
  onViewStudent: (student: Student) => void;
  onDeleteStudent?: (id: string) => void;
}

export const CollegeDashboard: React.FC<CollegeDashboardProps> = ({
  institutions,
  selectedInstitutionId,
  onSelectInstitution,
  students,
  onOpenRegister,
  onViewStudent,
  onDeleteStudent,
}) => {
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentInstitution =
    institutions.find((i) => i.id === selectedInstitutionId) || institutions[0];

  const collegeStats = calculateInstitutionIntake(currentInstitution, students);

  // College-specific student records
  const collegeStudents = students.filter(
    (s) => s.institutionId === currentInstitution.id
  );

  // Filtered students
  const filteredStudents = collegeStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.apaarId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registrationNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = courseFilter === 'all' || s.course === courseFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* College Switcher & Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Institutional Node
              </span>
              <span className="text-xs text-slate-400 font-mono">
                PID: {currentInstitution.code}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              {currentInstitution.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentInstitution.city}, {currentInstitution.state} • {currentInstitution.type} Institution
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Switch Institution Dropdown */}
          <div className="relative">
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Switch AICTE College:
            </label>
            <select
              value={currentInstitution.id}
              onChange={(e) => onSelectInstitution(e.target.value)}
              className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Register Button */}
          <div className="self-end">
            <button
              onClick={onOpenRegister}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Register New Student
            </button>
          </div>
        </div>
      </div>

      {/* Warning Banner when Enrolment Exceeds Approved Intake */}
      {collegeStats.isExcess && (
        <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
                  Warning: Enrolment Exceeds Sanctioned AICTE Intake
                </h3>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-200 text-amber-900">
                  +{collegeStats.excessAdmissions} Excess Admissions
                </span>
              </div>
              <p className="text-xs text-amber-900/90 mt-1.5 leading-relaxed">
                The institution has admitted{' '}
                <strong className="font-mono font-bold">{collegeStats.actualEnrolment}</strong> students,
                which surpasses the approved intake of{' '}
                <strong className="font-mono font-bold">{collegeStats.approvedIntake}</strong> seats.
                Excess admissions are flagged in the national AICTE registry and require an authorized compliance justification.
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs font-medium text-amber-950">
                <span className="bg-white/80 px-2 py-1 rounded border border-amber-200">
                  Approved Intake: <strong>{collegeStats.approvedIntake}</strong>
                </span>
                <span>→</span>
                <span className="bg-white/80 px-2 py-1 rounded border border-amber-200">
                  Actual Enrolment: <strong>{collegeStats.actualEnrolment}</strong>
                </span>
                <span>→</span>
                <span className="bg-amber-100 px-2 py-1 rounded border border-amber-300 font-bold text-amber-900">
                  Excess: <strong>+{collegeStats.excessAdmissions}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* College Intake Dashboard Cards (Prompt Section B) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Approved Intake */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">
            Approved Intake
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {collegeStats.approvedIntake}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Sanctioned seats</div>
        </div>

        {/* Actual Enrolment */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">
            Actual Enrolment
          </span>
          <div className={`text-2xl font-bold font-mono ${collegeStats.isExcess ? 'text-amber-600' : 'text-blue-600'}`}>
            {collegeStats.actualEnrolment}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {collegeStats.utilizationRate}% utilized
          </div>
        </div>

        {/* Remaining Seats */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">
            Remaining Seats
          </span>
          <div className="text-2xl font-bold font-mono text-slate-700">
            {collegeStats.remainingSeats}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Available capacity</div>
        </div>

        {/* Excess Admissions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">
            Excess Admissions
          </span>
          <div className={`text-2xl font-bold font-mono ${collegeStats.isExcess ? 'text-rose-600' : 'text-slate-400'}`}>
            {collegeStats.excessAdmissions > 0 ? `+${collegeStats.excessAdmissions}` : '0'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Over-intake cases</div>
        </div>

        {/* Total Submitted Records */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">
            Submitted Records
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {collegeStudents.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">In detailed registry</div>
        </div>
      </div>

      {/* Department-wise Breakdown Cards */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900 mb-3">
          Course / Department Sanctioned Capacity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {currentInstitution.courses.map((c) => {
            const courseCount = collegeStudents.filter((s) => s.course === c.courseName).length;
            return (
              <div
                key={c.code}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-blue-600">{c.code}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      Approved: {c.approvedIntake}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800 text-xs line-clamp-1">
                    {c.courseName}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Registered in Portal:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {courseCount} students
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* College Registered Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Table Filters Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Registered Student Admissions ({filteredStudents.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct submission records linked with verified APAAR IDs
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or APAAR ID..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-44 sm:w-56"
              />
            </div>

            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Departments</option>
              {currentInstitution.courses.map((c) => (
                <option key={c.code} value={c.courseName}>
                  {c.code}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="FLAGGED_DUPLICATE">Duplicate</option>
              <option value="EXCESS_ADMISSION">Excess Intake</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">APAAR ID (12-Digit)</th>
                <th className="py-3 px-4">Registration No</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Validation Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No student records matching current filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-400">
                        Admitted: {s.admissionDate}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      {s.apaarId}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {s.registrationNo}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="truncate max-w-[150px] block" title={s.course}>
                        {s.course}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                        {s.admissionCategory}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {s.status === 'VERIFIED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      )}
                      {s.status === 'FLAGGED_DUPLICATE' && (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200"
                          title={s.flagReason}
                        >
                          <ShieldAlert className="w-3 h-3 text-rose-600" />
                          Duplicate Flag
                        </span>
                      )}
                      {s.status === 'EXCESS_ADMISSION' && (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                          title={s.flagReason}
                        >
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Excess Intake
                        </span>
                      )}
                      {s.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                          <Clock className="w-3 h-3 text-slate-500" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewStudent(s)}
                          title="View Digital Pass & Verification"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {onDeleteStudent && (
                          <button
                            onClick={() => onDeleteStudent(s.id)}
                            title="Delete Student Record"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
