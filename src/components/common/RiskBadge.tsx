/**
 * Clean Status & Risk Indicators (Zero-Pill compliant)
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import React from 'react';
import { RiskLevel, IncidentStatus } from '../../types/telemetry';

export const RiskIndicator: React.FC<{
  level: RiskLevel;
  score?: number;
  showScore?: boolean;
}> = ({ level, score, showScore = true }) => {
  const config = {
    LOW: {
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-800/60',
      dot: 'bg-emerald-400',
      label: 'LOW RISK',
    },
    MEDIUM: {
      color: 'text-amber-400',
      bg: 'bg-amber-950/40 border-amber-800/60',
      dot: 'bg-amber-400',
      label: 'MEDIUM RISK',
    },
    HIGH: {
      color: 'text-orange-400',
      bg: 'bg-orange-950/40 border-orange-800/60',
      dot: 'bg-orange-400',
      label: 'HIGH RISK',
    },
    CRITICAL: {
      color: 'text-rose-400',
      bg: 'bg-rose-950/40 border-rose-800/60',
      dot: 'bg-rose-400',
      label: 'CRITICAL SLA BREACH RISK',
    },
  }[level];

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded border text-xs font-mono font-medium ${config.bg} ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
      {showScore && score !== undefined && (
        <>
          <span className="opacity-40">/</span>
          <span className="tabular-nums font-semibold">{score}/100</span>
        </>
      )}
    </div>
  );
};

export const IncidentStatusBadge: React.FC<{ status: IncidentStatus }> = ({ status }) => {
  switch (status) {
    case 'OPEN':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-rose-400">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          OPEN
        </span>
      );
    case 'ACKNOWLEDGED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          ACKNOWLEDGED
        </span>
      );
    case 'RESOLVED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          RESOLVED
        </span>
      );
  }
};
