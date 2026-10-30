import React, { useState } from 'react';
import { UserRole, ComplianceAlert } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  Menu,
  Search,
  Bell,
  ShieldCheck,
  Building2,
  GraduationCap,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
  Sun,
  Moon,
} from 'lucide-react';

interface TopNavProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  currentView: string;
  onSelectView: (view: string) => void;
  alerts: ComplianceAlert[];
  onOpenMobileSidebar: () => void;
  onResetData: () => void;
  onGlobalSearch: (term: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentRole,
  onSelectRole,
  currentView,
  onSelectView,
  alerts,
  onOpenMobileSidebar,
  onResetData,
  onGlobalSearch,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Breadcrumbs map
  const VIEW_TITLES: Record<string, { title: string; subtitle: string }> = {
    overview: { title: 'Executive Overview', subtitle: 'National AICTE Apex Dashboard' },
    institutions: { title: 'Institutions', subtitle: 'Approved College Profiles & Sanctioned Caps' },
    students: { title: 'Student Records', subtitle: 'Central Directory & Admission Rosters' },
    validation: { title: 'APAAR Validation', subtitle: 'Multi-Stage Format & Collision Engine' },
    graph: { title: 'Identity Graph', subtitle: 'Cross-Institution Student Relational Intelligence' },
    monitoring: { title: 'Admission Monitoring', subtitle: 'Approved Intake vs Enrolment Tracking' },
    workflow: { title: 'Six-Stage Workflow', subtitle: 'How APAAR NEXUS Works' },
    verification: { title: 'Authorized Verification', subtitle: 'Public Credential & QR Authenticator' },
    reports: { title: 'Reports & Analytics', subtitle: 'Institution Compliance & Export Suite' },
    student: { title: 'Student Self-Service', subtitle: 'Digital APAAR Pass & Credit Ledger' },
  };

  const currentMeta = VIEW_TITLES[currentView] || { title: 'Dashboard', subtitle: 'AICTE Student Registry' };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onGlobalSearch(searchTerm.trim());
      onSelectView('verification');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 transition-colors duration-200">
      {/* Left: Mobile hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            <span>APAAR NEXUS</span>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300 font-semibold">{currentMeta.title}</span>
          </div>
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
            {currentMeta.subtitle}
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-sm mx-6">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search APAAR ID, student, or college..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </form>

      {/* Right Controls: Theme Toggle, Notifications, Role Switcher, Reset */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative group flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-200 group-hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 transition-transform duration-200 group-hover:-rotate-12" />
          )}
          <span className="sr-only">Toggle Theme</span>
        </button>

        {/* Reset Sandbox Button */}
        <button
          onClick={onResetData}
          title="Reset to pristine sample data"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex items-center gap-1 text-xs cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium hidden md:inline">Reset</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 space-y-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Compliance & Audit Alerts
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-900/50">
                    {alerts.length}
                  </span>
                </div>
                <button
                  onClick={() => setIsAlertsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {alerts.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => {
                      onSelectView(alt.targetView);
                      setIsAlertsOpen(false);
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {alt.title}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                        {alt.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      {alt.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Demo Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {currentRole === 'aicte_admin'
                ? 'A'
                : currentRole === 'college_admin'
                ? 'C'
                : currentRole === 'student'
                ? 'S'
                : 'V'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[11px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {currentRole === 'aicte_admin'
                  ? 'AICTE Admin'
                  : currentRole === 'college_admin'
                  ? 'College Admin'
                  : currentRole === 'student'
                  ? 'Student'
                  : 'Authorized Verifier'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-2 space-y-1 z-50 animate-in fade-in">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                Switch User Persona:
              </div>

              {[
                { role: 'aicte_admin', label: 'AICTE Apex Admin', desc: 'National monitoring & compliance', icon: ShieldCheck },
                { role: 'college_admin', label: 'College Admin', desc: 'Admission register & intake caps', icon: Building2 },
                { role: 'student', label: 'Student Self-Service', desc: 'Digital APAAR Pass & ABC credits', icon: GraduationCap },
                { role: 'verifier', label: 'Authorized Verifier', desc: 'Public search & QR verification', icon: Search },
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => {
                    onSelectRole(item.role as UserRole);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left text-xs transition-colors cursor-pointer flex items-start gap-2.5 ${
                    currentRole === item.role
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900/50'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <item.icon className="w-4 h-4 mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="font-bold leading-tight">{item.label}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
