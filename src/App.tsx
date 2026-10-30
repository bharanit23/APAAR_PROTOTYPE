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
    showToast('Prototype state and sample records restored to pristine demo seed.', 'info');
  };

  // Scenario Runner for Demonstrations
  const handleRunScenario = (scenario: 'clean' | 'duplicate' | 'excess' | 'verify') => {
    setIsDemoGuideOpen(false);

    if (scenario === 'clean') {
      setCurrentRole('college_admin');
      setCurrentView('students');
      setSelectedCollegeId('inst-1'); // DTU has room
      setIsRegisterOpen(true);
      showToast('Click "Clean Admission" to fast-fill and demonstrate valid APAAR registration.', 'info');
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

  // Metrics
  const duplicateClusters = findDuplicateClusters(students);
  const institutionStats = institutions.map((i) =>
    calculateInstitutionIntake(i, students, intakeConfig)
  );
  const excessInstitutions = institutionStats.filter((i) => i.isExcess);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        duplicateCount={duplicateClusters.length}
        excessCount={excessInstitutions.length}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
      />

      {/* Main Layout Area offset by Sidebar (w-64 on lg) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <TopNav
          currentRole={currentRole}
          onSelectRole={(r) => {
            setCurrentRole(r);
            if (r === 'college_admin') setCurrentView('institutions');
            else if (r === 'verifier') setCurrentView('verification');
            else if (r === 'student') setCurrentView('verification');
            else setCurrentView('overview');
          }}
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
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : toast.type === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : toast.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                ) : (
                  <Info className="w-5 h-5 text-blue-600 shrink-0" />
                )}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => setToast(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
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

          {/* 5. Cross-Institution Student Identity Graph (Novel Feature) */}
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
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/80 py-5 px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">APAAR NEXUS</span>
              <span>—</span>
              <span>Centralized AICTE Student Registry & Identity Graph (SIH 2026 Prototype)</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>One Nation One Student ID</span>
              <span>•</span>
              <button
                onClick={() => setIsDemoGuideOpen(true)}
                className="text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                Launch Demo Walkthrough
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
