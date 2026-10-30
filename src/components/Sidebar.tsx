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
  GraduationCap,
  UserPlus,
  Sparkles,
  ChevronRight,
  Sun,
  Moon,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  duplicateCount: number;
  excessCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenDemoGuide: () => void;
  onOpenRegister?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string | null;
  badgeType?: string;
  highlight?: boolean;
  action?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  currentRole,
  onSelectRole,
  duplicateCount,
  excessCount,
  isOpenMobile,
  onCloseMobile,
  onOpenDemoGuide,
  onOpenRegister,
}) => {
  const { theme, toggleTheme } = useTheme();

  // Role-specific navigation items so each user has their dedicated view & flow
  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case 'college_admin':
        return [
          {
            id: 'institutions',
            label: 'College Dashboard',
            icon: Building2,
            badge: excessCount > 0 ? `${excessCount} alert` : null,
            badgeType: 'amber',
          },
          {
            id: 'register',
            label: 'Register New Student',
            icon: UserPlus,
            badge: 'Form',
            badgeType: 'blue',
            action: () => {
              if (onOpenRegister) onOpenRegister();
              else onSelectView('students');
            },
          },
          {
            id: 'students',
            label: 'Admitted Students Roster',
            icon: Users,
            badge: null,
          },
          {
            id: 'validation',
            label: 'APAAR Format Checker',
            icon: ShieldCheck,
            badge: 'Live',
            badgeType: 'emerald',
          },
          {
            id: 'monitoring',
            label: 'Intake Capacity Tracker',
            icon: BarChart3,
            badge: null,
          },
          {
            id: 'workflow',
            label: 'Admission Workflow Flow',
            icon: Layers,
            badge: '6 Steps',
            badgeType: 'slate',
          },
        ];

      case 'student':
        return [
          {
            id: 'student',
            label: 'My APAAR Digital ID',
            icon: GraduationCap,
            badge: 'Active Pass',
            badgeType: 'emerald',
          },
          {
            id: 'institutions',
            label: 'Approved Institutions',
            icon: Building2,
            badge: 'All Colleges',
            badgeType: 'blue',
          },
          {
            id: 'monitoring',
            label: 'Seat & Intake Matrix',
            icon: BarChart3,
            badge: 'Capacities',
            badgeType: 'slate',
          },
          {
            id: 'verification',
            label: 'Public Credential Check',
            icon: Search,
            badge: 'QR Authenticated',
            badgeType: 'blue',
          },
          {
            id: 'workflow',
            label: 'How APAAR Works',
            icon: Layers,
            badge: 'Guide',
            badgeType: 'slate',
          },
        ];

      case 'verifier':
        return [
          {
            id: 'verification',
            label: 'Verify Student Record',
            icon: Search,
            badge: 'Live Search',
            badgeType: 'emerald',
          },
          {
            id: 'institutions',
            label: 'Institutions Directory',
            icon: Building2,
            badge: 'All Colleges',
            badgeType: 'blue',
          },
          {
            id: 'monitoring',
            label: 'Admission Monitoring',
            icon: BarChart3,
            badge: 'Capacities',
            badgeType: 'slate',
          },
          {
            id: 'workflow',
            label: 'Verification Architecture',
            icon: Layers,
            badge: 'Protocol',
            badgeType: 'slate',
          },
        ];

      case 'aicte_admin':
      default:
        return [
          {
            id: 'overview',
            label: 'National Apex Overview',
            icon: LayoutDashboard,
            badge: null,
          },
          {
            id: 'monitoring',
            label: 'Admission Monitoring',
            icon: BarChart3,
            badge: excessCount > 0 ? `+${excessCount} excess` : null,
            badgeType: 'amber',
          },
          {
            id: 'graph',
            label: 'Identity Graph',
            icon: GitGraph,
            badge: duplicateCount > 0 ? `${duplicateCount} flags` : 'Live',
            badgeType: 'purple',
            highlight: true,
          },
          {
            id: 'institutions',
            label: 'Institutions Directory',
            icon: Building2,
            badge: null,
          },
          {
            id: 'students',
            label: 'Central Student Registry',
            icon: Users,
            badge: null,
          },
          {
            id: 'validation',
            label: 'APAAR Rule Engine',
            icon: ShieldCheck,
            badge: 'Live',
            badgeType: 'blue',
          },
          {
            id: 'reports',
            label: 'Reports & Export Suite',
            icon: FileSpreadsheet,
            badge: 'CSV',
            badgeType: 'slate',
          },
          {
            id: 'workflow',
            label: 'Six-Stage National Flow',
            icon: Layers,
            badge: '6 Steps',
            badgeType: 'slate',
          },
        ];
    }
  };

  const navItems = getNavItems();

  const ROLES_LIST: { id: UserRole; title: string; subtitle: string; icon: any }[] = [
    { id: 'aicte_admin', title: 'AICTE Admin', subtitle: 'National Apex', icon: ShieldCheck },
    { id: 'college_admin', title: 'College Admin', subtitle: 'Admissions Desk', icon: Building2 },
    { id: 'student', title: 'Student', subtitle: 'Digital Pass', icon: GraduationCap },
    { id: 'verifier', title: 'Verifier', subtitle: 'Public Check', icon: Search },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col justify-between transition-all duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto flex-1">
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div
              onClick={() => {
                if (currentRole === 'student') onSelectView('student');
                else if (currentRole === 'verifier') onSelectView('verification');
                else if (currentRole === 'college_admin') onSelectView('institutions');
                else onSelectView('overview');
                onCloseMobile();
              }}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                  APAAR <span className="text-blue-600 dark:text-blue-400">NEXUS</span>
                </span>
                <span className="ml-1.5 px-1 py-0.2 rounded text-[9px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
                  AICTE
                </span>
              </div>
            </div>
          </div>

          {/* User Persona Switcher Section */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Active User View
              </span>
              <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400">
                Click to switch
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {ROLES_LIST.map((r) => {
                const isSelected = currentRole === r.id;
                const IconComponent = r.icon;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      onSelectRole(r.id);
                      if (r.id === 'student') onSelectView('student');
                      else if (r.id === 'verifier') onSelectView('verification');
                      else if (r.id === 'college_admin') onSelectView('institutions');
                      else onSelectView('overview');
                    }}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-750'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <IconComponent
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                        }`}
                      />
                      <span className="text-[11px] font-bold truncate">{r.title}</span>
                    </div>
                    <div
                      className={`text-[9px] truncate ${
                        isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {r.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>{currentRole.replace('_', ' ')} modules</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500">Dedicated</span>
            </div>

            {navItems.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      onSelectView(item.id);
                    }
                    onCloseMobile();
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold shadow-2xs border border-blue-100/80 dark:border-blue-900/40'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold shrink-0 ${
                        item.badgeType === 'purple'
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/40'
                          : item.badgeType === 'amber'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40'
                          : item.badgeType === 'emerald'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40'
                          : item.badgeType === 'blue'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
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

        {/* Bottom Card / System Tour Banner & Theme switch */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {/* Quick theme pill for accessibility */}
          <div className="px-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-medium flex items-center gap-1.5">
              {theme === 'dark' ? (
                <Moon className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
            </span>
            <button
              onClick={toggleTheme}
              className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Toggle
            </button>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 dark:from-slate-800 dark:to-slate-950 text-white shadow-xs border border-slate-800 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Interactive System Tour
            </div>
            <p className="text-[10px] text-slate-300 mt-1 leading-snug">
              Explore how APAAR NEXUS protects admissions and prevents duplicate enrolments step-by-step.
            </p>
            <button
              onClick={onOpenDemoGuide}
              className="mt-2.5 w-full py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-[11px] font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Launch System Tour</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="px-3 py-0.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              System Online
            </span>
            <span className="font-mono">v2.4-Official</span>
          </div>
        </div>
      </aside>
    </>
  );
};
