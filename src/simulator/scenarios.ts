/**
 * 5G Fault Scenarios & O-RAN Mitigation Advisories
 * Team Dynamites - 5G Testbed AI Fault Prediction
 */

import { FaultScenarioConfig, FaultScenarioId, GNodeBNode } from '../types/telemetry';

export const GNODEB_FLEET: GNodeBNode[] = [
  {
    id: 'gNB-001',
    name: 'Austin Urban Metro 01',
    location: 'Austin Downtown Core (Sector A/B/C)',
    status: 'ONLINE',
    cells: ['Cell-01A (Band n78)', 'Cell-01B (Band n78)', 'Cell-01C (Band n257 mmWave)'],
    ipAddress: '10.240.12.10',
    totalUes: 342,
    avgThroughput: 840,
    riskScore: 8,
  },
  {
    id: 'gNB-002',
    name: 'Tech Campus Innovation Hub',
    location: 'North Tech Corridor (Industrial/eMBB)',
    status: 'ONLINE',
    cells: ['Cell-02A (Band n77)', 'Cell-02B (Band n77)', 'Cell-02C (Band n71)'],
    ipAddress: '10.240.12.14',
    totalUes: 189,
    avgThroughput: 920,
    riskScore: 12,
  },
  {
    id: 'gNB-003',
    name: 'Stadium East Arena',
    location: 'Sports & Entertainment Complex',
    status: 'ONLINE',
    cells: ['Cell-03A (Band n78 Mass-MIMO)', 'Cell-03B (Band n78 Mass-MIMO)', 'Cell-03C (Band n258 mmWave)'],
    ipAddress: '10.240.12.18',
    totalUes: 512,
    avgThroughput: 430,
    riskScore: 15,
  },
  {
    id: 'gNB-004',
    name: 'Suburban Edge Gateway',
    location: 'South Highway Interchange (URLLC Corridors)',
    status: 'ONLINE',
    cells: ['Cell-04A (Band n71 FDD)', 'Cell-04B (Band n28)', 'Cell-04C (Band n78)'],
    ipAddress: '10.240.12.22',
    totalUes: 94,
    avgThroughput: 610,
    riskScore: 5,
  },
];

export const NETWORK_SLICES = [
  { id: 'slice-embb-01', name: 'eMBB Enhanced Mobile Broadband', sst: 1, sd: '000001', targetLatency: '< 15 ms', targetThroughput: '> 500 Mbps' },
  { id: 'slice-urllc-02', name: 'URLLC Ultra-Reliable Low-Latency', sst: 2, sd: '000002', targetLatency: '< 3 ms', targetThroughput: '> 50 Mbps' },
  { id: 'slice-mmtc-03', name: 'mMTC Massive IoT Telemetry', sst: 3, sd: '000003', targetLatency: '< 100 ms', targetThroughput: '> 5 Mbps' },
];

export const FAULT_SCENARIOS: Record<FaultScenarioId, FaultScenarioConfig> = {
  radio_degradation: {
    id: 'radio_degradation',
    name: 'Radio Link Degradation (Feeder Loss & Antenna Drift)',
    subsystem: 'O-RU / Massive MIMO Antenna Subsystem',
    telecomDescription:
      'Severe attenuation in Reference Signal Received Power (RSRP drops to -130 dBm) and SINR degradation to -4 dB caused by physical antenna tilt miscalibration or RF jumper cable water ingress.',
    slaRiskDescription: 'Imminent call drop rate surge and coverage hole creation within 18 minutes.',
    leadTimeDefault: 19.4,
    baseSeverity: 'HIGH',
    symptoms: [
      { kpi: 'RSRP (dBm)', expectedNominal: '-82 to -95 dBm', faultState: '-128 to -134 dBm (Critical Drop)' },
      { kpi: 'SINR (dB)', expectedNominal: '+14 to +24 dB', faultState: '-4.2 to -1.5 dB (Noise Floor Inversion)' },
      { kpi: 'CQI Index', expectedNominal: '11 to 14', faultState: '2 to 4 (MCS Fallback to QPSK)' },
    ],
    mitigation: {
      actionId: 'ACT-RET-CALIB-01',
      title: 'O-RAN RET Antenna Electrical Down-Tilt Calibration',
      targetSubsystem: 'O-RAN Non-RT RIC',
      summary: 'Trigger Remote Electrical Tilt (RET) stepper motor recalibration and transmit power boost on adjacent beamforming sectors.',
      stepDetails: [
        'Query O-RAN O1 interface for current Remote Electrical Tilt (RET) angles',
        'Command antenna electrical down-tilt adjustment by +2.5° on azimuth sector alpha',
        'Inject +3 dBm digital pre-distortion boost via O-DU L1 scheduler',
        'Handover fringe UEs to secondary carrier aggregation cell (Band n71)',
      ],
      estimatedResolutionTimeMins: 3.2,
      slaImpactMitigated: 'Prevents 99.4% of forecasted call drops and maintains URLLC coverage integrity.',
    },
  },

  cell_congestion: {
    id: 'cell_congestion',
    name: 'Cell Resource Saturation & Flash Crowd Congestion',
    subsystem: 'MAC Scheduler & PRB Allocation (O-DU)',
    telecomDescription:
      'Massive surge in active UE attachments exceeding 500+ users, pushing Physical Resource Block (PRB) utilization to 98% with scheduling queuing delays.',
    slaRiskDescription: 'User experience degradation, severe bufferbloat, and random access preamble collisions.',
    leadTimeDefault: 16.8,
    baseSeverity: 'HIGH',
    symptoms: [
      { kpi: 'PRB Utilization', expectedNominal: '35% to 55%', faultState: '96% to 99% (Quota Exhaustion)' },
      { kpi: 'Active UEs', expectedNominal: '120 to 180', faultState: '520+ (High Admission Queuing)' },
      { kpi: 'DL Throughput', expectedNominal: '850 Mbps', faultState: '75 Mbps aggregate (Per-UE Starvation)' },
    ],
    mitigation: {
      actionId: 'ACT-PRB-REALLOC-02',
      title: 'Near-RT RIC Dynamic PRB Quota Reallocation & Slice Throttling',
      targetSubsystem: 'Near-RT RIC',
      summary: 'Dynamically reallocate PRB quota via Near-RT RIC xApp and enforce non-guaranteed bit rate (non-GBR) throttling.',
      stepDetails: [
        'Invoke O-RAN E2 interface KPM service model for PRB quota rebalance',
        'Reassign 35% reserved spectrum blocks from idle mMTC slice to active eMBB',
        'Trigger Connected-mode Handover (A3 event) for 80 edge UEs to underutilized Cell-01B',
        'Apply 5QI-9 best-effort downlink shaping at the UPF user plane',
      ],
      estimatedResolutionTimeMins: 2.1,
      slaImpactMitigated: 'Reduces cell PRB utilization below 68% and restores per-UE downlink guarantees.',
    },
  },

  packet_loss_instability: {
    id: 'packet_loss_instability',
    name: 'Fronthaul / eCPRI Transport Packet Loss Instability',
    subsystem: 'eCPRI 7.2x Fronthaul & Optical Transport',
    telecomDescription:
      'Burst frame loss reaching 15% to 30% across O-DU to O-RU 25Gbps optical links accompanied by packet jitter spikes due to SFP+ optical dispersion.',
    slaRiskDescription: 'Severe I/Q sample corruption leading to symbol synchronization loss in subcarrier spacing.',
    leadTimeDefault: 21.0,
    baseSeverity: 'CRITICAL',
    symptoms: [
      { kpi: 'eCPRI Loss (%)', expectedNominal: '< 0.001%', faultState: '18.5% to 28.2% (Frame Dropping)' },
      { kpi: 'Jitter (ms)', expectedNominal: '0.2 to 0.6 ms', faultState: '14.8 to 22.4 ms (Buffer Instability)' },
      { kpi: 'Radio SINR', expectedNominal: '20 dB', faultState: 'Drops by 8 dB due to I/Q sample truncation' },
    ],
    mitigation: {
      actionId: 'ACT-ECPRI-FEC-03',
      title: 'Optical Transceiver Low-Latency FEC & Port Failover',
      targetSubsystem: 'Transport SDN',
      summary: 'Activate Reed-Solomon RS-FEC on O-DU fronthaul transceivers and shift telemetry traffic to backup 25G lambda.',
      stepDetails: [
        'Engage RS(544,514) Forward Error Correction on 25GbE eCPRI interface',
        'Initiate sub-50ms optical protection switching (G.8032 ring failover)',
        'Resynchronize IEEE 1588v2 PTP / ITU-T G.8275.1 telecom clock profile',
        'Verify zero optical CRC drops on O-RU optical physical layer registers',
      ],
      estimatedResolutionTimeMins: 1.8,
      slaImpactMitigated: 'Zero frame drop restored and eliminates optical packet jitter back below 0.3ms.',
    },
  },

  increased_latency: {
    id: 'increased_latency',
    name: 'End-to-End Latency Spike Breaching URLLC SLA',
    subsystem: 'Transport SDN & UPF Edge Routing',
    telecomDescription:
      'Round-trip latency climbs from nominal 8ms to >250ms due to intermediate transport gateway buffer congestion, breaching strict 5G URLLC bounds.',
    slaRiskDescription: 'Complete collapse of mission-critical robotic and vehicular V2X control loops.',
    leadTimeDefault: 17.5,
    baseSeverity: 'CRITICAL',
    symptoms: [
      { kpi: 'RTT Latency (ms)', expectedNominal: '6.5 to 11.2 ms', faultState: '264 to 310 ms (Severe SLA Breach)' },
      { kpi: 'Jitter (ms)', expectedNominal: '0.4 ms', faultState: '38.5 ms (Queue Delay Variance)' },
      { kpi: 'URLLC Reliability', expectedNominal: '99.999%', faultState: '84.2% (Packets Exceeding Deadline)' },
    ],
    mitigation: {
      actionId: 'ACT-SRV6-REROUTE-04',
      title: 'SRv6 Low-Latency Policy Rerouting & Priority Queue Pre-emption',
      targetSubsystem: 'Transport SDN',
      summary: 'Steer URLLC traffic through pre-computed Segment Routing IPv6 (SRv6) express paths bypassing congested transit switches.',
      stepDetails: [
        'Signal SDN controller to inject SRv6 low-latency forwarding policy',
        'Assign 5QI-1 and 5QI-82 high-priority DSCP EF classification at gNodeB gtp-u layer',
        'Flush intermediate buffer queue on congested boundary router',
        'Verify round-trip latency returns to sub-8ms bounded profile',
      ],
      estimatedResolutionTimeMins: 1.5,
      slaImpactMitigated: 'Restores URLLC round trip latency to 5.8ms and prevents automotive safety cutoffs.',
    },
  },

  throughput_degradation: {
    id: 'throughput_degradation',
    name: 'Downlink User-Plane Throughput Degradation',
    subsystem: 'PDCP / RLC Protocol Stack & Scheduler',
    telecomDescription:
      'Total cell downlink user-plane throughput drops from 950 Mbps to <15 Mbps under nominal radio conditions due to RLC unacknowledged mode retransmission storms.',
    slaRiskDescription: 'Video streaming freezes, data stalling, and extreme customer churn rate.',
    leadTimeDefault: 18.2,
    baseSeverity: 'MEDIUM',
    symptoms: [
      { kpi: 'DL Throughput', expectedNominal: '800 to 1100 Mbps', faultState: '12.4 to 18.0 Mbps (Massive Starvation)' },
      { kpi: 'UL Throughput', expectedNominal: '120 to 180 Mbps', faultState: '8.2 Mbps (Ack Delays)' },
      { kpi: 'RLC Retransmissions', expectedNominal: '0.2%', faultState: '44% (Window Stall)' },
    ],
    mitigation: {
      actionId: 'ACT-RLC-WINDOW-05',
      title: 'RLC Buffer Window Reset & Carrier Aggregation Realignment',
      targetSubsystem: 'Near-RT RIC',
      summary: 'Reset stall timers in O-DU RLC entity and force secondary component carrier (SCell) realignment.',
      stepDetails: [
        'Send RRC Reconfiguration message instructing UE RLC AM window flush',
        'Enable 4x4 MIMO Rank 4 transmission indicator on primary component carrier',
        'Rebalance carrier aggregation cross-carrier scheduling across n78 and n257',
        'Monitor user-plane throughput recovery curve',
      ],
      estimatedResolutionTimeMins: 2.8,
      slaImpactMitigated: 'Re-establishes >800 Mbps downlink user-plane throughput across all connected UEs.',
    },
  },

  cpu_memory_saturation: {
    id: 'cpu_memory_saturation',
    name: 'Containerized NFVI Core CPU & Memory Saturation',
    subsystem: 'NFVI Kubernetes Cloud Infrastructure / O-Cloud',
    telecomDescription:
      'Containerized O-DU and 5G Core microservices experience sudden memory leaks and CPU exhaustion (98% load), causing process scheduling jitter and packet starvation.',
    slaRiskDescription: 'Kernel OOM killer termination of critical 5G control-plane microservices.',
    leadTimeDefault: 15.2,
    baseSeverity: 'CRITICAL',
    symptoms: [
      { kpi: 'Host CPU Util (%)', expectedNominal: '28% to 42%', faultState: '97.8% to 99.2% (Throttling)' },
      { kpi: 'NFVI Memory (%)', expectedNominal: '34% to 48%', faultState: '98.4% (Critical Leak)' },
      { kpi: 'PDU Session Setup', expectedNominal: '45 ms', faultState: 'Timeouts > 2000 ms' },
    ],
    mitigation: {
      actionId: 'ACT-NFVI-SCALE-06',
      title: 'O-Cloud Horizontal Pod Autoscaling & Pod Eviction',
      targetSubsystem: 'NFVI Orchestrator',
      summary: 'Trigger O-Cloud HPA to spin up 4 new stateless UPF/DU worker replicas and evict stale memory-leaking pods.',
      stepDetails: [
        'Scale Kubernetes StatefulSet / Deployment from 2 to 6 worker replicas',
        'Re-route new PDU sessions via service mesh load balancer to healthy pods',
        'Gracefully cordon and drain contaminated container host node',
        'Verify NFVI CPU settles below 38% and memory below 45%',
      ],
      estimatedResolutionTimeMins: 3.5,
      slaImpactMitigated: 'Averts crash of entire 5G user-plane function and restores 100% core uptime.',
    },
  },

  backhaul_interruption: {
    id: 'backhaul_interruption',
    name: 'Midhaul / Backhaul IP Transport Link Interruption',
    subsystem: 'IP/MPLS Backhaul & Microwave Link',
    telecomDescription:
      'Catastrophic physical fiber cut or microwave fade causing 85% backhaul packet loss, routing flaps, and BGP session resets between gNodeB and 5G Core UPF.',
    slaRiskDescription: 'Total isolation of gNodeB sector leading to complete cellular blackout.',
    leadTimeDefault: 22.1,
    baseSeverity: 'CRITICAL',
    symptoms: [
      { kpi: 'Packet Loss (%)', expectedNominal: '0.01%', faultState: '82% to 91% (Backhaul Severed)' },
      { kpi: 'Service Avail (%)', expectedNominal: '99.99%', faultState: '14.5% (Total Link Flap)' },
      { kpi: 'BGP Keepalive', expectedNominal: 'Established', faultState: 'Hold-timer Expired' },
    ],
    mitigation: {
      actionId: 'ACT-BACKHAUL-FAILOVER-07',
      title: 'Automated Dual-Connectivity NR-DC Failover & Microwave Standby',
      targetSubsystem: 'Transport SDN',
      summary: 'Trigger autonomous BGP fast reroute (FRR) over microwave backup link and engage 5G Dual-Connectivity (NR-DC).',
      stepDetails: [
        'Activate BGP Fast Reroute (FRR) sub-50ms backup LSP path',
        'Spin up secondary microwave backup radio link (E-Band 80GHz)',
        'Shift mission-critical control plane signaling to adjacent macro gNB via Xn interface',
        'Dispatch emergency fiber maintenance field crew with OTDR distance reading',
      ],
      estimatedResolutionTimeMins: 1.2,
      slaImpactMitigated: 'Prevents complete site blackout and preserves 100% emergency 911 / mission-critical sessions.',
    },
  },

  service_availability_degradation: {
    id: 'service_availability_degradation',
    name: '5G Core AMF / NRF Service Availability Collapse',
    subsystem: '5G Service-Based Architecture (SBA) Core',
    telecomDescription:
      'Access and Mobility Management Function (AMF) registration queue overload and Network Repository Function (NRF) discovery timeouts dropping core availability below 45%.',
    slaRiskDescription: 'Thousands of new UEs unable to register or establish PDU data sessions across the entire region.',
    leadTimeDefault: 16.0,
    baseSeverity: 'CRITICAL',
    symptoms: [
      { kpi: 'Service Avail (%)', expectedNominal: '99.98%', faultState: '41.2% to 44.8% (Collapse)' },
      { kpi: 'AMF Reg Success', expectedNominal: '99.9%', faultState: '32.1% (Massive Rejections)' },
      { kpi: 'Active PDU Sessions', expectedNominal: '850', faultState: 'Drops to 210 (Session Drop)' },
    ],
    mitigation: {
      actionId: 'ACT-AMF-SHED-08',
      title: 'SBA Core Overload Protection & AMF Load Balancing Shed',
      targetSubsystem: '5G Core AMF',
      summary: 'Engage 3GPP TS 23.501 AMF overload control mechanism, shed low-priority mMTC registrations, and failover to secondary NRF cluster.',
      stepDetails: [
        'Activate 3GPP 5G-GUTI reallocation rate limiter at the AMF perimeter',
        'Reject non-priority IoT registrations with randomized back-off timer T3346',
        'Reroute gNodeB NG-C signaling connections to backup geo-redundant AMF pool',
        'Verify 5G Core registration success rate recovers above 99.8%',
      ],
      estimatedResolutionTimeMins: 2.5,
      slaImpactMitigated: 'Halts catastrophic core registration storm and re-establishes 99.9% 5G Core SBA reliability.',
    },
  },
};
