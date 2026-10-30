import React, { useState } from 'react';
import { Institution, Student } from '../types';
import { calculateInstitutionIntake, findDuplicateClusters } from '../services/storage';
import {
  FileSpreadsheet,
  Download,
  Building2,
  Users,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Filter,
  BarChart2,
  Calendar,
} from 'lucide-react';

interface ReportsViewProps {
  institutions: Institution[];
  students: Student[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  institutions,
  students,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'institutions' | 'courses' | 'irregularities'>('all');

  const institutionStats = institutions.map((inst) =>
    calculateInstitutionIntake(inst, students)
  );

  const duplicateClusters = findDuplicateClusters(students);
  const excessInstitutions = institutionStats.filter((i) => i.isExcess);

  // Course-wise aggregation
  const courseMap = new Map<string, { approved: number; enrolled: number }>();
  for (const inst of institutions) {
    for (const c of inst.courses) {
      if (!courseMap.has(c.courseName)) {
        courseMap.set(c.courseName, { approved: 0, enrolled: 0 });
      }
      courseMap.get(c.courseName)!.approved += c.approvedIntake;
    }
  }
  for (const s of students) {
    if (courseMap.has(s.course)) {
      courseMap.get(s.course)!.enrolled += 1;
    } else {
      courseMap.set(s.course, { approved: 60, enrolled: 1 });
    }
  }

  const courseList = Array.from(courseMap.entries()).map(([courseName, val]) => ({
    courseName,
    approved: val.approved,
    enrolled: val.enrolled,
  }));

  // CSV Export
  const handleExportCSV = () => {
    const rows = [
      ['AICTE APAAR NEXUS AUDIT REPORT', new Date().toISOString()],
      [],
      ['--- INSTITUTION WISE ENROLMENT ---'],
      ['Institution Code', 'Institution Name', 'State', 'Approved Intake', 'Actual Enrolment', 'Excess Admissions', 'Status'],
      ...institutionStats.map((i) => [
        i.institution.code,
        `"${i.institution.name}"`,
        i.institution.state,
        i.approvedIntake,
        i.actualEnrolment,
        i.excessAdmissions,
        i.isExcess ? 'EXCESS_INTAKE_VIOLATION' : 'COMPLIANT',
      ]),
      [],
      ['--- POTENTIAL DUPLICATE RECORDS ---'],
      ['APAAR ID', 'Student Name', 'Conflicting Colleges', 'Total Records'],
      ...duplicateClusters.map((c) => [
        c.apaarId,
        `"${c.studentName}"`,
        `"${c.institutions.join('; ')}"`,
        c.records.length,
      ]),
      [],
      ['--- REGISTERED STUDENT ROSTER ---'],
      ['Student Name', 'APAAR ID', 'Registration No', 'Institution', 'Course', 'Category', 'Status', 'Admission Date'],
      ...students.map((s) => [
        `"${s.name}"`,
        s.apaarId,
        s.registrationNo,
        `"${s.institutionName}"`,
        `"${s.course}"`,
        s.admissionCategory,
        s.status,
        s.admissionDate,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AICTE_APAAR_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
              National Reporting Suite
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-xs">• AICTE Audit & Compliance</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Comprehensive Enrolment & Compliance Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Download institutional intake summaries, cross-institution duplicate audit trails, and program-wise seat distributions.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm active:scale-98 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export Complete Report (CSV)
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'all', label: 'All Report Modules' },
          { id: 'institutions', label: 'Institution-wise Enrolment' },
          { id: 'courses', label: 'Course-wise Distribution' },
          { id: 'irregularities', label: 'Irregularities & Alerts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section 1: Institution-wise Enrolment */}
      {(activeTab === 'all' || activeTab === 'institutions') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              1. Institution-wise Intake vs Enrolment Report
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {institutionStats.length} Institutions
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[580px]">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Institution Name</th>
                  <th className="py-2.5 px-4">State</th>
                  <th className="py-2.5 px-4 text-right">Approved Intake</th>
                  <th className="py-2.5 px-4 text-right">Actual Enrolment</th>
                  <th className="py-2.5 px-4 text-right">Remaining Seats</th>
                  <th className="py-2.5 px-4 text-right">Excess</th>
                  <th className="py-2.5 px-4 text-center">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {institutionStats.map((stat) => (
                  <tr key={stat.institution.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {stat.institution.name}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">{stat.institution.state}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                      {stat.approvedIntake}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                      {stat.actualEnrolment}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-emerald-700 dark:text-emerald-400">
                      {stat.remainingSeats}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono">
                      {stat.excessAdmissions > 0 ? (
                        <span className="text-amber-700 dark:text-amber-400 font-bold">
                          +{stat.excessAdmissions}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {stat.isExcess ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40">
                          EXCESS BREACH
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
                          APPROVED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 2: Course-wise student distribution */}
      {(activeTab === 'all' || activeTab === 'courses') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              2. Course-wise Student Distribution
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Aggregated across branches
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Program / Discipline</th>
                  <th className="py-2.5 px-4 text-right">Total Sanctioned Seats</th>
                  <th className="py-2.5 px-4 text-right">Current Enrolled</th>
                  <th className="py-2.5 px-4 text-right">Fill Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {courseList.map((c) => {
                  const fillRate = Math.round((c.enrolled / (c.approved || 1)) * 100);
                  return (
                    <tr key={c.courseName} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {c.courseName}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                        {c.approved}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                        {c.enrolled}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-blue-600 dark:text-blue-400 font-semibold">
                        {fillRate}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 3: Verified vs Pending Records & Irregularities */}
      {(activeTab === 'all' || activeTab === 'irregularities') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Duplicate Records Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/20">
              <h2 className="text-sm font-bold text-rose-950 dark:text-rose-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                3. Potential Duplicate Records
              </h2>
              <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400">
                {duplicateClusters.length} cases
              </span>
            </div>
            <div className="p-4 space-y-3">
              {duplicateClusters.map((cluster) => (
                <div
                  key={cluster.apaarId}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-mono font-bold text-slate-900 dark:text-slate-100">
                    <span>{cluster.apaarId}</span>
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-sans font-semibold">
                      DUAL ENROLMENT
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {cluster.studentName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Institutions: {cluster.institutions.join(' & ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Excess Admission Cases Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/50 dark:bg-amber-950/20">
              <h2 className="text-sm font-bold text-amber-950 dark:text-amber-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                4. Excess Admission Audit
              </h2>
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                {excessInstitutions.length} breaches
              </span>
            </div>
            <div className="p-4 space-y-3">
              {excessInstitutions.map((i) => (
                <div
                  key={i.institution.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {i.institution.name}
                    </span>
                    <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/40">
                      +{i.excessAdmissions} EXCESS
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    Approved: {i.approvedIntake} | Actual Enrolled: {i.actualEnrolment}
                  </div>
                  <div className="text-[10px] text-amber-700 dark:text-amber-400">
                    Action: Issued AICTE intake clarification directive.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
