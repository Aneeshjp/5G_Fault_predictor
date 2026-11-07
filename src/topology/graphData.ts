/**
 * 5G Topology Graph Definitions & Causal Edge Semantics
 * Sites, Cells, RUs, DUs, CUs, Core UPF/AMF, and Transport Links
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import { TopologyNode, TopologyEdge, GnnBenchmarkMetric } from '../types/topology';
import { TelemetrySample } from '../types/telemetry';

export const INITIAL_TOPOLOGY_NODES: TopologyNode[] = [
  // 5G Core Tier (Tier 0)
  {
    id: 'AMF-CORE-01',
    name: 'Access & Mobility Mgmt Function (AMF)',
    type: 'ACCESS_MOBILITY_FUNCTION',
    siteId: 'CORE-DATACENTER',
    healthStatus: 'HEALTHY',
    x: 180,
    y: 80,
    tier: 0,
    features: { cpuLoad: 31, memoryLoad: 42, latency: 4.2, packetLoss: 0.001, throughput: 2800 },
    metricsSummary: 'SBA Control Plane · 99.98% Reg Success · NRF Verified',
  },
  {
    id: 'UPF-CORE-01',
    name: '5G Core User Plane Function (UPF)',
    type: 'USER_PLANE_FUNCTION',
    siteId: 'CORE-DATACENTER',
    healthStatus: 'HEALTHY',
    x: 520,
    y: 80,
    tier: 0,
    features: { cpuLoad: 38, memoryLoad: 45, latency: 5.1, packetLoss: 0.002, throughput: 8500 },
    metricsSummary: 'N3/N4 Gateway · 100GbE DPDK · GTP-U Encapsulation',
  },

  // Central Unit Tier (Tier 1)
  {
    id: 'CU-CP-01',
    name: 'O-RAN Central Unit Control Plane (O-CU-CP)',
    type: 'CENTRAL_UNIT_CP',
    siteId: 'SITE-01',
    healthStatus: 'HEALTHY',
    x: 180,
    y: 220,
    tier: 1,
    features: { cpuLoad: 28, memoryLoad: 35, latency: 6.8, packetLoss: 0.003, throughput: 420 },
    metricsSummary: 'RRC / NGAP Signaling · R1 xApp Registered',
  },
  {
    id: 'CU-UP-01',
    name: 'O-RAN Central Unit User Plane (O-CU-UP)',
    type: 'CENTRAL_UNIT_UP',
    siteId: 'SITE-01',
    healthStatus: 'HEALTHY',
    x: 520,
    y: 220,
    tier: 1,
    features: { cpuLoad: 41, memoryLoad: 46, latency: 7.2, packetLoss: 0.004, throughput: 3400 },
    metricsSummary: 'PDCP / SDAP Processing · E1 Interface Bounded',
  },

  // Distributed Unit Tier (Tier 2)
  {
    id: 'DU-01',
    name: 'O-RAN Distributed Unit (O-DU-01)',
    type: 'DISTRIBUTED_UNIT',
    siteId: 'SITE-01',
    healthStatus: 'HEALTHY',
    x: 350,
    y: 360,
    tier: 2,
    features: { cpuLoad: 44, memoryLoad: 48, latency: 8.1, packetLoss: 0.004, throughput: 2850, prbUtil: 43.5 },
    metricsSummary: 'RLC / MAC Scheduler · Near-RT RIC E2 Connected',
  },

  // Radio Units Tier (Tier 3)
  {
    id: 'RU-01A',
    name: 'O-RU Sector Alpha (Massive MIMO 64T64R)',
    type: 'RADIO_UNIT',
    siteId: 'SITE-01',
    healthStatus: 'HEALTHY',
    x: 200,
    y: 500,
    tier: 3,
    features: { cpuLoad: 22, memoryLoad: 29, latency: 8.4, packetLoss: 0.001, throughput: 920, rsrp: -86.5, sinr: 18.8 },
    metricsSummary: 'Band n78 3.5GHz · 100MHz Carrier · RET Tilt +3.0°',
  },
  {
    id: 'RU-01B',
    name: 'O-RU Sector Beta (Massive MIMO 64T64R)',
    type: 'RADIO_UNIT',
    siteId: 'SITE-01',
    healthStatus: 'HEALTHY',
    x: 500,
    y: 500,
    tier: 3,
    features: { cpuLoad: 20, memoryLoad: 28, latency: 8.3, packetLoss: 0.001, throughput: 880, rsrp: -88.0, sinr: 17.5 },
    metricsSummary: 'Band n78 3.5GHz · 100MHz Carrier · RET Tilt +2.5°',
  },

  // Cellular Coverage Tier (Tier 4)
  {
    id: 'CELL-01A',
    name: 'Cell-01A (Band n78)',
    type: 'CELL',
    siteId: 'SITE-01',
    healthStatus: 'HEALTHY',
    x: 200,
    y: 640,
    tier: 4,
    features: { cpuLoad: 18, memoryLoad: 24, latency: 8.5, packetLoss: 0.001, throughput: 890, rsrp: -86.5, sinr: 18.8, prbUtil: 43.5 },
    metricsSummary: 'Active UEs: 145 · PDU Sessions: 290 · CQI: 13',
  },
  {
    id: 'CELL-01B',
    name: 'Cell-01B (Band n78)',
    type: 'CELL',
    siteId: 'SITE-01',
    healthStatus: 'HEALTHY',
    x: 500,
    y: 640,
    tier: 4,
    features: { cpuLoad: 17, memoryLoad: 23, latency: 8.4, packetLoss: 0.001, throughput: 860, rsrp: -88.0, sinr: 17.5, prbUtil: 39.0 },
    metricsSummary: 'Active UEs: 128 · PDU Sessions: 256 · CQI: 12',
  },

  // Transport & Backhaul Links
  {
    id: 'LINK-FH-01A',
    name: 'eCPRI Optical Fronthaul 01A',
    type: 'TRANSPORT_LINK',
    siteId: 'SITE-01',
    healthStatus: 'HEALTHY',
    x: 275,
    y: 430,
    tier: 2.5 as any,
    features: { cpuLoad: 12, memoryLoad: 18, latency: 0.35, packetLoss: 0.0007, throughput: 18500 },
    metricsSummary: '25GbE Optical Fiber · Split 7.2x · RS-FEC Active',
  },
  {
    id: 'LINK-BH-01',
    name: 'N3 Backhaul / Midhaul Transport',
    type: 'TRANSPORT_LINK',
    siteId: 'SITE-01',
    healthStatus: 'HEALTHY',
    x: 520,
    y: 150,
    tier: 0.5 as any,
    features: { cpuLoad: 24, memoryLoad: 31, latency: 3.2, packetLoss: 0.003, throughput: 42000 },
    metricsSummary: '100GbE MPLS/SRv6 Express Path · SLA Bound < 5ms',
  },
];

export const INITIAL_TOPOLOGY_EDGES: TopologyEdge[] = [
  // Core to CU
  { id: 'E-AMF-CUCP', source: 'AMF-CORE-01', target: 'CU-CP-01', semantic: 'depends-on', bandwidthGbps: 10, currentLossPercent: 0.001, latencyMs: 2.1, health: 'HEALTHY' },
  { id: 'E-UPF-CUUP', source: 'UPF-CORE-01', target: 'CU-UP-01', semantic: 'carries-traffic-to', bandwidthGbps: 100, currentLossPercent: 0.002, latencyMs: 2.3, health: 'HEALTHY' },

  // CU to DU
  { id: 'E-CUCP-DU', source: 'CU-CP-01', target: 'DU-01', semantic: 'connects-to', bandwidthGbps: 25, currentLossPercent: 0.002, latencyMs: 1.2, health: 'HEALTHY' },
  { id: 'E-CUUP-DU', source: 'CU-UP-01', target: 'DU-01', semantic: 'carries-traffic-to', bandwidthGbps: 50, currentLossPercent: 0.003, latencyMs: 1.4, health: 'HEALTHY' },

  // DU to RUs (via Fronthaul links)
  { id: 'E-DU-RU01A', source: 'DU-01', target: 'RU-01A', semantic: 'carries-traffic-to', bandwidthGbps: 25, currentLossPercent: 0.0007, latencyMs: 0.35, health: 'HEALTHY' },
  { id: 'E-DU-RU01B', source: 'DU-01', target: 'RU-01B', semantic: 'carries-traffic-to', bandwidthGbps: 25, currentLossPercent: 0.0008, latencyMs: 0.38, health: 'HEALTHY' },

  // RUs to Cells
  { id: 'E-RU01A-CELL01A', source: 'RU-01A', target: 'CELL-01A', semantic: 'serves', bandwidthGbps: 10, currentLossPercent: 0.001, latencyMs: 0.12, health: 'HEALTHY' },
  { id: 'E-RU01B-CELL01B', source: 'RU-01B', target: 'CELL-01B', semantic: 'serves', bandwidthGbps: 10, currentLossPercent: 0.001, latencyMs: 0.12, health: 'HEALTHY' },
];

export const GNN_BENCHMARK_RESULTS: GnnBenchmarkMetric[] = [
  {
    architecture: 'Spatial-Temporal ST-GNN (GraphSAGE + GRU)',
    type: 'Proposed Primary Architecture',
    macroF1: 99.82,
    prAuc: 1.0000,
    recall: 100.00,
    falseAlarmRate: 0.01,
    leadTimeHorizon: '17.8 – 23.4 mins',
    rootCauseTop1Acc: 94.6,
    rootCauseTop3Acc: 99.2,
    meanReciprocalRank: 0.968,
    impactEstimationF1: 97.4,
  },
  {
    architecture: 'Random Forest (Tabular Baseline)',
    type: 'Production Tabular Baseline',
    macroF1: 99.66,
    prAuc: 1.0000,
    recall: 100.00,
    falseAlarmRate: 0.03,
    leadTimeHorizon: '15.0 – 22.5 mins',
    rootCauseTop1Acc: 71.2,
    rootCauseTop3Acc: 84.5,
    meanReciprocalRank: 0.774,
    impactEstimationF1: 62.1,
  },
  {
    architecture: 'Temporal-Only (GRU / Temporal Transformer)',
    type: 'Time-Series Only Baseline',
    macroF1: 98.40,
    prAuc: 0.9890,
    recall: 98.80,
    falseAlarmRate: 0.08,
    leadTimeHorizon: '14.5 – 20.8 mins',
    rootCauseTop1Acc: 68.4,
    rootCauseTop3Acc: 82.0,
    meanReciprocalRank: 0.741,
    impactEstimationF1: 59.8,
  },
  {
    architecture: 'Graph-Only (Spatial GCN / GraphSAGE Snapshot)',
    type: 'Static Topology Baseline',
    macroF1: 97.10,
    prAuc: 0.9780,
    recall: 96.50,
    falseAlarmRate: 0.12,
    leadTimeHorizon: '11.0 – 16.2 mins',
    rootCauseTop1Acc: 88.5,
    rootCauseTop3Acc: 95.1,
    meanReciprocalRank: 0.912,
    impactEstimationF1: 89.2,
  },
];

/**
 * Updates topology node health and values dynamically when faults are active
 */
export function calculateDynamicTopology(
  nodes: TopologyNode[],
  edges: TopologyEdge[],
  currentTelemetry: TelemetrySample,
  activeScenario: string | null
): {
  updatedNodes: TopologyNode[];
  updatedEdges: TopologyEdge[];
} {
  return {
    updatedNodes: nodes.map(node => {
      const copy = { ...node, features: { ...node.features } };

      if (!activeScenario) {
        copy.healthStatus = 'HEALTHY';
        return copy;
      }

      // Root cause mappings depending on scenario
      switch (activeScenario) {
        case 'radio_degradation':
          if (node.id === 'RU-01A') {
            copy.healthStatus = 'CRITICAL';
            copy.features.rsrp = currentTelemetry.rsrp;
            copy.features.sinr = currentTelemetry.sinr;
            copy.metricsSummary = `Feeder Attenuation: RSRP ${currentTelemetry.rsrp} dBm · SINR ${currentTelemetry.sinr} dB`;
          } else if (node.id === 'CELL-01A') {
            copy.healthStatus = 'DEGRADED';
            copy.metricsSummary = 'Downstream Coverage Hole · Imminent Call Drops';
          }
          break;

        case 'cell_congestion':
          if (node.id === 'DU-01') {
            copy.healthStatus = 'CRITICAL';
            copy.features.prbUtil = currentTelemetry.prbUtilization;
            copy.metricsSummary = `PRB Quota Exhaustion: ${currentTelemetry.prbUtilization}% · 500+ Active UEs`;
          } else if (node.id === 'CELL-01A' || node.id === 'CELL-01B') {
            copy.healthStatus = 'DEGRADED';
            copy.metricsSummary = 'Per-UE Downlink Starvation';
          }
          break;

        case 'packet_loss_instability':
          if (node.id === 'LINK-FH-01A') {
            copy.healthStatus = 'CRITICAL';
            copy.features.packetLoss = currentTelemetry.ecpriFrameLoss;
            copy.metricsSummary = `eCPRI Optical Frame Drop: ${currentTelemetry.ecpriFrameLoss}%`;
          } else if (node.id === 'RU-01A' || node.id === 'CELL-01A') {
            copy.healthStatus = 'DEGRADED';
            copy.metricsSummary = 'Downstream I/Q Sample Truncation';
          }
          break;

        case 'increased_latency':
          if (node.id === 'LINK-BH-01' || node.id === 'CU-UP-01') {
            copy.healthStatus = 'CRITICAL';
            copy.features.latency = currentTelemetry.latency;
            copy.metricsSummary = `URLLC SLA Violation: RTT ${currentTelemetry.latency} ms`;
          } else if (node.id === 'DU-01' || node.id === 'CELL-01A') {
            copy.healthStatus = 'DEGRADED';
            copy.metricsSummary = 'Queue Bufferbloat Delay';
          }
          break;

        case 'cpu_memory_saturation':
          if (node.id === 'DU-01') {
            copy.healthStatus = 'CRITICAL';
            copy.features.cpuLoad = currentTelemetry.cpuUtilization;
            copy.features.memoryLoad = currentTelemetry.memoryUtilization;
            copy.metricsSummary = `Host NFVI Saturation: CPU ${currentTelemetry.cpuUtilization}% · Mem ${currentTelemetry.memoryUtilization}%`;
          } else if (node.id === 'CELL-01A') {
            copy.healthStatus = 'DEGRADED';
          }
          break;

        case 'backhaul_interruption':
          if (node.id === 'LINK-BH-01') {
            copy.healthStatus = 'CRITICAL';
            copy.metricsSummary = `Physical Fiber Severed: ${currentTelemetry.packetLoss}% Loss`;
          } else if (node.id === 'CU-UP-01' || node.id === 'DU-01' || node.id === 'CELL-01A') {
            copy.healthStatus = 'DEGRADED';
            copy.metricsSummary = 'GTP-U Transport Cutoff';
          }
          break;

        case 'service_availability_degradation':
          if (node.id === 'AMF-CORE-01') {
            copy.healthStatus = 'CRITICAL';
            copy.metricsSummary = `AMF Registration Queue Collapsed: Avail ${currentTelemetry.serviceAvailability}%`;
          } else if (node.id === 'CU-CP-01' || node.id === 'CELL-01A') {
            copy.healthStatus = 'DEGRADED';
            copy.metricsSummary = 'UE Registration Rejections';
          }
          break;
      }

      return copy;
    }),

    updatedEdges: edges.map(edge => {
      const copy = { ...edge };
      if (!activeScenario) {
        copy.health = 'HEALTHY';
        return copy;
      }
      if (activeScenario === 'packet_loss_instability' && (edge.source === 'DU-01' && edge.target === 'RU-01A')) {
        copy.health = 'CONGESTED';
        copy.currentLossPercent = currentTelemetry.ecpriFrameLoss;
      } else if (activeScenario === 'backhaul_interruption' && (edge.source === 'UPF-CORE-01' && edge.target === 'CU-UP-01')) {
        copy.health = 'CONGESTED';
        copy.currentLossPercent = currentTelemetry.packetLoss;
      } else if (activeScenario === 'increased_latency') {
        copy.latencyMs = currentTelemetry.latency / 2;
        if (edge.source === 'UPF-CORE-01') copy.health = 'DEGRADED';
      }
      return copy;
    }),
  };
}
