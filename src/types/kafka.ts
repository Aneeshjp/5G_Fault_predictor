/**
 * Enhancement 2: Intelligent Kafka Pipeline Reliability & Data-Quality Gate Types
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

export interface TelemetryKafkaEvent {
  event_id: string; // UUID v4
  event_time: number; // Origin timestamp (ms)
  ingestion_time: number; // Kafka broker arrival timestamp (ms)
  site_id: string;
  cell_id: string;
  component_id: string;
  source: 'O-RAN-O1-Collector' | 'E2-KPM-Agent' | 'Transport-SDN-Telemetry' | 'NFVI-cAdvisor';
  schema_version: 'v1.4.2';
  kpis: {
    rsrp: number;
    sinr: number;
    prbUtilization: number;
    latency: number;
    ecpriFrameLoss: number;
    dlThroughput: number;
    cpuUtilization: number;
    serviceAvailability: number;
  };
  completenessRatio: number; // 0.0 to 1.0 (checks missingness)
}

export interface KafkaTopicStats {
  topic: string;
  partitionCount: number;
  replicationFactor: number;
  totalMessagesEmitted: number;
  producerRateMsgsSec: number;
  retentionHours: number;
  bytesPerSec: number;
}

export interface KafkaConsumerGroupStats {
  groupId: string;
  targetTopic: string;
  assignedPartitions: number[];
  currentOffset: number;
  logEndOffset: number;
  consumerLag: number; // Messages queued
  consumerRateMsgsSec: number;
  processingLatencyMs: number;
  status: 'ACTIVE' | 'SLOW' | 'CRASHED' | 'REBALANCING';
  lastProcessedEventId: string;
  lastProcessedTime: number;
}

export type PredictionGateStatus =
  | 'TRUSTED'               // Freshness < 1500ms, completeness == 100%
  | 'DEGRADED_STALE'        // Freshness > 4000ms due to consumer lag
  | 'DEGRADED_INCOMPLETE'   // Missing KPIs (< 85% fields present)
  | 'CRITICAL_PIPELINE_LAG';// Lag > 5000 messages, ML inferences stalled

export interface PredictionQualityGate {
  gateStatus: PredictionGateStatus;
  qualityConfidenceScore: number; // 0 - 100%
  telemetryFreshnessMs: number; // Age of telemetry event at inference time
  dataCompletenessPercent: number; // % of mandatory KPIs present
  bottleneckDetected: boolean;
  activeImbalanceRateMsgsSec: number; // Producer rate - Consumer rate
  estimatedTimeToBufferExhaustionSeconds: number | null;
  advisory: string;
}

export interface PipelineExperimentState {
  activeFailureMode: 'NONE' | 'PRODUCER_BURST' | 'SLOW_ML_CONSUMER' | 'CONSUMER_CRASH' | 'STORAGE_SLOWDOWN';
  burstRateMsgsSec: number;
  injectedDelayMs: number;
  elapsedSeconds: number;
}
