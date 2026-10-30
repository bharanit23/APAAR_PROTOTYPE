import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Student,
  Institution,
  UserRole,
  IntakeConfig,
  ComplianceAlert,
} from './types';
import {
  loadStoredStudents,
  saveStoredStudents,
  loadStoredInstitutions,
  saveStoredInstitutions,
  loadStoredAlerts,
  saveStoredAlerts,
  loadStoredIntakeConfig,
  saveStoredIntakeConfig,
  resetAllDataToDefault,
  findDuplicateClusters,
  calculateInstitutionIntake,
  DEFAULT_INTAKE_CONFIG,
} from './services/storage';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { AicteDashboard } from './components/AicteDashboard';
import { CollegeDashboard } from './components/CollegeDashboard';
import { StudentRecordsView } from './components/StudentRecordsView';
import { ApaarValidationView } from './components/ApaarValidationView';
import { IdentityGraphView } from './components/IdentityGraphView';
import { AdmissionMonitoringView } from './components/AdmissionMonitoringView';
import { WorkflowView } from './components/WorkflowView';
import { VerificationView } from './components/VerificationView';
import { ReportsView } from './components/ReportsView';
import { StudentPortalView } from './components/StudentPortalView';
import { StudentRegistrationModal } from './components/StudentRegistrationModal';
import { EditStudentModal } from './components/EditStudentModal';
import { DemoScenariosModal } from './components/DemoScenariosModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { INSTITUTION_SIMULATED_TOTALS } from './data/mockData';
import {
  CheckCircle2,
  AlertTriangle,
  X,
  Info,
  ShieldCheck,
  Building2,
  GraduationCap,
  Search,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => loadStoredStudents());
  const [institutions, setInstitutions] = useState<Institution[]>(() => loadStoredInstitutions());
  const [alerts, setAlerts] = useState<ComplianceAlert[]>(() => loadStoredAlerts());
  const [intakeConfig, setIntakeConfig] = useState<IntakeConfig>(() => loadStoredIntakeConfig());

  // Navigation & Role State
  const [currentView, setCurrentView] = useState<string>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>('aicte_admin');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('inst-2'); // COEP Pune (120 approved vs 129 actual)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Modals State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [inspectedStudent, setInspectedStudent] = useState<Student | null>(null);
  const [verifierQuery, setVerifierQuery] = useState<string>('');

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // Persistence effects
  useEffect(() => {
    saveStoredStudents(students);
  }, [students]);

  useEffect(() => {
    saveStoredInstitutions(institutions);
  }, [institutions]);

  useEffect(() => {
    saveStoredAlerts(alerts);
  }, [alerts]);

  useEffect(() => {
    saveStoredIntakeConfig(intakeConfig);
  }, [intakeConfig]);

  // URL QR Scan Check: ?verify=XXXX
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verifyParam = urlParams.get('verify');
    if (verifyParam) {
      setCurrentRole('verifier');
      setCurrentView('verification');
      setVerifierQuery(verifyParam);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Add new student
  const handleRegisterStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);

    if (newStudent.status === 'VERIFIED') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      showToast(`Student "${newStudent.name}" verified & submitted to central AICTE registry!`, 'success');
    } else if (newStudent.status === 'FLAGGED_DUPLICATE') {
      showToast(`Alert: APAAR collision detected across institutions! Flagged for audit.`, 'warning');
    } else if (newStudent.status === 'EXCESS_ADMISSION') {
      showToast(`Warning: Institution has exceeded approved intake. Record marked as Excess Admission.`, 'warning');
    } else {
      showToast(`Student record registered.`, 'info');
    }
  };

  // Edit existing student
  const handleSaveEditedStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    showToast(`Student record for "${updatedStudent.name}" updated successfully.`, 'success');
  };

  // Delete student
  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast('Student record removed from registry.', 'info');
  };

  // Update intake config
  const handleUpdateIntakeConfig = (newConfig: IntakeConfig) => {
    setIntakeConfig(newConfig);
    showToast('Intake calculation settings updated.', 'info');
  };

  // Reset sandbox data
  const handleResetData = () => {
    const fresh = resetAllDataToDefault();
    setStudents(fresh.students);
    setInstitutions(fresh.institutions);
    setAlerts(fresh.alerts);
    setIntakeConfig(fresh.config);
    setSelectedCollegeId('inst-2');
    showToast('Prototype state and sample records restored to pristine seed.', 'info');
  };

  // Scenario Runner for Guided System Tour
  const handleRunScenario = (scenario: 'clean' | 'duplicate' | 'excess' | 'verify') => {
    setIsDemoGuideOpen(false);

    if (scenario === 'clean') {
      setCurrentRole('college_admin');
      setCurrentView('students');
      setSelectedCollegeId('inst-1'); // DTU has room
      setIsRegisterOpen(true);
      showToast('Click "Clean Admission" to autofill and test valid APAAR registration.', 'info');
    } else if (scenario === 'duplicate') {
      setCurrentRole('aicte_admin');
      setCurrentView('graph');
      showToast('Opening Cross-Institution Student Identity Graph highlighting dual admission collision.', 'warning');
    } else if (scenario === 'excess') {
      setCurrentRole('aicte_admin');
      setCurrentView('monitoring');
      setSelectedCollegeId('inst-2'); // COEP Pune: 120 approved vs 129 actual
      showToast('Showing COEP Pune: 120 approved intake vs 129 actual admissions (+9 excess, 107.5%).', 'warning');
    } else if (scenario === 'verify') {
      setCurrentRole('verifier');
      setCurrentView('verification');
      setVerifierQuery('9842 1209 4431');
      showToast('Loaded instant public verification for student Priya Sundaram with live QR pass.', 'success');
    }
  };

  // Change Role helper with view redirection
  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'college_admin') {
      setCurrentView('institutions');
    } else if (role === 'student') {
      setCurrentView('student');
    } else if (role === 'verifier') {
      setCurrentView('verification');
    } else {
      setCurrentView('overview');
    }
  };

  // Metrics
  const duplicateClusters = findDuplicateClusters(students);
  const institutionStats = institutions.map((i) =>
    calculateInstitutionIntake(i, students, intakeConfig)
  );
  const excessInstitutions = institutionStats.filter((i) => i.isExcess);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
        duplicateCount={duplicateClusters.length}
        excessCount={excessInstitutions.length}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Main Layout Area offset by Sidebar (w-64 on lg) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <TopNav
          currentRole={currentRole}
          onSelectRole={handleSelectRole}
          currentView={currentView}
          onSelectView={(v) => setCurrentView(v)}
          alerts={alerts}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onResetData={handleResetData}
          onGlobalSearch={(term) => setVerifierQuery(term)}
        />

        {/* Toast Alert */}
        {toast && (
          <div className="px-4 sm:px-6 pt-4">
            <div
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-150 ${
                toast.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                  : toast.type === 'warning'
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-200'
                  : 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200'
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : toast.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                ) : (
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                )}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => setToast(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Beginner-friendly 4-Step Flow Banner */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 shadow-2xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  End-to-End System Flow
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                  How APAAR ID connects colleges, AICTE, students, and verifiers
                </span>
              </div>

              {/* Quick Persona Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Role View:</span>
                {[
                  { id: 'aicte_admin', label: 'AICTE Admin', icon: ShieldCheck },
                  { id: 'college_admin', label: 'College Admin', icon: Building2 },
                  { id: 'student', label: 'Student', icon: GraduationCap },
                  { id: 'verifier', label: 'Verifier', icon: Search },
                ].map((r) => {
                  const isActive = currentRole === r.id;
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleSelectRole(r.id as UserRole)}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1 shrink-0 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4 Interactive Flow Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2.5 text-xs">
              <button
                onClick={() => {
                  setCurrentRole('college_admin');
                  setCurrentView('institutions');
                  setIsRegisterOpen(true);
                }}
                className="p-2.5 rounded-xl text-left border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-0.5">
                  <span>STEP 1 • COLLEGE</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px] leading-tight">
                  Enrol with APAAR ID
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                  College enters student details & 12-digit APAAR.
                </div>
              </button>

              <button
                onClick={() => {
                  setCurrentRole('college_admin');
                  setCurrentView('validation');
                }}
                className="p-2.5 rounded-xl text-left border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-0.5">
                  <span>STEP 2 • ENGINE</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px] leading-tight">
                  Format & Cap Validation
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                  Instant Luhn format check & college intake ceiling check.
                </div>
              </button>

              <button
                onClick={() => {
                  setCurrentRole('aicte_admin');
                  setCurrentView('graph');
                }}
                className="p-2.5 rounded-xl text-left border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-0.5">
                  <span>STEP 3 • AICTE APEX</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px] leading-tight">
                  Cross-College Identity Scan
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                  Detects dual enrolments & ghost students across India.
                </div>
              </button>

              <button
                onClick={() => {
                  setCurrentRole('student');
                  setCurrentView('student');
                }}
                className="p-2.5 rounded-xl text-left border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-0.5">
                  <span>STEP 4 • CREDENTIAL</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px] leading-tight">
                  Digital Pass & QR Verify
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                  Student receives APAAR pass; public verifiers scan QR.
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* View Router */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* 1. Overview (AICTE Apex Dashboard) */}
          {currentView === 'overview' && (
            <AicteDashboard
              institutions={institutions}
              students={students}
              onSelectInstitution={(instId) => {
                setSelectedCollegeId(instId);
                setCurrentView('institutions');
              }}
              onNavigateToModule={(v) => setCurrentView(v)}
              onViewDuplicates={() => setCurrentView('graph')}
              onViewReports={() => setCurrentView('reports')}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />
          )}

          {/* 2. Institutions Dashboard */}
          {currentView === 'institutions' && (
            <CollegeDashboard
              institutions={institutions}
              selectedInstitutionId={selectedCollegeId}
              onSelectInstitution={setSelectedCollegeId}
              students={students}
              onOpenRegister={() => setIsRegisterOpen(true)}
              onViewStudent={(s) => setInspectedStudent(s)}
              onDeleteStudent={handleDeleteStudent}
              currentRole={currentRole}
            />
          )}

          {/* 3. Student Records */}
          {currentView === 'students' && (
            <StudentRecordsView
              students={students}
              institutions={institutions}
              onOpenRegister={() => setIsRegisterOpen(true)}
              onViewStudent={(s) => setInspectedStudent(s)}
              onEditStudent={(s) => setEditingStudent(s)}
              onDeleteStudent={handleDeleteStudent}
            />
          )}

          {/* 4. APAAR Validation */}
          {currentView === 'validation' && (
            <ApaarValidationView
              students={students}
              institutions={institutions}
              onOpenRegister={() => setIsRegisterOpen(true)}
              onViewStudent={(s) => setInspectedStudent(s)}
            />
          )}

          {/* 5. Cross-Institution Student Identity Graph */}
          {currentView === 'graph' && (
            <IdentityGraphView
              students={students}
              institutions={institutions}
              onViewStudent={(s) => setInspectedStudent(s)}
            />
          )}

          {/* 6. Admission Monitoring */}
          {currentView === 'monitoring' && (
            <AdmissionMonitoringView
              institutions={institutions}
              students={students}
              intakeConfig={intakeConfig}
              onUpdateIntakeConfig={handleUpdateIntakeConfig}
              onSelectInstitution={(instId) => {
                setSelectedCollegeId(instId);
                setCurrentView('institutions');
              }}
            />
          )}

          {/* 7. Six-Stage Overall Workflow */}
          {currentView === 'workflow' && (
            <WorkflowView
              onNavigateToStage={(stageView) => setCurrentView(stageView)}
            />
          )}

          {/* 8. Authorized Verification */}
          {currentView === 'verification' && (
            <VerificationView
              students={students}
              initialSearchQuery={verifierQuery}
            />
          )}

          {/* 9. Reports & CSV */}
          {currentView === 'reports' && (
            <ReportsView institutions={institutions} students={students} />
          )}

          {/* 10. Student Self-Service Portal (Dedicated View for Students) */}
          {currentView === 'student' && (
            <StudentPortalView
              students={students}
              institutions={institutions}
              onSelectInstitution={(instId) => {
                setSelectedCollegeId(instId);
                setCurrentView('institutions');
              }}
              onNavigateToInstitutions={() => setCurrentView('institutions')}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 py-5 px-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">APAAR NEXUS</span>
              <span>—</span>
              <span>Centralized AICTE Student Registry & Identity Verification Platform</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500">
              <span>One Nation One Student ID</span>
              <span>•</span>
              <button
                onClick={() => setIsDemoGuideOpen(true)}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
              >
                Launch System Tour
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Registration Modal */}
      <StudentRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        institutions={institutions}
        currentInstitutionId={selectedCollegeId}
        existingStudents={students}
        onRegisterStudent={handleRegisterStudent}
        simulatedIntakeTotals={INSTITUTION_SIMULATED_TOTALS}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        isOpen={!!editingStudent}
        student={editingStudent}
        institutions={institutions}
        onClose={() => setEditingStudent(null)}
        onSaveStudent={handleSaveEditedStudent}
      />

      {/* Demo Scenarios Modal */}
      <DemoScenariosModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onRunScenario={handleRunScenario}
      />

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={inspectedStudent}
        onClose={() => setInspectedStudent(null)}
        onVerifyInPortal={(apaarId) => {
          setVerifierQuery(apaarId);
          setCurrentView('verification');
        }}
      />
    </div>
  );
}
