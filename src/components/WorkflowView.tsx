import React, { useState } from 'react';
import {
  UploadCloud,
  ShieldCheck,
  CheckCircle2,
  Database,
  BarChart3,
  Search,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowDown,
  Building2,
  FileCheck2,
  QrCode,
  GitGraph,
} from 'lucide-react';

interface WorkflowViewProps {
  onNavigateToStage: (stageView: string) => void;
}

export const WorkflowView: React.FC<WorkflowViewProps> = ({ onNavigateToStage }) => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);

  const STAGES = [
    {
      id: 'upload',
      number: '01',
      title: 'Institution → Student Data Upload',
      shortDesc: 'Colleges ingest admitted batch rosters with 12-digit APAAR IDs.',
      icon: UploadCloud,
      color: 'blue',
      targetView: 'students',
      actionLabel: 'Try Student Admission Form',
      details: {
        actor: 'College Admission Cell / Registrar',
        inputs: ['Student Demographics', '12-Digit APAAR ID', 'Sanctioned Course Code', 'Admission Quota'],
        process: 'College uploads or submits student matriculation forms directly into the institutional nexus node. Data format is prepared for national schema alignment.',
        outcome: 'Staged admission payload ready for automated compliance pre-screening.',
      },
    },
    {
      id: 'validation',
      number: '02',
      title: 'APAAR ID Validation',
      shortDesc: 'Automated syntax, length, and immediate structural validation.',
      icon: ShieldCheck,
      color: 'indigo',
      targetView: 'validation',
      actionLabel: 'Launch APAAR Validation Workbench',
      details: {
        actor: 'Automated AICTE Validation Engine',
        inputs: ['Submitted APAAR string', 'Institutional Sanctioned Cap', 'National Student Registry'],
        process: 'Engine verifies the 12-digit format, removes invalid patterns, and verifies completeness of mandatory admission parameters.',
        outcome: 'Instant validation verdict: Valid, Incomplete, Invalid Format, or Requires Review.',
      },
    },
    {
      id: 'verification',
      number: '03',
      title: 'Data Verification & De-duplication',
      shortDesc: 'Cross-institutional registry collision scan against all AICTE colleges.',
      icon: CheckCircle2,
      color: 'rose',
      targetView: 'graph',
      actionLabel: 'Inspect Cross-Institution Identity Graph',
      details: {
        actor: 'Centralized Identity Matching Service',
        inputs: ['Validated APAAR ID', 'Academic Year', 'Previous Enrolment Records', 'NOC Migration Certificates'],
        process: 'Scans all institutions across India to detect if the same APAAR ID is already enrolled in another college. Validates transfer NOCs to differentiate legitimate migrations from fraudulent dual admissions.',
        outcome: 'Flagged duplicate warning, legitimate transfer certification, or approved status.',
      },
    },
    {
      id: 'repository',
      number: '04',
      title: 'AICTE Central Repository',
      shortDesc: 'Permanent immutable academic record committed to national ledger.',
      icon: Database,
      color: 'emerald',
      targetView: 'overview',
      actionLabel: 'Open Central AICTE Repository',
      details: {
        actor: 'AICTE Apex Data Center & Academic Bank of Credits (ABC)',
        inputs: ['Certified Student Record', 'Institution Code', 'Program ID', 'Verification Seal'],
        process: 'Record is officially registered into the national AICTE registry, assigned a tamper-evident digital seal, and synchronized with the student Academic Bank of Credits (ABC) ledger.',
        outcome: 'Official student registration confirmed with unique AICTE registry token.',
      },
    },
    {
      id: 'monitoring',
      number: '05',
      title: 'Analytics & Admission Monitoring',
      shortDesc: 'Real-time intake monitoring, excess admission alerts, and quota auditing.',
      icon: BarChart3,
      color: 'amber',
      targetView: 'monitoring',
      actionLabel: 'Open Intake Monitoring Dashboard',
      details: {
        actor: 'AICTE Compliance Officers & College Deans',
        inputs: ['Aggregated Institutional Admitted Count', 'Approved Sanctioned Intake Caps', 'Category Distributions'],
        process: 'Monitors capacity thresholds per institution. Identifies colleges exceeding sanctioned seats (e.g. 129 enrolled vs 120 approved = +9 excess) and generates compliance advisories.',
        outcome: 'Instant violation notices, utilization metrics, and regulatory audit reports.',
      },
    },
    {
      id: 'auth_verify',
      number: '06',
      title: 'Authorized Verification & Digital Pass',
      shortDesc: 'Employers, recruiters, and institutions verify authenticity via QR pass.',
      icon: QrCode,
      color: 'purple',
      targetView: 'verification',
      actionLabel: 'Test Public QR Verification',
      details: {
        actor: 'Authorized Verifiers, Employers, Degree Boards',
        inputs: ['APAAR ID', 'Student Registration Number', 'QR Scan Token'],
        process: 'Verifiers scan the student dynamic QR code or search the APAAR portal to obtain a cryptographic verification certificate confirming authentic enrolment and college standing.',
        outcome: 'Official verification certificate with AICTE watermark and zero exposure of sensitive PII.',
      },
    },
  ];

  const currentStage = STAGES[activeStageIndex];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 uppercase tracking-wide">
            National Technical Architecture
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-xs">• End-to-End Operational Lifecycle</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          How APAAR NEXUS Works — Six-Stage Workflow
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          The centralized pipeline connecting participating colleges, the automated validation engine, national AICTE repository, and authorized public verifiers.
        </p>
      </div>

      {/* Connected 6-Stage Visual Stepper */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative">
          {STAGES.map((stage, idx) => {
            const isActive = activeStageIndex === idx;
            const Icon = stage.icon;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageIndex(idx)}
                className={`flex flex-col items-center text-center p-3.5 rounded-xl border transition-all text-left relative cursor-pointer group ${
                  isActive
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/50 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {/* Stage Number Badge */}
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full mb-2 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                  }`}
                >
                  Stage {stage.number}
                </span>

                {/* Stage Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Title */}
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">
                  {stage.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Deep-Dive Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden animate-in fade-in duration-200 transition-colors">
        {/* Banner */}
        <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
              {currentStage.number}
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                Active Stage Deep-Dive
              </div>
              <h2 className="text-lg font-bold text-white">
                {currentStage.title}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {currentStage.shortDesc}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToStage(currentStage.targetView)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {currentStage.actionLabel}
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </button>
        </div>

        {/* Detailed Lifecycle Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Process & Actor (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                Primary Operational Actor
              </span>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {currentStage.details.actor}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                Execution Workflow
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                {currentStage.details.process}
              </p>
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                System Output / Verification Outcome
              </span>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mt-1 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{currentStage.details.outcome}</span>
              </div>
            </div>
          </div>

          {/* Right: Data Schema & Inputs (5 cols) */}
          <div className="md:col-span-5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3">
            <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider block">
              Required Data Parameters
            </span>
            <div className="space-y-1.5">
              {currentStage.details.inputs.map((inp, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  {inp}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700">
              <button
                onClick={() => onNavigateToStage(currentStage.targetView)}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Launch Interactive Module</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
