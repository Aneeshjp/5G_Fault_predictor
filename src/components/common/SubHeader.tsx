/**
 * Contextual Telemetry Sub-Header & Controls Bar
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import React from 'react';
import { Play, Pause, FastForward, Download, AlertTriangle, ShieldCheck, CheckCircle2, Sliders } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { FAULT_SCENARIOS, NETWORK_SLICES } from '../../simulator/scenarios';

export const SubHeader: React.FC = () => {
  const {
    fleet,
    selectedGNodeB,
    setSelectedGNodeB,
    selectedCell,
    setSelectedCell,
    selectedSlice,
    setSelectedSlice,
    isStreaming,
    setIsStreaming,
    streamSpeed,
    setStreamSpeed,
    activeScenario,
    scenarioTimeElapsedSeconds,
    clearFault,
    executeAutonomousMitigation,
    isMitigating,
    mitigationStatusText,
    prediction,
    exportTelemetryCSV,
    exportTelemetryJSON,
  } = useTelemetry();

  const currentGnb = fleet.find(g => g.id === selectedGNodeB) || fleet[0];
  const activeFaultConfig = activeScenario ? FAULT_SCENARIOS[activeScenario] : null;

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Filters for Site, Cell, Slice */}
        <div className="flex flex-wrap items-center gap-3">
          {/* gNodeB Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">gNodeB:</span>
            <select
              value={selectedGNodeB}
              onChange={e => {
                const newGnb = fleet.find(g => g.id === e.target.value);
                setSelectedGNodeB(e.target.value);
                if (newGnb && newGnb.cells.length > 0) {
                  setSelectedCell(newGnb.cells[0]);
                }
              }}
              className="bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1 text-slate-200 font-mono text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
              {fleet.map(g => (
                <option key={g.id} value={g.id}>
                  {g.id} ({g.name})
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-700 hidden sm:inline" aria-hidden="true">·</span>

          {/* Cell Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Cell Sector:</span>
            <select
              value={selectedCell}
              onChange={e => setSelectedCell(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1 text-slate-200 font-mono text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
              {currentGnb.cells.map(cell => (
                <option key={cell} value={cell}>
                  {cell}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-700 hidden sm:inline" aria-hidden="true">·</span>

          {/* Slice Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">3GPP Slice:</span>
            <select
              value={selectedSlice}
              onChange={e => setSelectedSlice(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1 text-slate-200 font-mono text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
              {NETWORK_SLICES.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} (SST {s.sst})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Telemetry Stream Controls & Export */}
        <div className="flex items-center gap-3 ml-auto text-xs">
          {/* Stream Ticker State */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded px-2.5 py-1">
            <span className="text-slate-400">Stream:</span>
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                isStreaming ? 'text-emerald-400 hover:text-emerald-300' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>LIVE</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <span>PAUSED</span>
                </>
              )}
            </button>

            <span className="text-slate-800" aria-hidden="true">|</span>

            {/* Stream Speed Buttons */}
            <div className="flex items-center gap-0.5">
              {[1, 2, 4].map(s => (
                <button
                  key={s}
                  onClick={() => setStreamSpeed(s)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                    streamSpeed === s
                      ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-700/60'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Export Dropdown */}
          <div className="flex items-center gap-1">
            <button
              onClick={exportTelemetryCSV}
              title="Download 3GPP CSV"
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              <Download className="w-3 h-3" />
              <span>CSV</span>
            </button>
            <button
              onClick={exportTelemetryJSON}
              title="Download Full JSON State"
              className="flex items-center gap-1 px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Fault Alert / Mitigation Banner */}
      {activeFaultConfig && (
        <div className="max-w-[1600px] mx-auto mt-2.5 p-3 rounded bg-rose-950/50 border border-rose-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded bg-rose-900/60 text-rose-400">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-rose-200">
                  ACTIVE FAULT INJECTION: {activeFaultConfig.name}
                </span>
                <span className="font-mono text-rose-400 tabular-nums">
                  [T+{Math.round(scenarioTimeElapsedSeconds)}s elapsed]
                </span>
              </div>
              <p className="text-rose-300/80 text-[11px] mt-0.5">
                AI Early-Warning Lead Time: <span className="font-mono font-bold text-white">{prediction.leadTimeMinutes} mins</span> ahead of 3GPP SLA breach. Subsystem: {activeFaultConfig.subsystem}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isMitigating ? (
              <span className="text-cyan-300 font-mono text-[11px] animate-pulse">
                {mitigationStatusText || 'Executing Autonomous Mitigation...'}
              </span>
            ) : (
              <>
                <button
                  onClick={() => executeAutonomousMitigation(undefined, activeScenario!)}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Execute O-RAN Mitigation</span>
                </button>
                <button
                  onClick={clearFault}
                  className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
