import React, { useState, useMemo } from 'react';
import { Student, Institution } from '../types';
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Building2,
  Download,
  GraduationCap,
} from 'lucide-react';

interface StudentRecordsViewProps {
  students: Student[];
  institutions: Institution[];
  onOpenRegister: () => void;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentRecordsView: React.FC<StudentRecordsViewProps> = ({
  students,
  institutions,
  onOpenRegister,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [instFilter, setInstFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.apaarId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.registrationNo.toLowerCase().includes(searchQuery.toLowerCase());

      const matchInst = instFilter === 'all' || s.institutionId === instFilter;
      const matchCat = categoryFilter === 'all' || s.admissionCategory === categoryFilter;
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;

      return matchSearch && matchInst && matchCat && matchStatus;
    });
  }, [students, searchQuery, instFilter, categoryFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
              Central Student Directory
            </span>
            <span className="text-slate-400 text-xs">• Verified Admission Rosters</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Registered Student Records ({students.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Search, inspect, and update student admission details linked with verified 12-digit APAAR identifiers.
          </p>
        </div>

        <button
          onClick={onOpenRegister}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Register Student
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, APAAR ID, or Reg No..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Institution Filter */}
            <select
              value={instFilter}
              onChange={(e) => setInstFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Institutions</option>
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.shortName}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Quotas</option>
              <option value="Regular">Regular</option>
              <option value="Supernumerary">Supernumerary</option>
              <option value="NRI">NRI</option>
              <option value="OCI">OCI</option>
              <option value="Foreign National">Foreign National</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="FLAGGED_DUPLICATE">Duplicate</option>
              <option value="EXCESS_ADMISSION">Excess Intake</option>
              <option value="REQUIRES_MANUAL_REVIEW">Manual Review</option>
              <option value="TRANSFERRED">Transferred</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">12-Digit APAAR ID</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Program / Branch</th>
                <th className="py-3 px-4">Reg No</th>
                <th className="py-3 px-4">Quota</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No matching student records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{s.name}</div>
                      <div className="text-[10px] text-slate-400">Adm: {s.admissionDate}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {s.apaarId}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="line-clamp-1 max-w-[160px]" title={s.institutionName}>
                        {s.institutionName}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="line-clamp-1 max-w-[140px]" title={s.course}>
                        {s.course}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {s.registrationNo}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                        {s.admissionCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {s.status === 'VERIFIED' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          VERIFIED
                        </span>
                      )}
                      {s.status === 'FLAGGED_DUPLICATE' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          DUPLICATE
                        </span>
                      )}
                      {s.status === 'EXCESS_ADMISSION' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          EXCESS
                        </span>
                      )}
                      {s.status === 'REQUIRES_MANUAL_REVIEW' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          REVIEW
                        </span>
                      )}
                      {s.status === 'TRANSFERRED' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          TRANSFERRED
                        </span>
                      )}
                      {s.status === 'PENDING' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewStudent(s)}
                          title="View Digital Pass & Verification"
                          className="p-1.5 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditStudent(s)}
                          title="Edit Student Record"
                          className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(s.id)}
                          title="Delete Record"
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
