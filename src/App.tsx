import { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import type { TabType } from './components/Navigation';
import { MapView } from './components/MapView';
import { ExplorationTab } from './components/ExplorationTab';
import { HistoryTab } from './components/HistoryTab';
import { SafetyTab } from './components/SafetyTab';
import { ComparisonTab } from './components/ComparisonTab';
import { SmartPulseTab } from './components/SmartPulseTab';
import { DetailModal } from './components/DetailModal';
import { SOSModal } from './components/SOSModal';
import { SavedModal } from './components/SavedModal';
import { AIChatbot } from './components/AIChatbot';

import { CITIES, PLACES, HERITAGE_SITES, SAFETY_ZONES, SAFE_ROUTES, CITIZEN_REPORTS, SOCIAL_PULSE, WEATHER_ALERTS } from './data/mockData';
import type { CityId, Place, CitizenReport } from './types';
import { Compass, ShieldCheck, CloudSun, AlertTriangle } from 'lucide-react';

export function App() {
  const [currentCityId, setCurrentCityId] = useState<CityId>('pune');
  const [activeTab, setActiveTab] = useState<TabType>('map');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>(['p-pu-2', 'p-pu-6']);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isSavedOpen, setIsSavedOpen] = useState<boolean>(false);

  const [reports, setReports] = useState<CitizenReport[]>(CITIZEN_REPORTS);

  const city = CITIES.find((c) => c.id === currentCityId) || CITIES[0];

  // Show all places for the current city
  const cityPlaces = PLACES.filter((p) => p.cityId === currentCityId);
  const cityHeritage = HERITAGE_SITES.filter((h) => h.cityId === currentCityId);
  const citySafetyZones = SAFETY_ZONES.filter((s) => s.cityId === currentCityId);
  const citySafeRoutes = SAFE_ROUTES.filter((r) => r.cityId === currentCityId);
  const cityReports = reports.filter((r) => r.cityId === currentCityId);
  const citySocialPulse = SOCIAL_PULSE.filter((sp) => sp.cityId === currentCityId);
  const cityWeatherAlerts = WEATHER_ALERTS.filter((w) => w.cityId === currentCityId);

  // Always show all places in explore/comparison if city has none
  const explorePlaces = cityPlaces.length > 0 ? cityPlaces : PLACES;
  const savedPlaces = PLACES.filter((p) => savedPlaceIds.includes(p.id));

  // Disaster alerts count
  const disasterReports = cityReports.filter(r => r.isDisaster || r.aiRiskScore === 'Critical');

  const toggleSavePlace = (placeId: string) => {
    setSavedPlaceIds((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
    );
  };

  const handleAddReport = (newReport: CitizenReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        currentCityId={currentCityId}
        onSelectCity={(id) => setCurrentCityId(id)}
        onTriggerSOS={() => setIsSOSOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim() !== '' && activeTab !== 'explore') {
            setActiveTab('explore');
          }
        }}
        savedCount={savedPlaceIds.length}
        onOpenSaved={() => setIsSavedOpen(true)}
      />

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* Main Content */}
      <main className="main-content">
        {/* Disaster/Critical Alert Banner */}
        {disasterReports.length > 0 && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))',
              border: '1px solid rgba(239, 68, 68, 0.6)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 1rem',
              marginBottom: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              animation: 'pulse-red 2s infinite'
            }}
            onClick={() => setActiveTab('pulse')}
          >
            <AlertTriangle size={18} color="#EF4444" />
            <div>
              <strong style={{ fontSize: '0.85rem', color: '#EF4444' }}>
                🚨 {disasterReports.length} CRITICAL Alert{disasterReports.length > 1 ? 's' : ''} in {city.name}:
              </strong>
              <span style={{ fontSize: '0.82rem', color: '#FCA5A5', marginLeft: '0.5rem' }}>
                {disasterReports[0]?.title}
              </span>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#EF4444', fontWeight: 700 }}>VIEW →</span>
          </div>
        )}

        {/* City Hero Banner */}
        <div className="city-hero-banner">
          <div className="city-hero-overlay">
            <div className="city-hero-title">
              <span>{city.name}</span>
              <span className="city-badge-tag">{city.region}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '700px' }}>
              {city.tagline}
            </p>

            <div className="city-quick-metrics">
              <div className="metric-pill" style={{ borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' }}>
                <ShieldCheck size={14} />
                <span>Safety: {city.safetyScore}/100</span>
              </div>
              <div className="metric-pill" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
                <CloudSun size={14} />
                <span>AQI: {city.aqi} | {city.temp}°C {city.weatherCondition}</span>
              </div>
              <div className="metric-pill" style={{ borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}>
                <Compass size={14} />
                <span>{explorePlaces.length} Verified Spots</span>
              </div>
              {disasterReports.length > 0 && (
                <div
                  className="metric-pill"
                  style={{ borderColor: '#EF4444', color: '#EF4444', cursor: 'pointer' }}
                  onClick={() => setActiveTab('pulse')}
                >
                  <AlertTriangle size={14} />
                  <span>{disasterReports.length} Live Alerts</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'map' && (
          <MapView
            city={city}
            places={explorePlaces}
            heritageSites={cityHeritage.length > 0 ? cityHeritage : HERITAGE_SITES}
            safetyZones={citySafetyZones.length > 0 ? citySafetyZones : SAFETY_ZONES}
            safeRoutes={citySafeRoutes.length > 0 ? citySafeRoutes : SAFE_ROUTES}
            citizenReports={cityReports.length > 0 ? cityReports : CITIZEN_REPORTS}
            onSelectPlace={(place) => setSelectedPlace(place)}
          />
        )}

        {activeTab === 'explore' && (
          <ExplorationTab
            places={explorePlaces}
            onSelectPlace={(place) => setSelectedPlace(place)}
            savedPlaceIds={savedPlaceIds}
            onToggleSave={toggleSavePlace}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab heritageSites={cityHeritage.length > 0 ? cityHeritage : HERITAGE_SITES} />
        )}

        {activeTab === 'safety' && (
          <SafetyTab
            city={city}
            safetyZones={citySafetyZones.length > 0 ? citySafetyZones : SAFETY_ZONES}
            safeRoutes={citySafeRoutes.length > 0 ? citySafeRoutes : SAFE_ROUTES}
            onTriggerSOS={() => setIsSOSOpen(true)}
            onOpenMap={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'compare' && (
          <ComparisonTab places={explorePlaces} />
        )}

        {activeTab === 'pulse' && (
          <SmartPulseTab
            city={city}
            reports={cityReports.length > 0 ? cityReports : CITIZEN_REPORTS}
            socialPulse={citySocialPulse.length > 0 ? citySocialPulse : SOCIAL_PULSE}
            weatherAlerts={cityWeatherAlerts.length > 0 ? cityWeatherAlerts : WEATHER_ALERTS}
            onAddReport={handleAddReport}
          />
        )}
      </main>

      {/* Modals */}
      <DetailModal
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        isSaved={selectedPlace ? savedPlaceIds.includes(selectedPlace.id) : false}
        onToggleSave={toggleSavePlace}
      />

      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        cityName={city.name}
      />

      <SavedModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedPlaces={savedPlaces}
        onRemoveSaved={toggleSavePlace}
        onSelectPlace={(place) => setSelectedPlace(place)}
      />

      {/* AI Chatbot — always visible */}
      <AIChatbot city={city} places={explorePlaces} />
    </div>
  );
}

export default App;
