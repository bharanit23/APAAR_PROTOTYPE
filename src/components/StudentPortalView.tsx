import React, { useState, useMemo } from 'react';
import { Student, Institution } from '../types';
import { DigitalIdCard } from './DigitalIdCard';
import { calculateInstitutionIntake } from '../services/storage';
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
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  MapPin,
  School,
  Check,
} from 'lucide-react';

interface StudentPortalViewProps {
  students: Student[];
  institutions?: Institution[];
  onSelectInstitution?: (id: string) => void;
  onNavigateToInstitutions?: () => void;
}

export const StudentPortalView: React.FC<StudentPortalViewProps> = ({
  students,
  institutions = [],
  onSelectInstitution,
  onNavigateToInstitutions,
}) => {
  // Let user switch which sample student they are viewing as
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'profile' | 'institutions'>('profile');
  const [instSearchQuery, setInstSearchQuery] = useState('');
  const [instStateFilter, setInstStateFilter] = useState('all');

  const currentStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];

  // Current student's institution data
  const studentInstitution = institutions.find(
    (i) => i.id === currentStudent?.institutionId || i.name === currentStudent?.institutionName
  );
  const studentInstStats = studentInstitution
    ? calculateInstitutionIntake(studentInstitution, students)
    : null;

  // Filtered institutions for student exploration
  const filteredInstitutions = useMemo(() => {
    return institutions.filter((inst) => {
      const matchSearch =
        inst.name.toLowerCase().includes(instSearchQuery.toLowerCase()) ||
        inst.code.toLowerCase().includes(instSearchQuery.toLowerCase()) ||
        inst.city.toLowerCase().includes(instSearchQuery.toLowerCase()) ||
        inst.courses.some((c) =>
          c.courseName.toLowerCase().includes(instSearchQuery.toLowerCase())
        );

      const matchState =
        instStateFilter === 'all' || inst.state === instStateFilter;

      return matchSearch && matchState;
    });
  }, [institutions, instSearchQuery, instStateFilter]);

  const uniqueStates = Array.from(new Set(institutions.map((i) => i.state)));

  if (!currentStudent) {
    return (
      <div className="p-8 text-center text-slate-500">
        No student records available in prototype.
      </div>
    );
  }

  const handleOpenCollege = (instId: string) => {
    if (onSelectInstitution) onSelectInstitution(instId);
    if (onNavigateToInstitutions) onNavigateToInstitutions();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 px-1 sm:px-0">
      {/* Student Switcher & Top Tab Navigation */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Student Self-Service & Transparency Portal
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                Logged in as: {currentStudent.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">
              Demo Student Profile:
            </label>
            <select
              value={currentStudent.id}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden max-w-[200px] truncate"
            >
              {students.slice(0, 10).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.institutionName.split('(')[0].trim()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Tabs: My Digital ID vs AICTE Approved Institutions */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>My Digital Pass & Academic Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('institutions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'institutions'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Approved Institutions Directory ({institutions.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Digital ID Card & Academic Profile */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Digital ID Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <DigitalIdCard student={currentStudent} showActions={true} />
          </div>

          {/* Right Column: Academic Details, ABC Credits, Institution Link (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Institution & Enrolment Summary Card */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Enrolled Program & College Details
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
                  Active Enrolment
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">Institution</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold block mt-0.5 leading-snug">
                    {currentStudent.institutionName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">Department / Course</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold block mt-0.5 leading-snug">
                    {currentStudent.course}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">Registration Number</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-bold block mt-0.5">
                    {currentStudent.registrationNo}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">APAAR 12-Digit ID</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold block mt-0.5 break-all">
                    {currentStudent.apaarId}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">Admission Category</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium block mt-0.5">
                    {currentStudent.admissionCategory} Quota
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block font-medium">Admission Date</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium block mt-0.5">
                    {currentStudent.admissionDate}
                  </span>
                </div>
              </div>

              {/* Quick College Capacity Snapshot for Student */}
              {studentInstStats && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="text-xs">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                      College Sanctioned AICTE Intake:
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {studentInstStats.actualEnrolment} Enrolled / {studentInstStats.approvedIntake} Approved Seats
                    </span>
                  </div>

                  <button
                    onClick={() => studentInstitution && handleOpenCollege(studentInstitution.id)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                  >
                    <span>Inspect College Profile & Seats</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Academic Bank of Credits (ABC) Simulated Integration */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Academic Bank of Credits (ABC) Bridge
                  </h2>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-900/50">
                  NEP 2020 COMPLIANT
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                APAAR ID seamlessly anchors credit transfers and digital transcripts across recognized Indian higher education institutions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Earned Credits
                  </span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                    44 / 160
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Semester 1 & 2</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Current CGPA
                  </span>
                  <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
                    8.84
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">First Class Dist.</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-center">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    DigiLocker Status
                  </span>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Linked
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">KYC Verified</span>
                </div>
              </div>
            </div>

            {/* Admission Audit Note if Flagged */}
            {currentStudent.flagReason && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300">
                <span className="font-bold block mb-1">
                  Registry Compliance Notice:
                </span>
                <p>{currentStudent.flagReason}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AICTE Approved Institutions & Seat Directory (Available for Students) */}
      {activeTab === 'institutions' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Search & State Filter Banner */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Approved Technical Institutions & Capacity Directory</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Students can verify AICTE sanctioned seat ceilings, available vacancies, and accredited courses.
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 self-start sm:self-auto">
                {filteredInstitutions.length} Institutions Found
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={instSearchQuery}
                  onChange={(e) => setInstSearchQuery(e.target.value)}
                  placeholder="Search by college name, PID, city, or engineering branch..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="w-full sm:w-auto">
                <select
                  value={instStateFilter}
                  onChange={(e) => setInstStateFilter(e.target.value)}
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

          {/* Institutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInstitutions.map((inst) => {
              const stats = calculateInstitutionIntake(inst, students);
              const isStudentCollege =
                currentStudent.institutionId === inst.id ||
                currentStudent.institutionName.includes(inst.name.split('(')[0].trim());

              return (
                <div
                  key={inst.id}
                  className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-2xs flex flex-col justify-between transition-all ${
                    isStudentCollege
                      ? 'border-blue-400 dark:border-blue-700 ring-2 ring-blue-500/10'
                      : 'border-slate-200/90 dark:border-slate-800'
                  }`}
                >
                  <div>
                    {/* Top Row: Code and Status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                          PID: {inst.code}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40">
                          {inst.type}
                        </span>
                      </div>

                      {isStudentCollege && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Your Enrolled College
                        </span>
                      )}
                    </div>

                    {/* College Name & Location */}
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {inst.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{inst.city}, {inst.state}</span>
                    </div>

                    {/* Intake Capacity Metrics */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-600 dark:text-slate-400">Intake Capacity:</span>
                        <span className="font-mono text-slate-900 dark:text-slate-100">
                          {stats.actualEnrolment} / {stats.approvedIntake} ({stats.utilizationRate}%)
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            stats.isExcess
                              ? 'bg-amber-500'
                              : stats.utilizationRate >= 95
                              ? 'bg-indigo-600'
                              : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(100, (stats.actualEnrolment / stats.approvedIntake) * 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                        <span>
                          Remaining Seats:{' '}
                          <strong className="font-mono text-slate-700 dark:text-slate-200">
                            {stats.remainingSeats}
                          </strong>
                        </span>
                        {stats.isExcess ? (
                          <span className="text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> +{stats.excessAdmissions} Excess
                          </span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" /> Within AICTE Cap
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Departments List */}
                    <div className="mt-3">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                        Accredited Departments ({inst.courses.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {inst.courses.map((c) => (
                          <span
                            key={c.code}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                            title={`${c.courseName}: Approved Intake ${c.approvedIntake}`}
                          >
                            {c.code} ({c.approvedIntake})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      AICTE Monitored
                    </span>
                    <button
                      onClick={() => handleOpenCollege(inst.id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>View College Dashboard</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
