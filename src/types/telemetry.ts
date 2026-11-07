/**
 * 5G Telecom Telemetry, ML Prediction, and Incident Lifecycle Types
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';

export type FaultScenarioId =
  | 'radio_degradation'
  | 'cell_congestion'
  | 'packet_loss_instability'
  | 'increased_latency'
  | 'throughput_degradation'
  | 'cpu_memory_saturation'
  | 'backhaul_interruption'
  | 'service_availability_degradation';

export interface TelemetrySample {
  timestamp: number;
  timeString: string;
  cellId: string;
  gNodeBId: string;
  sliceId: string;
  // Radio Metrics (Layer 1 / Physical)
  rsrp: number; // dBm (-140 to -50)
  rsrq: number; // dB (-20 to -3)
  sinr: number; // dB (-10 to +30)
  cqi: number;  // 1 to 15
  // Transport & Fronthaul (eCPRI / O-RAN O-DU to O-RU)
  latency: number; // ms
  jitter: number;  // ms
  packetLoss: number; // % (0 to 100)
  ecpriFrameLoss: number; // % (0 to 100)
  // Throughput & Radio Resources
  dlThroughput: number; // Mbps (0 to 1500)
  ulThroughput: number; // Mbps (0 to 300)
  prbUtilization: number; // % (0 to 100)
  // Compute & NFVI Core
  cpuUtilization: number; // % (0 to 100)
  memoryUtilization: number; // % (0 to 100)
  activeUes: number; // count
  pduSessions: number; // count
  serviceAvailability: number; // % (0 to 100)
}

export interface FeatureContribution {
  feature: string;
  name: string;
  rawValue: number;
  unit: string;
  nominalRange: string;
  impactScore: number; // Positive = pushed toward fault, Negative = pushed toward normal
  direction: 'increase' | 'decrease';
  importance: number; // 0 to 1
}

export interface PredictionResult {
  timestamp: number;
  cellId: string;
  faultProbability: number; // 0 to 100%
  predictedFaultType: FaultScenarioId | 'nominal';
  predictedFaultName: string;
  leadTimeMinutes: number; // 15.0 - 22.5 mins
  riskLevel: RiskLevel;
  riskScore: number; // 0 to 100
  anomalyScore: number; // -0.5 to +0.5 (< -0.05 considered anomaly)
  isAnomaly: boolean;
  isZeroDay: boolean;
  featureContributions: FeatureContribution[];
  recommendedMitigation: MitigationRecommendation;
  slaBreachRisk: number; // 0 to 100%
}

export interface MitigationRecommendation {
  actionId: string;
  title: string;
  targetSubsystem: 'O-RAN Non-RT RIC' | 'Near-RT RIC' | 'NFVI Orchestrator' | 'Transport SDN' | '5G Core AMF';
  summary: string;
  stepDetails: string[];
  estimatedResolutionTimeMins: number;
  slaImpactMitigated: string;
}

export interface IncidentAlert {
  id: string;
  timestamp: number;
  timeFormatted: string;
  cellId: string;
  gNodeBId: string;
  sliceId: string;
  faultType: FaultScenarioId;
  faultName: string;
  severity: RiskLevel;
  status: IncidentStatus;
  faultProbability: number;
  leadTimeHorizon: string; // e.g. "18.5 mins ahead of SLA breach"
  anomalyScore: number;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  acknowledgmentNotes?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  mitigationApplied?: string;
  kpiSummary: {
    primaryTrigger: string;
    triggerValue: string;
    thresholdBreached: string;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  timeFormatted: string;
  operator: string;
  action: string;
  target: string;
  details: string;
  result: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface GNodeBNode {
  id: string;
  name: string;
  location: string;
  status: 'ONLINE' | 'DEGRADED' | 'CRITICAL';
  cells: string[];
  ipAddress: string;
  totalUes: number;
  avgThroughput: number;
  riskScore: number;
}

export interface FaultScenarioConfig {
  id: FaultScenarioId;
  name: string;
  subsystem: string;
  telecomDescription: string;
  slaRiskDescription: string;
  leadTimeDefault: number;
  baseSeverity: RiskLevel;
  symptoms: {
    kpi: string;
    expectedNominal: string;
    faultState: string;
  }[];
  mitigation: MitigationRecommendation;
}
