import React from 'react';
import { Student } from '../types';
import { DigitalIdCard } from './DigitalIdCard';
import { X, CheckCircle2, AlertTriangle, ShieldAlert, Building2 } from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onVerifyInPortal?: (apaarId: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onVerifyInPortal,
}) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              AICTE Student Record
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {student.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh] flex flex-col items-center">
          <DigitalIdCard student={student} showActions={true} />

          {/* Audit Trail Note */}
          {student.flagReason && (
            <div className="mt-5 w-full max-w-md p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <span className="font-bold block mb-1">
                Administrative Audit Flag:
              </span>
              <p>{student.flagReason}</p>
            </div>
          )}

          {onVerifyInPortal && (
            <div className="mt-4">
              <button
                onClick={() => {
                  onVerifyInPortal(student.apaarId);
                  onClose();
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
              >
                Open in Public Verification Portal →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
