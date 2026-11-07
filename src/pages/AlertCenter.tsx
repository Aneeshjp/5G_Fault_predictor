/**
 * Page 5: Alert Center & Incident Lifecycle Management
 * Complete incident states (Open -> Acknowledged -> Resolved), operator audit trail, and mitigation execution.
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Clock,
  History,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { IncidentAlert, IncidentStatus, RiskLevel } from '../types/telemetry';
import { IncidentStatusBadge, RiskIndicator } from '../components/common/RiskBadge';
import { AcknowledgeModal, ResolveModal } from '../components/common/IncidentModals';

export const AlertCenter: React.FC = () => {
  const {
    alerts,
    activeAlertsCount,
    criticalAlertsCount,
    acknowledgeAlert,
    resolveAlert,
    executeAutonomousMitigation,
    isMitigating,
    mitigationStatusText,
    auditLogs,
  } = useTelemetry();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | IncidentStatus>('ALL');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [activeTab, setActiveTab] = useState<'alerts' | 'audit'>('alerts');

  // Modals state
  const [ackAlertTarget, setAckAlertTarget] = useState<IncidentAlert | null>(null);
  const [resAlertTarget, setResAlertTarget] = useState<IncidentAlert | null>(null);

  // Filtered alerts
  const filteredAlerts = alerts.filter(a => {
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchesSearch =
      searchQuery === '' ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.cellId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.faultName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.acknowledgedBy && a.acknowledgedBy.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-mono">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Incident Lifecycle Management & Audit Trails</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
            5G Operations Center Alert Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Tracking pre-emptive incident lifecycles across Open, Acknowledged, and Resolved states with immutable operator audit trails.
          </p>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
            Total Queue: <strong className="text-white">{alerts.length}</strong>
          </div>
          <div className="px-3 py-1.5 rounded bg-rose-950/40 border border-rose-800/60 text-rose-300">
            Active: <strong className="text-rose-200">{activeAlertsCount}</strong>
          </div>
          <div className="px-3 py-1.5 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
            Resolved: <strong className="text-emerald-200">{alerts.filter(a => a.status === 'RESOLVED').length}</strong>
          </div>
        </div>
      </div>

      {/* Tabs Header: Incident Alerts vs Operator Audit Trail */}
      <div className="flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'alerts'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Active Incidents Queue ({filteredAlerts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'border-cyan-400 text-cyan-300 bg-slate-900/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Operator Audit Trail ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'alerts' ? (
        <div className="space-y-4">
          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded bg-slate-900/80 border border-slate-800 text-xs">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by incident ID, sector, fault type, or engineer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-1.5 text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none text-xs"
              />
            </div>

            {/* Filter buttons: Status */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800">
              {(['ALL', 'OPEN', 'ACKNOWLEDGED', 'RESOLVED'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-800 text-cyan-300 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Filter buttons: Severity */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800">
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                    severityFilter === sev
                      ? 'bg-slate-800 text-white font-semibold shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Incidents Table / Cards */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 rounded bg-slate-900/60 border border-slate-800 text-xs">
                No incident alerts match your filter criteria.
              </div>
            ) : (
              filteredAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-cyan-400 font-semibold">{alert.id}</span>
                      <span className="text-slate-600">·</span>
                      <h3 className="font-bold text-white text-sm">{alert.faultName}</h3>
                      <span className="text-slate-600">·</span>
                      <IncidentStatusBadge status={alert.status} />
                      <span className="text-slate-600">·</span>
                      <RiskIndicator level={alert.severity} showScore={false} />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-slate-400 font-mono text-[11px]">
                      <span>Sector: <strong className="text-slate-200">{alert.cellId}</strong></span>
                      <span className="text-slate-600">·</span>
                      <span>Site: <strong className="text-slate-200">{alert.gNodeBId}</strong></span>
                      <span className="text-slate-600">·</span>
                      <span>Forecast Horizon: <strong className="text-amber-400">{alert.leadTimeHorizon}</strong></span>
                      <span className="text-slate-600">·</span>
                      <span>Prob: <strong className="text-rose-400">{alert.faultProbability}%</strong></span>
                    </div>

                    <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono text-slate-300 mt-2">
                      <span className="text-slate-500">Trigger: </span>
                      <strong className="text-amber-300">{alert.kpiSummary.primaryTrigger}</strong> reached{' '}
                      <span className="text-rose-400 font-semibold">{alert.kpiSummary.triggerValue}</span> (
                      {alert.kpiSummary.thresholdBreached})
                    </div>

                    {alert.status === 'ACKNOWLEDGED' && alert.acknowledgedBy && (
                      <div className="text-[11px] text-amber-300 font-mono">
                        Acknowledged by: <strong>{alert.acknowledgedBy}</strong> · Notes: &quot;{alert.acknowledgmentNotes}&quot;
                      </div>
                    )}

                    {alert.status === 'RESOLVED' && alert.resolvedBy && (
                      <div className="text-[11px] text-emerald-300 font-mono">
                        Resolved by: <strong>{alert.resolvedBy}</strong> · Action: {alert.mitigationApplied} · &quot;{alert.resolutionNotes}&quot;
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-row md:flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      {alert.status === 'OPEN' && (
                        <button
                          onClick={() => setAckAlertTarget(alert)}
                          className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      )}

                      {alert.status !== 'RESOLVED' && (
                        <>
                          <button
                            onClick={() => executeAutonomousMitigation(alert.id, alert.faultType)}
                            disabled={isMitigating}
                            className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer shadow-sm"
                          >
                            Auto-Mitigate
                          </button>
                          <button
                            onClick={() => setResAlertTarget(alert)}
                            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                          >
                            Resolve...
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Operator Audit Trail Tab */
        <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <span>Telecom Operator & O-RAN Automation Audit Log</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Cryptographically verifiable timestamped audit log of all manual and automated mitigation directives.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">{auditLogs.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Operator / Actor</th>
                  <th className="py-2.5 px-3">Action Type</th>
                  <th className="py-2.5 px-3">Target Subsystem</th>
                  <th className="py-2.5 px-3">Execution Details</th>
                  <th className="py-2.5 px-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-950/60 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{log.timeFormatted}</td>
                    <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">{log.operator}</td>
                    <td className="py-2.5 px-3 text-cyan-300 whitespace-nowrap">{log.action}</td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{log.target}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-300">{log.details}</td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        log.result === 'SUCCESS' ? 'text-emerald-400 bg-emerald-950' : 'text-amber-400 bg-amber-950'
                      }`}>
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Acknowledge Modal */}
      <AcknowledgeModal
        alert={ackAlertTarget}
        onClose={() => setAckAlertTarget(null)}
        onConfirm={(operator, notes) => {
          if (ackAlertTarget) {
            acknowledgeAlert(ackAlertTarget.id, operator, notes);
            setAckAlertTarget(null);
          }
        }}
      />

      {/* Resolve Modal */}
      <ResolveModal
        alert={resAlertTarget}
        onClose={() => setResAlertTarget(null)}
        onConfirm={(operator, notes, rootCause) => {
          if (resAlertTarget) {
            resolveAlert(resAlertTarget.id, operator, notes, rootCause);
            setResAlertTarget(null);
          }
        }}
      />
    </div>
  );
};
