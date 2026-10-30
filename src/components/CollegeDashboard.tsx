import React, { useState, useMemo } from 'react';
import { Institution, Student, UserRole } from '../types';
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
  MapPin,
  GraduationCap,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface CollegeDashboardProps {
  institutions: Institution[];
  selectedInstitutionId: string;
  onSelectInstitution: (id: string) => void;
  students: Student[];
  onOpenRegister: () => void;
  onViewStudent: (student: Student) => void;
  onDeleteStudent?: (id: string) => void;
  currentRole?: UserRole;
}

export const CollegeDashboard: React.FC<CollegeDashboardProps> = ({
  institutions,
  selectedInstitutionId,
  onSelectInstitution,
  students,
  onOpenRegister,
  onViewStudent,
  onDeleteStudent,
  currentRole = 'college_admin',
}) => {
  const [activeTab, setActiveTab] = useState<'selected' | 'directory'>('selected');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Directory tab search & state filter
  const [dirSearch, setDirSearch] = useState('');
  const [dirState, setDirState] = useState('all');

  const currentInstitution =
    institutions.find((i) => i.id === selectedInstitutionId) || institutions[0];

  const collegeStats = calculateInstitutionIntake(currentInstitution, students);

  // College-specific student records
  const collegeStudents = students.filter(
    (s) => s.institutionId === currentInstitution.id
  );

  // Filtered students for selected college
  const filteredStudents = collegeStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.apaarId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registrationNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = courseFilter === 'all' || s.course === courseFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  // Filtered institutions for directory view
  const filteredInstitutions = useMemo(() => {
    return institutions.filter((inst) => {
      const matchSearch =
        inst.name.toLowerCase().includes(dirSearch.toLowerCase()) ||
        inst.code.toLowerCase().includes(dirSearch.toLowerCase()) ||
        inst.city.toLowerCase().includes(dirSearch.toLowerCase()) ||
        inst.courses.some((c) =>
          c.courseName.toLowerCase().includes(dirSearch.toLowerCase())
        );

      const matchState = dirState === 'all' || inst.state === dirState;
      return matchSearch && matchState;
    });
  }, [institutions, dirSearch, dirState]);

  const uniqueStates = Array.from(new Set(institutions.map((i) => i.state)));

  return (
    <div className="space-y-6">
      {/* Role-Specific Transparency Banner for Students & Verifiers */}
      {currentRole === 'student' && (
        <div className="bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <span className="font-bold block">
                Student Transparency Portal: Institutional & Intake Directory
              </span>
              <span className="text-[11px] text-blue-700 dark:text-blue-300">
                You can inspect approved seat capacities, department quotas, and verified enrolled students for any college in India.
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab(activeTab === 'directory' ? 'selected' : 'directory')}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 self-start sm:self-auto cursor-pointer transition-colors"
          >
            {activeTab === 'directory' ? 'View Selected College' : 'Browse All Colleges'}
          </button>
        </div>
      )}

      {/* Tabs: Selected College vs All Approved Institutions Directory */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('selected')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'selected'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{currentInstitution.shortName} Intake & Rosters</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All AICTE Approved Institutions ({institutions.length})</span>
        </button>
      </div>

      {/* VIEW 1: Selected College Dashboard */}
      {activeTab === 'selected' && (
        <div className="space-y-6 animate-in fade-in">
          {/* College Switcher & Header Bar */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40">
                    Institutional Node
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    PID: {currentInstitution.code}
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 leading-snug">
                  {currentInstitution.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentInstitution.city}, {currentInstitution.state} • {currentInstitution.type} Institution
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Switch Institution Dropdown */}
              <div className="relative w-full sm:w-auto">
                <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-0.5">
                  Switch AICTE College:
                </label>
                <select
                  value={currentInstitution.id}
                  onChange={(e) => onSelectInstitution(e.target.value)}
                  className="w-full sm:w-auto text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.shortName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Register Button */}
              <div className="self-end w-full sm:w-auto">
                <button
                  onClick={onOpenRegister}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register New Student</span>
                </button>
              </div>
            </div>
          </div>

          {/* Warning Banner when Enrolment Exceeds Approved Intake */}
          {collegeStats.isExcess && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800/80 rounded-2xl p-4 sm:p-5 shadow-sm animate-in fade-in transition-colors">
              <div className="flex flex-col sm:flex-row items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wide">
                      Warning: Enrolment Exceeds Sanctioned AICTE Intake
                    </h3>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800/80">
                      +{collegeStats.excessAdmissions} Excess Admissions
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/90 dark:text-amber-300 mt-1.5 leading-relaxed">
                    The institution has admitted{' '}
                    <strong className="font-mono font-bold text-amber-950 dark:text-amber-100">
                      {collegeStats.actualEnrolment}
                    </strong>{' '}
                    students, which surpasses the approved intake of{' '}
                    <strong className="font-mono font-bold text-amber-950 dark:text-amber-100">
                      {collegeStats.approvedIntake}
                    </strong>{' '}
                    seats ({collegeStats.utilizationRate}% capacity utilization). Excess admissions are flagged in the national AICTE registry.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-amber-950 dark:text-amber-200">
                    <span className="bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded border border-amber-200 dark:border-amber-800/60">
                      Approved: <strong>{collegeStats.approvedIntake}</strong>
                    </span>
                    <span>→</span>
                    <span className="bg-white/80 dark:bg-slate-900/80 px-2 py-1 rounded border border-amber-200 dark:border-amber-800/60">
                      Actual: <strong>{collegeStats.actualEnrolment}</strong>
                    </span>
                    <span>→</span>
                    <span className="bg-amber-100 dark:bg-amber-900/60 px-2 py-1 rounded border border-amber-300 dark:border-amber-700 font-bold text-amber-900 dark:text-amber-200">
                      Excess: <strong>+{collegeStats.excessAdmissions}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* College Intake Dashboard Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
              <span className="text-[11px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">
                Approved Intake
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                {collegeStats.approvedIntake}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Sanctioned seats
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
              <span className="text-[11px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">
                Actual Enrolment
              </span>
              <div
                className={`text-xl sm:text-2xl font-bold font-mono ${
                  collegeStats.isExcess
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                {collegeStats.actualEnrolment}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {collegeStats.utilizationRate}% utilized
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
              <span className="text-[11px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">
                Remaining Seats
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-slate-700 dark:text-slate-300">
                {collegeStats.remainingSeats}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Available capacity
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
              <span className="text-[11px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">
                Excess Admissions
              </span>
              <div
                className={`text-xl sm:text-2xl font-bold font-mono ${
                  collegeStats.isExcess
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {collegeStats.excessAdmissions > 0
                  ? `+${collegeStats.excessAdmissions}`
                  : '0'}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Over-intake cases
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors col-span-2 sm:col-span-1">
              <span className="text-[11px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 block mb-1">
                Submitted Records
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                {collegeStudents.length}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                In detailed registry
              </div>
            </div>
          </div>

          {/* Department-wise Breakdown Cards */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
              Course / Department Sanctioned Capacity
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentInstitution.courses.map((c) => {
                const courseCount = collegeStudents.filter(
                  (s) => s.course === c.courseName
                ).length;
                return (
                  <div
                    key={c.code}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {c.code}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          Approved: {c.approvedIntake}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs line-clamp-1">
                        {c.courseName}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        Registered in Portal:
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {courseCount} students
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* College Registered Students Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
            {/* Table Filters Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Registered Student Admissions ({filteredStudents.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Direct submission records linked with verified APAAR IDs
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search */}
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search student or APAAR ID..."
                    className="w-full sm:w-52 pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Course Filter */}
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-hidden"
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
                  className="text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-hidden"
                >
                  <option value="all">All Statuses</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="FLAGGED_DUPLICATE">Duplicate</option>
                  <option value="EXCESS_ADMISSION">Excess Intake</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>

            {/* Mobile Scroll Hint */}
            <div className="sm:hidden px-4 py-1.5 text-[10px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>Scroll horizontally for full student details</span>
              <span>→</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[650px]">
                <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
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
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 text-center text-slate-400 dark:text-slate-500"
                      >
                        No student records matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr
                        key={s.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {s.name}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500">
                            Admitted: {s.admissionDate}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                          {s.apaarId}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                          {s.registrationNo}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                          <span className="truncate max-w-[150px] block" title={s.course}>
                            {s.course}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {s.admissionCategory}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {s.status === 'VERIFIED' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              Verified
                            </span>
                          )}
                          {s.status === 'FLAGGED_DUPLICATE' && (
                            <span
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                              title={s.flagReason}
                            >
                              <ShieldAlert className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                              Duplicate Flag
                            </span>
                          )}
                          {s.status === 'EXCESS_ADMISSION' && (
                            <span
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                              title={s.flagReason}
                            >
                              <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              Excess Intake
                            </span>
                          )}
                          {s.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
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
                              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {onDeleteStudent && (
                              <button
                                onClick={() => onDeleteStudent(s.id)}
                                title="Delete Student Record"
                                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
      )}

      {/* VIEW 2: All AICTE Approved Institutions Directory */}
      {activeTab === 'directory' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Search & State Filter Header */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>National Directory of AICTE Approved Institutions</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Universal institutional dataset accessible across all user roles (Students, Colleges, AICTE Admins, and Verifiers).
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 self-start sm:self-auto">
                {filteredInstitutions.length} of {institutions.length} Colleges
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={dirSearch}
                  onChange={(e) => setDirSearch(e.target.value)}
                  placeholder="Filter colleges by name, code, state, or course..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="w-full sm:w-auto">
                <select
                  value={dirState}
                  onChange={(e) => setDirState(e.target.value)}
                  className="w-full sm:w-auto text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-hidden"
                >
                  <option value="all">All States</option>
                  {uniqueStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInstitutions.map((inst) => {
              const stats = calculateInstitutionIntake(inst, students);
              const isSelected = inst.id === currentInstitution.id;

              return (
                <div
                  key={inst.id}
                  className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-2xs flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-blue-500 dark:border-blue-600 ring-2 ring-blue-500/20'
                      : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                          PID: {inst.code}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40">
                          {inst.type}
                        </span>
                      </div>

                      {isSelected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40">
                          Currently Active
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {inst.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{inst.city}, {inst.state}</span>
                    </div>

                    {/* Stats Box */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-600 dark:text-slate-400">Seat Utilization:</span>
                        <span className="font-mono text-slate-900 dark:text-slate-100">
                          {stats.actualEnrolment} / {stats.approvedIntake} ({stats.utilizationRate}%)
                        </span>
                      </div>

                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            stats.isExcess
                              ? 'bg-amber-500'
                              : stats.utilizationRate >= 95
                              ? 'bg-indigo-600'
                              : 'bg-blue-600'
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              (stats.actualEnrolment / stats.approvedIntake) * 100
                            )}%`,
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                        <span>
                          Available Seats: <strong className="font-mono text-slate-700 dark:text-slate-200">{stats.remainingSeats}</strong>
                        </span>
                        {stats.isExcess ? (
                          <span className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> +{stats.excessAdmissions} Excess
                          </span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" /> Compliant
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Department list */}
                    <div className="mt-3">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                        Programs Offered:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {inst.courses.map((c) => (
                          <span
                            key={c.code}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            {c.code} ({c.approvedIntake})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      AICTE Monitored
                    </span>
                    <button
                      onClick={() => {
                        onSelectInstitution(inst.id);
                        setActiveTab('selected');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isSelected ? 'View Dashboard' : 'Select College'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
