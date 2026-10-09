import React, { useState } from 'react';
import type { Place } from '../types';
import { BarChart3, Trophy, DollarSign, Sparkles } from 'lucide-react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface ComparisonTabProps {
  places: Place[];
}

export const ComparisonTab: React.FC<ComparisonTabProps> = ({ places }) => {
  const [selectedId1, setSelectedId1] = useState<string>(places[0]?.id || '');
  const [selectedId2, setSelectedId2] = useState<string>(places[1]?.id || places[0]?.id || '');

  const place1 = places.find((p) => p.id === selectedId1) || places[0];
  const place2 = places.find((p) => p.id === selectedId2) || places[1] || places[0];

  const radarData = {
    labels: ['Safety Score', 'Cleanliness', 'Affordability', 'Transit Access', 'User Rating (x2)'],
    datasets: [
      {
        label: place1 ? place1.name : 'Location A',
        data: place1
          ? [place1.safetyRating * 10, place1.cleanlinessRating * 10, place1.affordabilityRating * 10, place1.transitAccess * 10, place1.rating * 20]
          : [80, 80, 80, 80, 80],
        borderColor: '#00F2FE',
        backgroundColor: 'rgba(0, 242, 254, 0.2)',
        borderWidth: 2,
      },
      {
        label: place2 ? place2.name : 'Location B',
        data: place2
          ? [place2.safetyRating * 10, place2.cleanlinessRating * 10, place2.affordabilityRating * 10, place2.transitAccess * 10, place2.rating * 20]
          : [70, 70, 70, 70, 70],
        borderColor: '#EC4899',
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        borderWidth: 2,
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#94A3B8', font: { size: 12 } },
        ticks: { backdropColor: 'transparent', color: '#64748B' },
        min: 0,
        max: 100,
      }
    },
    plugins: {
      legend: { labels: { color: '#F8FAFC', font: { size: 13 } } }
    }
  };

  // Ranking Top Leaderboards
  const topSafest = [...places].sort((a, b) => b.safetyRating - a.safetyRating).slice(0, 3);
  const topCleanest = [...places].sort((a, b) => b.cleanlinessRating - a.cleanlinessRating).slice(0, 3);
  const topBudget = [...places].sort((a, b) => b.affordabilityRating - a.affordabilityRating).slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(15, 23, 42, 0.85))', borderColor: 'rgba(139, 92, 246, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-purple)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Best vs. Worst Places Comparator</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Compare city locations side-by-side across safety, cleanliness, affordability, ratings, and accessibility
            </p>
          </div>
        </div>
      </div>

      {/* Selector Controls */}
      <div className="glass-panel compare-selectors-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.4rem' }}>
            SELECT LOCATION A (BLUE RADAR)
          </label>
          <select
            value={selectedId1}
            onChange={(e) => setSelectedId1(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--accent-cyan)', padding: '0.6rem', borderRadius: 'var(--radius-md)', color: 'white', fontWeight: 600, outline: 'none' }}
          >
            {places.map((p) => (
              <option key={p.id} value={p.id} style={{ background: '#0F172A' }}>
                {p.name} ({p.categoryLabel})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#EC4899', display: 'block', marginBottom: '0.4rem' }}>
            SELECT LOCATION B (PINK RADAR)
          </label>
          <select
            value={selectedId2}
            onChange={(e) => setSelectedId2(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid #EC4899', padding: '0.6rem', borderRadius: 'var(--radius-md)', color: 'white', fontWeight: 600, outline: 'none' }}
          >
            {places.map((p) => (
              <option key={p.id} value={p.id} style={{ background: '#0F172A' }}>
                {p.name} ({p.categoryLabel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Radar Chart & Comparison Table Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px minmax(0, 1fr)', gap: '1.25rem' }} className="compare-grid-layout">
        {/* Spider Radar Chart */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            Multi-Axis Radar Analysis
          </h3>
          <div style={{ width: '100%', height: '310px' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* Detailed Comparative Table Matrix */}
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.85rem' }}>
            Side-by-Side Metric Matrix
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Evaluation Metric</th>
                <th style={{ padding: '0.75rem', color: 'var(--accent-cyan)' }}>{place1?.name}</th>
                <th style={{ padding: '0.75rem', color: '#EC4899' }}>{place2?.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>🛡️ Safety Index</td>
                <td style={{ padding: '0.75rem', fontWeight: 800, color: (place1?.safetyRating || 0) >= (place2?.safetyRating || 0) ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
                  {place1?.safetyRating} / 10
                </td>
                <td style={{ padding: '0.75rem', fontWeight: 800, color: (place2?.safetyRating || 0) >= (place1?.safetyRating || 0) ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
                  {place2?.safetyRating} / 10
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>✨ Cleanliness Rating</td>
                <td style={{ padding: '0.75rem', fontWeight: 800, color: (place1?.cleanlinessRating || 0) >= (place2?.cleanlinessRating || 0) ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
                  {place1?.cleanlinessRating} / 10
                </td>
                <td style={{ padding: '0.75rem', fontWeight: 800, color: (place2?.cleanlinessRating || 0) >= (place1?.cleanlinessRating || 0) ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
                  {place2?.cleanlinessRating} / 10
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>💰 Affordability Index</td>
                <td style={{ padding: '0.75rem', fontWeight: 800, color: (place1?.affordabilityRating || 0) >= (place2?.affordabilityRating || 0) ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
                  {place1?.affordabilityRating} / 10 ({place1?.priceLevel})
                </td>
                <td style={{ padding: '0.75rem', fontWeight: 800, color: (place2?.affordabilityRating || 0) >= (place1?.affordabilityRating || 0) ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
                  {place2?.affordabilityRating} / 10 ({place2?.priceLevel})
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>🚌 Transit Accessibility</td>
                <td style={{ padding: '0.75rem', fontWeight: 800, color: (place1?.transitAccess || 0) >= (place2?.transitAccess || 0) ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
                  {place1?.transitAccess} / 10
                </td>
                <td style={{ padding: '0.75rem', fontWeight: 800, color: (place2?.transitAccess || 0) >= (place1?.transitAccess || 0) ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
                  {place2?.transitAccess} / 10
                </td>
              </tr>

              <tr>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>⭐ Public User Rating</td>
                <td style={{ padding: '0.75rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                  {place1?.rating} ⭐ ({place1?.reviewsCount})
                </td>
                <td style={{ padding: '0.75rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                  {place2?.rating} ⭐ ({place2?.reviewsCount})
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* City Leaderboards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Trophy size={18} />
            <span>Top 3 Safest Hubs</span>
          </h4>
          {topSafest.map((p, idx) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>#{idx + 1} {p.name}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>{p.safetyRating}/10</span>
            </div>
          ))}
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={18} />
            <span>Top 3 Cleanest Spots</span>
          </h4>
          {topCleanest.map((p, idx) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>#{idx + 1} {p.name}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>{p.cleanlinessRating}/10</span>
            </div>
          ))}
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DollarSign size={18} />
            <span>Best Budget Value</span>
          </h4>
          {topBudget.map((p, idx) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>#{idx + 1} {p.name}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: 800 }}>{p.priceLevel}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .compare-grid-layout {
            grid-template-columns: 1fr !important;
          }
          .compare-selectors-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
