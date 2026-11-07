/**
 * Enhancement 2: Intelligent Kafka Pipeline Reliability & Data-Quality Gate Engine
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import {
  TelemetryKafkaEvent,
  KafkaTopicStats,
  KafkaConsumerGroupStats,
  PredictionQualityGate,
  PipelineExperimentState,
} from '../types/kafka';
import { TelemetrySample } from '../types/telemetry';

export const INITIAL_KAFKA_TOPICS: KafkaTopicStats[] = [
  { topic: '5g.telemetry.raw', partitionCount: 6, replicationFactor: 3, totalMessagesEmitted: 184520, producerRateMsgsSec: 1000, retentionHours: 72, bytesPerSec: 1420000 },
  { topic: '5g.telemetry.processed', partitionCount: 6, replicationFactor: 3, totalMessagesEmitted: 184200, producerRateMsgsSec: 1000, retentionHours: 72, bytesPerSec: 1250000 },
  { topic: '5g.fault.predictions', partitionCount: 3, replicationFactor: 3, totalMessagesEmitted: 36840, producerRateMsgsSec: 200, retentionHours: 168, bytesPerSec: 180000 },
  { topic: '5g.anomaly.events', partitionCount: 3, replicationFactor: 3, totalMessagesEmitted: 4120, producerRateMsgsSec: 25, retentionHours: 336, bytesPerSec: 32000 },
  { topic: '5g.incidents', partitionCount: 2, replicationFactor: 3, totalMessagesEmitted: 240, producerRateMsgsSec: 2, retentionHours: 720, bytesPerSec: 8500 },
];

export const INITIAL_CONSUMER_GROUPS: KafkaConsumerGroupStats[] = [
  {
    groupId: 'cg-telemetry-proc',
    targetTopic: '5g.telemetry.raw',
    assignedPartitions: [0, 1, 2, 3, 4, 5],
    currentOffset: 184510,
    logEndOffset: 184520,
    consumerLag: 10,
    consumerRateMsgsSec: 1000,
    processingLatencyMs: 3.4,
    status: 'ACTIVE',
    lastProcessedEventId: 'evt-proc-9941',
    lastProcessedTime: Date.now() - 40,
  },
  {
    groupId: 'cg-ml-inference',
    targetTopic: '5g.telemetry.processed',
    assignedPartitions: [0, 1, 2, 3, 4, 5],
    currentOffset: 184185,
    logEndOffset: 184200,
    consumerLag: 15,
    consumerRateMsgsSec: 1000,
    processingLatencyMs: 8.2,
    status: 'ACTIVE',
    lastProcessedEventId: 'evt-ml-4412',
    lastProcessedTime: Date.now() - 35,
  },
  {
    groupId: 'cg-db-sink',
    targetTopic: '5g.telemetry.processed',
    assignedPartitions: [0, 1, 2, 3, 4, 5],
    currentOffset: 184160,
    logEndOffset: 184200,
    consumerLag: 40,
    consumerRateMsgsSec: 990,
    processingLatencyMs: 14.5,
    status: 'ACTIVE',
    lastProcessedEventId: 'evt-db-8891',
    lastProcessedTime: Date.now() - 60,
  },
  {
    groupId: 'cg-alert-dispatcher',
    targetTopic: '5g.fault.predictions',
    assignedPartitions: [0, 1, 2],
    currentOffset: 36838,
    logEndOffset: 36840,
    consumerLag: 2,
    consumerRateMsgsSec: 200,
    processingLatencyMs: 4.8,
    status: 'ACTIVE',
    lastProcessedEventId: 'evt-alt-0021',
    lastProcessedTime: Date.now() - 120,
  },
];

/**
 * Computes dynamic pipeline metrics and prediction quality gate state
 */
export function evaluatePipelineReliability(
  experiment: PipelineExperimentState,
  currentTelemetry: TelemetrySample
): {
  topics: KafkaTopicStats[];
  consumerGroups: KafkaConsumerGroupStats[];
  qualityGate: PredictionQualityGate;
  sampleEvent: TelemetryKafkaEvent;
} {
  const now = Date.now();
  let mlConsumerLag = 15;
  let producerRate = 1000;
  let mlConsumerRate = 1000;
  let processingLatency = 8.2;
  let consumerStatus: 'ACTIVE' | 'SLOW' | 'CRASHED' | 'REBALANCING' = 'ACTIVE';
  let missingnessRatio = 1.0;

  // Simulate experimental bottleneck modes
  switch (experiment.activeFailureMode) {
    case 'PRODUCER_BURST':
      producerRate = experiment.burstRateMsgsSec || 3500;
      mlConsumerRate = 1000;
      // Lag accumulates at (3500 - 1000) = 2500 msgs/sec
      mlConsumerLag = Math.min(25000, 15 + Math.round(experiment.elapsedSeconds * (producerRate - mlConsumerRate)));
      processingLatency = 45.0 + Math.min(300, experiment.elapsedSeconds * 12);
      consumerStatus = 'SLOW';
      break;

    case 'SLOW_ML_CONSUMER':
      producerRate = 1000;
      mlConsumerRate = 280; // Choked consumer
      mlConsumerLag = Math.min(18000, 15 + Math.round(experiment.elapsedSeconds * (1000 - 280)));
      processingLatency = 140.0;
      consumerStatus = 'SLOW';
      break;

    case 'CONSUMER_CRASH':
      producerRate = 1000;
      mlConsumerRate = 0; // Crashed
      mlConsumerLag = Math.min(35000, 15 + Math.round(experiment.elapsedSeconds * 1000));
      processingLatency = 9999.0;
      consumerStatus = 'CRASHED';
      break;

    case 'STORAGE_SLOWDOWN':
      producerRate = 1000;
      mlConsumerRate = 950;
      mlConsumerLag = 120;
      break;

    case 'NONE':
    default:
      producerRate = 1000;
      mlConsumerRate = 1000;
      mlConsumerLag = 12 + Math.round(Math.random() * 8);
      processingLatency = 7.5 + Math.random() * 2;
      consumerStatus = 'ACTIVE';
      break;
  }

  // Telemetry freshness in milliseconds
  // When consumer is lagging, incoming inference events are stale
  const lagDelayMs = (mlConsumerLag / mlConsumerRate) * 1000 || 0;
  const telemetryFreshnessMs = Math.round(40 + (consumerStatus === 'CRASHED' ? experiment.elapsedSeconds * 1000 : lagDelayMs));

  // Prediction-Quality Gate Logic
  let gateStatus: any = 'TRUSTED';
  let confidenceScore = 99.4;
  let bottleneckDetected = false;
  let advisory = 'Kafka event stream healthy. Telemetry freshness < 100ms with zero message drop.';
  const imbalanceRate = producerRate - mlConsumerRate;

  if (consumerStatus === 'CRASHED') {
    gateStatus = 'CRITICAL_PIPELINE_LAG';
    confidenceScore = 12.0;
    bottleneckDetected = true;
    advisory = 'CRITICAL: ML inference consumer group crashed. Telemetry stream stalled. Inferences blocked.';
  } else if (mlConsumerLag > 4000 || telemetryFreshnessMs > 4000) {
    gateStatus = 'DEGRADED_STALE';
    confidenceScore = Math.max(30, 99.4 - (telemetryFreshnessMs / 200));
    bottleneckDetected = true;
    advisory = `WARNING: Telemetry is ${telemetryFreshnessMs}ms STALE due to consumer backlog. Downstream fault predictions tagged as DEGRADED / UNTRUSTED.`;
  } else if (mlConsumerLag > 800) {
    gateStatus = 'DEGRADED_STALE';
    confidenceScore = 84.0;
    bottleneckDetected = true;
    advisory = 'Buffer queue building up. Lag trend indicates impending prediction staleness.';
  }

  // Estimated time to Kafka buffer exhaustion (e.g. at 50,000 message high watermark)
  let exhaustionSec: number | null = null;
  if (imbalanceRate > 0) {
    const remainingCapacity = Math.max(0, 50000 - mlConsumerLag);
    exhaustionSec = Math.round(remainingCapacity / imbalanceRate);
  }

  const updatedConsumerGroups: KafkaConsumerGroupStats[] = INITIAL_CONSUMER_GROUPS.map(cg => {
    if (cg.groupId === 'cg-ml-inference') {
      return {
        ...cg,
        consumerLag: mlConsumerLag,
        consumerRateMsgsSec: mlConsumerRate,
        processingLatencyMs: Number(processingLatency.toFixed(1)),
        status: consumerStatus,
        lastProcessedTime: now - Math.min(10000, telemetryFreshnessMs),
      };
    }
    return cg;
  });

  const updatedTopics: KafkaTopicStats[] = INITIAL_KAFKA_TOPICS.map(t => {
    if (t.topic === '5g.telemetry.raw' || t.topic === '5g.telemetry.processed') {
      return {
        ...t,
        producerRateMsgsSec: producerRate,
      };
    }
    return t;
  });

  // Construct representative versioned Kafka event payload
  const sampleEvent: TelemetryKafkaEvent = {
    event_id: `evt-${Math.floor(100000 + Math.random() * 900000)}`,
    event_time: now - telemetryFreshnessMs,
    ingestion_time: now - Math.round(telemetryFreshnessMs * 0.8),
    site_id: 'SITE-01',
    cell_id: currentTelemetry.cellId,
    component_id: 'RU-01A',
    source: 'E2-KPM-Agent',
    schema_version: 'v1.4.2',
    kpis: {
      rsrp: currentTelemetry.rsrp,
      sinr: currentTelemetry.sinr,
      prbUtilization: currentTelemetry.prbUtilization,
      latency: currentTelemetry.latency,
      ecpriFrameLoss: currentTelemetry.ecpriFrameLoss,
      dlThroughput: currentTelemetry.dlThroughput,
      cpuUtilization: currentTelemetry.cpuUtilization,
      serviceAvailability: currentTelemetry.serviceAvailability,
    },
    completenessRatio: missingnessRatio,
  };

  return {
    topics: updatedTopics,
    consumerGroups: updatedConsumerGroups,
    qualityGate: {
      gateStatus,
      qualityConfidenceScore: Number(confidenceScore.toFixed(1)),
      telemetryFreshnessMs,
      dataCompletenessPercent: Math.round(missingnessRatio * 100),
      bottleneckDetected,
      activeImbalanceRateMsgsSec: imbalanceRate,
      estimatedTimeToBufferExhaustionSeconds: exhaustionSec,
      advisory,
    },
    sampleEvent,
  };
}
