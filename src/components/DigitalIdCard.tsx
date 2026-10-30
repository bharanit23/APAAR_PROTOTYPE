import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Student } from '../types';
import { ShieldCheck, AlertCircle, Award, CheckCircle2, Download, Printer } from 'lucide-react';

interface DigitalIdCardProps {
  student: Student;
  onVerifyClick?: () => void;
  showActions?: boolean;
}

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({
  student,
  showActions = true,
}) => {
  const isVerified = student.status === 'VERIFIED';
  const isDuplicate = student.status === 'FLAGGED_DUPLICATE';
  const isExcess = student.status === 'EXCESS_ADMISSION';

  const verificationUrl = `${window.location.origin}/?verify=${encodeURIComponent(student.apaarId.replace(/\s+/g, ''))}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Card Body */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg relative">
        {/* Top Header Strip */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-[10px] font-semibold tracking-widest uppercase text-blue-200">
                  AICTE • Ministry of Education
                </div>
                <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  APAAR DIGITAL STUDENT PASS
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                VERIFIED PASS
              </span>
            </div>
          </div>
        </div>

        {/* Status Ribbon if flagged */}
        {isDuplicate && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border-y border-rose-200 dark:border-rose-900/60 px-4 py-2 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Dual Enrolment Flagged: Audit Required</span>
          </div>
        )}
        {isExcess && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border-y border-amber-200 dark:border-amber-900/60 px-4 py-2 flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Excess Admission: Admitted beyond approved intake limit</span>
          </div>
        )}

        {/* Card Main Content */}
        <div className="p-5">
          {/* Avatar & APAAR ID */}
          <div className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-xl flex items-center justify-center shadow-inner shrink-0 border-2 border-white dark:border-slate-700 shadow-slate-200 dark:shadow-none">
              {student.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                APAAR ID (One Nation One ID)
              </div>
              <div className="text-base sm:text-lg font-mono font-bold text-slate-900 dark:text-slate-100 tracking-wider break-all">
                {student.apaarId}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                {student.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Reg: {student.registrationNo}
              </div>
            </div>
          </div>

          {/* Academic Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 py-4 text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block font-medium">Institution</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold leading-tight line-clamp-2">
                {student.institutionName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block font-medium">Program / Branch</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold leading-tight line-clamp-2">
                {student.course}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block font-medium">Academic Year</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{student.academicYear}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block font-medium">Category</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {student.admissionCategory}
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block font-medium">Admission Date</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{student.admissionDate}</span>
            </div>
            {student.bloodGroup && (
              <div>
                <span className="text-slate-400 dark:text-slate-500 block font-medium">Blood Group</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{student.bloodGroup}</span>
              </div>
            )}
          </div>

          {/* QR Code & Digital Verification Stamp */}
          <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-2xs shrink-0">
                <QRCodeSVG
                  value={verificationUrl}
                  size={52}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  {isVerified ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Verified Record</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>{student.status.replace('_', ' ')}</span>
                    </>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Scan QR for live verification
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60 dark:border-slate-700/60 w-full sm:w-auto">
              <div className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                REGISTRY STAMP
              </div>
              <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                AICTE-NEXUS-2024
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security Band */}
        <div className="bg-slate-100/90 dark:bg-slate-800/80 px-4 py-2 border-t border-slate-200/80 dark:border-slate-750 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            National Academic Depository (NAD) Compatible
          </span>
          <span className="font-mono">SEC-ID: {student.id.slice(-6).toUpperCase()}</span>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-3 mt-4 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            Print ID Card
          </button>
          <button
            onClick={() => {
              const text = `APAAR ID: ${student.apaarId}\nName: ${student.name}\nCollege: ${student.institutionName}\nCourse: ${student.course}\nStatus: ${student.status}`;
              const blob = new Blob([text], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `APAAR_${student.registrationNo}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            Download Summary
          </button>
        </div>
      )}
    </div>
  );
};
