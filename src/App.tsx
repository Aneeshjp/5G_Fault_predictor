/**
 * AI-Powered Fault Prediction in 5G Testbed
 * Team Name: Team Dynamites
 * Role: Senior Telecom Network & ML Research Engineering Project
 * Target Deployments: Vercel (Frontend) + Render (Backend) + Docker Compose
 */

import React, { useState } from 'react';
import { TelemetryProvider, useTelemetry } from './context/TelemetryContext';
import { Header, PageId } from './components/common/Header';
import { SubHeader } from './components/common/SubHeader';
import { QuickInjectModal, AcknowledgeModal } from './components/common/IncidentModals';
import { ExecutiveOverview } from './pages/ExecutiveOverview';
import { TopologyDiagnosis } from './pages/TopologyDiagnosis';
import { NetworkMonitoring } from './pages/NetworkMonitoring';
import { FaultPrediction } from './pages/FaultPrediction';
import { KafkaPipeline } from './pages/KafkaPipeline';
import { AnomalyDetection } from './pages/AnomalyDetection';
import { AdaptiveLearning } from './pages/AdaptiveLearning';
import { AlertCenter } from './pages/AlertCenter';
import { ModelEvaluation } from './pages/ModelEvaluation';
import { SimulatorControls } from './pages/SimulatorControls';
import { SystemHealth } from './pages/SystemHealth';
import { Radio, ShieldCheck, Terminal, Heart } from 'lucide-react';
import { IncidentAlert, FaultScenarioId } from './types/telemetry';

function MainApp() {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [isQuickInjectOpen, setIsQuickInjectOpen] = useState(false);
  const [selectedAlertForAck, setSelectedAlertForAck] = useState<IncidentAlert | null>(null);

  const { injectFault, acknowledgeAlert, activeModelVersion, pipelineQualityGate } = useTelemetry();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Bar Header (Strict 3-zone contract) */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenQuickInject={() => setIsQuickInjectOpen(true)}
      />

      {/* SubHeader Filters and Streaming State */}
      <SubHeader />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-6 py-6">
        {activePage === 'overview' && (
          <ExecutiveOverview
            onNavigate={setActivePage}
            onOpenInject={() => setIsQuickInjectOpen(true)}
            onAcknowledgeAlert={alert => setSelectedAlertForAck(alert)}
          />
        )}

        {/* ENHANCEMENT 1: Topology-Aware Fault Diagnosis */}
        {activePage === 'topology' && (
          <TopologyDiagnosis onNavigateToSimulator={() => setActivePage('simulator')} />
        )}

        {activePage === 'monitoring' && <NetworkMonitoring />}

        {activePage === 'prediction' && (
          <FaultPrediction onNavigateToSimulator={() => setActivePage('simulator')} />
        )}

        {/* ENHANCEMENT 2: Intelligent Kafka Pipeline Reliability & Data-Quality Gate */}
        {activePage === 'pipeline' && <KafkaPipeline />}

        {activePage === 'anomalies' && <AnomalyDetection />}

        {/* ENHANCEMENT 3: Adaptive Fault Prediction & Concept Drift */}
        {activePage === 'adaptive' && <AdaptiveLearning />}

        {activePage === 'alerts' && <AlertCenter />}

        {activePage === 'evaluation' && <ModelEvaluation />}

        {activePage === 'simulator' && <SimulatorControls />}

        {activePage === 'health' && <SystemHealth />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-xs text-slate-500">
        <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-300">Team Dynamites</span>
            <span>·</span>
            <span>Senior Telecom Network &amp; ML Research Engineering Project</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-400">
            <span>Model: <strong className="text-purple-300">{activeModelVersion}</strong></span>
            <span>·</span>
            <span>Gate: <strong className={pipelineQualityGate.gateStatus === 'TRUSTED' ? 'text-emerald-400' : 'text-amber-400'}>{pipelineQualityGate.gateStatus}</strong></span>
            <span>·</span>
            <span>ST-GNN MRR: <strong className="text-cyan-300">0.968</strong></span>
            <span>·</span>
            <span>Kafka Ingestion: <strong className="text-white">1,000 msgs/s</strong></span>
          </div>
        </div>
      </footer>

      {/* Quick Injection Modal */}
      <QuickInjectModal
        isOpen={isQuickInjectOpen}
        onClose={() => setIsQuickInjectOpen(false)}
        onInject={(scenarioId: FaultScenarioId) => {
          injectFault(scenarioId);
          setIsQuickInjectOpen(false);
          setActivePage('topology'); // Jump straight into topology graph to see causal propagation!
        }}
      />

      {/* Acknowledge Modal */}
      <AcknowledgeModal
        alert={selectedAlertForAck}
        onClose={() => setSelectedAlertForAck(null)}
        onConfirm={(operator, notes) => {
          if (selectedAlertForAck) {
            acknowledgeAlert(selectedAlertForAck.id, operator, notes);
            setSelectedAlertForAck(null);
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <TelemetryProvider>
      <MainApp />
    </TelemetryProvider>
  );
}
