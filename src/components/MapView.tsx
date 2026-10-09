import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { CityInfo, Place, HeritageSite, SafetyZone, SafeRoute, CitizenReport } from '../types';
import { ShieldCheck, Landmark, Navigation2, Compass, Radio, MapPin } from 'lucide-react';

interface MapViewProps {
  city: CityInfo;
  places: Place[];
  heritageSites: HeritageSite[];
  safetyZones: SafetyZone[];
  safeRoutes: SafeRoute[];
  citizenReports: CitizenReport[];
  onSelectPlace: (place: Place) => void;
}

type TileSource = 'osm' | 'esri' | 'humanitarian';

export const MapView: React.FC<MapViewProps> = ({
  city,
  places,
  heritageSites,
  safetyZones,
  safeRoutes,
  citizenReports,
  onSelectPlace,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Layer Visibility
  const [showPlaces, setShowPlaces] = useState<boolean>(true);
  const [showHeritage, setShowHeritage] = useState<boolean>(true);
  const [showSafety, setShowSafety] = useState<boolean>(true);
  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [showReports, setShowReports] = useState<boolean>(true);
  const [tileSource, setTileSource] = useState<TileSource>('osm');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(safeRoutes[0]?.id || null);

  // 100% Free Open Tile Providers — ZERO API KEYS REQUIRED
  const TILE_MAPS: Record<TileSource, { url: string; subdomains?: string[]; attribution: string; maxZoom: number }> = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    },
    esri: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
      maxZoom: 19,
    },
    humanitarian: {
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; OpenStreetMap contributors, Tiles courtesy of Humanitarian OpenStreetMap Team',
      maxZoom: 19,
    },
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up prior map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [city.lat, city.lng],
      zoom: city.zoom,
      zoomControl: true,
      fadeAnimation: true,
      zoomAnimation: true,
    });

    const activeTile = TILE_MAPS[tileSource];
    const tileLayer = L.tileLayer(activeTile.url, {
      subdomains: activeTile.subdomains || 'abc',
      attribution: activeTile.attribution,
      maxZoom: activeTile.maxZoom,
    }).addTo(map);

    currentTileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    // Dynamic layer container
    const dynamicLayers = L.layerGroup().addTo(map);
    layerGroupRef.current = dynamicLayers;

    // Force tile recalculation so it never renders blank
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [city.id]);

  // Switch Tile Layer smoothly
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const activeTile = TILE_MAPS[tileSource];
    const newTileLayer = L.tileLayer(activeTile.url, {
      subdomains: activeTile.subdomains || 'abc',
      attribution: activeTile.attribution,
      maxZoom: activeTile.maxZoom,
    }).addTo(map);

    currentTileLayerRef.current = newTileLayer;
    map.invalidateSize();
  }, [tileSource]);

  // Render Pins & Overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Safety Zones (Circles & Blackspots)
    if (showSafety) {
      safetyZones.forEach((sz) => {
        const isBlackspot = sz.isBlackspot || sz.safetyLevel === 'unsafe';
        const color = isBlackspot ? '#EF4444' : sz.safetyLevel === 'caution' ? '#F59E0B' : '#10B981';

        const circle = L.circle([sz.lat, sz.lng], {
          color: color,
          fillColor: color,
          fillOpacity: isBlackspot ? 0.35 : 0.18,
          weight: isBlackspot ? 3 : 1.5,
          dashArray: isBlackspot ? '4, 4' : undefined,
          radius: sz.radius,
        }).addTo(layerGroup);

        circle.bindPopup(`
          <div style="font-family: -apple-system, sans-serif; color: #0F172A; padding: 4px; min-width: 210px;">
            <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 5px;">
              <span style="background: ${color}; color: #FFF; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 99px;">
                ${isBlackspot ? '⚠️ BLACKSPOT' : sz.safetyLevel.toUpperCase()}
              </span>
              <strong style="font-size: 13px; color: #0F172A;">${sz.areaName}</strong>
            </div>
            <p style="margin: 0; font-size: 11.5px; line-height: 1.4; color: #475569;">${sz.description}</p>
            <div style="margin-top: 6px; font-size: 10.5px; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 5px; border-radius: 6px; color: #334155;">
              <div><strong>Safe Hours:</strong> ${sz.safeHours}</div>
              <div><strong>CCTV:</strong> ${sz.cctvCoverage} | <strong>Lighting:</strong> ${sz.lightingLevel}</div>
            </div>
          </div>
        `);
      });
    }

    // 2. Safe Routes
    if (showRoutes) {
      safeRoutes.forEach((route) => {
        const isSelected = route.id === selectedRouteId;
        const polyline = L.polyline(route.waypoints, {
          color: isSelected ? '#FF5722' : '#3B82F6',
          weight: isSelected ? 6 : 3.5,
          dashArray: isSelected ? undefined : '6, 8',
          opacity: isSelected ? 0.95 : 0.65,
        }).addTo(layerGroup);

        polyline.bindPopup(`
          <div style="font-family: -apple-system, sans-serif; color: #0F172A; min-width: 200px;">
            <h4 style="margin: 0 0 5px; color: #FF5722; font-weight: 800; font-size: 13px;">🛡️ ${route.name}</h4>
            <div style="font-size: 11px; margin-bottom: 3px;"><strong>Safety Score:</strong> <span style="color: #10B981; font-weight: 800;">${route.overallSafetyIndex}/100</span></div>
            <div style="font-size: 11px; color: #64748B;">${route.distanceKm} km • ~${route.safestTimeMin} mins</div>
            <div style="margin-top: 6px; font-size: 10.5px; color: #334155;">
              ${route.highlights.map(h => `• ${h}`).join('<br/>')}
            </div>
          </div>
        `);
      });
    }

    // 3. Bright Orange Place Markers
    if (showPlaces) {
      places.forEach((place) => {
        const isGem = place.hiddenGem;

        const iconHtml = `
          <div style="
            position: relative;
            cursor: pointer;
            filter: drop-shadow(0 3px 6px rgba(255, 87, 34, 0.45));
          ">
            <div style="
              width: 32px;
              height: 32px;
              background: linear-gradient(135deg, #FF7043 0%, #FF5722 100%);
              border: 2px solid #FFFFFF;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(255, 87, 34, 0.4);
            ">
              <span style="
                transform: rotate(45deg);
                font-size: 14px;
                line-height: 1;
                display: flex;
                align-items: center;
                justify-content: center;
              ">${isGem ? '💎' : '📍'}</span>
            </div>
            ${isGem ? `
              <span style="
                position: absolute;
                top: -4px;
                right: -4px;
                background: #8B5CF6;
                color: white;
                font-size: 8px;
                font-weight: 900;
                padding: 1px 4px;
                border-radius: 99px;
                border: 1px solid white;
              ">GEM</span>
            ` : ''}
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-orange-place-pin',
          iconSize: [32, 38],
          iconAnchor: [16, 36],
          popupAnchor: [0, -34],
        });

        const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(layerGroup);
        marker.bindPopup(`
          <div style="font-family: -apple-system, sans-serif; color: #0F172A; width: 220px;">
            <div style="position: relative; height: 95px; border-radius: 8px; overflow: hidden; margin-bottom: 7px;">
              <img src="${place.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${place.name}" />
              <span style="position: absolute; top: 4px; right: 4px; background: rgba(15, 23, 42, 0.85); color: #FFF; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 800;">
                ⭐ ${place.rating}
              </span>
            </div>
            <strong style="font-size: 13.5px; display: block; color: #0F172A; margin-bottom: 2px;">${place.name}</strong>
            <span style="font-size: 10px; background: #FFF3E0; color: #D84315; padding: 2px 6px; border-radius: 4px; font-weight: 700; display: inline-block; margin-bottom: 5px;">
              ${place.categoryLabel}
            </span>
            <p style="font-size: 11px; color: #64748B; margin: 0 0 8px; line-height: 1.35;">${place.aiSummary}</p>
            <button id="pin-view-btn-${place.id}" style="
              width: 100%;
              background: #FF5722;
              color: white;
              border: none;
              padding: 6px 10px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 700;
              cursor: pointer;
            ">Explore Details →</button>
          </div>
        `);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`pin-view-btn-${place.id}`);
          if (btn) btn.onclick = () => onSelectPlace(place);
        });
      });
    }

    // 4. Heritage Sites
    if (showHeritage) {
      heritageSites.forEach((site) => {
        const iconHtml = `
          <div style="
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #FF9800, #E65100);
            border: 2px solid #FFFFFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 10px rgba(230, 81, 0, 0.45);
            font-size: 15px;
          ">🏛️</div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-heritage-pin',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });

        const marker = L.marker([site.lat, site.lng], { icon: customIcon }).addTo(layerGroup);
        marker.bindPopup(`
          <div style="font-family: -apple-system, sans-serif; color: #0F172A; width: 200px;">
            <strong style="font-size: 13px; color: #C2410C; display: block; margin-bottom: 2px;">🏛️ ${site.name}</strong>
            <div style="font-size: 10.5px; color: #475569; margin-bottom: 5px;">Era: ${site.era} (${site.builtYear})</div>
            <p style="font-size: 11px; color: #334155; margin: 0; line-height: 1.35;">${site.description}</p>
          </div>
        `);
      });
    }

    // 5. Citizen Incident & Disaster Alerts
    if (showReports) {
      citizenReports.forEach((rep) => {
        const isDisaster = rep.isDisaster || rep.aiRiskScore === 'Critical';
        const iconHtml = `
          <div style="
            width: 28px;
            height: 28px;
            background: ${isDisaster ? '#DC2626' : '#EA580C'};
            border: 2px solid #FFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            box-shadow: 0 0 0 4px ${isDisaster ? 'rgba(220, 38, 38, 0.35)' : 'rgba(234, 88, 12, 0.25)'};
          ">${isDisaster ? '🚨' : '⚠️'}</div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-report-pin',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        });

        const marker = L.marker([rep.lat, rep.lng], { icon: customIcon }).addTo(layerGroup);
        marker.bindPopup(`
          <div style="font-family: -apple-system, sans-serif; color: #0F172A; width: 210px;">
            <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 4px;">
              <span style="background: ${isDisaster ? '#FEE2E2' : '#FFEDD5'}; color: ${isDisaster ? '#991B1B' : '#9A3412'}; font-size: 9.5px; font-weight: 800; padding: 2px 5px; border-radius: 4px;">
                ${rep.category.toUpperCase()}
              </span>
              <span style="font-size: 10px; color: #64748B; margin-left: auto;">${rep.timestamp}</span>
            </div>
            <strong style="font-size: 12.5px; color: ${isDisaster ? '#DC2626' : '#EA580C'}; display: block; margin-bottom: 3px;">${rep.title}</strong>
            <p style="font-size: 11px; color: #334155; margin: 0 0 5px; line-height: 1.35;">${rep.description}</p>
            <div style="font-size: 10.5px; color: #64748B;">📍 ${rep.locationName}</div>
          </div>
        `);
      });
    }
  }, [showPlaces, showHeritage, showSafety, showRoutes, showReports, selectedRouteId, places, heritageSites, safetyZones, safeRoutes, citizenReports]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Controls Bar */}
      <div
        className="glass-panel"
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '0.9rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.85rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              background: '#FF5722',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 3px 10px rgba(255, 87, 34, 0.4)',
            }}
          >
            <Compass size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0F172A' }}>
              Live OpenStreetMap Radar ({city.name})
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
              100% Free Open Tiles Active • {places.length} Locations • {safetyZones.length} Zones
            </div>
          </div>
        </div>

        {/* Tile Provider Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#F1F5F9', padding: '3px', borderRadius: '10px' }}>
          <button
            onClick={() => setTileSource('osm')}
            style={{
              background: tileSource === 'osm' ? '#FF5722' : 'transparent',
              color: tileSource === 'osm' ? '#FFF' : '#475569',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '7px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🗺️ OpenStreetMap
          </button>
          <button
            onClick={() => setTileSource('esri')}
            style={{
              background: tileSource === 'esri' ? '#FF5722' : 'transparent',
              color: tileSource === 'esri' ? '#FFF' : '#475569',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '7px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🌍 Esri World
          </button>
          <button
            onClick={() => setTileSource('humanitarian')}
            style={{
              background: tileSource === 'humanitarian' ? '#FF5722' : 'transparent',
              color: tileSource === 'humanitarian' ? '#FFF' : '#475569',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '7px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🧭 Terrain (HOT)
          </button>
        </div>

        {/* Layer Toggles */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          <button
            onClick={() => setShowPlaces(!showPlaces)}
            style={{
              background: showPlaces ? '#FFF3E0' : '#F8FAFC',
              border: `1px solid ${showPlaces ? '#FF5722' : '#CBD5E1'}`,
              color: showPlaces ? '#D84315' : '#64748B',
              borderRadius: '20px',
              padding: '0.35rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <MapPin size={13} />
            <span>Places ({places.length})</span>
          </button>

          <button
            onClick={() => setShowSafety(!showSafety)}
            style={{
              background: showSafety ? '#ECFDF5' : '#F8FAFC',
              border: `1px solid ${showSafety ? '#10B981' : '#CBD5E1'}`,
              color: showSafety ? '#047857' : '#64748B',
              borderRadius: '20px',
              padding: '0.35rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <ShieldCheck size={13} />
            <span>Safety Zones</span>
          </button>

          <button
            onClick={() => setShowHeritage(!showHeritage)}
            style={{
              background: showHeritage ? '#FFFBEB' : '#F8FAFC',
              border: `1px solid ${showHeritage ? '#F59E0B' : '#CBD5E1'}`,
              color: showHeritage ? '#B45309' : '#64748B',
              borderRadius: '20px',
              padding: '0.35rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Landmark size={13} />
            <span>Heritage</span>
          </button>

          <button
            onClick={() => setShowRoutes(!showRoutes)}
            style={{
              background: showRoutes ? '#EFF6FF' : '#F8FAFC',
              border: `1px solid ${showRoutes ? '#3B82F6' : '#CBD5E1'}`,
              color: showRoutes ? '#1D4ED8' : '#64748B',
              borderRadius: '20px',
              padding: '0.35rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Navigation2 size={13} />
            <span>Routes</span>
          </button>

          <button
            onClick={() => setShowReports(!showReports)}
            style={{
              background: showReports ? '#FEF2F2' : '#F8FAFC',
              border: `1px solid ${showReports ? '#EF4444' : '#CBD5E1'}`,
              color: showReports ? '#B91C1C' : '#64748B',
              borderRadius: '20px',
              padding: '0.35rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Radio size={13} />
            <span>Alerts ({citizenReports.length})</span>
          </button>
        </div>
      </div>

      {/* Actual Map Container */}
      <div
        style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid #CBD5E1',
          boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
          height: '540px',
          width: '100%',
          backgroundColor: '#E2E8F0',
        }}
      >
        <div
          ref={mapContainerRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        />

        {/* Legend */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontSize: '11px',
            color: '#1E293B',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ fontWeight: 800, fontSize: '11px', color: '#FF5722', marginBottom: '2px' }}>
            MAP PIN LEGEND
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5722' }}></span>
            <span>Food & Hidden Gems (Bright Orange)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></span>
            <span>Verified Safe Patrolled Zone</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></span>
            <span>Accident Blackspot / Hazard</span>
          </div>
        </div>
      </div>

      {/* Safe Corridor Quick Selector */}
      {showRoutes && safeRoutes.length > 0 && (
        <div
          className="glass-panel"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '0.85rem 1.15rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#D84315', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Navigation2 size={15} />
            <span>Safe Transit Corridors in {city.name}:</span>
          </div>
          <div style={{ display: 'flex', gap: '0.65rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
            {safeRoutes.map((route) => {
              const isSelected = route.id === selectedRouteId;
              return (
                <button
                  key={route.id}
                  onClick={() => {
                    setSelectedRouteId(route.id);
                    if (mapInstanceRef.current && route.waypoints[0]) {
                      mapInstanceRef.current.panTo(route.waypoints[0], { animate: true });
                    }
                  }}
                  style={{
                    background: isSelected ? '#FF5722' : '#F8FAFC',
                    color: isSelected ? '#FFFFFF' : '#334155',
                    border: `1px solid ${isSelected ? '#FF5722' : '#CBD5E1'}`,
                    borderRadius: '10px',
                    padding: '0.55rem 0.95rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.82rem' }}>{route.name}</div>
                  <div style={{ fontSize: '0.7rem', opacity: isSelected ? 0.95 : 0.75, marginTop: '2px' }}>
                    Safety: {route.overallSafetyIndex}/100 • {route.distanceKm} km
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
