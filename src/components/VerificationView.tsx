import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { DigitalIdCard } from './DigitalIdCard';
import { cleanApaarId, normalizeApaarId } from '../services/validation';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Sparkles,
  HelpCircle,
  FileCheck2,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface VerificationViewProps {
  students: Student[];
  initialSearchQuery?: string;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  students,
  initialSearchQuery = '',
}) => {
  const [query, setQuery] = useState(initialSearchQuery);
  const [searchedRecord, setSearchedRecord] = useState<Student | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showQrSimulator, setShowQrSimulator] = useState(false);

  // Sync initial search if passed (e.g. from URL parameter or card click)
  useEffect(() => {
    if (initialSearchQuery) {
      setQuery(initialSearchQuery);
      performSearch(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const performSearch = (searchTerm: string) => {
    const cleaned = cleanApaarId(searchTerm).toLowerCase();
    if (!cleaned) {
      setSearchedRecord(null);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    const match = students.find((s) => {
      const matchApaar = cleanApaarId(s.apaarId).toLowerCase() === cleaned;
      const matchReg = s.registrationNo.toLowerCase() === cleaned;
      const partialName = s.name.toLowerCase().includes(cleaned);
      return matchApaar || matchReg || partialName;
    });

    setSearchedRecord(match || null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleQuickSample = (sampleApaar: string) => {
    setQuery(sampleApaar);
    performSearch(sampleApaar);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs text-center transition-colors">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-3 border border-blue-100 dark:border-blue-900/40">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          AICTE APAAR National Record Verification Portal
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto mt-1">
          Public and employer verification engine to confirm student academic credentials, admission validity, and institutional affiliation across India.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="mt-6 max-w-xl mx-auto">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter 12-digit APAAR ID (e.g. 9842 1209 4431) or Reg No..."
              className="w-full pl-11 pr-28 py-3 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-sans"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Verify
            </button>
          </div>
        </form>

        {/* Quick Sample Selector */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Quick Try Samples:
          </span>
          <button
            onClick={() => handleQuickSample('9842 1209 4431')}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 text-xs transition-colors cursor-pointer"
          >
            ✓ Priya Sundaram (Verified)
          </button>
          <button
            onClick={() => handleQuickSample('7341 9023 8812')}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 text-xs transition-colors cursor-pointer"
          >
            ⚠ Arjun Sharma (Dual Enrolment Flag)
          </button>
          <button
            onClick={() => handleQuickSample('4910 2938 4710')}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 text-xs transition-colors cursor-pointer"
          >
            ⚠ Devendra Joshi (Excess Intake)
          </button>
        </div>
      </div>

      {/* Verification Results Panel */}
      {hasSearched && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
          {searchedRecord ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
              {/* Result Banner */}
              <div
                className={`p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                  searchedRecord.status === 'VERIFIED'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : searchedRecord.status === 'FLAGGED_DUPLICATE'
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    : searchedRecord.status === 'EXCESS_ADMISSION'
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {searchedRecord.status === 'VERIFIED' ? (
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : searchedRecord.status === 'FLAGGED_DUPLICATE' ? (
                    <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">
                      {searchedRecord.status === 'VERIFIED'
                        ? 'AUTHENTIC RECORD VERIFIED'
                        : searchedRecord.status === 'FLAGGED_DUPLICATE'
                        ? 'POTENTIAL DUPLICATE ADMISSION FLAGGED'
                        : searchedRecord.status.replace('_', ' ')}
                    </div>
                    <div className="text-xs opacity-90 mt-0.5">
                      Registry match found for APAAR ID: <span className="font-mono font-bold">{searchedRecord.apaarId}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs font-mono font-medium opacity-80">
                  Verification Code: AICTE-CHK-{searchedRecord.id.slice(-6).toUpperCase()}
                </div>
              </div>

              {/* Detailed Breakdown & Card Side-by-Side */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Left 6 cols: Official Data Details */}
                <div className="md:col-span-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Registered Academic Credential
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Student Full Name:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{searchedRecord.name}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">APAAR ID:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{searchedRecord.apaarId}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Registration / Roll No:</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{searchedRecord.registrationNo}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Affiliated Institution:</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-right max-w-[200px]">
                        {searchedRecord.institutionName}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Department / Course:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-right max-w-[200px]">
                        {searchedRecord.course}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Academic Year:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{searchedRecord.academicYear}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Admission Category:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300">
                        {searchedRecord.admissionCategory}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Admission Date:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{searchedRecord.admissionDate}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Registry Status:</span>
                      <span
                        className={`font-bold ${
                          searchedRecord.status === 'VERIFIED'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : searchedRecord.status === 'FLAGGED_DUPLICATE'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {searchedRecord.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {searchedRecord.flagReason && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                        Audit Note:
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">{searchedRecord.flagReason}</span>
                    </div>
                  )}
                </div>

                {/* Right 6 cols: Digital ID Card Preview with live QR */}
                <div className="md:col-span-6 flex justify-center">
                  <DigitalIdCard student={searchedRecord} showActions={true} />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-8 text-center transition-colors">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                No Record Found in AICTE Registry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                The identifier <span className="font-mono font-bold text-slate-700 dark:text-slate-300">"{query}"</span> does not match any admitted student record in the centralized sample database.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
                Tip: Try one of the quick sample buttons above to test immediate validation.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Verification Instructions & Security Features Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-4 text-xs transition-colors">
        <div className="space-y-1">
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Tamper-Proof National ID
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            Every APAAR ID is a unique 12-digit permanent academic anchor mapped to the student's Academic Bank of Credits (ABC).
          </p>
        </div>

        <div className="space-y-1">
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Instant QR Verification
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            QR codes embedded on passes encode live cryptographic URL pointers to verify credentials in offline/online scenarios.
          </p>
        </div>

        <div className="space-y-1">
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Single Admission Integrity
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            Cross-institutional collision detection prevents a student from holding active regular seats in multiple engineering colleges.
          </p>
        </div>
      </div>
    </div>
  );
};
