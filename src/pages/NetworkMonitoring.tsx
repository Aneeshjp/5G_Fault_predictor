/**
 * Page 2: Network Monitoring
 * 4 Synchronized Live Time-Series Charts with 3GPP Thresholds & Multi-Vector Telemetry
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Radio, Truck, Cpu, Gauge, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

// Custom dark NOC chart tooltip
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 border border-slate-700/80 p-2.5 rounded shadow-xl text-xs font-mono">
        <p className="text-slate-400 mb-1 border-b border-slate-800 pb-1">{label}</p>
        <div className="space-y-0.5">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span style={{ color: entry.color }} className="font-medium">
                {entry.name}:
              </span>
              <span className="text-white font-bold tabular-nums">
                {entry.value} {entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const NetworkMonitoring: React.FC = () => {
  const {
    currentTelemetry,
    telemetryHistory,
    selectedCell,
    selectedGNodeB,
    selectedSlice,
  } = useTelemetry();

  const [activeMetricTab, setActiveMetricTab] = useState<'all' | 'radio' | 'transport' | 'throughput' | 'compute'>('all');

  return (
    <div className="space-y-6">
      {/* Header and Telemetry Snapshot strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-slate-900/90 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Vector Synchronized Telemetry Tele-Telemetry</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">
            Real-Time 5G Telemetry & 3GPP Threshold Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Sampling Layer 1 RF, eCPRI Fronthaul transport, MAC resource scheduler, and NFVI microservices on <span className="font-mono text-cyan-300 font-semibold">{selectedCell}</span>.
          </p>
        </div>

        {/* Live Vector Badges */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
            RSRP: <strong className="text-cyan-400 tabular-nums">{currentTelemetry.rsrp} dBm</strong>
          </div>
          <div className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
            PRB: <strong className={currentTelemetry.prbUtilization > 75 ? 'text-rose-400' : 'text-emerald-400'}>{currentTelemetry.prbUtilization}%</strong>
          </div>
          <div className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
            RTT: <strong className={currentTelemetry.latency > 40 ? 'text-rose-400' : 'text-cyan-400'}>{currentTelemetry.latency} ms</strong>
          </div>
          <div className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
            DL: <strong className="text-emerald-400 tabular-nums">{currentTelemetry.dlThroughput} Mbps</strong>
          </div>
        </div>
      </div>

      {/* Grid of 4 Synchronized Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Radio Quality (RSRP, RSRQ, SINR, CQI) */}
        <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Radio Link Quality (Layer 1 / RF)</h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
              <span>SINR: <strong className="text-cyan-300">{currentTelemetry.sinr} dB</strong></span>
              <span>·</span>
              <span>CQI: <strong className="text-slate-200">{currentTelemetry.cqi}</strong></span>
            </div>
          </div>

          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timeString" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis yAxisId="rsrp" domain={[-140, -60]} stroke="#06b6d4" tick={{ fontSize: 10, fill: '#06b6d4' }} />
                <YAxis yAxisId="sinr" orientation="right" domain={[-10, 30]} stroke="#38bdf8" tick={{ fontSize: 10, fill: '#38bdf8' }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <ReferenceLine yAxisId="rsrp" y={-115} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '3GPP Drop Threshold (-115 dBm)', fill: '#ef4444', fontSize: 10 }} />
                <Line yAxisId="rsrp" type="monotone" dataKey="rsrp" name="RSRP (dBm)" stroke="#06b6d4" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line yAxisId="sinr" type="monotone" dataKey="sinr" name="SINR (dB)" stroke="#38bdf8" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-[11px] text-slate-500 flex justify-between font-mono">
            <span>Nominal RSRP: -95 to -75 dBm</span>
            <span>Degradation Alarm: &lt; -115 dBm</span>
          </div>
        </div>

        {/* Chart 2: Transport & Fronthaul (Latency, Jitter, eCPRI Loss) */}
        <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Transport & eCPRI Fronthaul</h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
              <span>Jitter: <strong className="text-indigo-300">{currentTelemetry.jitter} ms</strong></span>
              <span>·</span>
              <span>eCPRI Loss: <strong className="text-rose-400">{currentTelemetry.ecpriFrameLoss}%</strong></span>
            </div>
          </div>

          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timeString" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis yAxisId="lat" domain={[0, 300]} stroke="#818cf8" tick={{ fontSize: 10, fill: '#818cf8' }} />
                <YAxis yAxisId="loss" orientation="right" domain={[0, 35]} stroke="#f43f5e" tick={{ fontSize: 10, fill: '#f43f5e' }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <ReferenceLine yAxisId="lat" y={45} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'URLLC SLA Limit (45ms)', fill: '#f59e0b', fontSize: 10 }} />
                <Line yAxisId="lat" type="monotone" dataKey="latency" name="RTT Latency (ms)" stroke="#818cf8" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line yAxisId="loss" type="monotone" dataKey="ecpriFrameLoss" name="eCPRI Loss (%)" stroke="#f43f5e" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-[11px] text-slate-500 flex justify-between font-mono">
            <span>Nominal Latency: 4 to 12 ms</span>
            <span>URLLC Deadline Breach: &gt; 45 ms</span>
          </div>
        </div>

        {/* Chart 3: Throughput & Radio Resource PRB Utilization */}
        <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Throughput & PRB Allocation</h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
              <span>UL: <strong className="text-slate-200">{currentTelemetry.ulThroughput} Mbps</strong></span>
              <span>·</span>
              <span>Active UEs: <strong className="text-cyan-300">{currentTelemetry.activeUes}</strong></span>
            </div>
          </div>

          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timeString" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis yAxisId="tp" domain={[0, 1300]} stroke="#10b981" tick={{ fontSize: 10, fill: '#10b981' }} />
                <YAxis yAxisId="prb" orientation="right" domain={[0, 100]} stroke="#f59e0b" tick={{ fontSize: 10, fill: '#f59e0b' }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <ReferenceLine yAxisId="prb" y={75} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'PRB Congestion (75%)', fill: '#f59e0b', fontSize: 10 }} />
                <ReferenceLine yAxisId="prb" y={90} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'PRB Critical (90%)', fill: '#ef4444', fontSize: 10 }} />
                <Line yAxisId="tp" type="monotone" dataKey="dlThroughput" name="DL Throughput (Mbps)" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line yAxisId="prb" type="monotone" dataKey="prbUtilization" name="PRB Utilization (%)" stroke="#f59e0b" strokeWidth={1.8} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-[11px] text-slate-500 flex justify-between font-mono">
            <span>Nominal PRB: 20% – 60%</span>
            <span>Target DL: &gt; 500 Mbps</span>
          </div>
        </div>

        {/* Chart 4: Compute & NFVI Core (CPU, Memory, Availability) */}
        <div className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Compute & NFVI Infrastructure</h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
              <span>Memory: <strong className="text-slate-200">{currentTelemetry.memoryUtilization}%</strong></span>
              <span>·</span>
              <span>SLA: <strong className="text-emerald-400">{currentTelemetry.serviceAvailability}%</strong></span>
            </div>
          </div>

          <div className="h-64 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timeString" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} stroke="#fbbf24" tick={{ fontSize: 10, fill: '#fbbf24' }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'NFVI Saturation Threshold (80%)', fill: '#ef4444', fontSize: 10 }} />
                <Line type="monotone" dataKey="cpuUtilization" name="NFVI CPU Load (%)" stroke="#fbbf24" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="memoryUtilization" name="Memory Load (%)" stroke="#a78bfa" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="serviceAvailability" name="5G Core Avail (%)" stroke="#10b981" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-[11px] text-slate-500 flex justify-between font-mono">
            <span>Nominal CPU: 20% – 50%</span>
            <span>Core Target: &gt; 99.9%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
