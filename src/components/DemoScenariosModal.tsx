import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, ArrowRight, Play, Compass, HelpCircle } from 'lucide-react';

interface DemoScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunScenario: (scenario: 'clean' | 'duplicate' | 'excess' | 'verify') => void;
}

export const DemoScenariosModal: React.FC<DemoScenariosModalProps> = ({
  isOpen,
  onClose,
  onRunScenario,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-inner shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Interactive Guided Tour
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore the key features of APAAR NEXUS through interactive real-world examples
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* How It Works Beginner Callout */}
        <div className="mx-6 mt-4 p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>How the system works:</strong> Each student has one unique 12-digit APAAR ID. Colleges submit student admission records, and the system instantly verifies identity, ensures colleges do not exceed approved seats, and stops duplicate admissions across India.
          </div>
        </div>

        {/* Scenarios List */}
        <div className="p-6 space-y-3.5 max-h-[70vh] overflow-y-auto">
          {/* Scenario 1: Clean Registration */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-800/60 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all flex items-start justify-between gap-4 group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Standard Student Admission (Clean Flow)
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
                See how a college admin enters student details with a valid 12-digit APAAR ID. The system checks the format, verifies available seats, and approves the admission.
              </p>
            </div>
            <button
              onClick={() => onRunScenario('clean')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Try Step
            </button>
          </div>

          {/* Scenario 2: Duplicate APAAR Across Institutions */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700 bg-white dark:bg-slate-800/60 hover:bg-rose-50/20 dark:hover:bg-rose-950/20 transition-all flex items-start justify-between gap-4 group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Dual Enrolment Detection (Duplicate Prevention)
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
                See what happens when the same APAAR ID (<span className="font-mono font-semibold text-slate-900 dark:text-slate-200">7341 9023 8812</span>) is registered at two different engineering colleges simultaneously. The system flags this immediately on the Identity Graph.
              </p>
            </div>
            <button
              onClick={() => onRunScenario('duplicate')}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Try Step
            </button>
          </div>

          {/* Scenario 3: Excess Admission Intake Breach */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 bg-white dark:bg-slate-800/60 hover:bg-amber-50/20 dark:hover:bg-amber-950/20 transition-all flex items-start justify-between gap-4 group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Intake Capacity Monitoring (Excess Admissions)
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
                See how AICTE monitors approved student intake. For example, COEP Pune has 129 admitted students against an approved intake of 120 (<strong>+9 excess admissions</strong>, 107.5% capacity).
              </p>
            </div>
            <button
              onClick={() => onRunScenario('excess')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Try Step
            </button>
          </div>

          {/* Scenario 4: Verifier & QR Pass */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-800/60 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all flex items-start justify-between gap-4 group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 text-[11px] font-bold flex items-center justify-center">
                  4
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Public & Employer Verification with QR Code Pass
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
                See how a verifier or employer looks up an APAAR ID to instantly view a verified Digital Student Pass with a live QR code and tamper-evident certificate stamp.
              </p>
            </div>
            <button
              onClick={() => onRunScenario('verify')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Try Step
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>APAAR NEXUS — One Nation, One Student ID Platform</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

