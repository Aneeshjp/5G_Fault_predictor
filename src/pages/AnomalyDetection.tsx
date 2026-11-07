/**
 * Page 4: Anomaly Detection
 * Unsupervised Isolation Forest Score Timeline, Decision Boundary (-0.05), and Zero-Day Multi-Variate Threat Analysis
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Sparkles, ShieldAlert, Cpu, Radio, AlertOctagon, HelpCircle, Layers } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export const AnomalyDetection: React.FC = () => {
  const {
    prediction,
    currentTelemetry,
    predictionHistory,
    selectedCell,
  } = useTelemetry();

  // Multi-axis telemetry deviation data for radar/comparative analysis
  const deviationRadar = [
    { metric: 'Radio RSRP', current: Math.abs(currentTelemetry.rsrp + 88.5) / 4.8, maxNominal: 2.5, unit: 'std' },
    { metric: 'Radio SINR', current: Math.abs(currentTelemetry.sinr - 18.4) / 3.2, maxNominal: 2.5, unit: 'std' },
    { metric: 'PRB Quota', current: Math.abs(currentTelemetry.prbUtilization - 42.5) / 7.5, maxNominal: 2.5, unit: 'std' },
    { metric: 'eCPRI Loss', current: Math.abs(currentTelemetry.ecpriFrameLoss - 0.0008) / 0.001, maxNominal: 2.5, unit: 'std' },
    { metric: 'Latency', current: Math.abs(currentTelemetry.latency - 8.4) / 1.2, maxNominal: 2.5, unit: 'std' },
    { metric: 'NFVI CPU', current: Math.abs(currentTelemetry.cpuUtilization - 34.2) / 5.5, maxNominal: 2.5, unit: 'std' },
    { metric: 'Core Avail', current: Math.abs(currentTelemetry.serviceAvailability - 99.98) / 0.02, maxNominal: 2.5, unit: 'std' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unsupervised Zero-Day Anomaly Detection</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
            Isolation Forest Multi-Variate Threat Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Decoupled from supervised labels to flag previously unseen multi-cell failure signatures. Decision boundary threshold: <span className="font-mono text-purple-300 font-semibold">-0.05</span>.
          </p>
        </div>

        {/* Current Anomaly State Banner */}
        <div className={`px-4 py-2 rounded border text-xs font-mono font-medium flex items-center gap-2 ${
          prediction.isAnomaly
            ? 'bg-purple-950/60 border-purple-800 text-purple-300'
            : 'bg-slate-950 border-slate-800 text-emerald-400'
        }`}>
          <span className={`w-2 h-2 rounded-full ${prediction.isAnomaly ? 'bg-purple-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span>
            {prediction.isZeroDay
              ? 'ZERO-DAY UNKNOWN MULTIVARIATE THREAT'
              : prediction.isAnomaly
              ? 'ANOMALOUS MANIFOLD DEVIATION'
              : 'WITHIN NOMINAL GAUSSIAN ENVELOPE'}
          </span>
          <span className="opacity-40">|</span>
          <span className="tabular-nums font-bold">{prediction.anomalyScore.toFixed(4)}</span>
        </div>
      </div>

      {/* Main Grid: Isolation Forest Score Timeline & Multi-Dimensional Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Timeline of Isolation Forest Score */}
        <div className="lg:col-span-7 p-5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Isolation Forest Score Timeline</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">Boundary: -0.05</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Scores above -0.05 represent dense nominal clusters. Scores descending into negative values indicate low tree depth path lengths (anomalous sample isolation).
            </p>

            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timeString" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis domain={[-0.5, 0.5]} stroke="#c084fc" tick={{ fontSize: 10, fill: '#c084fc' }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const val = payload[0].value as number;
                        return (
                          <div className="bg-slate-950 border border-purple-800/80 p-2.5 rounded text-xs font-mono">
                            <div className="text-slate-400">{label}</div>
                            <div className="text-purple-300 font-bold mt-1">
                              Anomaly Score: {val.toFixed(4)}
                            </div>
                            <div className="text-slate-500 text-[10px]">
                              {val < -0.05 ? 'ANOMALY DETECTED' : 'NORMAL ENVELOPE'}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    y={-0.05}
                    stroke="#a855f7"
                    strokeDasharray="4 4"
                    label={{ value: 'Anomaly Decision Boundary (-0.05)', fill: '#c084fc', fontSize: 10 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="anomalyScore"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Score Range: [-0.5 (Severe Anomaly) to +0.5 (Nominal Dense Cluster)]</span>
            <span className="text-purple-300">Target: {selectedCell}</span>
          </div>
        </div>

        {/* Right (5 cols): Multivariate Deviation Vector Breakdown */}
        <div className="lg:col-span-5 p-5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Multivariate Standard Deviations</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">Z-Score Normalization</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Distance from Gaussian mean. Spikes &gt; 3.0σ trigger Isolation Forest hyper-plane cuts.
            </p>

            <div className="mt-4 space-y-2.5">
              {deviationRadar.map(item => {
                const isOutlier = item.current > item.maxNominal;
                return (
                  <div key={item.metric} className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium">{item.metric}</span>
                      <span className={`font-mono font-bold ${isOutlier ? 'text-rose-400' : 'text-slate-400'}`}>
                        {item.current.toFixed(2)} σ
                      </span>
                    </div>
                    {/* Deviation bar */}
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${Math.min(100, (item.current / 8) * 100)}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOutlier ? 'bg-purple-500' : 'bg-cyan-500/60'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Research Insight Card */}
          <div className="p-3.5 rounded bg-purple-950/30 border border-purple-800/50 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Why Unsupervised Isolation Forest in 5G?</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Supervised classifiers can only recognize known patterns (e.g. the 8 standard fault types). Isolation Forests recursively partition telemetry space; anomalies require substantially fewer random splits to isolate, catching novel 0-day exploits and multi-factor hardware degradation before rules exist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
