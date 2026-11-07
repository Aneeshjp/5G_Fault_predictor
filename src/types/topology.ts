/**
 * Enhancement 1: Topology-Aware Fault Diagnosis Types
 * Network Component Graph, Root-Cause Localization, and Downstream Impact Schema
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

export type ComponentType =
  | 'SITE'
  | 'CELL'
  | 'RADIO_UNIT'    // O-RU
  | 'DISTRIBUTED_UNIT' // O-DU
  | 'CENTRAL_UNIT_UP'  // O-CU-UP
  | 'CENTRAL_UNIT_CP'  // O-CU-CP
  | 'USER_PLANE_FUNCTION' // UPF
  | 'ACCESS_MOBILITY_FUNCTION' // AMF
  | 'SESSION_MANAGEMENT_FUNCTION' // SMF
  | 'TRANSPORT_LINK'; // Fronthaul / Midhaul / Backhaul

export type EdgeSemantic =
  | 'serves'
  | 'connects-to'
  | 'depends-on'
  | 'carries-traffic-to';

export interface TopologyNode {
  id: string; // e.g., 'RU-01A', 'DU-01', 'CU-UP-01', 'AMF-CORE-01'
  name: string;
  type: ComponentType;
  siteId: string;
  healthStatus: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  x: number;
  y: number;
  tier: number; // 0=Core, 1=CU, 2=DU, 3=RU, 4=Cell
  features: {
    cpuLoad: number; // %
    memoryLoad: number; // %
    latency: number; // ms
    packetLoss: number; // %
    throughput: number; // Mbps
    prbUtil?: number; // %
    rsrp?: number; // dBm
    sinr?: number; // dB
  };
  metricsSummary: string;
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  semantic: EdgeSemantic;
  bandwidthGbps: number;
  currentLossPercent: number;
  latencyMs: number;
  health: 'HEALTHY' | 'DEGRADED' | 'CONGESTED';
}

export interface RootCauseCandidate {
  componentId: string;
  componentName: string;
  componentType: ComponentType;
  siteId: string;
  rootCauseProbability: number; // 0 - 100%
  rank: number;
  evidenceKpis: {
    kpi: string;
    observedValue: string;
    expectedValue: string;
    zScore: number;
  }[];
  causalPath: string[]; // e.g. ['RU-01A', 'DU-01', 'CU-UP-01']
}

export interface AffectedComponentImpact {
  componentId: string;
  componentName: string;
  componentType: ComponentType;
  impactProbability: number; // 0 - 100%
  estimatedTimeToImpactMinutes: number;
  serviceSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedSlices: string[];
}

export interface SpatialTemporalDiagnosisResult {
  timestamp: number;
  faultProbability: number;
  predictedFaultType: string;
  primaryRootCause: RootCauseCandidate;
  rootCauseRankings: RootCauseCandidate[];
  affectedComponents: AffectedComponentImpact[];
  graphExplanation: {
    causalChainSummary: string;
    supportingNeighborNodes: string[];
    criticalGraphEdges: string[];
  };
}

export interface GnnBenchmarkMetric {
  architecture: string;
  type: string;
  macroF1: number;
  prAuc: number;
  recall: number;
  falseAlarmRate: number;
  leadTimeHorizon: string;
  rootCauseTop1Acc: number;
  rootCauseTop3Acc: number;
  meanReciprocalRank: number; // MRR
  impactEstimationF1: number;
}
