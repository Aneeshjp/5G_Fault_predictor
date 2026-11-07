/**
 * Top Bar Navigation (Strict 3-zone contract)
 * Integrated with Enhancements: Topology-Aware Diagnosis, Kafka Reliability & Adaptive ML
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import React from 'react';
import {
  Activity,
  ShieldAlert,
  Sparkles,
  Zap,
  Radio,
  Network,
  BellRing,
  Settings,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

export type PageId =
  | 'overview'
  | 'topology'    // ENHANCEMENT 1
  | 'monitoring'
  | 'prediction'
  | 'pipeline'      // ENHANCEMENT 2
  | 'anomalies'
  | 'adaptive'      // ENHANCEMENT 3
  | 'alerts'
  | 'evaluation'
  | 'simulator'
  | 'health';

interface HeaderProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  onOpenQuickInject?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activePage, setActivePage, onOpenQuickInject }) => {
  const {
    activeAlertsCount,
    activeScenario,
    clearFault,
    audioAlertsEnabled,
    setAudioAlertsEnabled,
    isMitigating,
    pipelineQualityGate,
  } = useTelemetry();

  const navLinks: { id: PageId; label: string; badge?: number; highlight?: boolean }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'topology', label: 'Topology GNN', highlight: true },
    { id: 'monitoring', label: 'Telemetry' },
    { id: 'prediction', label: 'AI Prediction' },
    { id: 'pipeline', label: 'Kafka Pipeline', highlight: true },
    { id: 'anomalies', label: 'Anomalies' },
    { id: 'adaptive', label: 'Adaptive ML', highlight: true },
    { id: 'alerts', label: 'Alert Center', badge: activeAlertsCount },
    { id: 'evaluation', label: 'Benchmarks' },
    { id: 'simulator', label: 'Simulator' },
    { id: 'health', label: 'Health & Docs' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-6 py-3">
      <div className="flex items-center justify-between gap-6 max-w-[1700px] mx-auto">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-950">
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <button
            onClick={() => setActivePage('overview')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-sm font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0">
              Team Dynamites <span className="text-cyan-400 font-mono text-xs font-semibold ml-1">5G AI Testbed</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-0.5">
          {navLinks.map(link => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActivePage(link.id)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 font-semibold shadow-sm'
                    : link.highlight
                    ? 'text-cyan-400/90 hover:text-cyan-200 hover:bg-slate-900/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-600/90 text-white text-[10px] font-mono flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Kafka Quality Gate Mini-Indicator */}
          {pipelineQualityGate.gateStatus !== 'TRUSTED' && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 border border-amber-700 text-amber-300 hidden sm:inline">
              LAG: {pipelineQualityGate.gateStatus}
            </span>
          )}

          {/* Quick Audio Mute Toggle */}
          <button
            onClick={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
            title={audioAlertsEnabled ? 'Audio Alerts Enabled' : 'Audio Alerts Muted'}
            className={`p-1.5 rounded border text-xs transition-colors cursor-pointer ${
              audioAlertsEnabled
                ? 'bg-cyan-950/60 border-cyan-800/80 text-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {audioAlertsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {activeScenario ? (
            <button
              onClick={clearFault}
              disabled={isMitigating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-200 bg-rose-950/80 border border-rose-700/80 rounded hover:bg-rose-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-rose-950"
            >
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>Clear Fault</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (onOpenQuickInject) onOpenQuickInject();
                else setActivePage('simulator');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 border border-cyan-500/80 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-cyan-950/50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate 5G Fault</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile/Compact navigation bar */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto pt-2 mt-1.5 border-t border-slate-900">
        {navLinks.map(link => {
          const isActive = activePage === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActivePage(link.id)}
              className={`px-2 py-1 text-[11px] font-medium rounded whitespace-nowrap shrink-0 flex items-center gap-1 ${
                isActive ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {link.label}
              {link.badge !== undefined && link.badge > 0 && (
                <span className="w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[9px] flex items-center justify-center">
                  {link.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
