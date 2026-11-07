/**
 * Enhancement 3: Adaptive Fault Prediction & Concept Drift Architecture Page
 * ADWIN & Page-Hinkley Detectors, Out-of-Distribution (OOD) Detection, Model Registry & Controlled Adaptation
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import React from 'react';
import {
  Sparkles,
  GitCompare,
  TrendingDown,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Award,
  Zap,
  ArrowRight,
  ShieldCheck,
  Play,
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export const AdaptiveLearning: React.FC = () => {
  const {
    modelRegistry,
    activeModelVersion,
    driftEvents,
    oodResult,
    adaptationPipelineStatus,
    triggerAdaptationWorkflow,
    rollbackToBaseline,
    injectUnseenCompoundFault,
    pipelineQualityGate,
  } = useTelemetry();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enhancement 3 · ML Robustness & Non-Stationary Adaptation</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
            Adaptive Fault Prediction & Statistical Concept Drift Gating
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Maintains model reliability under non-stationary cellular traffic using streaming ADWIN &amp; Page-Hinkley detectors. Enforces data-quality gating before candidate retraining.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded bg-purple-950/50 border border-purple-800/80 text-purple-300">
            Active: <strong className="text-white">{activeModelVersion}</strong>
          </div>
          <div className="px-3 py-1.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
            OOD Score: <strong className={oodResult.isUnknownFault ? 'text-rose-400' : 'text-emerald-400'}>{oodResult.oodScore.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Grid 1: Streaming Drift Detectors & OOD Anomaly Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Concept Drift Monitor (ADWIN & Page-Hinkley) */}
        <div className="lg:col-span-7 p-5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-purple-400" />
              <span>Statistical Concept Drift Detector Stream</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">ADWIN + Page-Hinkley</span>
          </div>

          <div className="space-y-3">
            {driftEvents.length === 0 ? (
              <div className="p-8 text-center text-slate-500 rounded bg-slate-950 border border-slate-800/80 text-xs">
                No active distribution drift detected. Telemetry means and variances are stationary.
              </div>
            ) : (
              driftEvents.map(evt => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded bg-slate-950 border border-purple-800/60 space-y-1.5 text-xs font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">[{evt.detector}] {evt.metric} Drift</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      evt.status === 'CONFIRMED' ? 'bg-purple-950 text-purple-300 border border-purple-700' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {evt.status}
                    </span>
                  </div>

                  <div className="text-slate-400 text-[11px] font-sans">
                    {evt.details}
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                    <span>Shift Magnitude: <strong className="text-purple-300">+{evt.driftMagnitudeSigma}σ</strong></span>
                    <span>p-value: <strong className="text-cyan-400">{evt.pValue}</strong></span>
                    <span>Quality Gated: <strong className={evt.dataQualityVerified ? 'text-emerald-400' : 'text-rose-400'}>{evt.dataQualityVerified ? 'VERIFIED' : 'REJECTED (STALE)'}</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Controlled Adaptation Trigger Callout */}
          <div className="p-3.5 rounded bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-white">Controlled Model Adaptation Pipeline</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {adaptationPipelineStatus.message}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {adaptationPipelineStatus.canRollback && (
                <button
                  onClick={rollbackToBaseline}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rollback v1.0.0</span>
                </button>
              )}

              <button
                onClick={() => triggerAdaptationWorkflow()}
                disabled={adaptationPipelineStatus.activeStep !== 'IDLE' && adaptationPipelineStatus.activeStep !== 'DEPLOYED'}
                className="px-4 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-purple-950"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {adaptationPipelineStatus.activeStep === 'IDLE' || adaptationPipelineStatus.activeStep === 'DEPLOYED'
                    ? 'Execute Adaptation Workflow'
                    : 'Adapting...'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right (5 cols): Out-of-Distribution & Unseen Scenario Detector */}
        <div className="lg:col-span-5 p-5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-purple-400" />
                <span>Out-of-Distribution (OOD) Detector</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">Unseen Class Isolation</span>
            </div>

            <div className="mt-3 p-4 rounded bg-slate-950 border border-slate-800 space-y-3 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans">OOD Novelty Score:</span>
                <span className={`text-xl font-bold tabular-nums ${oodResult.isUnknownFault ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {oodResult.oodScore.toFixed(3)}
                </span>
              </div>

              {/* OOD Bar */}
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${oodResult.oodScore * 100}%` }}
                  className={`h-full rounded-full transition-all duration-300 ${
                    oodResult.isUnknownFault ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                />
              </div>

              <div className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1 border-t border-slate-900">
                <strong>Diagnosis:</strong> {oodResult.advisory}
              </div>

              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Nearest Known Scenario:</span>
                <span className="text-slate-300">{oodResult.nearestKnownScenario}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={injectUnseenCompoundFault}
              className="w-full py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Simulate Unseen Compound Multi-Fault</span>
            </button>
          </div>
        </div>
      </div>

      {/* Model Registry & Version Tracking Matrix */}
      <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Model Version Registry & Champion / Challenger Benchmarks</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict time-separated validation windows. Rollback to baseline preserved at all times.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{modelRegistry.length} Registered Models</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Model Version</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Training Window</th>
                <th className="py-2.5 px-3">Validation Window</th>
                <th className="py-2.5 px-3 text-right">Precision</th>
                <th className="py-2.5 px-3 text-right">Recall</th>
                <th className="py-2.5 px-3 text-right">F1-Score</th>
                <th className="py-2.5 px-3 text-right">Latency</th>
                <th className="py-2.5 px-3 text-right">OOD Acc</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {modelRegistry.map(m => (
                <tr
                  key={m.version}
                  className={m.isCurrentProduction ? 'bg-purple-950/20 font-medium' : 'hover:bg-slate-950/40'}
                >
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-1.5">
                    {m.isCurrentProduction && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                    <span>{m.version}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.isCurrentProduction
                        ? 'bg-purple-950 text-purple-300 border border-purple-700'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {m.isCurrentProduction ? 'ACTIVE CHAMPION' : 'CANDIDATE'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">{m.trainingWindow}</td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">{m.validationWindow}</td>
                  <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">{m.precision.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-right text-emerald-400 tabular-nums">{m.recall.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-right font-bold text-white tabular-nums">{m.f1Score.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-right text-slate-400 tabular-nums">{m.inferenceLatencyMs} ms</td>
                  <td className="py-3 px-3 text-right text-cyan-300 tabular-nums">{m.oodDetectionAccuracy}%</td>
                  <td className="py-3 px-3 text-right">
                    {m.isReferenceBaseline && !m.isCurrentProduction ? (
                      <button
                        onClick={rollbackToBaseline}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] cursor-pointer"
                      >
                        Restore
                      </button>
                    ) : m.isCurrentProduction ? (
                      <span className="text-emerald-400 text-[10px] uppercase font-bold">Serving</span>
                    ) : (
                      <button
                        onClick={() => triggerAdaptationWorkflow()}
                        className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] cursor-pointer"
                      >
                        Promote
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
