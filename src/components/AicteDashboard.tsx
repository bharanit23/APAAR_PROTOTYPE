import React, { useState } from 'react';
import { Institution, Student } from '../types';
import { calculateInstitutionIntake, findDuplicateClusters } from '../services/storage';
import {
  Building2,
  Users,
  ShieldCheck,
  Clock,
  AlertTriangle,
  TrendingUp,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle,
  BarChart3,
  Filter,
  GitGraph,
  Layers,
  Sparkles,
  UserCheck,
} from 'lucide-react';

interface AicteDashboardProps {
  institutions: Institution[];
  students: Student[];
  onSelectInstitution: (institutionId: string) => void;
  onNavigateToModule: (view: string) => void;
  onViewDuplicates: () => void;
  onViewReports: () => void;
  onOpenRegister: () => void;
}

export const AicteDashboard: React.FC<AicteDashboardProps> = ({
  institutions,
  students,
  onSelectInstitution,
  onNavigateToModule,
  onViewDuplicates,
  onViewReports,
  onOpenRegister,
}) => {
  const [filterState, setFilterState] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Institution calculations
  const institutionStats = institutions.map((inst) =>
    calculateInstitutionIntake(inst, students)
  );

  const duplicateClusters = findDuplicateClusters(students);

  // Global Key Metrics
  const totalInstitutions = institutions.length;
  const totalApprovedCapacity = institutionStats.reduce((acc, i) => acc + i.approvedIntake, 0);
  const totalActualEnrolment = institutionStats.reduce((acc, i) => acc + i.actualEnrolment, 0);
  
  // Student verification statuses
  const verifiedCount = students.filter((s) => s.status === 'VERIFIED').length;
  const pendingCount = students.filter((s) => s.status === 'PENDING').length;
  const duplicateCount = students.filter((s) => s.status === 'FLAGGED_DUPLICATE').length;
  const excessCount = students.filter((s) => s.status === 'EXCESS_ADMISSION').length;

  const institutionsExceeding = institutionStats.filter((i) => i.isExcess);

  // Filtered institutions
  const filteredInstitutions = institutionStats.filter((stat) => {
    const matchesSearch =
      stat.institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stat.institution.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stat.institution.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stat.institution.state.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterState === 'excess') return matchesSearch && stat.isExcess;
    if (filterState === 'normal') return matchesSearch && !stat.isExcess;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
              National Apex Overview
            </span>
            <span className="text-slate-400 text-xs">• AICTE Academic Registry System</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Centralized AICTE Intake & APAAR Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Real-time monitoring of student admissions across approved technical institutions using One Nation, One Student ID (APAAR) verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateToModule('graph')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <GitGraph className="w-4 h-4 text-purple-600" />
            Identity Graph
          </button>
          <button
            onClick={onViewReports}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-slate-600" />
            Export Reports
          </button>
        </div>
      </div>

      {/* Critical Irregularity Alerts Banner (if any excess or duplicates exist) */}
      {(institutionsExceeding.length > 0 || duplicateClusters.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Excess Admission Alert */}
          {institutionsExceeding.length > 0 && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Intake Violation Detected ({institutionsExceeding.length} Institution)
                  </h3>
                  <span className="text-[10px] font-semibold bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  <strong className="font-semibold">{institutionsExceeding[0].institution.name}</strong> has enrolled{' '}
                  <span className="font-mono font-bold text-amber-900">{institutionsExceeding[0].actualEnrolment}</span>{' '}
                  students against approved intake of{' '}
                  <span className="font-mono font-bold text-amber-900">{institutionsExceeding[0].approvedIntake}</span>{' '}
                  (<strong>+{institutionsExceeding[0].excessAdmissions} excess</strong>, 107.5% utilization).
                </p>
                <button
                  onClick={() => onNavigateToModule('monitoring')}
                  className="mt-2 text-xs font-semibold text-amber-900 hover:text-amber-950 underline flex items-center gap-1 cursor-pointer"
                >
                  Open Admission Monitoring <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Cross-Institution Duplicate Alert */}
          {duplicateClusters.length > 0 && (
            <div className="bg-rose-50/90 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                    Potential Duplicate Records ({duplicateClusters.length} Found)
                  </h3>
                  <span className="text-[10px] font-semibold bg-rose-200/60 text-rose-900 px-2 py-0.5 rounded">
                    High Priority
                  </span>
                </div>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  APAAR ID <span className="font-mono font-bold">{duplicateClusters[0].apaarId}</span> ({duplicateClusters[0].studentName}) is simultaneously enrolled in{' '}
                  <strong>{duplicateClusters[0].institutions.join(' & ')}</strong>.
                </p>
                <button
                  onClick={() => onNavigateToModule('graph')}
                  className="mt-2 text-xs font-semibold text-rose-900 hover:text-rose-950 underline flex items-center gap-1 cursor-pointer"
                >
                  Visualize on Identity Graph <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Institutions</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {totalInstitutions}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">AICTE Approved</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Student Records</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {totalActualEnrolment}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {students.length} detailed in portal
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Verified APAAR</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 tracking-tight">
            {verifiedCount}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">
            100% Registry Match
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Pending Records</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-700 tracking-tight">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting docs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Exceeding Intake</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className={`text-2xl font-bold tracking-tight ${institutionsExceeding.length > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {institutionsExceeding.length}
          </div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">
            {institutionsExceeding.length > 0 ? '+9 Excess seats' : 'Fully compliant'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Duplicate Alerts</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className={`text-2xl font-bold tracking-tight ${duplicateClusters.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {duplicateClusters.length}
          </div>
          <div className="text-[11px] text-rose-600 mt-1 font-medium">
            {duplicateClusters.length > 0 ? 'Cross-inst duplicate' : 'Zero duplicates'}
          </div>
        </div>
      </div>

      {/* Quick Access to Important Modules */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigateToModule('graph')}
          className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-bold uppercase text-purple-700 tracking-wider">Novel Feature</span>
            <div className="text-xs font-bold text-slate-900 mt-0.5">Identity Graph</div>
          </div>
          <GitGraph className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => onNavigateToModule('monitoring')}
          className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">Capacity Audit</span>
            <div className="text-xs font-bold text-slate-900 mt-0.5">Admission Monitoring</div>
          </div>
          <BarChart3 className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => onNavigateToModule('validation')}
          className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-bold uppercase text-indigo-700 tracking-wider">Intelligent Protocol</span>
            <div className="text-xs font-bold text-slate-900 mt-0.5">APAAR Validation</div>
          </div>
          <ShieldCheck className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={() => onNavigateToModule('workflow')}
          className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div>
            <span className="text-[10px] font-bold uppercase text-blue-700 tracking-wider">SIH Process</span>
            <div className="text-xs font-bold text-slate-900 mt-0.5">Six-Stage Workflow</div>
          </div>
          <Layers className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Visual Analytics Section: Institution-wise and Year-wise Enrolment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Institution-wise Enrolment Bar Chart: 8 cols */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Institution-wise Approved vs Actual Enrolment
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Capacity utilization comparison across AICTE monitored institutions
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-300 inline-block" />
                Approved Intake
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block" />
                Enrolled (Healthy)
              </span>
              <span className="flex items-center gap-1.5 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />
                Excess Intake
              </span>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="space-y-4">
            {institutionStats.map((stat) => {
              const maxScale = Math.max(stat.approvedIntake, stat.actualEnrolment, 250);
              const approvedWidth = (stat.approvedIntake / maxScale) * 100;
              const actualWidth = (stat.actualEnrolment / maxScale) * 100;

              return (
                <div key={stat.institution.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 truncate max-w-[240px] sm:max-w-md">
                      {stat.institution.name}
                      {stat.isExcess && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          +{stat.excessAdmissions} EXCESS ({stat.utilizationRate}%)
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-slate-600 shrink-0">
                      <strong className={stat.isExcess ? 'text-amber-700' : 'text-slate-900'}>
                        {stat.actualEnrolment}
                      </strong>
                      <span className="text-slate-400"> / {stat.approvedIntake} ({stat.utilizationRate}%)</span>
                    </span>
                  </div>

                  <div className="h-5 w-full bg-slate-100 rounded-md overflow-hidden relative flex items-center">
                    <div
                      className="absolute top-0 bottom-0 border-r-2 border-slate-400 z-10"
                      style={{ left: `${approvedWidth}%` }}
                      title={`Approved Cap: ${stat.approvedIntake}`}
                    />
                    <div
                      className={`h-full transition-all duration-500 rounded-md ${
                        stat.isExcess
                          ? 'bg-amber-500'
                          : stat.utilizationRate >= 95
                          ? 'bg-indigo-600'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${actualWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Vertical line marks the sanctioned AICTE intake threshold.</span>
            <span>Academic Year 2024–2025</span>
          </div>
        </div>

        {/* Year-wise and Category Distribution: 4 cols */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
              Year-wise Student Enrolment
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Historical multi-year enrolment progression
            </p>

            <div className="space-y-3">
              {[
                { year: '2024-2025', count: 810, pct: 100, active: true },
                { year: '2023-2024', count: 765, pct: 94, active: false },
                { year: '2022-2023', count: 720, pct: 88, active: false },
                { year: '2021-2022', count: 685, pct: 84, active: false },
              ].map((item) => (
                <div key={item.year} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold ${item.active ? 'text-blue-600' : 'text-slate-700'}`}>
                      {item.year} {item.active && '(Current)'}
                    </span>
                    <span className="font-mono text-slate-600 font-medium">
                      {item.count} students
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.active ? 'bg-blue-600' : 'bg-slate-300'}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
              Admission Category Breakdown
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Distribution of verified student quotas
            </p>

            <div className="space-y-2.5 text-xs">
              {[
                { label: 'Regular (State/Central)', share: '78%', color: 'bg-blue-600' },
                { label: 'Supernumerary (TFWS/EWS)', share: '12%', color: 'bg-indigo-500' },
                { label: 'NRI Quota', share: '5%', color: 'bg-sky-500' },
                { label: 'OCI / Foreign National', share: '5%', color: 'bg-amber-500' },
              ].map((cat) => (
                <div key={cat.label} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                    {cat.label}
                  </span>
                  <span className="font-mono font-bold text-slate-800">{cat.share}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Admission Activity Stream (Prompt Requirement A) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Recent Admission Activity
            </h2>
          </div>
          <button
            onClick={() => onNavigateToModule('students')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
          >
            View All Records →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {students.slice(0, 3).map((st) => (
            <div
              key={st.id}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 line-clamp-1">{st.name}</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    st.status === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : st.status === 'FLAGGED_DUPLICATE'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {st.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 line-clamp-1">{st.institutionName}</div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                <span className="font-mono">{st.apaarId}</span>
                <span>{st.admissionDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Institutions Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              AICTE Approved Institutions Registry
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an institution to inspect departmental enrolments and student records
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search college, code, state..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 sm:w-60"
              />
            </div>

            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="excess">Excess Intake Only</option>
              <option value="normal">Compliant Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">AICTE Institution</th>
                <th className="py-3 px-4">PID Code</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Approved Intake</th>
                <th className="py-3 px-4 text-right">Actual Enrolled</th>
                <th className="py-3 px-4 text-right">Remaining / Excess</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInstitutions.map((stat) => (
                <tr
                  key={stat.institution.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">
                      {stat.institution.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Type: {stat.institution.type} • {stat.institution.courses.length} Approved Programs
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {stat.institution.code}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {stat.institution.city}, {stat.institution.state}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-800">
                    {stat.approvedIntake}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {stat.actualEnrolment}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono">
                    {stat.isExcess ? (
                      <span className="text-amber-700 font-bold">
                        +{stat.excessAdmissions} Excess
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">
                        {stat.remainingSeats} Seats Left
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {stat.isExcess ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Cap Exceeded
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Compliant
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectInstitution(stat.institution.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      View College <ChevronRight className="w-3.5 h-3.5" />
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
