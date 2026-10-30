import React, { useState } from 'react';
import { Student, DuplicateCluster } from '../types';
import { findDuplicateClusters } from '../services/storage';
import {
  ShieldAlert,
  AlertTriangle,
  Building2,
  Calendar,
  ArrowRight,
  CheckCircle,
  XCircle,
  FileText,
  UserX,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface DuplicateDetectionViewProps {
  students: Student[];
  onResolveDuplicate?: (apaarId: string, keepStudentId: string) => void;
  onViewStudent: (student: Student) => void;
}

export const DuplicateDetectionView: React.FC<DuplicateDetectionViewProps> = ({
  students,
  onResolveDuplicate,
  onViewStudent,
}) => {
  const clusters = findDuplicateClusters(students);
  const [resolvedClusters, setResolvedClusters] = useState<Record<string, string>>({});

  const handleResolveAction = (clusterApaar: string, retainedId: string) => {
    setResolvedClusters((prev) => ({
      ...prev,
      [clusterApaar]: retainedId,
    }));
    if (onResolveDuplicate) {
      onResolveDuplicate(clusterApaar, retainedId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
              National Registry Integrity Engine
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-xs">• Cross-Institution Duplicate Audit</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Potential Duplicate Records & Dual Enrolments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Automated collision engine scanning all AICTE approved institutions for identical 12-digit APAAR IDs claimed across multiple colleges or redundant registrations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-right">
            <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 block">
              Active Alerts
            </span>
            <span className="text-lg font-bold font-mono text-rose-700 dark:text-rose-300">
              {clusters.length} Incident{clusters.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>

      {/* Overview Warning */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white p-5 rounded-2xl shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Regulatory Context (AICTE Guidelines)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              Under AICTE norms, a student cannot hold concurrent full-time regular admission in two degree-granting engineering colleges. APAAR nexus detects dual enrolments across state and central jurisdictions simultaneously.
            </p>
          </div>
        </div>
      </div>

      {/* Duplicate Incidents List */}
      {clusters.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-12 text-center transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-100 dark:border-emerald-900/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            No Duplicate Records Detected
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
            All submitted APAAR IDs in the central registry are currently unique to their respective institution and degree program.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {clusters.map((cluster, idx) => {
            const isResolved = resolvedClusters[cluster.apaarId];
            return (
              <div
                key={cluster.apaarId}
                className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-2xs overflow-hidden transition-all ${
                  isResolved
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-rose-200 dark:border-rose-900/60'
                }`}
              >
                {/* Cluster Top Bar */}
                <div
                  className={`p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
                    isResolved
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 font-bold text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-2xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-2">
                        <span>Collision for APAAR ID:</span>
                        <span className="font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold">
                          {cluster.apaarId}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        Claimed Name: <strong>{cluster.studentName}</strong> • {cluster.records.length} Conflicting Registrations
                      </div>
                    </div>
                  </div>

                  <div>
                    {isResolved ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Resolved & Reconciled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        {cluster.isCrossInstitution ? 'Dual Institution Violation' : 'Intra-College Duplicate'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Side-by-Side Comparison of Records */}
                <div className="p-5">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                    Conflicting Enrolment Submissions
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cluster.records.map((rec) => {
                      const isRetained = isResolved === rec.id;
                      const isRevoked = isResolved && !isRetained;

                      return (
                        <div
                          key={rec.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isRetained
                              ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/30 shadow-xs'
                              : isRevoked
                              ? 'border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 opacity-60'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200/60 dark:border-slate-700">
                              Reg: {rec.registrationNo}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                              Admitted: {rec.admissionDate}
                            </span>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-semibold">
                                Institution
                              </span>
                              <div className="font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {rec.institutionName}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                              <div>
                                <span className="text-slate-400 dark:text-slate-500 block text-[10px]">
                                  Program / Branch
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  {rec.course}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 dark:text-slate-500 block text-[10px]">
                                  Category
                                </span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                  {rec.admissionCategory}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Bar for this Record */}
                          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                            <button
                              onClick={() => onViewStudent(rec)}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
                            >
                              Inspect Details <ExternalLink className="w-3 h-3" />
                            </button>

                            {!isResolved && (
                              <button
                                onClick={() => handleResolveAction(cluster.apaarId, rec.id)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                              >
                                Retain This Admission
                              </button>
                            )}

                            {isRetained && (
                              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Retained & Verified
                              </span>
                            )}
                            {isRevoked && (
                              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                <UserX className="w-3.5 h-3.5" /> Admission Nullified
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Audit Resolution Box */}
                {!isResolved && (
                  <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      Select "Retain This Admission" to simulate AICTE adjudication and mark the duplicate as resolved.
                    </span>
                    <button
                      onClick={() => handleResolveAction(cluster.apaarId, cluster.records[0].id)}
                      className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-semibold underline self-start sm:self-auto cursor-pointer"
                    >
                      Quick-Resolve Default
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
