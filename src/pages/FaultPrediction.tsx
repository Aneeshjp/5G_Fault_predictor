/**
 * Page 3: AI Fault Prediction
 * Live Probability Gauge, 15-22.5m Lead Time Horizon, Feature Attribution, and Ad-Hoc Test Runner
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Play,
  RotateCcw,
  Zap,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { RiskIndicator } from '../components/common/RiskBadge';
import { evaluateCustomParameters } from '../ml/models';
import { PredictionResult } from '../types/telemetry';

export const FaultPrediction: React.FC<{ onNavigateToSimulator: () => void }> = ({ onNavigateToSimulator }) => {
  const {
    prediction,
    currentTelemetry,
    executeAutonomousMitigation,
    isMitigating,
    mitigationStatusText,
  } = useTelemetry();

  // Ad-Hoc Test Runner State (Sliders)
  const [adHocParams, setAdHocParams] = useState({
    rsrp: -86.5,
    sinr: 18.8,
    prbUtilization: 43.5,
    ecpriFrameLoss: 0.001,
    latency: 8.2,
    cpuUtilization: 33.0,
    activeUes: 145,
    packetLoss: 0.004,
    dlThroughput: 890,
    serviceAvailability: 99.98,
  });

  const [adHocResult, setAdHocResult] = useState<PredictionResult | null>(null);

  const handleRunAdHoc = () => {
    const res = evaluateCustomParameters(adHocParams);
    setAdHocResult(res);
  };

  const handleResetAdHoc = () => {
    const nominal = {
      rsrp: -86.5,
      sinr: 18.8,
      prbUtilization: 43.5,
      ecpriFrameLoss: 0.001,
      latency: 8.2,
      cpuUtilization: 33.0,
      activeUes: 145,
      packetLoss: 0.004,
      dlThroughput: 890,
      serviceAvailability: 99.98,
    };
    setAdHocParams(nominal);
    setAdHocResult(evaluateCustomParameters(nominal));
  };

  const activePred = adHocResult || prediction;

  // Gauge angle calculation (0 to 180 deg)
  const gaugePercent = Math.min(100, Math.max(0, prediction.faultProbability));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Random Forest Supervised Ensemble Inference</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
            AI-Driven 5G Fault Forecasting & Feature Attribution
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Predictive lead time horizon: <span className="font-mono text-cyan-300 font-semibold">15.0 to 22.5 minutes</span> prior to 3GPP SLA breach. Latency: <span className="font-mono text-emerald-400">0.0431 ms/pt</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RiskIndicator level={prediction.riskLevel} score={prediction.riskScore} />
        </div>
      </div>

      {/* Main 2-Column: Live Prediction Diagnosis & Feature Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Live Probability Gauge & Lead Time Horizon */}
        <div className="lg:col-span-5 p-5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>Live Predictive Inference Gauge</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">100-Tree Model</span>
            </div>

            {/* Circular / Arc Gauge Graphic */}
            <div className="mt-6 flex flex-col items-center justify-center">
              <div className="relative w-48 h-24 overflow-hidden flex items-end justify-center">
                {/* Gauge Background Track */}
                <div className="absolute w-44 h-44 rounded-full border-[14px] border-slate-800 border-b-transparent border-l-transparent -rotate-45" />
                {/* Active Indicator Color */}
                <div
                  style={{ transform: `rotate(${(gaugePercent / 100) * 180 - 135}deg)` }}
                  className="absolute w-44 h-44 rounded-full border-[14px] border-cyan-400 border-b-transparent border-l-transparent transition-transform duration-500"
                />
                <div className="text-center z-10 mb-1">
                  <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
                    {prediction.faultProbability}%
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 tracking-wider">
                    FAULT PROBABILITY
                  </div>
                </div>
              </div>

              <div className="w-full flex justify-between px-6 text-[10px] font-mono text-slate-500 mt-2">
                <span>0% Nominal</span>
                <span>50% Threshold</span>
                <span>100% Imminent</span>
              </div>
            </div>

            {/* Forecast Horizon Countdown Card */}
            <div className="mt-6 p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Early-Warning Lead Time Horizon:</span>
                </span>
                <span className="text-base font-bold font-mono text-cyan-300 tabular-nums">
                  {prediction.leadTimeMinutes} mins
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Network operators receive actionable alerts <strong className="text-slate-200">{prediction.leadTimeMinutes} minutes</strong> prior to user-plane SLA breach, allowing autonomous O-RAN closed-loop mitigation to execute with zero customer outage.
              </p>
            </div>
          </div>

          {/* Fault Classification Result */}
          <div className="p-3.5 rounded bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Predicted State:</span>
              <span className="font-semibold text-white font-mono">{prediction.predictedFaultName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target Cell:</span>
              <span className="font-mono text-cyan-400">{prediction.cellId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Isolation Forest:</span>
              <span className={`font-mono ${prediction.isAnomaly ? 'text-rose-400' : 'text-emerald-400'}`}>
                {prediction.anomalyScore.toFixed(3)} ({prediction.isAnomaly ? 'Anomalous' : 'Normal'})
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Feature Attribution (SHAP-Style Waterfall) */}
        <div className="lg:col-span-7 p-5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Feature Attribution & Deviation Analysis</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">SHAP-Equivalent Attribution</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Shows how each 5G telemetry metric pushes the prediction toward nominal or fault state relative to baseline standard deviation.
            </p>

            <div className="mt-4 space-y-3">
              {prediction.featureContributions.map(feat => {
                const isAlarm = feat.impactScore > 10;
                return (
                  <div key={feat.feature} className="p-3 rounded bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-200">{feat.name}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          (Nominal: {feat.nominalRange})
                        </span>
                      </div>
                      <span className="font-mono font-bold text-white tabular-nums">
                        {feat.rawValue} {feat.unit}
                      </span>
                    </div>

                    {/* Impact Bar */}
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${Math.min(100, Math.max(5, feat.impactScore * 2.2))}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          isAlarm ? 'bg-rose-500' : 'bg-cyan-500/70'
                        }`}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>Direction: {feat.direction === 'increase' ? 'Surging (+)' : 'Dropping (-)'}</span>
                      <span>Importance Weight: {(feat.importance * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actionable Root Cause Mitigation Advisory Card */}
          <div className="p-4 rounded-lg bg-cyan-950/40 border border-cyan-800/60 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-semibold text-cyan-400 uppercase tracking-wider">
                  Target Subsystem: {prediction.recommendedMitigation.targetSubsystem}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {prediction.recommendedMitigation.title}
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 shrink-0">
                Action: {prediction.recommendedMitigation.actionId}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {prediction.recommendedMitigation.summary}
            </p>

            <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
              {prediction.recommendedMitigation.stepDetails.map((st, i) => (
                <li key={i}>{st}</li>
              ))}
            </ul>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-cyan-900/40">
              <span className="text-[11px] text-emerald-400 font-medium">
                {prediction.recommendedMitigation.slaImpactMitigated}
              </span>
              <button
                onClick={() => executeAutonomousMitigation(undefined, prediction.predictedFaultType as any)}
                disabled={isMitigating || prediction.predictedFaultType === 'nominal'}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm ${
                  prediction.predictedFaultType === 'nominal'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isMitigating ? 'Executing...' : 'Execute Mitigation Now'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Ad-Hoc Parameter Test Runner */}
      <div className="p-6 rounded-lg bg-slate-900/90 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Interactive Ad-Hoc Model Test Runner</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust telemetry parameters to test how the Random Forest classifier and Isolation Forest evaluate edge-case 5G conditions in real time (&lt;0.05ms).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetAdHoc}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Nominal</span>
            </button>
            <button
              onClick={handleRunAdHoc}
              className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-cyan-950"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Evaluate Custom Input</span>
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* Slider 1: RSRP */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Radio RSRP:</span>
              <span className="font-bold text-cyan-400">{adHocParams.rsrp} dBm</span>
            </div>
            <input
              type="range"
              min={-140}
              max={-60}
              step={0.5}
              value={adHocParams.rsrp}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setAdHocParams(p => ({ ...p, rsrp: val }));
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-140 dBm (Drop)</span>
              <span>-60 dBm (Ideal)</span>
            </div>
          </div>

          {/* Slider 2: SINR */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Radio SINR:</span>
              <span className="font-bold text-cyan-400">{adHocParams.sinr} dB</span>
            </div>
            <input
              type="range"
              min={-8}
              max={30}
              step={0.5}
              value={adHocParams.sinr}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setAdHocParams(p => ({ ...p, sinr: val }));
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-8 dB</span>
              <span>+30 dB</span>
            </div>
          </div>

          {/* Slider 3: PRB Utilization */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">PRB Quota:</span>
              <span className={`font-bold ${adHocParams.prbUtilization > 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {adHocParams.prbUtilization}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={1}
              value={adHocParams.prbUtilization}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setAdHocParams(p => ({ ...p, prbUtilization: val }));
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10%</span>
              <span>100% (Congested)</span>
            </div>
          </div>

          {/* Slider 4: eCPRI Loss */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">eCPRI Loss:</span>
              <span className="font-bold text-rose-400">{adHocParams.ecpriFrameLoss}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={0.2}
              value={adHocParams.ecpriFrameLoss}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setAdHocParams(p => ({ ...p, ecpriFrameLoss: val }));
              }}
              className="w-full accent-rose-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% (Clean)</span>
              <span>30% (Burst)</span>
            </div>
          </div>

          {/* Slider 5: Latency */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">RTT Latency:</span>
              <span className="font-bold text-indigo-400">{adHocParams.latency} ms</span>
            </div>
            <input
              type="range"
              min={4}
              max={300}
              step={2}
              value={adHocParams.latency}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setAdHocParams(p => ({ ...p, latency: val }));
              }}
              className="w-full accent-indigo-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>4 ms (URLLC)</span>
              <span>300 ms (Lag)</span>
            </div>
          </div>

          {/* Slider 6: NFVI CPU */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">NFVI CPU:</span>
              <span className="font-bold text-amber-400">{adHocParams.cpuUtilization}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={1}
              value={adHocParams.cpuUtilization}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setAdHocParams(p => ({ ...p, cpuUtilization: val }));
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10%</span>
              <span>100% (Throttling)</span>
            </div>
          </div>

          {/* Slider 7: Active UEs */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Active UEs:</span>
              <span className="font-bold text-cyan-400">{adHocParams.activeUes}</span>
            </div>
            <input
              type="range"
              min={20}
              max={650}
              step={10}
              value={adHocParams.activeUes}
              onChange={e => {
                const val = parseInt(e.target.value, 10);
                setAdHocParams(p => ({ ...p, activeUes: val }));
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>20</span>
              <span>650 (Crowd)</span>
            </div>
          </div>

          {/* Slider 8: Service Availability */}
          <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Core Availability:</span>
              <span className="font-bold text-emerald-400">{adHocParams.serviceAvailability}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={0.5}
              value={adHocParams.serviceAvailability}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setAdHocParams(p => ({ ...p, serviceAvailability: val }));
              }}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>20% (Collapse)</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Ad-Hoc Evaluation Output Banner */}
        {adHocResult && (
          <div className="p-4 rounded-lg bg-slate-950 border border-cyan-500/50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Ad-Hoc Classification:</span>
                <span className="text-cyan-300 font-semibold">{adHocResult.predictedFaultName}</span>
                <span className="text-slate-600">·</span>
                <RiskIndicator level={adHocResult.riskLevel} score={adHocResult.riskScore} />
              </div>
              <p className="text-slate-400 text-[11px] mt-1 font-sans">
                Model Probability: <strong className="text-white font-mono">{adHocResult.faultProbability}%</strong> · Lead Time: <strong className="text-cyan-400 font-mono">{adHocResult.leadTimeMinutes}m</strong> · Anomaly Score: <strong className="text-amber-400 font-mono">{adHocResult.anomalyScore.toFixed(3)}</strong>
              </p>
            </div>
            <div className="text-slate-400 text-[11px] font-sans">
              Recommended: <span className="text-cyan-300 font-medium">{adHocResult.recommendedMitigation.title}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
