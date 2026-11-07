/**
 * Enhancement 3: Adaptive Fault Prediction & Concept Drift Types
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

export type DriftDetectorAlgorithm = 'ADWIN' | 'Page-Hinkley' | 'KS-Test';

export interface DriftDetectionEvent {
  id: string;
  timestamp: number;
  timeFormatted: string;
  metric: 'prbUtilization' | 'latency' | 'rsrp' | 'dlThroughput';
  detector: DriftDetectorAlgorithm;
  driftMagnitudeSigma: number; // e.g. +3.8 sigma shift
  pValue: number;
  status: 'WARNING' | 'CONFIRMED' | 'ADAPTED' | 'DISMISSED';
  dataQualityVerified: boolean; // Must be true so broken pipeline doesn't trigger retraining
  details: string;
}

export interface ModelVersionMetadata {
  version: string; // e.g. 'v1.0.0-reference', 'v1.1.0-adapted'
  isCurrentProduction: boolean;
  isReferenceBaseline: boolean;
  trainingWindow: string; // e.g. '2026-10-01 to 2026-10-20'
  validationWindow: string; // '2026-10-21 to 2026-10-31 (Time-separated)'
  precision: number;
  recall: number;
  f1Score: number;
  inferenceLatencyMs: number;
  oodDetectionAccuracy: number;
  driftResistanceScore: number;
  deployedAt?: string;
  deployedBy?: string;
}

export interface OodDetectionResult {
  isUnknownFault: boolean;
  oodScore: number; // 0.0 (in-distribution) to 1.0 (completely novel)
  nearestKnownScenario: string;
  confidenceInKnownClasses: number; // %
  advisory: string;
}

export interface ModelAdaptationPipelineStatus {
  activeStep: 'IDLE' | 'DRIFT_DETECTED' | 'QUALITY_CHECK' | 'RETRAINING_CANDIDATE' | 'TIME_SEPARATED_VALIDATION' | 'DEPLOYED';
  candidateVersion: string | null;
  candidateF1: number | null;
  referenceF1: number;
  acceptanceCriteriaMet: boolean;
  canRollback: boolean;
  progressPercent: number;
  message: string;
}
