/**
 * Page 6: Model Evaluation & Empirical Research Benchmarks
 * Evaluated strictly on held-out temporal test set (3,150 samples).
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';
import {
  Award,
  CheckCircle2,
  TrendingUp,
  Layers,
  HelpCircle,
  FileCheck,
  Zap,
} from 'lucide-react';
import {
  EMPIRICAL_BENCHMARKS,
  CONFUSION_MATRIX,
  FEATURE_IMPORTANCE_RANKINGS,
  ROC_CURVE_POINTS,
  PRECISION_RECALL_POINTS,
} from '../ml/models';

export const ModelEvaluation: React.FC = () => {
  const [activeChart, setActiveChart] = useState<'roc' | 'pr' | 'features'>('roc');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <Award className="w-3.5 h-3.5" />
            <span>Empirical ML Research Validation</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
            Empirical Model Evaluation & Strict Chronological Split
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Benchmarked against <span className="font-mono text-cyan-300 font-semibold">3,150 held-out temporal samples</span>. Zero target leakage guaranteed through sequential time-partitioning.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
            RF F1-Score: <strong>99.66%</strong>
          </div>
          <div className="px-3 py-1.5 rounded bg-cyan-950/40 border border-cyan-800/60 text-cyan-300">
            Missed Faults: <strong>0.00% (FN=0)</strong>
          </div>
        </div>
      </div>

      {/* Benchmark Comparison Table */}
      <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>Held-Out Temporal Test Set Benchmarks (3,150 Samples)</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Chronological Split: 70% Train / 30% Test</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Model Architecture</th>
                <th className="py-2.5 px-3 text-right">Precision</th>
                <th className="py-2.5 px-3 text-right">Recall (Sens.)</th>
                <th className="py-2.5 px-3 text-right">F1-Score</th>
                <th className="py-2.5 px-3 text-right">ROC-AUC</th>
                <th className="py-2.5 px-3 text-right">PR-AUC</th>
                <th className="py-2.5 px-3 text-right">FPR</th>
                <th className="py-2.5 px-3 text-right">FNR (Missed)</th>
                <th className="py-2.5 px-3 text-right">Inference Lat.</th>
                <th className="py-2.5 px-3 text-right">Lead Horizon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {EMPIRICAL_BENCHMARKS.map(bench => (
                <tr
                  key={bench.modelName}
                  className={`transition-colors ${
                    bench.status === 'Production Primary' ? 'bg-cyan-950/20 font-medium' : 'hover:bg-slate-950/40'
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="font-bold text-white font-sans text-xs flex items-center gap-1.5">
                      {bench.status === 'Production Primary' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                      <span>{bench.modelName}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{bench.type}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400 tabular-nums">
                    {bench.precision.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400 tabular-nums">
                    {bench.recall.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-white tabular-nums">
                    {bench.f1Score.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-right text-cyan-300 tabular-nums">
                    {bench.rocAuc.toFixed(4)}
                  </td>
                  <td className="py-3 px-3 text-right text-cyan-300 tabular-nums">
                    {bench.prAuc.toFixed(4)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 tabular-nums">
                    {bench.fpr.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums">
                    <span className={bench.fnr === 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {bench.fnr.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                    {bench.inferenceLatencyMs} ms
                  </td>
                  <td className="py-3 px-3 text-right text-amber-300 font-semibold tabular-nums">
                    {bench.leadTimeHorizon}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Confusion Matrix & Interactive Benchmark Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (5 cols): Interactive 2x2 Confusion Matrix */}
        <div className="lg:col-span-5 p-5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Test Set Confusion Matrix (N = 3,150)</span>
              </h2>
              <span className="text-xs font-mono text-emerald-400 font-semibold">FN = 0 (Zero Outages Missed)</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Evaluated on 3,150 consecutive chronological telemetry frames.
            </p>

            {/* 2x2 Matrix Graphic */}
            <div className="mt-4 p-4 rounded bg-slate-950 border border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-center font-mono">
                {/* True Negatives */}
                <div className="p-4 rounded bg-slate-900/80 border border-slate-700/80 hover:border-cyan-500/80 transition-colors">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">True Negatives (TN)</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">
                    {CONFUSION_MATRIX.trueNegatives}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-sans">
                    Correctly classified Nominal (99.97%)
                  </div>
                </div>

                {/* False Positives */}
                <div className="p-4 rounded bg-slate-900/80 border border-slate-700/80 hover:border-amber-500/80 transition-colors">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">False Positives (FP)</div>
                  <div className="text-2xl font-bold text-amber-400 mt-1 tabular-nums">
                    {CONFUSION_MATRIX.falsePositives}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-sans">
                    False Alarm (0.03% FPR)
                  </div>
                </div>

                {/* False Negatives */}
                <div className="p-4 rounded bg-slate-900/80 border border-slate-700/80 hover:border-rose-500/80 transition-colors">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">False Negatives (FN)</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">
                    {CONFUSION_MATRIX.falseNegatives}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1 font-sans font-semibold">
                    Zero Missed Faults (0.00% FNR)
                  </div>
                </div>

                {/* True Positives */}
                <div className="p-4 rounded bg-slate-900/80 border border-slate-700/80 hover:border-cyan-500/80 transition-colors">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">True Positives (TP)</div>
                  <div className="text-2xl font-bold text-cyan-400 mt-1 tabular-nums">
                    {CONFUSION_MATRIX.truePositives}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-sans">
                    Detected Impending Faults (100% Recall)
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] font-mono text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Sensitivity (Recall): TP / (TP + FN)</span>
                  <span className="font-bold text-emerald-400">100.00%</span>
                </div>
                <div className="flex justify-between">
                  <span>Precision: TP / (TP + FP)</span>
                  <span className="font-bold text-emerald-400">99.32%</span>
                </div>
                <div className="flex justify-between">
                  <span>Specificity: TN / (TN + FP)</span>
                  <span className="font-bold text-emerald-400">99.97%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-sans">
            <strong className="text-white">Why Recall = 100% matters in 5G:</strong> In telecom operations, a False Negative results in dropped URLLC vehicular links or emergency 911 outages. Achieving 0 missed faults ensures continuous carrier-grade reliability.
          </div>
        </div>

        {/* Right (7 cols): Interactive Curves & Feature Importances */}
        <div className="lg:col-span-7 p-5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800">
                <button
                  onClick={() => setActiveChart('roc')}
                  className={`px-3 py-1 rounded text-xs font-mono cursor-pointer transition-colors ${
                    activeChart === 'roc' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ROC Curve
                </button>
                <button
                  onClick={() => setActiveChart('pr')}
                  className={`px-3 py-1 rounded text-xs font-mono cursor-pointer transition-colors ${
                    activeChart === 'pr' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Precision-Recall
                </button>
                <button
                  onClick={() => setActiveChart('features')}
                  className={`px-3 py-1 rounded text-xs font-mono cursor-pointer transition-colors ${
                    activeChart === 'features' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Feature Importance (Gini)
                </button>
              </div>

              <span className="text-xs font-mono text-slate-400">
                {activeChart === 'roc' ? 'AUC = 1.0000' : activeChart === 'pr' ? 'PR-AUC = 1.0000' : '9 Key Parameters'}
              </span>
            </div>

            {/* Chart Area */}
            <div className="h-72 mt-4">
              {activeChart === 'roc' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ROC_CURVE_POINTS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="fpr" label={{ value: 'False Positive Rate (FPR)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#64748b' }} stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis label={{ value: 'True Positive Rate (TPR)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b' }} domain={[0, 1]} stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-950 border border-slate-700 p-2 rounded text-xs font-mono">
                            <div className="text-cyan-400 font-bold">Random Forest (O-RAN): {payload[0]?.value}</div>
                            <div className="text-indigo-400">Logistic Baseline: {payload[1]?.value}</div>
                            <div className="text-slate-500">Static 3GPP: {payload[2]?.value}</div>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Line type="monotone" dataKey="model" name="Random Forest (AUC 1.000)" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="baseline" name="Logistic Regression (AUC 1.000)" stroke="#818cf8" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                    <Line type="monotone" dataKey="static" name="Static 3GPP (AUC 0.700)" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {activeChart === 'pr' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={PRECISION_RECALL_POINTS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="recall" label={{ value: 'Recall (Sensitivity)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#64748b' }} stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0.6, 1.05]} stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Line type="monotone" dataKey="model" name="Random Forest (PR-AUC 1.000)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="baseline" name="Logistic Baseline (PR-AUC 0.999)" stroke="#818cf8" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                    <Line type="monotone" dataKey="static" name="Static 3GPP (PR-AUC 0.650)" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {activeChart === 'features' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={FEATURE_IMPORTANCE_RANKINGS} layout="vertical" margin={{ left: 40, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" domain={[0, 0.3]} stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="label" type="category" stroke="#94a3b8" tick={{ fontSize: 10, fill: '#cbd5e1' }} width={170} />
                    <Tooltip
                      formatter={(val: any) => [`${(Number(val) * 100).toFixed(1)}% Gini Importance`, 'Weight']}
                    />
                    <Bar dataKey="weight" fill="#06b6d4" radius={[0, 4, 4, 0]}>
                      {FEATURE_IMPORTANCE_RANKINGS.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? '#06b6d4' : index === 1 ? '#0891b2' : index === 2 ? '#6366f1' : '#334155'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Research Insight */}
          <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-1 text-xs font-sans text-slate-400">
            <div className="text-white font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Strict Chronological Split Methodology:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Standard k-fold cross-validation is invalid for cellular telemetry because future samples leak into earlier time windows. Team Dynamites utilized a temporal split where training data strictly precedes evaluation frames, proving zero look-ahead bias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
