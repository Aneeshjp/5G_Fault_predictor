/**
 * Page 7: 5G Simulator Controls
 * 8 Supported 5G Fault Scenarios, Target Selectors, Active Countdown, and Environmental Noise Controls
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import React, { useState } from 'react';
import {
  Zap,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Radio,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Wrench,
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { FAULT_SCENARIOS, NETWORK_SLICES } from '../simulator/scenarios';
import { FaultScenarioId } from '../types/telemetry';
import { RiskIndicator } from '../components/common/RiskBadge';

export const SimulatorControls: React.FC = () => {
  const {
    activeScenario,
    scenarioTimeElapsedSeconds,
    scenarioTargetCell,
    injectFault,
    clearFault,
    selectedCell,
    setSelectedCell,
    selectedGNodeB,
    setSelectedGNodeB,
    fleet,
    noiseLevel,
    setNoiseLevel,
    streamSpeed,
    setStreamSpeed,
    prediction,
    executeAutonomousMitigation,
    isMitigating,
  } = useTelemetry();

  const [selectedScenarioForDetail, setSelectedScenarioForDetail] = useState<FaultScenarioId>('radio_degradation');

  const currentGnb = fleet.find(g => g.id === selectedGNodeB) || fleet[0];
  const activeConfig = activeScenario ? FAULT_SCENARIOS[activeScenario] : null;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
            <Zap className="w-3.5 h-3.5" />
            <span>5G O-RAN Hardware & Transport Simulator</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
            5G Fault Injection Engine & Scenario Orchestrator
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Inject synthetic multi-cell 3GPP and O-RAN faults to evaluate ML early warning horizons and closed-loop self-healing.
          </p>
        </div>

        {activeScenario ? (
          <button
            onClick={clearFault}
            disabled={isMitigating}
            className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm shadow-rose-950"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Active Fault State</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded">
            <CheckCircle2 className="w-4 h-4" />
            <span>Nominal State (No Active Fault Injected)</span>
          </div>
        )}
      </div>

      {/* Target Sector & Telemetry Environment Controls Strip */}
      <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-400 font-medium">Injection Target:</span>
          {/* gNodeB Selector */}
          <select
            value={selectedGNodeB}
            onChange={e => {
              const newG = fleet.find(g => g.id === e.target.value);
              setSelectedGNodeB(e.target.value);
              if (newG && newG.cells.length > 0) setSelectedCell(newG.cells[0]);
            }}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
          >
            {fleet.map(g => (
              <option key={g.id} value={g.id}>{g.id} ({g.name})</option>
            ))}
          </select>

          {/* Cell Selector */}
          <select
            value={selectedCell}
            onChange={e => setSelectedCell(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-cyan-300 font-mono font-medium"
          >
            {currentGnb.cells.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Noise & Drift Slider */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-400">Gaussian Noise:</span>
            <input
              type="range"
              min={0.2}
              max={2.5}
              step={0.1}
              value={noiseLevel}
              onChange={e => setNoiseLevel(parseFloat(e.target.value))}
              className="w-24 accent-cyan-400 cursor-pointer"
            />
            <span className="text-white tabular-nums w-8">{noiseLevel.toFixed(1)}x</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-slate-400">Rate:</span>
            {[1, 2, 4].map(s => (
              <button
                key={s}
                onClick={() => setStreamSpeed(s)}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  streamSpeed === s ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700' : 'text-slate-500'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Fault Progress Countdown (if active) */}
      {activeConfig && (
        <div className="p-5 rounded-lg bg-rose-950/40 border border-rose-800 space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
              <span className="font-bold text-white text-sm">
                IN PROGRESS: {activeConfig.name}
              </span>
              <span className="font-mono text-rose-300">
                on {scenarioTargetCell || selectedCell}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-slate-300">Elapsed: <strong className="text-rose-300">{Math.round(scenarioTimeElapsedSeconds)}s</strong></span>
              <span>·</span>
              <span className="text-slate-300">Early-Warning Horizon: <strong className="text-cyan-300">{prediction.leadTimeMinutes} mins</strong></span>
            </div>
          </div>

          {/* Progress bar indicating ramp into critical failure */}
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${Math.min(100, (scenarioTimeElapsedSeconds / 20) * 100)}%` }}
              className="h-full bg-rose-500 rounded-full transition-all duration-300"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Degradation Curve: Subsystem Stress Applied</span>
            <button
              onClick={() => executeAutonomousMitigation(undefined, activeScenario!)}
              disabled={isMitigating}
              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors cursor-pointer"
            >
              Execute Autonomous Mitigation
            </button>
          </div>
        </div>
      )}

      {/* The 8 Supported 5G Fault Scenarios Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>The 8 Supported 5G Testbed Fault Scenarios</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">3GPP & O-RAN Standard Specifications</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(FAULT_SCENARIOS) as FaultScenarioId[]).map(key => {
            const sc = FAULT_SCENARIOS[key];
            const isCurrentlyActive = activeScenario === key;

            return (
              <div
                key={key}
                className={`p-4 rounded-lg border transition-all flex flex-col justify-between ${
                  isCurrentlyActive
                    ? 'bg-rose-950/30 border-rose-600 shadow-md shadow-rose-950'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {sc.name}
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                        {sc.leadTimeDefault}m lead
                      </span>
                      <RiskIndicator level={sc.baseSeverity} showScore={false} />
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {sc.telecomDescription}
                  </p>

                  <div className="text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500">Subsystem:</span> <strong className="text-slate-200">{sc.subsystem}</strong>
                  </div>

                  {/* Symptoms Summary */}
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1 text-[11px] font-mono">
                    {sc.symptoms.map((symp, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-slate-400">{symp.kpi}:</span>
                        <span className="text-rose-400">{symp.faultState}</span>
                      </div>
                    ))}
                  </div>

                  {/* Mitigation Action Preview */}
                  <div className="text-[11px] text-slate-400">
                    <span className="text-cyan-400 font-semibold font-mono">Remediation:</span> {sc.mitigation.title}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    Target: {selectedCell}
                  </span>

                  {isCurrentlyActive ? (
                    <button
                      onClick={clearFault}
                      className="px-3 py-1.5 rounded bg-rose-700 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Stop Simulation</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => injectFault(key)}
                      className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-cyan-950"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Inject Fault</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
