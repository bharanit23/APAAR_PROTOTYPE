import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  GitGraph,
  BarChart3,
  Layers,
  Search,
  FileSpreadsheet,
  ShieldAlert,
  Sparkles,
  Award,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  duplicateCount: number;
  excessCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenDemoGuide: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  duplicateCount,
  excessCount,
  isOpenMobile,
  onCloseMobile,
  onOpenDemoGuide,
}) => {
  const NAV_ITEMS = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'institutions',
      label: 'Institutions',
      icon: Building2,
      badge: excessCount > 0 ? `${excessCount} alert` : null,
      badgeType: 'amber',
    },
    {
      id: 'students',
      label: 'Student Records',
      icon: Users,
      badge: null,
    },
    {
      id: 'validation',
      label: 'APAAR Validation',
      icon: ShieldCheck,
      badge: 'Live',
      badgeType: 'blue',
    },
    {
      id: 'graph',
      label: 'Identity Graph',
      icon: GitGraph,
      badge: 'Novel',
      badgeType: 'purple',
      highlight: true,
    },
    {
      id: 'monitoring',
      label: 'Admission Monitoring',
      icon: BarChart3,
      badge: excessCount > 0 ? `+${excessCount}` : null,
      badgeType: 'amber',
    },
    {
      id: 'workflow',
      label: 'Six-Stage Workflow',
      icon: Layers,
      badge: '6 Steps',
      badgeType: 'slate',
    },
    {
      id: 'verification',
      label: 'Verification',
      icon: Search,
      badge: 'QR Pass',
      badgeType: 'emerald',
    },
    {
      id: 'reports',
      label: 'Reports & CSV',
      icon: FileSpreadsheet,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
            <div
              onClick={() => {
                onSelectView('overview');
                onCloseMobile();
              }}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-slate-900">
                  APAAR <span className="text-blue-600">NEXUS</span>
                </span>
                <span className="ml-1.5 px-1 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  AICTE
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Platform Modules
            </div>

            {NAV_ITEMS.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-blue-600'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold shrink-0 ${
                        item.badgeType === 'purple'
                          ? 'bg-purple-100 text-purple-700'
                          : item.badgeType === 'amber'
                          ? 'bg-amber-100 text-amber-800'
                          : item.badgeType === 'emerald'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.badgeType === 'blue'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Card / Demo Guide Banner */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xs">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              SIH 2026 Evaluation
            </div>
            <p className="text-[10px] text-slate-300 mt-1 leading-snug">
              Demonstrate the 1-click end-to-end APAAR validation workflow to judges.
            </p>
            <button
              onClick={onOpenDemoGuide}
              className="mt-2.5 w-full py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-[11px] font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Demo Tour Guide</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="px-3 py-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>Status: Online</span>
            <span className="font-mono">v2.4-SIH</span>
          </div>
        </div>
      </aside>
    </>
  );
};
