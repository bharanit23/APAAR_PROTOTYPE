import React, { useState } from 'react';
import { Institution, Student, IntakeConfig } from '../types';
import { calculateInstitutionIntake } from '../services/storage';
import {
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Building2,
  Info,
  TrendingUp,
  FileSpreadsheet,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface AdmissionMonitoringViewProps {
  institutions: Institution[];
  students: Student[];
  intakeConfig: IntakeConfig;
  onUpdateIntakeConfig: (newConfig: IntakeConfig) => void;
  onSelectInstitution: (institutionId: string) => void;
}

export const AdmissionMonitoringView: React.FC<AdmissionMonitoringViewProps> = ({
  institutions,
  students,
  intakeConfig,
  onUpdateIntakeConfig,
  onSelectInstitution,
}) => {
  const [filterState, setFilterState] = useState<'all' | 'excess' | 'compliant'>('all');

  const stats = institutions.map((inst) =>
    calculateInstitutionIntake(inst, students, intakeConfig)
  );

  const excessCount = stats.filter((s) => s.isExcess).length;
  const totalApproved = stats.reduce((acc, s) => acc + s.approvedIntake, 0);
  const totalEnrolled = stats.reduce((acc, s) => acc + s.actualEnrolment, 0);
  const totalExcess = stats.reduce((acc, s) => acc + s.excessAdmissions, 0);
  const nationalUtilization = Number(((totalEnrolled / (totalApproved || 1)) * 100).toFixed(1));

  const filteredStats = stats.filter((s) => {
    if (filterState === 'excess') return s.isExcess;
    if (filterState === 'compliant') return !s.isExcess;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wide">
              Compliance & Sanction Monitoring
            </span>
            <span className="text-slate-400 text-xs">• AICTE Regulatory Oversight</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Centralized Admission & Sanctioned Intake Monitoring
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Real-time verification comparing admitted student rolls against sanctioned intake thresholds. Accurately flags over-enrolment and accommodates configurable special quotas.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-right">
            <span className="text-[10px] font-bold uppercase text-amber-800 block">
              Intake Violations
            </span>
            <span className="text-xl font-mono font-bold text-amber-900">
              {excessCount} College{excessCount === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>

      {/* Special Admission Quota Configurator Card (User Requirement F) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Configurable Quota Calculation Settings
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Per AICTE Regulations (Hand Book 2024-25)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {/* Toggle 1: Supernumerary (TFWS/EWS) */}
          <label className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/60 flex items-start justify-between gap-3 cursor-pointer select-none">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Supernumerary (TFWS/EWS)
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block leading-tight">
                Include Tuition Fee Waiver & EWS in base capacity calculation
              </span>
            </div>
            <input
              type="checkbox"
              checked={intakeConfig.includeSupernumerary}
              onChange={(e) =>
                onUpdateIntakeConfig({
                  ...intakeConfig,
                  includeSupernumerary: e.target.checked,
                })
              }
              className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
          </label>

          {/* Toggle 2: NRI Quota */}
          <label className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/60 flex items-start justify-between gap-3 cursor-pointer select-none">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                NRI Quota Admissions
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block leading-tight">
                Count Non-Resident Indian seats against approved intake
              </span>
            </div>
            <input
              type="checkbox"
              checked={intakeConfig.includeNri}
              onChange={(e) =>
                onUpdateIntakeConfig({
                  ...intakeConfig,
                  includeNri: e.target.checked,
                })
              }
              className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
          </label>

          {/* Toggle 3: Foreign / OCI */}
          <label className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/60 flex items-start justify-between gap-3 cursor-pointer select-none">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Foreign National / OCI
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block leading-tight">
                Evaluate international student seats under regular cap
              </span>
            </div>
            <input
              type="checkbox"
              checked={intakeConfig.includeForeign}
              onChange={(e) =>
                onUpdateIntakeConfig({
                  ...intakeConfig,
                  includeForeign: e.target.checked,
                })
              }
              className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">
            Total Sanctioned Intake
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {totalApproved}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">AICTE approved capacity</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">
            Total Actual Enrolment
          </span>
          <div className="text-2xl font-bold font-mono text-blue-600">
            {totalEnrolled}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{nationalUtilization}% National Fill Rate</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">
            Excess Admissions
          </span>
          <div className="text-2xl font-bold font-mono text-amber-600">
            +{totalExcess}
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">Requires official justification</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-medium text-slate-400 block mb-1">
            Compliant Institutions
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-600">
            {institutions.length - excessCount} / {institutions.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Within approved ceiling</div>
        </div>
      </div>

      {/* Flagship Scenario Callout Card: COEP Pune (Exact Prompt Example) */}
      <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-5 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
                Flagship Case: College of Engineering Pune (COEP Tech)
              </h3>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-200 text-amber-900 font-mono">
                Utilization: 107.5%
              </span>
            </div>
            <p className="text-xs text-amber-900 mt-1.5 leading-relaxed">
              Demonstrates the exact intake monitoring formula specified in SIH requirements:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Approved Intake</span>
                <span className="text-base font-bold font-mono text-slate-900">120</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Actual Enrolment</span>
                <span className="text-base font-bold font-mono text-amber-900">129</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Excess Admissions</span>
                <span className="text-base font-bold font-mono text-rose-700">+9</span>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Utilization Rate</span>
                <span className="text-base font-bold font-mono text-amber-800">107.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Institutions Intake Monitoring Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Institution-wise Intake & Utilization Audit
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live capacity monitoring based on current quota configurations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value as any)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Institutions</option>
              <option value="excess">Excess Admissions Only</option>
              <option value="compliant">Compliant Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Institution Name</th>
                <th className="py-3 px-4">PID Code</th>
                <th className="py-3 px-4 text-right">Approved Intake</th>
                <th className="py-3 px-4 text-right">Actual Enrolment</th>
                <th className="py-3 px-4 text-right">Available Seats</th>
                <th className="py-3 px-4 text-right">Excess</th>
                <th className="py-3 px-4 text-right">Utilization %</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStats.map((item) => (
                <tr key={item.institution.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>{item.institution.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      {item.institution.city}, {item.institution.state}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {item.institution.code}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-700">
                    {item.approvedIntake}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {item.actualEnrolment}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-semibold">
                    {item.remainingSeats > 0 ? item.remainingSeats : '0'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold">
                    {item.excessAdmissions > 0 ? (
                      <span className="text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        +{item.excessAdmissions}
                      </span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold">
                    <span
                      className={
                        item.utilizationRate > 100
                          ? 'text-amber-800'
                          : item.utilizationRate >= 95
                          ? 'text-indigo-600'
                          : 'text-slate-900'
                      }
                    >
                      {item.utilizationRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {item.isExcess ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        CAP EXCEEDED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        COMPLIANT
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectInstitution(item.institution.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      Details <ChevronRight className="w-3.5 h-3.5" />
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
