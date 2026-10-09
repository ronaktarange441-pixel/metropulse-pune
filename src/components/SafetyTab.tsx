import React from 'react';
import type { SafetyZone, SafeRoute, CityInfo } from '../types';
import { Shield, AlertTriangle, ArrowRight, ShieldAlert, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SafetyTabProps {
  city: CityInfo;
  safetyZones: SafetyZone[];
  safeRoutes: SafeRoute[];
  onTriggerSOS: () => void;
  onOpenMap: () => void;
}

export const SafetyTab: React.FC<SafetyTabProps> = ({
  city,
  safetyZones,
  safeRoutes,
  onTriggerSOS,
  onOpenMap
}) => {
  // Chart data for 24h City Safety Index trends
  const chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    datasets: [
      {
        label: 'City Lighting & Crowd Index',
        data: [72, 65, 88, 96, 94, 85, 78],
        borderColor: '#00F2FE',
        backgroundColor: 'rgba(0, 242, 254, 0.15)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'CCTV Active Coverage Rate (%)',
        data: [92, 92, 95, 98, 98, 95, 93],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        fill: true,
        tension: 0.2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#94A3B8' }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94A3B8' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94A3B8' }, min: 50, max: 100 }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.85))', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Safety, Security & Unsafe Zones Radar</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Real-time safety analysis, accident blackspots, and illuminated night navigation corridors
              </p>
            </div>
          </div>

          <button className="sos-trigger-btn" onClick={onTriggerSOS}>
            <ShieldAlert size={18} />
            <span>Launch Guardian SOS</span>
          </button>
        </div>
      </div>

      {/* Safety Score Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>OVERALL SAFETY INDEX</span>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-emerald)', margin: '0.2rem 0' }}>
            {city.safetyScore} / 100
          </h3>
          <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
            High Safety Rating
          </span>
        </div>

        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>SMART LIGHTING COVERAGE</span>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '0.2rem 0' }}>
            94%
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LED Beacons Active</span>
        </div>

        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>MONITORED SAFE CORRIDORS</span>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-purple)', margin: '0.2rem 0' }}>
            {safeRoutes.length} Active
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>24/7 CCTV Monitored</span>
        </div>

        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>REPORTED DANGER ZONES</span>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-rose)', margin: '0.2rem 0' }}>
            {safetyZones.filter((z) => z.safetyLevel === 'unsafe').length} Areas
          </h3>
          <span style={{ fontSize: '0.75rem', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
            Avoid Dim Paths
          </span>
        </div>
      </div>

      {/* Safety Chart & Unsafe Zone List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '1.25rem' }} className="safety-grid-layout">
        {/* Line Chart */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span>24-Hour City Safety & Crowd Density Trend</span>
            </h3>
          </div>
          <div style={{ height: '260px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Unsafe Zones & Blackspots List */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
            <AlertTriangle size={18} style={{ color: 'var(--accent-rose)' }} />
            <span>Reported Unsafe & Caution Zones</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {safetyZones.map((zone) => {
              const isDanger = zone.safetyLevel === 'unsafe';
              return (
                <div
                  key={zone.id}
                  style={{
                    background: isDanger ? 'rgba(244, 63, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    border: `1px solid ${isDanger ? 'rgba(244, 63, 94, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: isDanger ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
                      {zone.areaName}
                    </h4>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', fontWeight: 800 }}>
                      {zone.safetyLevel}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    {zone.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem' }}>
                    <span>💡 Lighting: {zone.lightingLevel}</span>
                    <span>📹 CCTV: {zone.cctvCoverage}</span>
                    <span>🚨 Incidents: {zone.reportedIssuesCount}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onOpenMap}
            style={{
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid var(--border-glow)',
              color: 'var(--accent-cyan)',
              borderRadius: 'var(--radius-md)',
              padding: '0.6rem',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              marginTop: 'auto'
            }}
          >
            <span>View Safe Route Map Navigation</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .safety-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
