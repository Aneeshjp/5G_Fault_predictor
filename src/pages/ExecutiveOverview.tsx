/**
 * Page 1: Executive Overview
 * High-level NOC dashboard with real-time KPIs, cell fleet status, sparklines, and active alerts.
 * Integrated with Enhancements 1, 2, and 3.
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import React from 'react';
import {
  ShieldAlert,
  Clock,
  Radio,
  Activity,
  Layers,
  Cpu,
  AlertTriangle,
  Zap,
  ArrowRight,
  Sparkles,
  Server,
  Network,
  CheckCircle2,
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { RiskIndicator, IncidentStatusBadge } from '../components/common/RiskBadge';
import { FAULT_SCENARIOS } from '../simulator/scenarios';
import { PageId } from '../components/common/Header';

export const ExecutiveOverview: React.FC<{
  onNavigate: (page: PageId) => void;
  onOpenInject: () => void;
  onAcknowledgeAlert: (alert: any) => void;
}> = ({ onNavigate, onOpenInject, onAcknowledgeAlert }) => {
  const {
    currentTelemetry,
    prediction,
    fleet,
    selectedCell,
    alerts,
    activeAlertsCount,
    criticalAlertsCount,
    activeScenario,
    telemetryHistory,
    executeAutonomousMitigation,
    isMitigating,
    stDiagnosis,
    pipelineQualityGate,
    activeModelVersion,
  } = useTelemetry();

  const openAlerts = alerts.filter(a => a.status !== 'RESOLVED').slice(0, 4);

  const sparklineRSRP = telemetryHistory.slice(-15).map(s => s.rsrp);
  const sparklinePRB = telemetryHistory.slice(-15).map(s => s.prbUtilization);
  const sparklineLatency = telemetryHistory.slice(-15).map(s => s.latency);
  const sparklineThroughput = telemetryHistory.slice(-15).map(s => s.dlThroughput);

  return (
    <div className="space-y-6">
      {/* Top Hero Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-lg bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
            <Radio className="w-3.5 h-3.5" />
            <span>Autonomous O-RAN Predictive Assurance Platform</span>
            <span className="text-slate-600">·</span>
            <span className="text-purple-300 font-semibold">{activeModelVersion} Serving</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            5G Testbed Operational Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Proactive cellular failure forecasting predicting service breaches 15 to 22.5 minutes prior to 3GPP SLA degradation. Integrated with Spatial-Temporal GNN root-cause localization, Kafka pipeline reliability gating, and streaming concept drift adaptation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <RiskIndicator level={prediction.riskLevel} score={prediction.riskScore} />
          <button
            onClick={onOpenInject}
            className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm shadow-cyan-950"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate 5G Fault</span>
          </button>
        </div>
      </div>

      {/* 3 Major Research Contributions Spotlight Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Enhancement 1 Spotlight */}
        <div
          onClick={() => onNavigate('topology')}
          className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/80 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
              <span className="flex items-center gap-1.5 font-bold">
                <Network className="w-4 h-4" />
                <span>Enhancement 1: Topology GNN</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-2 text-sm font-bold text-white">
              Root-Cause: <span className="font-mono text-cyan-300">{stDiagnosis.primaryRootCause.componentId}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {stDiagnosis.primaryRootCause.componentId === 'NONE'
                ? 'All O-RAN components, cells, and transport links operating within nominal bounds.'
                : stDiagnosis.graphExplanation.causalChainSummary}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] font-mono text-slate-500">
            <span>RCA Top-1: <strong className="text-white">94.6%</strong></span>
            <span>Blast Radius: <strong className="text-amber-400">{stDiagnosis.affectedComponents.length} nodes</strong></span>
          </div>
        </div>

        {/* Enhancement 2 Spotlight */}
        <div
          onClick={() => onNavigate('pipeline')}
          className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-amber-500/80 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-amber-400">
              <span className="flex items-center gap-1.5 font-bold">
                <Activity className="w-4 h-4" />
                <span>Enhancement 2: Kafka Pipeline</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-2 text-sm font-bold text-white flex items-center gap-2">
              <span>Quality Gate:</span>
              <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                pipelineQualityGate.gateStatus === 'TRUSTED' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
              }`}>
                {pipelineQualityGate.gateStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              {pipelineQualityGate.advisory}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] font-mono text-slate-500">
            <span>Freshness: <strong className="text-white">{pipelineQualityGate.telemetryFreshnessMs} ms</strong></span>
            <span>Confidence: <strong className="text-emerald-400">{pipelineQualityGate.qualityConfidenceScore}%</strong></span>
          </div>
        </div>

        {/* Enhancement 3 Spotlight */}
        <div
          onClick={() => onNavigate('adaptive')}
          className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-purple-500/80 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-purple-400">
              <span className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Enhancement 3: Adaptive ML</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-2 text-sm font-bold text-white">
              Model: <span className="font-mono text-purple-300">{activeModelVersion}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Streaming ADWIN &amp; Page-Hinkley concept drift monitors with quality gating and time-separated validation windows.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] font-mono text-slate-500">
            <span>Drift Status: <strong className="text-emerald-400">STABLE</strong></span>
            <span>Rollback: <strong className="text-cyan-300">Ready</strong></span>
          </div>
        </div>
      </div>

      {/* 4 Quantitative Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Forecast Lead Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {prediction.leadTimeMinutes}
            </span>
            <span className="text-xs text-slate-400 font-mono">minutes horizon</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
            <span>Target: 15.0 – 22.5 mins</span>
            <span className="text-emerald-400 font-medium font-mono">100% Sensitivity</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Operational Risk Index</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${
              prediction.riskScore > 75 ? 'text-rose-400' : prediction.riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {prediction.riskScore}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
            <span className="text-xs font-semibold ml-auto">{prediction.riskLevel}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
            <span>SLA Breach Risk: <span className="font-mono text-slate-300">{prediction.slaBreachRisk}%</span></span>
            <span className="text-slate-400 font-mono">{prediction.predictedFaultType === 'nominal' ? 'Nominal' : 'Pre-Fault'}</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Isolation Forest Anomaly</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${
              prediction.anomalyScore < -0.05 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {prediction.anomalyScore.toFixed(3)}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {prediction.isAnomaly ? '(Anomalous)' : '(Normal)'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
            <span>Boundary: &lt; -0.05</span>
            <span className="text-slate-400 font-mono">O-RAN Manifold</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>3GPP Service Availability</span>
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tabular-nums ${
              currentTelemetry.serviceAvailability < 98.0 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {currentTelemetry.serviceAvailability}%
            </span>
            <span className="text-xs text-slate-400 font-mono">UPF/AMF Core</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
            <span>Active Alerts: <span className="text-white font-mono font-semibold">{activeAlertsCount}</span></span>
            <span className="text-rose-400 font-mono font-medium">{criticalAlertsCount} Critical</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Telemetry Sparklines & Fleet Topology */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Selected Sector Telemetry:</span>
                <span className="text-cyan-400 font-mono">{selectedCell}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-dimensional streaming telemetry updated every 2.0s
              </p>
            </div>
            <button
              onClick={() => onNavigate('monitoring')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Detailed Charts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Sparkline 1 */}
            <div className="p-3.5 rounded bg-slate-950 border border-slate-800/90 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Radio Signal (RSRP)</span>
                <span className="font-mono text-cyan-400 font-semibold tabular-nums">
                  {currentTelemetry.rsrp} dBm
                </span>
              </div>
              <div className="h-10 flex items-end gap-1 px-1">
                {sparklineRSRP.map((val, idx) => {
                  const normalized = Math.max(10, Math.min(100, ((val + 130) / 70) * 100));
                  return (
                    <div
                      key={idx}
                      style={{ height: `${normalized}%` }}
                      className={`flex-1 rounded-t-sm transition-all duration-300 ${
                        val < -115 ? 'bg-rose-500' : 'bg-cyan-500/70'
                      }`}
                      title={`RSRP: ${val} dBm`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>SINR: <strong className="text-slate-300">{currentTelemetry.sinr} dB</strong></span>
                <span>CQI: <strong className="text-slate-300">{currentTelemetry.cqi}</strong></span>
              </div>
            </div>

            {/* Sparkline 2 */}
            <div className="p-3.5 rounded bg-slate-950 border border-slate-800/90 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">PRB Utilization</span>
                <span className={`font-mono font-semibold tabular-nums ${
                  currentTelemetry.prbUtilization > 80 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {currentTelemetry.prbUtilization}%
                </span>
              </div>
              <div className="h-10 flex items-end gap-1 px-1">
                {sparklinePRB.map((val, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${Math.max(8, val)}%` }}
                    className={`flex-1 rounded-t-sm transition-all duration-300 ${
                      val > 80 ? 'bg-rose-500' : val > 65 ? 'bg-amber-500' : 'bg-emerald-500/70'
                    }`}
                    title={`PRB: ${val}%`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Active UEs: <strong className="text-slate-300">{currentTelemetry.activeUes}</strong></span>
                <span>Sessions: <strong className="text-slate-300">{currentTelemetry.pduSessions}</strong></span>
              </div>
            </div>

            {/* Sparkline 3 */}
            <div className="p-3.5 rounded bg-slate-950 border border-slate-800/90 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Transport Latency (RTT)</span>
                <span className={`font-mono font-semibold tabular-nums ${
                  currentTelemetry.latency > 50 ? 'text-rose-400' : 'text-cyan-400'
                }`}>
                  {currentTelemetry.latency} ms
                </span>
              </div>
              <div className="h-10 flex items-end gap-1 px-1">
                {sparklineLatency.map((val, idx) => {
                  const normalized = Math.min(100, Math.max(8, (val / 120) * 100));
                  return (
                    <div
                      key={idx}
                      style={{ height: `${normalized}%` }}
                      className={`flex-1 rounded-t-sm transition-all duration-300 ${
                        val > 45 ? 'bg-rose-500' : 'bg-indigo-500/70'
                      }`}
                      title={`Latency: ${val} ms`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Jitter: <strong className="text-slate-300">{currentTelemetry.jitter} ms</strong></span>
                <span>eCPRI Loss: <strong className="text-slate-300">{currentTelemetry.ecpriFrameLoss}%</strong></span>
              </div>
            </div>

            {/* Sparkline 4 */}
            <div className="p-3.5 rounded bg-slate-950 border border-slate-800/90 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">DL Throughput</span>
                <span className={`font-mono font-semibold tabular-nums ${
                  currentTelemetry.dlThroughput < 100 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {currentTelemetry.dlThroughput} Mbps
                </span>
              </div>
              <div className="h-10 flex items-end gap-1 px-1">
                {sparklineThroughput.map((val, idx) => {
                  const normalized = Math.min(100, Math.max(8, (val / 1200) * 100));
                  return (
                    <div
                      key={idx}
                      style={{ height: `${normalized}%` }}
                      className={`flex-1 rounded-t-sm transition-all duration-300 ${
                        val < 80 ? 'bg-rose-500' : 'bg-teal-500/70'
                      }`}
                      title={`DL: ${val} Mbps`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>UL: <strong className="text-slate-300">{currentTelemetry.ulThroughput} Mbps</strong></span>
                <span>CPU: <strong className="text-slate-300">{currentTelemetry.cpuUtilization}%</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Fleet Grid */}
        <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>O-RAN gNodeB Fleet</span>
              </h2>
              <span className="text-xs font-mono text-emerald-400 font-semibold">4 Sites Active</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {fleet.map(gnb => {
                const isWarning = gnb.id === 'gNB-003' || (activeScenario && currentTelemetry.gNodeBId === gnb.id);
                return (
                  <div
                    key={gnb.id}
                    className="p-2.5 rounded bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors text-xs"
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-slate-200 font-mono">{gnb.id}</span>
                      <span className={`font-mono text-[10px] ${isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {isWarning ? 'HIGH LOAD' : 'ONLINE'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">{gnb.name}</div>
                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-1">
                      <span>{gnb.cells.length} Sectors</span>
                      <span>{gnb.totalUes} UEs</span>
                      <span>~{gnb.avgThroughput} Mbps</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Kafka Ingestion: 1,000 msgs/s</span>
            <span className="font-mono text-emerald-400">Lat: 0.043ms</span>
          </div>
        </div>
      </div>

      {/* Active Incidents Stream */}
      <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Active Early-Warning Incident Alerts ({openAlerts.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Predicted network failure events prioritized by risk score and time-to-SLA breach.
            </p>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>View All Alerts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {openAlerts.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs flex flex-col items-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2 opacity-80" />
            <span>Zero critical alerts in queue. All 5G sectors within nominal bounds.</span>
          </div>
        ) : (
          <div className="mt-3 divide-y divide-slate-800/80">
            {openAlerts.map(alert => (
              <div
                key={alert.id}
                className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400">{alert.id}</span>
                    <span className="text-slate-600">·</span>
                    <span className="font-semibold text-white">{alert.faultName}</span>
                    <span className="text-slate-600">·</span>
                    <IncidentStatusBadge status={alert.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span className="text-cyan-400">{alert.cellId}</span>
                    <span className="text-slate-600">·</span>
                    <span>Horizon: <strong className="text-amber-400">{alert.leadTimeHorizon}</strong></span>
                    <span className="text-slate-600">·</span>
                    <span>Prob: <strong className="text-rose-400">{alert.faultProbability}%</strong></span>
                    <span className="text-slate-600">·</span>
                    <span>Trigger: {alert.kpiSummary.primaryTrigger} ({alert.kpiSummary.triggerValue})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {alert.status === 'OPEN' && (
                    <button
                      onClick={() => onAcknowledgeAlert(alert)}
                      className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
                    >
                      Acknowledge
                    </button>
                  )}
                  <button
                    onClick={() => executeAutonomousMitigation(alert.id, alert.faultType)}
                    disabled={isMitigating}
                    className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors cursor-pointer text-xs shadow-sm"
                  >
                    Mitigate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
