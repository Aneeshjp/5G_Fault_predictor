/**
 * Enhancement 2: Intelligent Kafka Pipeline Reliability & Data-Quality Gate Page
 * Telemetry Stream Architecture, Consumer Lag, Freshness Tracking, Bottleneck Detector & Chaos Testing
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import React, { useState } from 'react';
import {
  Activity,
  Layers,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Server,
  Zap,
  Cpu,
  Flame,
  ArrowRight,
  Code,
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export const KafkaPipeline: React.FC = () => {
  const {
    kafkaTopics,
    kafkaConsumerGroups,
    pipelineQualityGate,
    pipelineExperiment,
    triggerPipelineBurst,
    triggerSlowConsumer,
    triggerConsumerCrash,
    resetPipeline,
    sampleKafkaEvent,
  } = useTelemetry();

  const [activeTab, setActiveTab] = useState<'metrics' | 'event' | 'architecture'>('metrics');

  const mlConsumer = kafkaConsumerGroups.find(c => c.groupId === 'cg-ml-inference') || kafkaConsumerGroups[1];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
            <Activity className="w-3.5 h-3.5" />
            <span>Enhancement 2 · Streaming Reliability & Data-Quality Gate</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
            Intelligent Kafka Pipeline Reliability & Quality Gate
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitors stream processing delay, consumer lag, and telemetry freshness. Ensures delayed or missing telemetry marks predictions as <span className="font-mono text-amber-300">DEGRADED</span> rather than silently reporting false confidence.
          </p>
        </div>

        {/* Prediction-Quality Gate Status Badge */}
        <div className={`px-3.5 py-1.5 rounded border text-xs font-mono font-bold flex items-center gap-2 ${
          pipelineQualityGate.gateStatus === 'TRUSTED'
            ? 'bg-emerald-950/60 border-emerald-700 text-emerald-400'
            : pipelineQualityGate.gateStatus === 'CRITICAL_PIPELINE_LAG'
            ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
            : 'bg-amber-950/70 border-amber-600 text-amber-300'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            pipelineQualityGate.gateStatus === 'TRUSTED' ? 'bg-emerald-400' : 'bg-amber-400'
          }`} />
          <span>GATE: {pipelineQualityGate.gateStatus.replace(/_/g, ' ')}</span>
          <span className="opacity-40">|</span>
          <span>{pipelineQualityGate.qualityConfidenceScore}% Conf</span>
        </div>
      </div>

      {/* 4 Pipeline Health Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Telemetry Freshness */}
        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Telemetry Freshness</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span className={`text-2xl font-bold tabular-nums ${
              pipelineQualityGate.telemetryFreshnessMs > 2000 ? 'text-rose-400' : 'text-white'
            }`}>
              {pipelineQualityGate.telemetryFreshnessMs}
            </span>
            <span className="text-xs text-slate-400">ms latency</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono border-t border-slate-800/80 pt-2 flex justify-between">
            <span>Target: &lt; 100 ms</span>
            <span className="text-emerald-400 font-semibold">100% Ingested</span>
          </div>
        </div>

        {/* Metric 2: ML Consumer Lag */}
        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>ML Consumer Lag</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span className={`text-2xl font-bold tabular-nums ${
              mlConsumer.consumerLag > 1000 ? 'text-rose-400' : mlConsumer.consumerLag > 200 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {mlConsumer.consumerLag.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">msgs queued</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono border-t border-slate-800/80 pt-2 flex justify-between">
            <span>Group: cg-ml-inference</span>
            <span className="text-slate-300">{mlConsumer.consumerRateMsgsSec} msgs/s</span>
          </div>
        </div>

        {/* Metric 3: Producer Rate vs Consumer Rate */}
        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Imbalance Delta</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span className={`text-2xl font-bold tabular-nums ${
              pipelineQualityGate.activeImbalanceRateMsgsSec > 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {pipelineQualityGate.activeImbalanceRateMsgsSec > 0 ? `+${pipelineQualityGate.activeImbalanceRateMsgsSec}` : '0'}
            </span>
            <span className="text-xs text-slate-400">msgs/sec surge</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono border-t border-slate-800/80 pt-2 flex justify-between">
            <span>Buffer Exhaustion:</span>
            <span className="text-amber-400 font-bold">
              {pipelineQualityGate.estimatedTimeToBufferExhaustionSeconds
                ? `${pipelineQualityGate.estimatedTimeToBufferExhaustionSeconds}s`
                : 'Nominal'}
            </span>
          </div>
        </div>

        {/* Metric 4: Data Completeness */}
        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Data Completeness</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-bold text-white tabular-nums">
              {pipelineQualityGate.dataCompletenessPercent}%
            </span>
            <span className="text-xs text-slate-400">mandatory KPIs</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono border-t border-slate-800/80 pt-2 flex justify-between">
            <span>Missing Fields: 0</span>
            <span className="text-emerald-400 font-semibold">Valid Schema</span>
          </div>
        </div>
      </div>

      {/* Controlled Pipeline Chaos Testing Controls */}
      <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Kafka Controlled Chaos & Bottleneck Experiment Harness</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate producer spikes, slow ML consumers, and node crashes to measure downstream prediction delay.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetPipeline}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Nominal</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={triggerPipelineBurst}
            className={`p-3 rounded border text-left transition-all cursor-pointer flex flex-col justify-between ${
              pipelineExperiment.activeFailureMode === 'PRODUCER_BURST'
                ? 'bg-amber-950/60 border-amber-500 ring-1 ring-amber-500/50'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="font-bold text-white text-xs">1. Producer Burst Surge</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Surges ingestion rate from 1,000 to 3,500 msgs/s. Backlog builds at +2,500 msgs/s.
              </p>
            </div>
            <div className="mt-3 font-mono text-[10px] text-amber-400 font-bold uppercase">
              {pipelineExperiment.activeFailureMode === 'PRODUCER_BURST' ? 'Active Burst' : 'Trigger Surge'}
            </div>
          </button>

          <button
            onClick={triggerSlowConsumer}
            className={`p-3 rounded border text-left transition-all cursor-pointer flex flex-col justify-between ${
              pipelineExperiment.activeFailureMode === 'SLOW_ML_CONSUMER'
                ? 'bg-amber-950/60 border-amber-500 ring-1 ring-amber-500/50'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="font-bold text-white text-xs">2. Slow ML Consumer Node</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Chokes inference throughput to 280 msgs/s. Telemetry ages at inference time.
              </p>
            </div>
            <div className="mt-3 font-mono text-[10px] text-amber-400 font-bold uppercase">
              {pipelineExperiment.activeFailureMode === 'SLOW_ML_CONSUMER' ? 'Active Slowdown' : 'Trigger Choke'}
            </div>
          </button>

          <button
            onClick={triggerConsumerCrash}
            className={`p-3 rounded border text-left transition-all cursor-pointer flex flex-col justify-between ${
              pipelineExperiment.activeFailureMode === 'CONSUMER_CRASH'
                ? 'bg-rose-950/80 border-rose-500 ring-1 ring-rose-500/50'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="font-bold text-white text-xs">3. Consumer Worker Crash</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Stalls cg-ml-inference completely. Quality Gate flags CRITICAL pipeline lag.
              </p>
            </div>
            <div className="mt-3 font-mono text-[10px] text-rose-400 font-bold uppercase">
              {pipelineExperiment.activeFailureMode === 'CONSUMER_CRASH' ? 'Worker Crashed' : 'Trigger Crash'}
            </div>
          </button>
        </div>

        {/* Active Advisory Callout */}
        <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs font-mono flex items-center justify-between">
          <span className="text-slate-400">Quality Gate Advisory:</span>
          <span className={pipelineQualityGate.gateStatus === 'TRUSTED' ? 'text-emerald-400 font-medium' : 'text-amber-300 font-bold'}>
            {pipelineQualityGate.advisory}
          </span>
        </div>
      </div>

      {/* Consumer Groups & Topics Detailed Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Consumer Groups Lag Breakdown */}
        <div className="lg:col-span-7 p-5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Independent Consumer Groups Performance</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">4 Active Consumer Groups</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Consumer Group ID</th>
                  <th className="py-2.5 px-3">Target Topic</th>
                  <th className="py-2.5 px-3 text-right">Lag</th>
                  <th className="py-2.5 px-3 text-right">Rate</th>
                  <th className="py-2.5 px-3 text-right">Latency</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {kafkaConsumerGroups.map(cg => (
                  <tr key={cg.groupId} className="hover:bg-slate-950/40">
                    <td className="py-2.5 px-3 font-bold text-white">{cg.groupId}</td>
                    <td className="py-2.5 px-3 text-slate-400">{cg.targetTopic}</td>
                    <td className="py-2.5 px-3 text-right font-bold tabular-nums">
                      <span className={cg.consumerLag > 1000 ? 'text-rose-400' : cg.consumerLag > 100 ? 'text-amber-400' : 'text-emerald-400'}>
                        {cg.consumerLag.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">{cg.consumerRateMsgsSec} msgs/s</td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-400">{cg.processingLatencyMs} ms</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        cg.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                      }`}>
                        {cg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right (5 cols): Sample Versioned Kafka Event Inspector */}
        <div className="lg:col-span-5 p-5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <span>Versioned Event Schema (v1.4.2)</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400">At-Least-Once Delivery</span>
          </div>

          <div className="p-3.5 rounded bg-slate-950 border border-slate-800/80 overflow-x-auto max-h-[320px]">
            <pre className="text-[11px] font-mono text-cyan-300 leading-relaxed">
              {JSON.stringify(sampleKafkaEvent, null, 2)}
            </pre>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Partition Key: <strong className="text-slate-300">cell_id: Cell-01A (Band n78)</strong> · Idempotent UUID verification active.
          </div>
        </div>
      </div>
    </div>
  );
};
