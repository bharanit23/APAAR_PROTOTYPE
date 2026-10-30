import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Student,
  Institution,
  UserRole,
} from './types';
import {
  loadStoredStudents,
  saveStoredStudents,
  loadStoredInstitutions,
  saveStoredInstitutions,
  resetAllDataToDefault,
  findDuplicateClusters,
  calculateInstitutionIntake,
} from './services/storage';
import { Navbar } from './components/Navbar';
import { AicteDashboard } from './components/AicteDashboard';
import { CollegeDashboard } from './components/CollegeDashboard';
import { VerificationView } from './components/VerificationView';
import { StudentPortalView } from './components/StudentPortalView';
import { DuplicateDetectionView } from './components/DuplicateDetectionView';
import { ReportsView } from './components/ReportsView';
import { StudentRegistrationModal } from './components/StudentRegistrationModal';
import { DemoScenariosModal } from './components/DemoScenariosModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { INSTITUTION_SIMULATED_TOTALS } from './data/mockData';
import {
  CheckCircle2,
  AlertTriangle,
  X,
  Info,
  ShieldCheck,
} from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => loadStoredStudents());
  const [institutions, setInstitutions] = useState<Institution[]>(() => loadStoredInstitutions());

  const [currentRole, setCurrentRole] = useState<UserRole>('aicte_admin');
  const [currentView, setCurrentView] = useState<string>('aicte_dashboard');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('inst-2'); // default to COEP Pune to showcase intake monitoring immediately

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [inspectedStudent, setInspectedStudent] = useState<Student | null>(null);
  const [verifierQuery, setVerifierQuery] = useState<string>('');

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveStoredStudents(students);
  }, [students]);

  useEffect(() => {
    saveStoredInstitutions(institutions);
  }, [institutions]);

  // Check URL query parameters (e.g. from QR code scan ?verify=XXXX)
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
      showToast(`Student "${newStudent.name}" successfully registered & verified in AICTE Central Registry!`, 'success');
    } else if (newStudent.status === 'FLAGGED_DUPLICATE') {
      showToast(`Alert: Record registered but FLAGGED for Duplicate APAAR detection across colleges.`, 'warning');
    } else if (newStudent.status === 'EXCESS_ADMISSION') {
      showToast(`Warning: Student registered under EXCESS ADMISSION status due to college intake limit breach.`, 'warning');
    } else {
      showToast(`Student record submitted for verification.`, 'info');
    }
  };

  // Delete student
  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast('Student record removed from registry.', 'info');
  };

  // Resolve duplicate collision
  const handleResolveDuplicate = (apaarId: string, retainedId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.apaarId === apaarId) {
          if (s.id === retainedId) {
            return {
              ...s,
              status: 'VERIFIED',
              flagReason: 'Duplicate resolved: verified as the authorized admission.',
            };
          } else {
            return {
              ...s,
              status: 'INVALID_FORMAT',
              flagReason: 'Dual admission revoked following AICTE regulatory review.',
            };
          }
        }
        return s;
      })
    );
    showToast('Duplicate conflict resolved by administrator.', 'success');
  };

  // Reset data to seed defaults
  const handleResetData = () => {
    const fresh = resetAllDataToDefault();
    setStudents(fresh.students);
    setInstitutions(fresh.institutions);
    setSelectedCollegeId('inst-2');
    showToast('All student records and institutional quotas reset to default demo seed.', 'info');
  };

  // Scenario Runner
  const handleRunScenario = (scenario: 'clean' | 'duplicate' | 'excess' | 'verify') => {
    setIsDemoGuideOpen(false);

    if (scenario === 'clean') {
      setCurrentRole('college_admin');
      setCurrentView('college_dashboard');
      setSelectedCollegeId('inst-1'); // DTU has plenty of seats
      setIsRegisterOpen(true);
      showToast('Click "Clean Admission" in the top bar to fast-fill and submit a verified student.', 'info');
    } else if (scenario === 'duplicate') {
      setCurrentRole('aicte_admin');
      setCurrentView('duplicates');
      showToast('Showing potential duplicate APAAR IDs detected across multiple institutions.', 'warning');
    } else if (scenario === 'excess') {
      setCurrentRole('college_admin');
      setCurrentView('college_dashboard');
      setSelectedCollegeId('inst-2'); // COEP Pune: 120 approved vs 129 enrolled
      showToast('Showing COEP Pune: 120 approved intake vs 129 actual enrolment (+9 excess admissions).', 'warning');
    } else if (scenario === 'verify') {
      setCurrentRole('verifier');
      setCurrentView('verification');
      setVerifierQuery('9842 1209 4431');
      showToast('Loaded instant verification for student Priya Sundaram with live QR code.', 'success');
    }
  };

  // Duplicate count
  const duplicateClusters = findDuplicateClusters(students);
  const institutionStats = institutions.map((i) => calculateInstitutionIntake(i, students));
  const excessInstitutions = institutionStats.filter((i) => i.isExcess);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Navbar */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        currentView={currentView}
        onSelectView={setCurrentView}
        duplicateCount={duplicateClusters.length}
        excessCount={excessInstitutions.length}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Toast Alert */}
        {toast && (
          <div
            className={`mb-5 p-4 rounded-xl border flex items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-150 ${
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
        )}

        {/* View Switcher Router */}
        {currentView === 'aicte_dashboard' && (
          <AicteDashboard
            institutions={institutions}
            students={students}
            onSelectInstitution={(instId) => {
              setSelectedCollegeId(instId);
              setCurrentRole('college_admin');
              setCurrentView('college_dashboard');
            }}
            onViewDuplicates={() => setCurrentView('duplicates')}
            onViewReports={() => setCurrentView('reports')}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}

        {currentView === 'college_dashboard' && (
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

        {currentView === 'student_portal' && (
          <StudentPortalView students={students} />
        )}

        {currentView === 'verification' && (
          <VerificationView
            students={students}
            initialSearchQuery={verifierQuery}
          />
        )}

        {currentView === 'duplicates' && (
          <DuplicateDetectionView
            students={students}
            onResolveDuplicate={handleResolveDuplicate}
            onViewStudent={(s) => setInspectedStudent(s)}
          />
        )}

        {currentView === 'reports' && (
          <ReportsView institutions={institutions} students={students} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">APAAR NEXUS</span>
            <span>—</span>
            <span>All India Council for Technical Education (AICTE) Pilot</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>One Nation, One Student ID (APAAR)</span>
            <span>•</span>
            <span>Simulated Sandbox Environment</span>
            <span>•</span>
            <button
              onClick={() => setIsDemoGuideOpen(true)}
              className="text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Demo Walkthrough Guide
            </button>
          </div>
        </div>
      </footer>

      {/* Student Registration Modal */}
      <StudentRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        institutions={institutions}
        currentInstitutionId={selectedCollegeId}
        existingStudents={students}
        onRegisterStudent={handleRegisterStudent}
        simulatedIntakeTotals={INSTITUTION_SIMULATED_TOTALS}
      />

      {/* SIH Demo Walkthrough Modal */}
      <DemoScenariosModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onRunScenario={handleRunScenario}
      />

      {/* Student Detail / Digital Pass Inspection Modal */}
      <StudentDetailModal
        student={inspectedStudent}
        onClose={() => setInspectedStudent(null)}
        onVerifyInPortal={(apaarId) => {
          setVerifierQuery(apaarId);
          setCurrentRole('verifier');
          setCurrentView('verification');
        }}
      />
    </div>
  );
}
