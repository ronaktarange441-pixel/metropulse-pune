import React from 'react';
import { ShieldAlert, Compass, Search, ChevronDown, Bookmark } from 'lucide-react';
import { CITIES } from '../data/mockData';
import type { CityId } from '../types';

interface HeaderProps {
  currentCityId: CityId;
  onSelectCity: (cityId: CityId) => void;
  onTriggerSOS: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCityId,
  onSelectCity,
  onTriggerSOS,
  searchQuery,
  onSearchChange,
  savedCount,
  onOpenSaved
}) => {
  return (
    <header className="app-header">
      <div className="brand-logo">
        <div className="brand-icon">
          <Compass size={22} />
        </div>
        <div className="brand-text">
          <h1>MetroPulse AI</h1>
          <span>Smart City & Chaos Navigator</span>
        </div>
      </div>

      <div className="header-actions">
        {/* City Selector */}
        <div className="city-select-wrapper">
          <select
            className="city-select"
            value={currentCityId}
            onChange={(e) => onSelectCity(e.target.value as CityId)}
          >
            {CITIES.map((city) => (
              <option key={city.id} value={city.id} style={{ background: '#0F172A' }}>
                {city.name} ({city.region})
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="city-select-icon" />
        </div>

        {/* Search Bar - Desktop */}
        <div style={{ position: 'relative', display: 'none', minWidth: '200px' }} className="desktop-search-container">
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search places, safe routes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 0.8rem 0.4rem 2.2rem',
              fontSize: '0.82rem',
              width: '100%',
              outline: 'none'
            }}
          />
        </div>

        {/* Saved Places Button */}
        <button
          onClick={onOpenSaved}
          title="Saved Itinerary"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-full)',
            padding: '0.45rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            color: (savedCount > 0) ? 'var(--accent-amber)' : 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          <Bookmark size={16} />
          <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>
            {savedCount}
          </span>
        </button>

        {/* SOS Alert Button */}
        <button className="sos-trigger-btn" onClick={onTriggerSOS}>
          <ShieldAlert size={16} />
          <span>SOS</span>
        </button>
      </div>
    </header>
  );
};
