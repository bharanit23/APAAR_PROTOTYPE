import React, { useState, useMemo } from 'react';
import { Student, Institution, GraphNode, GraphEdge } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  GitGraph,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Building2,
  GraduationCap,
  BookOpen,
  Info,
  Calendar,
  FileCheck2,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface IdentityGraphViewProps {
  students: Student[];
  institutions: Institution[];
  onViewStudent: (student: Student) => void;
}

export const IdentityGraphView: React.FC<IdentityGraphViewProps> = ({
  students,
  institutions,
  onViewStudent,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedScenario, setSelectedScenario] = useState<'all' | 'duplicate' | 'transfer' | 'unusual'>('all');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('std-arjun');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Graph Definition
  const { nodes, edges } = useMemo(() => {
    const rawNodes: GraphNode[] = [];
    const rawEdges: GraphEdge[] = [];

    // Institutions
    const instCoords: Record<string, { x: number; y: number }> = {
      'inst-1': { x: 120, y: 150 }, // DTU
      'inst-2': { x: 120, y: 390 }, // COEP
      'inst-3': { x: 120, y: 610 }, // NIT Trichy
      'inst-4': { x: 740, y: 180 }, // BIT Mesra
      'inst-5': { x: 740, y: 440 }, // RVCE
    };

    institutions.forEach((inst) => {
      const coord = instCoords[inst.id] || { x: 740, y: 600 };
      rawNodes.push({
        id: `node-inst-${inst.id}`,
        label: inst.shortName,
        sublabel: `${inst.city} • PID: ${inst.code.slice(-6)}`,
        type: 'institution',
        x: coord.x,
        y: coord.y,
        data: inst,
      });
    });

    // Student Clusters
    // 1. Arjun Sharma (Duplicate Overlap: DTU & BIT Mesra)
    rawNodes.push({
      id: 'std-arjun',
      label: 'Arjun Sharma',
      sublabel: 'APAAR: 7341 9023 8812',
      type: 'student',
      status: 'FLAGGED_DUPLICATE',
      flagged: true,
      x: 430,
      y: 160,
      data: {
        name: 'Arjun Sharma',
        apaarId: '7341 9023 8812',
        records: students.filter((s) => s.apaarId.includes('7341 9023 8812')),
        nature: 'Overlapping Duplicate',
        summary: 'Same APAAR ID enrolled concurrently in DTU New Delhi (CSE) and BIT Mesra (IT) for AY 2024-2025 without cancellation.',
      },
    });

    rawEdges.push({
      id: 'edge-arjun-dtu',
      source: 'std-arjun',
      target: 'node-inst-inst-1',
      type: 'duplicate_overlap',
      label: 'Concurrent Admission (DTU)',
      details: 'Active regular seat • 2024-DTU-CSE-014',
      isWarning: true,
    });

    rawEdges.push({
      id: 'edge-arjun-bitm',
      source: 'std-arjun',
      target: 'node-inst-inst-4',
      type: 'duplicate_overlap',
      label: 'Concurrent Admission (BIT Mesra)',
      details: 'Active regular seat • 2024-BITM-IT-089',
      isWarning: true,
    });

    // 2. Ananya Deshpande (Legitimate Transfer: COEP -> DTU)
    rawNodes.push({
      id: 'std-ananya',
      label: 'Ananya Deshpande',
      sublabel: 'APAAR: 5920 4819 3302',
      type: 'student',
      status: 'TRANSFERRED',
      x: 430,
      y: 330,
      data: {
        name: 'Ananya Deshpande',
        apaarId: '5920 4819 3302',
        records: students.filter((s) => s.apaarId.includes('5920 4819 3302')),
        nature: 'Legitimate Transfer',
        summary: 'Official inter-college migration from COEP Pune (2023) to DTU (2024) backed by AICTE NOC certificate AICTE/MIG/2024/7721.',
        migrationCert: 'AICTE/MIG/2024/7721',
      },
    });

    rawEdges.push({
      id: 'edge-ananya-coep',
      source: 'node-inst-inst-2',
      target: 'std-ananya',
      type: 'legitimate_transfer',
      label: 'Migrated Out (COEP Pune)',
      details: 'NOC Issued • 2023-COEP-CE-034',
    });

    rawEdges.push({
      id: 'edge-ananya-dtu',
      source: 'std-ananya',
      target: 'node-inst-inst-1',
      type: 'legitimate_transfer',
      label: 'Admitted via Transfer (DTU)',
      details: 'Credits Transferred • 2024-DTU-CSE-T04',
    });

    // 3. Vikramaditya Rao (Unusual Pattern: RVCE & DTU)
    rawNodes.push({
      id: 'std-vikram',
      label: 'Vikramaditya Rao',
      sublabel: 'APAAR: 2019 4820 1938',
      type: 'student',
      status: 'REQUIRES_MANUAL_REVIEW',
      x: 430,
      y: 490,
      data: {
        name: 'Vikramaditya Rao',
        apaarId: '2019 4820 1938',
        records: students.filter((s) => s.apaarId.includes('2019 4820 1938')),
        nature: 'Unusual Record Pattern',
        summary: 'Conflicting admission quota data (OCI Quota at RVCE vs Regular Quota at DTU) without formal migration document.',
      },
    });

    rawEdges.push({
      id: 'edge-vikram-rvce',
      source: 'std-vikram',
      target: 'node-inst-inst-5',
      type: 'unusual_pattern',
      label: 'OCI Quota (RVCE)',
      details: '2024-RVCE-AE-004 • Aerospace',
      isWarning: true,
    });

    rawEdges.push({
      id: 'edge-vikram-dtu',
      source: 'std-vikram',
      target: 'node-inst-inst-1',
      type: 'unusual_pattern',
      label: 'Regular Quota (DTU)',
      details: '2024-DTU-ECE-U88 • Electronics',
      isWarning: true,
    });

    // 4. Clean Student Node for contrast: Priya Sundaram
    rawNodes.push({
      id: 'std-priya',
      label: 'Priya Sundaram',
      sublabel: 'APAAR: 9842 1209 4431',
      type: 'student',
      status: 'VERIFIED',
      x: 430,
      y: 650,
      data: {
        name: 'Priya Sundaram',
        apaarId: '9842 1209 4431',
        records: students.filter((s) => s.apaarId.includes('9842 1209 4431')),
        nature: 'Regular',
        summary: 'Single authentic admission at DTU New Delhi. Complete compliance and zero cross-institutional collisions.',
      },
    });

    rawEdges.push({
      id: 'edge-priya-dtu',
      source: 'std-priya',
      target: 'node-inst-inst-1',
      type: 'enrolled',
      label: 'Regular Enrolment (DTU)',
      details: '2024-DTU-CSE-001 • Verified',
    });

    return { nodes: rawNodes, edges: rawEdges };
  }, [students, institutions]);

  // Filtering by Scenario
  const filteredEdges = useMemo(() => {
    return edges.filter((e) => {
      if (selectedScenario === 'duplicate') return e.type === 'duplicate_overlap';
      if (selectedScenario === 'transfer') return e.type === 'legitimate_transfer';
      if (selectedScenario === 'unusual') return e.type === 'unusual_pattern';
      return true;
    });
  }, [edges, selectedScenario]);

  const activeNodeIds = useMemo(() => {
    const ids = new Set<string>();
    filteredEdges.forEach((e) => {
      ids.add(e.source);
      ids.add(e.target);
    });
    return ids;
  }, [filteredEdges]);

  const filteredNodes = useMemo(() => {
    return nodes.filter((n) => {
      if (selectedScenario === 'all') return true;
      return activeNodeIds.has(n.id);
    });
  }, [nodes, selectedScenario, activeNodeIds]);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 uppercase tracking-wide">
              Relational Intelligence • Cross-College Discovery
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-xs">• Cross-Institution Identity Graph</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <GitGraph className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Cross-Institution Student Identity Graph
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            A visual relational intelligence network tracing individual 12-digit APAAR IDs across all AICTE institutions to distinguish between <strong>overlapping duplicate admissions</strong>, <strong>legitimate inter-college transfers</strong>, and <strong>unusual pattern anomalies</strong>.
          </p>
        </div>

        {/* Legend Pills */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] shrink-0 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block animate-pulse" />
            Duplicate Overlap
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            Legitimate Transfer
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
            Unusual Pattern
          </div>
        </div>
      </div>

      {/* Interactive Scenario Presets Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3 transition-colors">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Demonstration Scenarios:
          </span>

          <button
            onClick={() => {
              setSelectedScenario('all');
              setSelectedNodeId('std-arjun');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedScenario === 'all'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Relationships (Overview)
          </button>

          <button
            onClick={() => {
              setSelectedScenario('duplicate');
              setSelectedNodeId('std-arjun');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedScenario === 'duplicate'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Scenario 1: Duplicate Enrolment
          </button>

          <button
            onClick={() => {
              setSelectedScenario('transfer');
              setSelectedNodeId('std-ananya');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedScenario === 'transfer'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Scenario 2: Legitimate Transfer
          </button>

          <button
            onClick={() => {
              setSelectedScenario('unusual');
              setSelectedNodeId('std-vikram');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedScenario === 'unusual'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Scenario 3: Unusual Record Pattern
          </button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-[11px] px-1">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas & Details Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Graph Canvas: 8 cols */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden relative min-h-[580px] transition-colors">
          {/* Canvas Header Sub-Bar */}
          <div className="p-3 bg-slate-50/90 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Interactive Graph Canvas • Click any Student or College Node to inspect details
            </span>
            <span className="text-[10px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono text-slate-600 dark:text-slate-300">
              Nodes: {filteredNodes.length} | Connections: {filteredEdges.length}
            </span>
          </div>

          {/* SVG Graph Viewport */}
          <div className="overflow-auto max-h-[620px] p-4 flex justify-center bg-radial from-slate-50/50 to-white dark:from-slate-900 dark:to-slate-950">
            <svg
              width="880"
              height="740"
              viewBox="0 0 880 740"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
              className="transition-transform duration-150 select-none"
            >
              <defs>
                {/* Arrow markers */}
                <marker
                  id="arrow-transfer"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#059669" />
                </marker>
                <marker
                  id="arrow-duplicate"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#e11d48" />
                </marker>
                <marker
                  id="arrow-unusual"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#d97706" />
                </marker>
              </defs>

              {/* Background Graph Grid */}
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeWidth="1" />
              </pattern>
              <rect width="880" height="740" fill={isDark ? '#0b0f19' : 'url(#grid)'} />

              {/* Connecting Edges */}
              {filteredEdges.map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.source);
                const targetNode = nodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isDuplicate = edge.type === 'duplicate_overlap';
                const isTransfer = edge.type === 'legitimate_transfer';
                const isUnusual = edge.type === 'unusual_pattern';

                // Curved cubic Bezier path
                const dx = targetNode.x - sourceNode.x;
                const dy = targetNode.y - sourceNode.y;
                const cx1 = sourceNode.x + dx * 0.5;
                const cy1 = sourceNode.y;
                const cx2 = sourceNode.x + dx * 0.5;
                const cy2 = targetNode.y;

                const pathData = `M ${sourceNode.x} ${sourceNode.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${targetNode.x} ${targetNode.y}`;
                const midX = (sourceNode.x + targetNode.x) / 2;
                const midY = (sourceNode.y + targetNode.y) / 2;

                return (
                  <g key={edge.id} className="transition-all duration-300">
                    {/* Shadow halo line */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={
                        isDuplicate
                          ? isDark ? '#4c0519' : '#fecdd3'
                          : isTransfer
                          ? isDark ? '#064e3b' : '#a7f3d0'
                          : isUnusual
                          ? isDark ? '#451a03' : '#fde68a'
                          : isDark ? '#1e293b' : '#e2e8f0'
                      }
                      strokeWidth={isDuplicate || isTransfer || isUnusual ? 6 : 4}
                      strokeOpacity="0.8"
                    />

                    {/* Main stroke line */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={
                        isDuplicate
                          ? '#e11d48'
                          : isTransfer
                          ? '#059669'
                          : isUnusual
                          ? '#d97706'
                          : isDark ? '#475569' : '#94a3b8'
                      }
                      strokeWidth="2.5"
                      strokeDasharray={isDuplicate ? '5 4' : isUnusual ? '4 3' : 'none'}
                      markerEnd={
                        isTransfer
                          ? 'url(#arrow-transfer)'
                          : isDuplicate
                          ? 'url(#arrow-duplicate)'
                          : isUnusual
                          ? 'url(#arrow-unusual)'
                          : undefined
                      }
                    />

                    {/* Edge Label Pill */}
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-70"
                        y="-12"
                        width="140"
                        height="24"
                        rx="12"
                        fill={isDark ? '#1e293b' : '#ffffff'}
                        stroke={
                          isDuplicate
                            ? isDark ? '#9f1239' : '#fda4af'
                            : isTransfer
                            ? isDark ? '#065f46' : '#6ee7b7'
                            : isUnusual
                            ? isDark ? '#b45309' : '#fcd34d'
                            : isDark ? '#475569' : '#cbd5e1'
                        }
                        strokeWidth="1.5"
                        filter="drop-shadow(0 1px 2px rgb(0 0 0 / 0.15))"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill={
                          isDuplicate
                            ? isDark ? '#fca5a5' : '#9f1239'
                            : isTransfer
                            ? isDark ? '#6ee7b7' : '#065f46'
                            : isUnusual
                            ? isDark ? '#fde68a' : '#92400e'
                            : isDark ? '#cbd5e1' : '#475569'
                        }
                        fontSize="9.5"
                        fontWeight="600"
                      >
                        {edge.label}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Institution Nodes */}
              {filteredNodes
                .filter((n) => n.type === 'institution')
                .map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => setSelectedNodeId(node.id)}
                      className="cursor-pointer group"
                    >
                      {/* Selection ring */}
                      {isSelected && (
                        <rect
                          x="-105"
                          y="-35"
                          width="210"
                          height="70"
                          rx="16"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeDasharray="4 3"
                        />
                      )}

                      <rect
                        x="-100"
                        y="-30"
                        width="200"
                        height="60"
                        rx="12"
                        fill={isDark ? '#1e293b' : '#ffffff'}
                        stroke={isSelected ? '#3b82f6' : isDark ? '#334155' : '#cbd5e1'}
                        strokeWidth={isSelected ? 2 : 1.5}
                        filter="drop-shadow(0 4px 6px rgb(0 0 0 / 0.15))"
                        className="transition-all group-hover:stroke-blue-500"
                      />

                      {/* Institution Icon */}
                      <circle cx="-70" cy="0" r="16" fill={isDark ? '#1e3a8a' : '#eff6ff'} />
                      <text
                        x="-70"
                        y="5"
                        textAnchor="middle"
                        fontSize="14"
                        fill="#3b82f6"
                      >
                        🏛
                      </text>

                      {/* Label & Details */}
                      <text
                        x="-45"
                        y="-5"
                        fontSize="11.5"
                        fontWeight="700"
                        fill={isDark ? '#f8fafc' : '#0f172a'}
                      >
                        {node.label}
                      </text>
                      <text
                        x="-45"
                        y="12"
                        fontSize="9"
                        fill={isDark ? '#94a3b8' : '#64748b'}
                        fontWeight="500"
                      >
                        {node.sublabel}
                      </text>
                    </g>
                  );
                })}

              {/* Student Identity Nodes (Center Column) */}
              {filteredNodes
                .filter((n) => n.type === 'student')
                .map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const isDuplicate = node.status === 'FLAGGED_DUPLICATE';
                  const isTransfer = node.status === 'TRANSFERRED';
                  const isUnusual = node.status === 'REQUIRES_MANUAL_REVIEW';

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => setSelectedNodeId(node.id)}
                      className="cursor-pointer group"
                    >
                      {/* Pulse ring if flagged */}
                      {isDuplicate && (
                        <circle
                          cx="0"
                          cy="0"
                          r="34"
                          fill={isDark ? '#881337' : '#ffe4e6'}
                          opacity="0.6"
                          className="animate-ping"
                        />
                      )}

                      {/* Selection ring */}
                      {isSelected && (
                        <circle
                          cx="0"
                          cy="0"
                          r="34"
                          fill="none"
                          stroke={isDuplicate ? '#e11d48' : isTransfer ? '#059669' : '#3b82f6'}
                          strokeWidth="3"
                          strokeDasharray="4 3"
                        />
                      )}

                      {/* Main Node Bubble */}
                      <circle
                        cx="0"
                        cy="0"
                        r="26"
                        fill={
                          isDuplicate
                            ? isDark ? '#4c0519' : '#fff1f2'
                            : isTransfer
                            ? isDark ? '#064e3b' : '#ecfdf5'
                            : isUnusual
                            ? isDark ? '#451a03' : '#fffbeb'
                            : isDark ? '#1e293b' : '#eff6ff'
                        }
                        stroke={
                          isDuplicate
                            ? '#e11d48'
                            : isTransfer
                            ? '#059669'
                            : isUnusual
                            ? '#d97706'
                            : '#3b82f6'
                        }
                        strokeWidth="2.5"
                        filter="drop-shadow(0 2px 4px rgb(0 0 0 / 0.15))"
                      />

                      {/* Student Emoji/Avatar */}
                      <text
                        x="0"
                        y="6"
                        textAnchor="middle"
                        fontSize="16"
                      >
                        {isDuplicate ? '⚠️' : isTransfer ? '🔄' : isUnusual ? '❓' : '🎓'}
                      </text>

                      {/* Student Name Header Below Node */}
                      <rect
                        x="-80"
                        y="34"
                        width="160"
                        height="26"
                        rx="6"
                        fill={isDark ? '#1e293b' : '#ffffff'}
                        stroke={isDark ? '#334155' : '#e2e8f0'}
                        strokeWidth="1"
                        filter="drop-shadow(0 1px 2px rgb(0 0 0 / 0.15))"
                      />
                      <text
                        x="0"
                        y="48"
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        fill={isDark ? '#f8fafc' : '#0f172a'}
                      >
                        {node.label}
                      </text>
                      <text
                        x="0"
                        y="57"
                        textAnchor="middle"
                        fontSize="7.5"
                        fontFamily="monospace"
                        fontWeight="600"
                        fill={isDark ? '#94a3b8' : '#64748b'}
                      >
                        {node.sublabel}
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>
        </div>

        {/* Node Inspection & Evidence Details Panel: 4 cols */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Identity Relation Details
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
              RELATIONAL AUDIT
            </span>
          </div>

          {selectedNode ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Node Title & Badge */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {selectedNode.type.toUpperCase()} NODE
                  </span>
                  {selectedNode.data?.nature && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedNode.data.nature === 'Overlapping Duplicate'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50'
                          : selectedNode.data.nature === 'Legitimate Transfer'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                          : selectedNode.data.nature === 'Unusual Record Pattern'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
                          : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50'
                      }`}
                    >
                      {selectedNode.data.nature}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {selectedNode.label}
                </h3>
                {selectedNode.sublabel && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {selectedNode.sublabel}
                  </p>
                )}
              </div>

              {/* Analytical Summary */}
              {selectedNode.data?.summary && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold block text-slate-900 dark:text-slate-100 mb-1">
                    System Correlation Finding:
                  </span>
                  {selectedNode.data.summary}
                </div>
              )}

              {/* Migration Document Badge if Transfer */}
              {selectedNode.data?.migrationCert && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">
                      AICTE Verified Migration Clearance
                    </span>
                    <span className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300">
                      Cert No: {selectedNode.data.migrationCert}
                    </span>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
                      Student provided legitimate NOC from COEP Pune before matriculating at DTU. Record verified in ABC registry.
                    </p>
                  </div>
                </div>
              )}

              {/* Connected Records Roster */}
              {selectedNode.data?.records && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Associated Enrolment Records ({selectedNode.data.records.length})
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedNode.data.records.map((rec: Student) => (
                      <div
                        key={rec.id}
                        className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                            {rec.institutionName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {rec.academicYear}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400">
                          {rec.course} • Reg: <span className="font-mono">{rec.registrationNo}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700 text-[10px]">
                          <span className="text-slate-400 dark:text-slate-500">Date: {rec.admissionDate}</span>
                          <button
                            onClick={() => onViewStudent(rec)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold flex items-center gap-0.5 cursor-pointer"
                          >
                            Inspect Pass <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Institution Node details if selected */}
              {selectedNode.type === 'institution' && selectedNode.data && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Institution Code:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedNode.data.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Category / Type:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedNode.data.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">AICTE Approved Intake:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedNode.data.totalApprovedIntake}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Programs Sanctioned:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedNode.data.courses.length} Departments</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
              Click any node in the graph to inspect relationship attributes.
            </div>
          )}

          {/* Regulatory Guidance Note */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
            AICTE Circular 2024-REG-09: Inter-institutional cross-referencing does not automatically invalidate legitimate credit migrations with authorized NOCs.
          </div>
        </div>
      </div>
    </div>
  );
};
