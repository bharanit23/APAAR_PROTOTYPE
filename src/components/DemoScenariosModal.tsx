import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, ArrowRight, Play } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                SIH Demonstration Walkthrough
              </h2>
              <p className="text-xs text-slate-500">
                1-Click demonstration of the complete AICTE + APAAR centralized workflow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios List */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Scenario 1: Clean Registration */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/20 transition-all flex items-start justify-between gap-4 group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Clean Student Admission & Format Validation
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                College registers a student with a valid 12-digit APAAR ID. The engine validates format, checks national registry for collisions, and certifies the admission.
              </p>
            </div>
            <button
              onClick={() => onRunScenario('clean')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Test Flow
            </button>
          </div>

          {/* Scenario 2: Duplicate APAAR Across Institutions */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-rose-300 bg-white hover:bg-rose-50/20 transition-all flex items-start justify-between gap-4 group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Dual Institution Enrolment Detection
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                Simulates an attempt to admit a student whose APAAR ID (<span className="font-mono font-semibold">7341 9023 8812</span>) is already registered in another institution (DTU & BIT Mesra). Triggers instant collision block.
              </p>
            </div>
            <button
              onClick={() => onRunScenario('duplicate')}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Test Flow
            </button>
          </div>

          {/* Scenario 3: Excess Admission Intake Breach */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50/20 transition-all flex items-start justify-between gap-4 group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Approved Intake Cap Breach (120 vs 129 seats)
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                Inspects College of Engineering Pune (COEP) which has 129 admitted students against an approved AICTE intake of 120 (<strong>+9 excess admissions</strong>).
              </p>
            </div>
            <button
              onClick={() => onRunScenario('excess')}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Test Flow
            </button>
          </div>

          {/* Scenario 4: Verifier & QR Pass */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/20 transition-all flex items-start justify-between gap-4 group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold flex items-center justify-center">
                  4
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Public & Employer Verification with Live QR Pass
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                Instant authenticity verification via APAAR ID or registration number, rendering an official digital student card with tamper-evident QR seal.
              </p>
            </div>
            <button
              onClick={() => onRunScenario('verify')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Test Flow
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>AICTE APAAR Prototype demonstration environment</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
