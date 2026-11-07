/**
 * Unified Real-Time 5G Telemetry, Topology GNN, Kafka Pipeline & Adaptive ML Context
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import React, { createContext, useContext, useEffect, useRef, useState, useMemo } from 'react';
import {
  AuditLogEntry,
  FaultScenarioId,
  GNodeBNode,
  IncidentAlert,
  PredictionResult,
  TelemetrySample,
} from '../types/telemetry';
import {
  TopologyNode,
  TopologyEdge,
  SpatialTemporalDiagnosisResult,
} from '../types/topology';
import {
  KafkaTopicStats,
  KafkaConsumerGroupStats,
  PredictionQualityGate,
  PipelineExperimentState,
  TelemetryKafkaEvent,
} from '../types/kafka';
import {
  DriftDetectionEvent,
  ModelVersionMetadata,
  OodDetectionResult,
  ModelAdaptationPipelineStatus,
} from '../types/adaptation';

import { FAULT_SCENARIOS, GNODEB_FLEET } from '../simulator/scenarios';
import { evaluateTelemetrySample } from '../ml/models';
import {
  INITIAL_TOPOLOGY_NODES,
  INITIAL_TOPOLOGY_EDGES,
  calculateDynamicTopology,
} from '../topology/graphData';
import { evaluateSpatialTemporalTopologyDiagnosis } from '../topology/gnnModel';
import {
  INITIAL_KAFKA_TOPICS,
  INITIAL_CONSUMER_GROUPS,
  evaluatePipelineReliability,
} from '../kafka/pipelineEngine';
import {
  INITIAL_MODEL_REGISTRY,
  evaluateConceptDrift,
} from '../adaptation/driftEngine';

interface TelemetryContextType {
  // Topology & Selection
  fleet: GNodeBNode[];
  selectedGNodeB: string;
  setSelectedGNodeB: (id: string) => void;
  selectedCell: string;
  setSelectedCell: (cell: string) => void;
  selectedSlice: string;
  setSelectedSlice: (slice: string) => void;

  // Real-Time Telemetry & History
  currentTelemetry: TelemetrySample;
  telemetryHistory: TelemetrySample[];
  prediction: PredictionResult;
  predictionHistory: { timestamp: number; timeString: string; probability: number; anomalyScore: number; riskScore: number }[];

  // Simulation Controls & Fault State
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  streamSpeed: number;
  setStreamSpeed: (speed: number) => void;
  noiseLevel: number;
  setNoiseLevel: (n: number) => void;
  activeScenario: FaultScenarioId | null;
  scenarioTimeElapsedSeconds: number;
  scenarioTargetCell: string | null;
  injectFault: (scenarioId: FaultScenarioId, cellId?: string) => void;
  clearFault: () => void;

  // Incidents & Alert Center
  alerts: IncidentAlert[];
  activeAlertsCount: number;
  criticalAlertsCount: number;
  acknowledgeAlert: (alertId: string, operator: string, notes: string) => void;
  resolveAlert: (alertId: string, operator: string, notes: string, rootCause: string) => void;
  executeAutonomousMitigation: (alertId?: string, scenarioId?: FaultScenarioId) => Promise<boolean>;
  isMitigating: boolean;
  mitigationStatusText: string;

  // Audit Logs & Audio
  auditLogs: AuditLogEntry[];
  audioAlertsEnabled: boolean;
  setAudioAlertsEnabled: (enabled: boolean) => void;

  // Data Export
  exportTelemetryCSV: () => void;
  exportTelemetryJSON: () => void;

  // ENHANCEMENT 1: Topology-Aware Fault Diagnosis
  topologyNodes: TopologyNode[];
  topologyEdges: TopologyEdge[];
  selectedTopologyNode: TopologyNode | null;
  setSelectedTopologyNode: (node: TopologyNode | null) => void;
  stDiagnosis: SpatialTemporalDiagnosisResult;

  // ENHANCEMENT 2: Kafka Pipeline Reliability & Data-Quality Gate
  kafkaTopics: KafkaTopicStats[];
  kafkaConsumerGroups: KafkaConsumerGroupStats[];
  pipelineQualityGate: PredictionQualityGate;
  pipelineExperiment: PipelineExperimentState;
  setPipelineExperiment: (exp: PipelineExperimentState) => void;
  triggerPipelineBurst: () => void;
  triggerSlowConsumer: () => void;
  triggerConsumerCrash: () => void;
  resetPipeline: () => void;
  sampleKafkaEvent: TelemetryKafkaEvent | null;

  // ENHANCEMENT 3: Adaptive Fault Prediction & Concept Drift
  modelRegistry: ModelVersionMetadata[];
  activeModelVersion: string;
  driftEvents: DriftDetectionEvent[];
  oodResult: OodDetectionResult;
  adaptationPipelineStatus: ModelAdaptationPipelineStatus;
  triggerAdaptationWorkflow: () => Promise<boolean>;
  rollbackToBaseline: () => void;
  injectUnseenCompoundFault: () => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fleet] = useState<GNodeBNode[]>(GNODEB_FLEET);
  const [selectedGNodeB, setSelectedGNodeB] = useState<string>('gNB-001');
  const [selectedCell, setSelectedCell] = useState<string>('Cell-01A (Band n78)');
  const [selectedSlice, setSelectedSlice] = useState<string>('slice-embb-01');

  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamSpeed, setStreamSpeed] = useState<number>(1);
  const [noiseLevel, setNoiseLevel] = useState<number>(1.0);

  const [activeScenario, setActiveScenario] = useState<FaultScenarioId | null>(null);
  const [scenarioTimeElapsedSeconds, setScenarioTimeElapsedSeconds] = useState<number>(0);
  const [scenarioTargetCell, setScenarioTargetCell] = useState<string | null>(null);

  const [isMitigating, setIsMitigating] = useState<boolean>(false);
  const [mitigationStatusText, setMitigationStatusText] = useState<string>('');
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState<boolean>(false);

  // ENHANCEMENT 1 STATE: Topology Graph
  const [rawNodes, setRawNodes] = useState<TopologyNode[]>(INITIAL_TOPOLOGY_NODES);
  const [rawEdges, setRawEdges] = useState<TopologyEdge[]>(INITIAL_TOPOLOGY_EDGES);
  const [selectedTopologyNode, setSelectedTopologyNode] = useState<TopologyNode | null>(null);

  // ENHANCEMENT 2 STATE: Kafka Pipeline Experiments
  const [pipelineExperiment, setPipelineExperiment] = useState<PipelineExperimentState>({
    activeFailureMode: 'NONE',
    burstRateMsgsSec: 1000,
    injectedDelayMs: 0,
    elapsedSeconds: 0,
  });

  // ENHANCEMENT 3 STATE: Model Registry & Adaptation Pipeline
  const [modelRegistry, setModelRegistry] = useState<ModelVersionMetadata[]>(INITIAL_MODEL_REGISTRY);
  const [activeModelVersion, setActiveModelVersion] = useState<string>('v1.0.0-reference');
  const [adaptationPipelineStatus, setAdaptationPipelineStatus] = useState<ModelAdaptationPipelineStatus>({
    activeStep: 'IDLE',
    candidateVersion: 'v1.1.0-adaptive-candidate',
    candidateF1: 99.89,
    referenceF1: 99.66,
    acceptanceCriteriaMet: true,
    canRollback: false,
    progressPercent: 0,
    message: 'System operating on verified reference model v1.0.0.',
  });

  // Current Telemetry
  const [currentTelemetry, setCurrentTelemetry] = useState<TelemetrySample>(() => ({
    timestamp: Date.now(),
    timeString: new Date().toLocaleTimeString(),
    cellId: 'Cell-01A (Band n78)',
    gNodeBId: 'gNB-001',
    sliceId: 'slice-embb-01',
    rsrp: -86.4,
    rsrq: -10.8,
    sinr: 19.2,
    cqi: 13,
    latency: 8.2,
    jitter: 0.42,
    packetLoss: 0.004,
    ecpriFrameLoss: 0.0007,
    dlThroughput: 895.0,
    ulThroughput: 148.0,
    prbUtilization: 44.2,
    cpuUtilization: 32.5,
    memoryUtilization: 39.8,
    activeUes: 142,
    pduSessions: 284,
    serviceAvailability: 99.98,
  }));

  // History Window (last 30 samples)
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetrySample[]>(() => {
    const list: TelemetrySample[] = [];
    const now = Date.now();
    for (let i = 25; i >= 0; i--) {
      const ts = now - i * 2000;
      list.push({
        timestamp: ts,
        timeString: new Date(ts).toLocaleTimeString(),
        cellId: 'Cell-01A (Band n78)',
        gNodeBId: 'gNB-001',
        sliceId: 'slice-embb-01',
        rsrp: -86.0 + gaussianRandom(0, 1.2),
        rsrq: -11.0 + gaussianRandom(0, 0.4),
        sinr: 19.0 + gaussianRandom(0, 0.8),
        cqi: 13,
        latency: 8.0 + gaussianRandom(0, 0.3),
        jitter: 0.4 + gaussianRandom(0, 0.05),
        packetLoss: 0.004,
        ecpriFrameLoss: 0.0006,
        dlThroughput: 890 + gaussianRandom(0, 20),
        ulThroughput: 145 + gaussianRandom(0, 5),
        prbUtilization: 43.0 + gaussianRandom(0, 2.5),
        cpuUtilization: 32.0 + gaussianRandom(0, 1.8),
        memoryUtilization: 40.0 + gaussianRandom(0, 1.2),
        activeUes: Math.round(140 + gaussianRandom(0, 4)),
        pduSessions: 280,
        serviceAvailability: 99.98,
      });
    }
    return list;
  });

  const [prediction, setPrediction] = useState<PredictionResult>(() =>
    evaluateTelemetrySample(currentTelemetry)
  );

  const [predictionHistory, setPredictionHistory] = useState<
    { timestamp: number; timeString: string; probability: number; anomalyScore: number; riskScore: number }[]
  >([]);

  // Incidents seed
  const [alerts, setAlerts] = useState<IncidentAlert[]>([
    {
      id: 'ALT-5G-9021',
      timestamp: Date.now() - 32 * 60 * 1000,
      timeFormatted: '32 mins ago',
      cellId: 'Cell-03A (Band n78 Mass-MIMO)',
      gNodeBId: 'gNB-003',
      sliceId: 'slice-embb-01',
      faultType: 'cell_congestion',
      faultName: 'Cell Resource Saturation & Flash Crowd Congestion',
      severity: 'HIGH',
      status: 'ACKNOWLEDGED',
      faultProbability: 88.4,
      leadTimeHorizon: '17.2 mins ahead of SLA breach',
      anomalyScore: -0.21,
      acknowledgedBy: 'NOC Lead Operator (Sarah Chen)',
      acknowledgedAt: '24 mins ago',
      acknowledgmentNotes: 'Massive surge observed during stadium concert pre-show. Applying dynamic PRB reallocation.',
      kpiSummary: {
        primaryTrigger: 'PRB Quota Utilization',
        triggerValue: '96.2%',
        thresholdBreached: '> 75.0% (3GPP Critical)',
      },
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'LOG-001',
      timestamp: Date.now() - 45 * 60 * 1000,
      timeFormatted: '45m ago',
      operator: 'Field Transport Eng (M. Davis)',
      action: 'RESOLVE_INCIDENT',
      target: 'ALT-5G-8914 / Cell-02A',
      details: 'Applied ACT-ECPRI-FEC-03 mitigation and closed incident with root cause: Optical Fiber Dust Ingress.',
      result: 'SUCCESS',
    },
    {
      id: 'LOG-002',
      timestamp: Date.now() - 24 * 60 * 1000,
      timeFormatted: '24m ago',
      operator: 'NOC Lead Operator (Sarah Chen)',
      action: 'ACKNOWLEDGE_INCIDENT',
      target: 'ALT-5G-9021 / Cell-03A',
      details: 'Acknowledged high congestion alert. Dispatched Near-RT RIC xApp quota balancer.',
      result: 'SUCCESS',
    },
  ]);

  // Audio helper
  const playAlertSound = (type: 'CRITICAL' | 'RESOLVED') => {
    if (!audioAlertsEnabled || typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'CRITICAL') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // Ignore audio policy
    }
  };

  // Evaluate dynamic topology
  const { updatedNodes: topologyNodes, updatedEdges: topologyEdges } = useMemo(
    () => calculateDynamicTopology(rawNodes, rawEdges, currentTelemetry, activeScenario),
    [rawNodes, rawEdges, currentTelemetry, activeScenario]
  );

  // Evaluate Spatial-Temporal Diagnosis
  const stDiagnosis = useMemo(
    () => evaluateSpatialTemporalTopologyDiagnosis(currentTelemetry, activeScenario, topologyNodes),
    [currentTelemetry, activeScenario, topologyNodes]
  );

  // Evaluate Kafka Pipeline Reliability & Prediction Quality Gate
  const {
    topics: kafkaTopics,
    consumerGroups: kafkaConsumerGroups,
    qualityGate: pipelineQualityGate,
    sampleEvent: sampleKafkaEvent,
  } = useMemo(
    () => evaluatePipelineReliability(pipelineExperiment, currentTelemetry),
    [pipelineExperiment, currentTelemetry]
  );

  // Evaluate Concept Drift & OOD Detection
  const {
    activeEvents: driftEvents,
    oodResult,
    overallStatus: driftOverallStatus,
  } = useMemo(
    () =>
      evaluateConceptDrift(
        currentTelemetry,
        telemetryHistory,
        pipelineQualityGate.gateStatus !== 'TRUSTED'
      ),
    [currentTelemetry, telemetryHistory, pipelineQualityGate.gateStatus]
  );

  // Main streaming loop
  const tickTelemetry = () => {
    const now = Date.now();
    const timeStr = new Date(now).toLocaleTimeString();
    const noise = noiseLevel;

    // Check if fault active
    const isFaultActiveForCell = activeScenario !== null && (scenarioTargetCell === null || scenarioTargetCell === selectedCell);
    const faultConfig = activeScenario ? FAULT_SCENARIOS[activeScenario] : null;

    let rsrp = -86.5 + gaussianRandom(0, 1.2 * noise);
    let rsrq = -11.0 + gaussianRandom(0, 0.5 * noise);
    let sinr = 18.8 + gaussianRandom(0, 1.0 * noise);
    let cqi = 13;
    let latency = 8.2 + gaussianRandom(0, 0.4 * noise);
    let jitter = 0.42 + gaussianRandom(0, 0.08 * noise);
    let packetLoss = Math.max(0, 0.004 + gaussianRandom(0, 0.002 * noise));
    let ecpriFrameLoss = Math.max(0, 0.0007 + gaussianRandom(0, 0.0003 * noise));
    let dlThroughput = 890 + gaussianRandom(0, 25 * noise);
    let ulThroughput = 146 + gaussianRandom(0, 6 * noise);
    let prbUtilization = 43.5 + gaussianRandom(0, 3.0 * noise);
    let cpuUtilization = 33.0 + gaussianRandom(0, 2.0 * noise);
    let memoryUtilization = 40.5 + gaussianRandom(0, 1.5 * noise);
    let activeUes = Math.max(10, Math.round(145 + gaussianRandom(0, 6 * noise)));
    let pduSessions = activeUes * 2;
    let serviceAvailability = 99.98;

    if (isFaultActiveForCell && faultConfig) {
      const ramp = Math.min(1.0, 0.35 + (scenarioTimeElapsedSeconds / 15) * 0.65);

      switch (activeScenario) {
        case 'radio_degradation':
          rsrp = -86.5 - ramp * 44.0 + gaussianRandom(0, 2.0);
          sinr = 18.8 - ramp * 23.0 + gaussianRandom(0, 0.8);
          cqi = Math.max(2, Math.round(13 - ramp * 10));
          dlThroughput = Math.max(18, dlThroughput * (1 - ramp * 0.85));
          break;

        case 'cell_congestion':
          prbUtilization = 43.5 + ramp * 54.0 + gaussianRandom(0, 1.5);
          activeUes = Math.round(145 + ramp * 390 + gaussianRandom(0, 15));
          pduSessions = activeUes * 2;
          dlThroughput = Math.max(45, 890 * (1 - ramp * 0.9));
          latency = 8.2 + ramp * 48.0;
          break;

        case 'packet_loss_instability':
          ecpriFrameLoss = ramp * 24.5 + gaussianRandom(0, 2.0);
          jitter = 0.42 + ramp * 18.2 + gaussianRandom(0, 1.5);
          sinr = Math.max(2.0, sinr - ramp * 12.0);
          dlThroughput = Math.max(30, dlThroughput * (1 - ramp * 0.82));
          break;

        case 'increased_latency':
          latency = 8.2 + ramp * 270.0 + gaussianRandom(0, 12.0);
          jitter = 0.42 + ramp * 36.0 + gaussianRandom(0, 4.0);
          packetLoss = Math.min(12, packetLoss + ramp * 8.5);
          break;

        case 'throughput_degradation':
          dlThroughput = Math.max(11, 890 * (1 - ramp * 0.985) + gaussianRandom(0, 2));
          ulThroughput = Math.max(4, 146 * (1 - ramp * 0.95));
          break;

        case 'cpu_memory_saturation':
          cpuUtilization = 33.0 + ramp * 65.5 + gaussianRandom(0, 1.2);
          memoryUtilization = 40.5 + ramp * 58.0 + gaussianRandom(0, 0.8);
          latency = 8.2 + ramp * 55.0;
          break;

        case 'backhaul_interruption':
          packetLoss = ramp * 86.0 + gaussianRandom(0, 3.0);
          serviceAvailability = Math.max(12, 99.98 - ramp * 85.0);
          dlThroughput = Math.max(5, dlThroughput * (1 - ramp * 0.97));
          break;

        case 'service_availability_degradation':
          serviceAvailability = Math.max(38, 99.98 - ramp * 58.0);
          activeUes = Math.max(20, Math.round(activeUes * (1 - ramp * 0.75)));
          pduSessions = Math.round(activeUes * 1.5);
          break;
      }
    }

    const newSample: TelemetrySample = {
      timestamp: now,
      timeString: timeStr,
      cellId: selectedCell,
      gNodeBId: selectedGNodeB,
      sliceId: selectedSlice,
      rsrp: Number(rsrp.toFixed(1)),
      rsrq: Number(rsrq.toFixed(1)),
      sinr: Number(sinr.toFixed(1)),
      cqi: Math.max(1, Math.min(15, Math.round(cqi))),
      latency: Number(latency.toFixed(1)),
      jitter: Number(jitter.toFixed(2)),
      packetLoss: Number(packetLoss.toFixed(3)),
      ecpriFrameLoss: Number(ecpriFrameLoss.toFixed(3)),
      dlThroughput: Number(dlThroughput.toFixed(1)),
      ulThroughput: Number(ulThroughput.toFixed(1)),
      prbUtilization: Number(Math.min(100, Math.max(0, prbUtilization)).toFixed(1)),
      cpuUtilization: Number(Math.min(100, Math.max(0, cpuUtilization)).toFixed(1)),
      memoryUtilization: Number(Math.min(100, Math.max(0, memoryUtilization)).toFixed(1)),
      activeUes,
      pduSessions,
      serviceAvailability: Number(Math.max(0, Math.min(100, serviceAvailability)).toFixed(2)),
    };

    setCurrentTelemetry(newSample);

    setTelemetryHistory(prev => {
      const next = [...prev, newSample];
      if (next.length > 40) next.shift();
      return next;
    });

    const newPrediction = evaluateTelemetrySample(newSample);
    setPrediction(newPrediction);

    setPredictionHistory(prev => {
      const item = {
        timestamp: now,
        timeString: timeStr,
        probability: newPrediction.faultProbability,
        anomalyScore: newPrediction.anomalyScore,
        riskScore: newPrediction.riskScore,
      };
      const next = [...prev, item];
      if (next.length > 40) next.shift();
      return next;
    });

    // Alert generator
    if (newPrediction.riskLevel === 'HIGH' || newPrediction.riskLevel === 'CRITICAL') {
      setAlerts(prev => {
        const existingOpen = prev.find(
          a => a.cellId === selectedCell && a.status !== 'RESOLVED' && a.faultType === newPrediction.predictedFaultType
        );
        if (existingOpen) return prev;

        const newAlertId = `ALT-5G-${Math.floor(1000 + Math.random() * 9000)}`;
        const topContr = newPrediction.featureContributions[0];
        const newAlert: IncidentAlert = {
          id: newAlertId,
          timestamp: now,
          timeFormatted: 'Just now',
          cellId: selectedCell,
          gNodeBId: selectedGNodeB,
          sliceId: selectedSlice,
          faultType: newPrediction.predictedFaultType as FaultScenarioId,
          faultName: newPrediction.predictedFaultName,
          severity: newPrediction.riskLevel,
          status: 'OPEN',
          faultProbability: newPrediction.faultProbability,
          leadTimeHorizon: `${newPrediction.leadTimeMinutes} mins ahead of SLA breach`,
          anomalyScore: newPrediction.anomalyScore,
          kpiSummary: {
            primaryTrigger: topContr ? topContr.name : 'Multivariate Anomaly',
            triggerValue: topContr ? `${topContr.rawValue} ${topContr.unit}` : 'Threshold breached',
            thresholdBreached: topContr ? `Nominal: ${topContr.nominalRange}` : 'Out of bound',
          },
        };

        if (newPrediction.riskLevel === 'CRITICAL') {
          playAlertSound('CRITICAL');
        }

        setAuditLogs(logs => [
          {
            id: `LOG-${Date.now()}`,
            timestamp: now,
            timeFormatted: 'Just now',
            operator: 'Spatial-Temporal GNN + RF Engine',
            action: 'DISPATCH_ALERT',
            target: `${newAlertId} / ${selectedCell}`,
            details: `Forecasted ${newAlert.faultName} with ${newAlert.leadTimeHorizon}. Root-Cause candidate identified.`,
            result: 'WARNING',
          },
          ...logs,
        ]);

        return [newAlert, ...prev];
      });
    }

    if (activeScenario) {
      setScenarioTimeElapsedSeconds(t => t + (2 / streamSpeed));
    }

    if (pipelineExperiment.activeFailureMode !== 'NONE') {
      setPipelineExperiment(prev => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + (2 / streamSpeed),
      }));
    }
  };

  const tickRef = useRef(tickTelemetry);
  tickRef.current = tickTelemetry;

  useEffect(() => {
    if (!isStreaming) return;
    const intervalMs = Math.max(300, 2000 / streamSpeed);
    const timer = setInterval(() => {
      tickRef.current();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isStreaming, streamSpeed]);

  const injectFault = (scenarioId: FaultScenarioId, cellId?: string) => {
    const target = cellId || selectedCell;
    setActiveScenario(scenarioId);
    setScenarioTargetCell(target);
    setScenarioTimeElapsedSeconds(0);

    const scenario = FAULT_SCENARIOS[scenarioId];
    setAuditLogs(logs => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: Date.now(),
        timeFormatted: 'Just now',
        operator: 'O-RAN Fault Injector',
        action: 'INJECT_FAULT_SCENARIO',
        target: `${scenarioId} on ${target}`,
        details: `Simulating ${scenario.name}. Lead time baseline: ${scenario.leadTimeDefault}m. Topology root-cause localization active.`,
        result: 'WARNING',
      },
      ...logs,
    ]);
  };

  const clearFault = () => {
    const priorScenario = activeScenario;
    setActiveScenario(null);
    setScenarioTargetCell(null);
    setScenarioTimeElapsedSeconds(0);

    setAuditLogs(logs => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: Date.now(),
        timeFormatted: 'Just now',
        operator: 'Telecom Operations Admin',
        action: 'CLEAR_FAULT_INJECTION',
        target: priorScenario ? `${priorScenario}` : 'Fleet',
        details: 'Manually cleared fault scenario. Topology and telemetry returning to nominal state.',
        result: 'SUCCESS',
      },
      ...logs,
    ]);
  };

  const acknowledgeAlert = (alertId: string, operator: string, notes: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId
          ? {
              ...a,
              status: 'ACKNOWLEDGED',
              acknowledgedBy: operator,
              acknowledgedAt: 'Just now',
              acknowledgmentNotes: notes,
            }
          : a
      )
    );

    setAuditLogs(logs => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: Date.now(),
        timeFormatted: 'Just now',
        operator,
        action: 'ACKNOWLEDGE_ALERT',
        target: alertId,
        details: `Operator assigned notes: "${notes}". Incident moved to ACKNOWLEDGED state.`,
        result: 'SUCCESS',
      },
      ...logs,
    ]);
  };

  const resolveAlert = (alertId: string, operator: string, notes: string, rootCause: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId
          ? {
              ...a,
              status: 'RESOLVED',
              resolvedBy: operator,
              resolvedAt: 'Just now',
              resolutionNotes: notes,
              mitigationApplied: rootCause,
            }
          : a
      )
    );

    playAlertSound('RESOLVED');

    setAuditLogs(logs => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: Date.now(),
        timeFormatted: 'Just now',
        operator,
        action: 'RESOLVE_ALERT',
        target: alertId,
        details: `Closed incident with mitigation: ${rootCause}. Notes: "${notes}".`,
        result: 'SUCCESS',
      },
      ...logs,
    ]);
  };

  const executeAutonomousMitigation = async (alertId?: string, scenarioId?: FaultScenarioId): Promise<boolean> => {
    const scId = scenarioId || activeScenario;
    if (!scId) return false;

    const scenario = FAULT_SCENARIOS[scId];
    setIsMitigating(true);
    setMitigationStatusText(`Dispatched ${scenario.mitigation.title} to ${scenario.mitigation.targetSubsystem}...`);

    return new Promise(resolve => {
      setTimeout(() => {
        setMitigationStatusText('Executing Step: Handover fringe UEs & applying parameter recalibration...');
      }, 1000);

      setTimeout(() => {
        setMitigationStatusText('O-RAN Closed-Loop Verification: Telemetry stabilizing to nominal 3GPP limits.');
      }, 2200);

      setTimeout(() => {
        setIsMitigating(false);
        setMitigationStatusText('');
        clearFault();

        setAlerts(prev =>
          prev.map(a =>
            a.faultType === scId && a.status !== 'RESOLVED'
              ? {
                  ...a,
                  status: 'RESOLVED',
                  resolvedBy: 'Autonomous O-RAN xApp Controller',
                  resolvedAt: 'Just now',
                  resolutionNotes: scenario.mitigation.slaImpactMitigated,
                  mitigationApplied: scenario.mitigation.title,
                }
              : a
          )
        );

        playAlertSound('RESOLVED');

        setAuditLogs(logs => [
          {
            id: `LOG-${Date.now()}`,
            timestamp: Date.now(),
            timeFormatted: 'Just now',
            operator: 'Autonomous O-RAN Closed-Loop Controller',
            action: 'AUTONOMOUS_MITIGATION_EXECUTED',
            target: scenario.mitigation.actionId,
            details: `Successfully completed ${scenario.mitigation.title}. ${scenario.mitigation.slaImpactMitigated}`,
            result: 'SUCCESS',
          },
          ...logs,
        ]);

        resolve(true);
      }, 3400);
    });
  };

  // ENHANCEMENT 2: Kafka Pipeline Experiment Triggers
  const triggerPipelineBurst = () => {
    setPipelineExperiment({
      activeFailureMode: 'PRODUCER_BURST',
      burstRateMsgsSec: 3500,
      injectedDelayMs: 45,
      elapsedSeconds: 0,
    });
    setAuditLogs(logs => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: Date.now(),
        timeFormatted: 'Just now',
        operator: 'Kafka Reliability Testbed',
        action: 'PIPELINE_BURST_TRIGGERED',
        target: '5g.telemetry.raw',
        details: 'Simulating producer burst to 3,500 msgs/sec. Consumer lag accumulating at +2,500 msgs/s.',
        result: 'WARNING',
      },
      ...logs,
    ]);
  };

  const triggerSlowConsumer = () => {
    setPipelineExperiment({
      activeFailureMode: 'SLOW_ML_CONSUMER',
      burstRateMsgsSec: 1000,
      injectedDelayMs: 140,
      elapsedSeconds: 0,
    });
    setAuditLogs(logs => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: Date.now(),
        timeFormatted: 'Just now',
        operator: 'Kafka Reliability Testbed',
        action: 'SLOW_CONSUMER_INJECTED',
        target: 'cg-ml-inference',
        details: 'Simulating choked ML consumer throughput (280 msgs/sec). Downstream predictions flagged as DEGRADED_STALE.',
        result: 'WARNING',
      },
      ...logs,
    ]);
  };

  const triggerConsumerCrash = () => {
    setPipelineExperiment({
      activeFailureMode: 'CONSUMER_CRASH',
      burstRateMsgsSec: 1000,
      injectedDelayMs: 9999,
      elapsedSeconds: 0,
    });
    setAuditLogs(logs => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: Date.now(),
        timeFormatted: 'Just now',
        operator: 'Kafka Chaos Injector',
        action: 'CONSUMER_CRASH_SIMULATION',
        target: 'cg-ml-inference',
        details: 'Simulating total worker node failure. Consumer group stalled.',
        result: 'FAILED',
      },
      ...logs,
    ]);
  };

  const resetPipeline = () => {
    setPipelineExperiment({
      activeFailureMode: 'NONE',
      burstRateMsgsSec: 1000,
      injectedDelayMs: 0,
      elapsedSeconds: 0,
    });
    setAuditLogs(logs => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: Date.now(),
        timeFormatted: 'Just now',
        operator: 'Kafka Reliability Controller',
        action: 'PIPELINE_RESET',
        target: 'Broker Cluster',
        details: 'Drained lag backlog. Telemetry freshness restored to sub-50ms.',
        result: 'SUCCESS',
      },
      ...logs,
    ]);
  };

  // ENHANCEMENT 3: Model Adaptation & Retraining Workflow
  const triggerAdaptationWorkflow = async (): Promise<boolean> => {
    setAdaptationPipelineStatus({
      activeStep: 'QUALITY_CHECK',
      candidateVersion: 'v1.1.0-adaptive-candidate',
      candidateF1: 99.89,
      referenceF1: 99.66,
      acceptanceCriteriaMet: false,
      canRollback: false,
      progressPercent: 25,
      message: 'Checking Kafka Pipeline Quality Gate: verifying telemetry freshness and zero packet drop...',
    });

    return new Promise(resolve => {
      setTimeout(() => {
        setAdaptationPipelineStatus(prev => ({
          ...prev,
          activeStep: 'RETRAINING_CANDIDATE',
          progressPercent: 55,
          message: 'Data quality confirmed. Preparing candidate model weights from verified recent window B...',
        }));
      }, 1200);

      setTimeout(() => {
        setAdaptationPipelineStatus(prev => ({
          ...prev,
          activeStep: 'TIME_SEPARATED_VALIDATION',
          progressPercent: 85,
          message: 'Evaluating on held-out temporal validation window: Candidate F1=99.89% exceeds reference F1=99.66% (+0.23% delta)...',
        }));
      }, 2400);

      setTimeout(() => {
        setActiveModelVersion('v1.1.0-adaptive-candidate');
        setModelRegistry(reg =>
          reg.map(m => ({
            ...m,
            isCurrentProduction: m.version === 'v1.1.0-adaptive-candidate',
            deployedAt: m.version === 'v1.1.0-adaptive-candidate' ? 'Just now (Deployed)' : m.deployedAt,
          }))
        );

        setAdaptationPipelineStatus({
          activeStep: 'DEPLOYED',
          candidateVersion: 'v1.1.0-adaptive-candidate',
          candidateF1: 99.89,
          referenceF1: 99.66,
          acceptanceCriteriaMet: true,
          canRollback: true,
          progressPercent: 100,
          message: 'Adaptive candidate v1.1.0 successfully promoted to production champion. Rollback preserved.',
        });

        setAuditLogs(logs => [
          {
            id: `LOG-${Date.now()}`,
            timestamp: Date.now(),
            timeFormatted: 'Just now',
            operator: 'Adaptive ML Retraining Controller',
            action: 'MODEL_PROMOTED_CHAMPION',
            target: 'v1.1.0-adaptive-candidate',
            details: 'Promoted adapted model after statistical drift confirmation and time-separated validation pass.',
            result: 'SUCCESS',
          },
          ...logs,
        ]);

        resolve(true);
      }, 3600);
    });
  };

  const rollbackToBaseline = () => {
    setActiveModelVersion('v1.0.0-reference');
    setModelRegistry(reg =>
      reg.map(m => ({
        ...m,
        isCurrentProduction: m.version === 'v1.0.0-reference',
      }))
    );

    setAdaptationPipelineStatus({
      activeStep: 'IDLE',
      candidateVersion: null,
      candidateF1: null,
      referenceF1: 99.66,
      acceptanceCriteriaMet: false,
      canRollback: false,
      progressPercent: 0,
      message: 'Rolled back to reference baseline model v1.0.0.',
    });

    setAuditLogs(logs => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: Date.now(),
        timeFormatted: 'Just now',
        operator: 'Senior ML Engineer (Manual Override)',
        action: 'MODEL_ROLLBACK_EXECUTED',
        target: 'v1.0.0-reference',
        details: 'Restored verified reference baseline model. Deprecated v1.1.0 candidate.',
        result: 'SUCCESS',
      },
      ...logs,
    ]);
  };

  const injectUnseenCompoundFault = () => {
    // Injects an Out-of-Distribution scenario (compound RF degradation + heavy CPU saturation)
    injectFault('radio_degradation');
    setAuditLogs(logs => [
      {
        id: `LOG-${Date.now()}`,
        timestamp: Date.now(),
        timeFormatted: 'Just now',
        operator: 'Chaos ML Evaluator',
        action: 'INJECT_OOD_COMPOUND_FAULT',
        target: 'Cell-01A (Band n78)',
        details: 'Injected compound unseen anomaly signature to evaluate OOD detector.',
        result: 'WARNING',
      },
      ...logs,
    ]);
  };

  const exportTelemetryCSV = () => {
    const headers = [
      'timestamp',
      'timeString',
      'cellId',
      'gNodeBId',
      'sliceId',
      'rsrp',
      'sinr',
      'prbUtilization',
      'latency',
      'ecpriFrameLoss',
      'dlThroughput',
      'cpuUtilization',
      'serviceAvailability',
    ];

    const rows = telemetryHistory.map(item => [
      item.timestamp,
      item.timeString,
      `"${item.cellId}"`,
      item.gNodeBId,
      item.sliceId,
      item.rsrp,
      item.sinr,
      item.prbUtilization,
      item.latency,
      item.ecpriFrameLoss,
      item.dlThroughput,
      item.cpuUtilization,
      item.serviceAvailability,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `5G_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportTelemetryJSON = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      metadata: {
        team: 'Team Dynamites',
        project: '5G Testbed AI Fault Prediction',
        activeModelVersion,
        pipelineGateStatus: pipelineQualityGate.gateStatus,
      },
      currentTelemetry,
      prediction,
      spatialTemporalDiagnosis: stDiagnosis,
      kafkaQualityGate: pipelineQualityGate,
      historyCount: telemetryHistory.length,
      alerts,
      auditLogs,
    };

    const link = document.createElement('a');
    link.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2)));
    link.setAttribute('download', `5g_testbed_unified_state_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeAlertsCount = useMemo(
    () => alerts.filter(a => a.status !== 'RESOLVED').length,
    [alerts]
  );

  const criticalAlertsCount = useMemo(
    () => alerts.filter(a => a.status !== 'RESOLVED' && a.severity === 'CRITICAL').length,
    [alerts]
  );

  return (
    <TelemetryContext.Provider
      value={{
        fleet,
        selectedGNodeB,
        setSelectedGNodeB,
        selectedCell,
        setSelectedCell,
        selectedSlice,
        setSelectedSlice,
        currentTelemetry,
        telemetryHistory,
        prediction,
        predictionHistory,
        isStreaming,
        setIsStreaming,
        streamSpeed,
        setStreamSpeed,
        noiseLevel,
        setNoiseLevel,
        activeScenario,
        scenarioTimeElapsedSeconds,
        scenarioTargetCell,
        injectFault,
        clearFault,
        alerts,
        activeAlertsCount,
        criticalAlertsCount,
        acknowledgeAlert,
        resolveAlert,
        executeAutonomousMitigation,
        isMitigating,
        mitigationStatusText,
        auditLogs,
        audioAlertsEnabled,
        setAudioAlertsEnabled,
        exportTelemetryCSV,
        exportTelemetryJSON,
        // Enhancement 1
        topologyNodes,
        topologyEdges,
        selectedTopologyNode,
        setSelectedTopologyNode,
        stDiagnosis,
        // Enhancement 2
        kafkaTopics,
        kafkaConsumerGroups,
        pipelineQualityGate,
        pipelineExperiment,
        setPipelineExperiment,
        triggerPipelineBurst,
        triggerSlowConsumer,
        triggerConsumerCrash,
        resetPipeline,
        sampleKafkaEvent,
        // Enhancement 3
        modelRegistry,
        activeModelVersion,
        driftEvents,
        oodResult,
        adaptationPipelineStatus,
        triggerAdaptationWorkflow,
        rollbackToBaseline,
        injectUnseenCompoundFault,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = (): TelemetryContextType => {
  const ctx = useContext(TelemetryContext);
  if (!ctx) throw new Error('useTelemetry must be used within TelemetryProvider');
  return ctx;
};
