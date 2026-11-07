/**
 * Enhancement 1: Topology-Aware Predictive Fault Diagnosis Page
 * Component Graph Explorer, Root-Cause Localization (Top-1/Top-k & MRR), and Downstream Impact Estimation
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import React, { useState } from 'react';
import {
  Network,
  GitBranch,
  ShieldAlert,
  ArrowRight,
  Layers,
  Cpu,
  Radio,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info,
  Maximize2,
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { TopologyNode, ComponentType } from '../types/topology';
import { GNN_BENCHMARK_RESULTS } from '../topology/graphData';
import { RiskIndicator } from '../components/common/RiskBadge';

export const TopologyDiagnosis: React.FC<{ onNavigateToSimulator: () => void }> = ({ onNavigateToSimulator }) => {
  const {
    topologyNodes,
    topologyEdges,
    selectedTopologyNode,
    setSelectedTopologyNode,
    stDiagnosis,
    activeScenario,
    executeAutonomousMitigation,
    isMitigating,
  } = useTelemetry();

  const [activeSiteFilter, setActiveSiteFilter] = useState<string>('ALL');

  const filteredNodes = topologyNodes.filter(
    n => activeSiteFilter === 'ALL' || n.siteId === activeSiteFilter || n.siteId === 'CORE-DATACENTER'
  );

  const getComponentBadgeColor = (type: ComponentType) => {
    switch (type) {
      case 'ACCESS_MOBILITY_FUNCTION':
      case 'USER_PLANE_FUNCTION':
        return 'text-purple-400 bg-purple-950/60 border-purple-800';
      case 'CENTRAL_UNIT_CP':
      case 'CENTRAL_UNIT_UP':
        return 'text-blue-400 bg-blue-950/60 border-blue-800';
      case 'DISTRIBUTED_UNIT':
        return 'text-amber-400 bg-amber-950/60 border-amber-800';
      case 'RADIO_UNIT':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800';
      case 'CELL':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
      case 'TRANSPORT_LINK':
        return 'text-indigo-400 bg-indigo-950/60 border-indigo-800';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  const activeNode = selectedTopologyNode || topologyNodes.find(n => n.id === stDiagnosis.primaryRootCause.componentId) || topologyNodes[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
            <Network className="w-3.5 h-3.5" />
            <span>Enhancement 1 · Primary Research Contribution</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
            Topology-Aware Predictive Fault Diagnosis & Root-Cause Localization
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            GraphSAGE + GRU Spatial-Temporal model capturing component dependencies (<span className="font-mono text-cyan-300">serves, connects-to, depends-on, carries-traffic-to</span>) to isolate root causes and forecast downstream impact.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded bg-cyan-950/50 border border-cyan-800/80 text-cyan-300">
            Top-1 RCA Acc: <strong className="text-white">94.6%</strong>
          </div>
          <div className="px-3 py-1.5 rounded bg-emerald-950/50 border border-emerald-800/80 text-emerald-300">
            MRR: <strong className="text-white">0.968</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Topology Graph Explorer (8 cols) + Root-Cause & Impact Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Interactive Topology Visualizer */}
        <div className="lg:col-span-8 p-5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">5G Component Graph Hierarchy</h2>
            </div>

            {/* Site Filter */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-400">View Site:</span>
              {(['ALL', 'SITE-01', 'CORE-DATACENTER'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setActiveSiteFilter(s)}
                  className={`px-2.5 py-1 rounded text-[11px] cursor-pointer transition-colors ${
                    activeSiteFilter === s
                      ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive SVG / Graph Visualizer Canvas */}
          <div className="relative w-full h-[460px] bg-slate-950/90 rounded border border-slate-800/80 overflow-hidden select-none p-4">
            {/* Background Grid Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none">
              <defs>
                <pattern id="topoGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#64748b" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#topoGrid)" />
            </svg>

            {/* Render Connecting Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                </marker>
                <marker id="arrowCritical" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                </marker>
              </defs>

              {topologyEdges.map(edge => {
                const src = topologyNodes.find(n => n.id === edge.source);
                const tgt = topologyNodes.find(n => n.id === edge.target);
                if (!src || !tgt) return null;

                const isCritical = edge.health === 'CONGESTED' || edge.health === 'DEGRADED';

                return (
                  <g key={edge.id}>
                    <line
                      x1={src.x + 60}
                      y1={src.y + 24}
                      x2={tgt.x + 60}
                      y2={tgt.y + 24}
                      stroke={isCritical ? '#ef4444' : '#334155'}
                      strokeWidth={isCritical ? 2.5 : 1.5}
                      strokeDasharray={edge.semantic === 'depends-on' ? '4 3' : undefined}
                      markerEnd={isCritical ? 'url(#arrowCritical)' : 'url(#arrow)'}
                    />
                    {/* Edge Label */}
                    <text
                      x={(src.x + tgt.x) / 2 + 60}
                      y={(src.y + tgt.y) / 2 + 18}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {edge.semantic}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Render Graph Nodes */}
            <div className="relative w-full h-full">
              {filteredNodes.map(node => {
                const isSelected = activeNode?.id === node.id;
                const isRootCause = stDiagnosis.primaryRootCause.componentId === node.id;
                const isAffected = stDiagnosis.affectedComponents.some(a => a.componentId === node.id);

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedTopologyNode(node)}
                    style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    className={`absolute w-36 p-2 rounded cursor-pointer transition-all duration-200 border text-xs flex flex-col justify-between shadow-lg ${
                      isRootCause
                        ? 'bg-rose-950/90 border-rose-500 ring-2 ring-rose-500/50 shadow-rose-950'
                        : isAffected
                        ? 'bg-amber-950/80 border-amber-500/80'
                        : isSelected
                        ? 'bg-slate-900 border-cyan-400 ring-1 ring-cyan-400/50'
                        : 'bg-slate-950/95 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-white truncate">{node.id}</span>
                      <span className={`w-2 h-2 rounded-full ${
                        node.healthStatus === 'CRITICAL' ? 'bg-rose-500 animate-pulse' : node.healthStatus === 'DEGRADED' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                    </div>

                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{node.name}</div>

                    <div className="mt-1.5 flex justify-between text-[9px] font-mono text-slate-500 border-t border-slate-900 pt-1">
                      <span>{node.type.replace(/_/g, ' ')}</span>
                      {isRootCause && <span className="text-rose-400 font-bold uppercase">Root</span>}
                      {isAffected && <span className="text-amber-400 font-semibold uppercase">Impact</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Causal Chain Explanation Banner */}
          {stDiagnosis.primaryRootCause.componentId !== 'NONE' && (
            <div className="p-3.5 rounded bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono">
              <div className="flex items-center gap-2 text-rose-300 font-semibold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Spatial-Temporal Causal Propagation Chain:</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-[11px] flex-wrap">
                {stDiagnosis.primaryRootCause.causalPath.map((step, idx) => (
                  <React.Fragment key={step}>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold">
                      {step}
                    </span>
                    {idx < stDiagnosis.primaryRootCause.causalPath.length - 1 && (
                      <span className="text-slate-500">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                {stDiagnosis.graphExplanation.causalChainSummary}
              </p>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Selected Node Inspector & Root-Cause Diagnosis */}
        <div className="lg:col-span-4 space-y-4">
          {/* Node Inspector Card */}
          <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white">Component Telemetry Inspector</h3>
              </div>
              <span className={`px-2 py-0.5 rounded border text-[10px] font-mono ${getComponentBadgeColor(activeNode.type)}`}>
                {activeNode.type}
              </span>
            </div>

            <div>
              <div className="font-bold text-white text-sm font-mono">{activeNode.id}</div>
              <div className="text-slate-400 text-xs mt-0.5">{activeNode.name}</div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">Site: {activeNode.siteId}</div>
            </div>

            {/* Time-Aligned Features Table */}
            <div className="p-3 rounded bg-slate-950 border border-slate-800/80 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Component Health:</span>
                <span className={`font-bold ${
                  activeNode.healthStatus === 'CRITICAL' ? 'text-rose-400' : activeNode.healthStatus === 'DEGRADED' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {activeNode.healthStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Processing Latency:</span>
                <span className="text-slate-200">{activeNode.features.latency} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Packet Loss Rate:</span>
                <span className="text-slate-200">{activeNode.features.packetLoss}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Throughput:</span>
                <span className="text-slate-200">{activeNode.features.throughput} Mbps</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CPU / Memory Load:</span>
                <span className="text-slate-200">{activeNode.features.cpuLoad}% / {activeNode.features.memoryLoad}%</span>
              </div>
              {activeNode.features.prbUtil !== undefined && (
                <div className="flex justify-between">
                  <span className="text-slate-400">PRB Utilization:</span>
                  <span className="text-cyan-400">{activeNode.features.prbUtil}%</span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
              <strong>Operational Summary:</strong> {activeNode.metricsSummary}
            </div>
          </div>

          {/* Root-Cause Candidates Ranking (Top-k) */}
          <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-rose-400" />
                <span>Root-Cause Localization Ranking</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">ST-GNN Top-k</span>
            </div>

            <div className="space-y-2">
              {stDiagnosis.rootCauseRankings.map(candidate => (
                <div
                  key={candidate.componentId}
                  className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1 font-mono text-[11px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">#{candidate.rank} {candidate.componentId}</span>
                    <span className="text-rose-400 font-bold">{candidate.rootCauseProbability}% Conf</span>
                  </div>
                  <div className="text-slate-400 font-sans text-[11px] truncate">{candidate.componentName}</div>

                  {candidate.evidenceKpis.map((ev, i) => (
                    <div key={i} className="text-[10px] text-slate-500 flex justify-between pt-0.5 border-t border-slate-900 mt-1">
                      <span>{ev.kpi}:</span>
                      <span className="text-amber-400">{ev.observedValue} (z={ev.zScore}σ)</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Downstream Blast Radius Estimation */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Downstream Blast Radius ({stDiagnosis.affectedComponents.length} Nodes)
              </span>

              {stDiagnosis.affectedComponents.length === 0 ? (
                <div className="text-[11px] text-slate-500 font-sans">
                  No downstream components at risk.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {stDiagnosis.affectedComponents.map(aff => (
                    <div
                      key={aff.componentId}
                      className="p-2 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between text-[11px] font-mono"
                    >
                      <div>
                        <div className="text-white font-semibold">{aff.componentId}</div>
                        <div className="text-[10px] text-slate-500 font-sans">
                          Impact in <span className="text-cyan-400 font-mono">{aff.estimatedTimeToImpactMinutes}m</span>
                        </div>
                      </div>
                      <span className="text-amber-400 font-bold">{aff.impactProbability}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {activeScenario && (
              <button
                onClick={() => executeAutonomousMitigation()}
                disabled={isMitigating}
                className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isMitigating ? 'Remediating...' : 'Remediate Root Component'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Model Comparison Table (Spatial-Temporal GNN vs Tabular vs Temporal vs Graph) */}
      <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Experiment E1 & E2: Model Architecture Benchmark Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluating Root-Cause Localization (Top-1/Top-3 Acc, MRR) and Downstream Impact Estimation F1.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Held-Out Multi-Site Evaluation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Architecture</th>
                <th className="py-2.5 px-3 text-right">Macro F1</th>
                <th className="py-2.5 px-3 text-right">Recall</th>
                <th className="py-2.5 px-3 text-right">Lead Time</th>
                <th className="py-2.5 px-3 text-right font-bold text-cyan-400">RCA Top-1 Acc</th>
                <th className="py-2.5 px-3 text-right font-bold text-cyan-400">RCA Top-3 Acc</th>
                <th className="py-2.5 px-3 text-right font-bold text-cyan-400">MRR</th>
                <th className="py-2.5 px-3 text-right font-bold text-emerald-400">Impact F1</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {GNN_BENCHMARK_RESULTS.map(res => (
                <tr
                  key={res.architecture}
                  className={res.type.includes('Proposed') ? 'bg-cyan-950/20 font-medium' : 'hover:bg-slate-950/40'}
                >
                  <td className="py-3 px-3">
                    <div className="font-bold text-white font-sans text-xs">{res.architecture}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{res.type}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-white">{res.macroF1.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-right text-emerald-400">{res.recall.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-right text-amber-300">{res.leadTimeHorizon}</td>
                  <td className="py-3 px-3 text-right font-bold text-cyan-300">{res.rootCauseTop1Acc.toFixed(1)}%</td>
                  <td className="py-3 px-3 text-right text-cyan-300">{res.rootCauseTop3Acc.toFixed(1)}%</td>
                  <td className="py-3 px-3 text-right font-bold text-white">{res.meanReciprocalRank.toFixed(3)}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400">{res.impactEstimationF1.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
