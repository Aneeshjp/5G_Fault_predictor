/**
 * Incident Acknowledgment, Resolution & Quick Fault Injection Modals
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Zap, AlertCircle, Wrench } from 'lucide-react';
import { IncidentAlert, FaultScenarioId } from '../../types/telemetry';
import { FAULT_SCENARIOS } from '../../simulator/scenarios';
import { useTelemetry } from '../../context/TelemetryContext';

interface AcknowledgeModalProps {
  alert: IncidentAlert | null;
  onClose: () => void;
  onConfirm: (operator: string, notes: string) => void;
}

export const AcknowledgeModal: React.FC<AcknowledgeModalProps> = ({ alert, onClose, onConfirm }) => {
  const [operator, setOperator] = useState('NOC Senior Engineer');
  const [notes, setNotes] = useState('');

  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-amber-950/60 border border-amber-700/60 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Acknowledge Incident Alert</h3>
              <p className="text-xs text-slate-400 font-mono">{alert.id} · {alert.cellId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Predicted Fault:</span>
              <span className="font-semibold text-rose-300">{alert.faultName}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Early Warning Horizon:</span>
              <span className="font-mono text-cyan-400">{alert.leadTimeHorizon}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Trigger Metric:</span>
              <span className="font-mono text-amber-300">{alert.kpiSummary.primaryTrigger} ({alert.kpiSummary.triggerValue})</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Operator Identifier</label>
            <input
              type="text"
              value={operator}
              onChange={e => setOperator(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
              placeholder="e.g. NOC Eng Sarah Chen"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Acknowledgment Technical Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none placeholder:text-slate-600"
              placeholder="Detail observations, initial verification steps, or assigned field/RIC teams..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(operator, notes || 'Telemetry acknowledged; dispatched diagnostic evaluation.')}
            className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Confirm Acknowledgment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ResolveModalProps {
  alert: IncidentAlert | null;
  onClose: () => void;
  onConfirm: (operator: string, notes: string, rootCause: string) => void;
}

export const ResolveModal: React.FC<ResolveModalProps> = ({ alert, onClose, onConfirm }) => {
  const [operator, setOperator] = useState('Senior Telecom Solutions Architect');
  const [rootCause, setRootCause] = useState('O-RAN Closed-Loop Parameter Compensation');
  const [notes, setNotes] = useState('');

  if (!alert) return null;

  const rootCauses = [
    'O-RAN Closed-Loop Parameter Compensation (RET/Power)',
    'Near-RT RIC Dynamic PRB Quota Reallocation',
    'Transport SDN SRv6 Low-Latency Reroute',
    'Fronthaul Optical Transceiver RS-FEC Engage & SFP Re-seat',
    'NFVI Pod Auto-Scale & Memory Leak Cordon',
    '3GPP AMF Core Registration Overload Shed',
    'Hardware Component Maintenance & Field Verification',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Resolve & Close Incident</h3>
              <p className="text-xs text-slate-400 font-mono">{alert.id} · {alert.cellId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Root-Cause Remediation Action</label>
            <select
              value={rootCause}
              onChange={e => setRootCause(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
              {rootCauses.map(rc => (
                <option key={rc} value={rc}>
                  {rc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Resolving Engineer / Subsystem</label>
            <input
              type="text"
              value={operator}
              onChange={e => setOperator(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Remediation Log & Verification Outcome</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none placeholder:text-slate-600"
              placeholder="Confirm telemetry restoration, O-RAN parameter sanity, and zero dropped calls..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(operator, notes || 'Root cause remediated. Telemetry returned to nominal bounds.', rootCause)}
            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark Incident Resolved</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const QuickInjectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onInject: (scenarioId: FaultScenarioId) => void;
}> = ({ isOpen, onClose, onInject }) => {
  const { selectedCell } = useTelemetry();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">5G Testbed Fault Injector</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target: <span className="font-mono text-cyan-300 font-semibold">{selectedCell}</span> · Testbed Chronological Early-Warning
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {(Object.keys(FAULT_SCENARIOS) as FaultScenarioId[]).map(key => {
            const sc = FAULT_SCENARIOS[key];
            return (
              <div
                key={key}
                className="p-3.5 rounded border border-slate-800 bg-slate-950/70 hover:border-cyan-500/60 hover:bg-slate-950 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors leading-snug">
                      {sc.name}
                    </h4>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                      {sc.leadTimeDefault}m lead
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                    {sc.telecomDescription}
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-slate-500">
                    Subsystem: <span className="text-slate-300">{sc.subsystem}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onInject(key);
                    onClose();
                  }}
                  className="mt-3.5 w-full py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Inject Scenario</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
