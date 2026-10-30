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
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              National Reporting Suite
            </span>
            <span className="text-slate-400 text-xs">• AICTE Audit & Compliance</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Comprehensive Enrolment & Compliance Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
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
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
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
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Section 1: Institution-wise Enrolment */}
      {(activeTab === 'all' || activeTab === 'institutions') && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              1. Institution-wise Intake vs Enrolment Report
            </h2>
            <span className="text-xs text-slate-400">
              {institutionStats.length} Institutions
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
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
              <tbody className="divide-y divide-slate-100">
                {institutionStats.map((stat) => (
                  <tr key={stat.institution.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-4 font-semibold text-slate-800">
                      {stat.institution.name}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{stat.institution.state}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                      {stat.approvedIntake}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      {stat.actualEnrolment}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-emerald-700">
                      {stat.remainingSeats}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono">
                      {stat.excessAdmissions > 0 ? (
                        <span className="text-amber-700 font-bold">
                          +{stat.excessAdmissions}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {stat.isExcess ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                          EXCESS BREACH
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
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
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              2. Course-wise Student Distribution
            </h2>
            <span className="text-xs text-slate-400">
              Aggregated across branches
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-4">Program / Discipline</th>
                  <th className="py-2.5 px-4 text-right">Total Sanctioned Seats</th>
                  <th className="py-2.5 px-4 text-right">Current Enrolled</th>
                  <th className="py-2.5 px-4 text-right">Fill Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courseList.map((c) => {
                  const fillRate = Math.round((c.enrolled / (c.approved || 1)) * 100);
                  return (
                    <tr key={c.courseName} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-4 font-semibold text-slate-800">
                        {c.courseName}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                        {c.approved}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                        {c.enrolled}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-blue-600 font-semibold">
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
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
              <h2 className="text-sm font-bold text-rose-950 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                3. Potential Duplicate Records
              </h2>
              <span className="text-xs font-mono font-bold text-rose-700">
                {duplicateClusters.length} cases
              </span>
            </div>
            <div className="p-4 space-y-3">
              {duplicateClusters.map((cluster) => (
                <div
                  key={cluster.apaarId}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-mono font-bold text-slate-900">
                    <span>{cluster.apaarId}</span>
                    <span className="text-[10px] text-rose-600 font-sans font-semibold">
                      DUAL ENROLMENT
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800">
                    {cluster.studentName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Institutions: {cluster.institutions.join(' & ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Excess Admission Cases Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
              <h2 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                4. Excess Admission Audit
              </h2>
              <span className="text-xs font-mono font-bold text-amber-700">
                {excessInstitutions.length} breaches
              </span>
            </div>
            <div className="p-4 space-y-3">
              {excessInstitutions.map((i) => (
                <div
                  key={i.institution.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {i.institution.name}
                    </span>
                    <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                      +{i.excessAdmissions} EXCESS
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Approved: {i.approvedIntake} | Actual Enrolled: {i.actualEnrolment}
                  </div>
                  <div className="text-[10px] text-amber-700">
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
