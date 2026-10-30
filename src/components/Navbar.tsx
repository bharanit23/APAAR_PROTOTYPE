import React from 'react';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  Search,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  BarChart3,
  CheckCircle,
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  currentView: string;
  onSelectView: (view: string) => void;
  duplicateCount: number;
  excessCount: number;
  onOpenDemoGuide: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  currentView,
  onSelectView,
  duplicateCount,
  excessCount,
  onOpenDemoGuide,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top micro-bar for official context */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            AICTE CENTRALIZED REGISTRY NODE
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">
            One Nation One Student ID (APAAR) Implementation
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDemoGuide}
            className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span className="underline">Interactive Demo Guide</span>
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={onResetData}
            title="Reset to default sample data"
            className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => {
            onSelectRole('aicte_admin');
            onSelectView('aicte_dashboard');
          }}
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                APAAR <span className="text-blue-600">NEXUS</span>
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                AICTE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Centralized Student Admission & Audit
            </p>
          </div>
        </div>

        {/* Role Switcher Pills (User Requirement 2) */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => {
              onSelectRole('aicte_admin');
              onSelectView('aicte_dashboard');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentRole === 'aicte_admin' && (currentView === 'aicte_dashboard' || currentView === 'college_dashboard')
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            AICTE Admin
          </button>

          <button
            onClick={() => {
              onSelectRole('college_admin');
              onSelectView('college_dashboard');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentRole === 'college_admin'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            College Admin
          </button>

          <button
            onClick={() => {
              onSelectRole('student');
              onSelectView('student_portal');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentRole === 'student'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            Student View
          </button>

          <button
            onClick={() => {
              onSelectRole('verifier');
              onSelectView('verification');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentRole === 'verifier'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-slate-700" />
            Public Verifier
          </button>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2">
          {/* Duplicate Audit Tab */}
          <button
            onClick={() => onSelectView('duplicates')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
              currentView === 'duplicates'
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Duplicate Audit</span>
            {duplicateCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                {duplicateCount}
              </span>
            )}
          </button>

          {/* Reports Tab */}
          <button
            onClick={() => onSelectView('reports')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
              currentView === 'reports'
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Reports & CSV</span>
          </button>
        </div>
      </div>

      {/* Mobile Role Switcher Bar */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 border-t border-slate-100 gap-2 bg-slate-50 text-xs">
        {[
          { role: 'aicte_admin', view: 'aicte_dashboard', label: 'AICTE Admin' },
          { role: 'college_admin', view: 'college_dashboard', label: 'College Admin' },
          { role: 'student', view: 'student_portal', label: 'Student' },
          { role: 'verifier', view: 'verification', label: 'Verifier' },
        ].map((item) => (
          <button
            key={item.role}
            onClick={() => {
              onSelectRole(item.role as UserRole);
              onSelectView(item.view);
            }}
            className={`px-3 py-1 rounded-lg font-semibold shrink-0 cursor-pointer ${
              currentRole === item.role
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
