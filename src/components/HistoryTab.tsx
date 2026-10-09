import React, { useState } from 'react';
import type { HeritageSite } from '../types';
import { Volume2, VolumeX, History, Clock, BookOpen, Calendar } from 'lucide-react';

interface HistoryTabProps {
  heritageSites: HeritageSite[];
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ heritageSites }) => {
  const [selectedSite, setSelectedSite] = useState<HeritageSite>(heritageSites[0]);
  const [showHistoricalPhoto, setShowHistoricalPhoto] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Web Speech API Voice Narrator
  const handleToggleAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        window.speechSynthesis.cancel(); // Stop any active speech first
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);

        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      alert('Text-to-Speech audio guide is not supported on this browser.');
    }
  };

  const culturalEvents = [
    { title: 'Grand Heritage Lantern Walk', date: 'October 15', location: 'Historic Quarter Plaza', tag: 'Night Culture' },
    { title: 'Artisan Craft & Antique Fair', date: 'October 22', location: 'Old Port Citadel Courtyard', tag: 'Fair & Markets' },
    { title: 'Symphony Under the Celestial Ceiling', date: 'November 05', location: 'Grand Central Concourse', tag: 'Music' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(15, 23, 42, 0.8))', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <History size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>History, Heritage & AI Audio Guides</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Step into the city's past with interactive historical image toggles and immersive audio storytelling
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '1.25rem' }} className="history-grid-layout">
        {/* Main Heritage Showcase Detail */}
        {selectedSite && (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Image Box with Time Machine Toggle */}
            <div style={{ position: 'relative', height: '300px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
              <img
                src={showHistoricalPhoto ? selectedSite.imageUrlHistorical : selectedSite.imageUrlCurrent}
                alt={selectedSite.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'filter 0.3s ease' }}
              />

              <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                {showHistoricalPhoto ? '📜 Historical Archive Photo' : '📸 Modern View Today'}
              </div>

              {/* Time Machine Toggle Button */}
              <button
                onClick={() => setShowHistoricalPhoto(!showHistoricalPhoto)}
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  background: 'linear-gradient(135deg, var(--accent-amber), #D97706)',
                  color: '#000',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.5rem 1rem',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                }}
              >
                <Clock size={16} />
                <span>{showHistoricalPhoto ? 'Switch to Present Day' : 'Time Machine View'}</span>
              </button>
            </div>

            {/* Title & Speech Player Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{selectedSite.name}</h3>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>⏳ Built: {selectedSite.builtYear}</span>
                  <span>🏛️ Style: {selectedSite.architecturalStyle}</span>
                </div>
              </div>

              {/* Speech Narrator Button */}
              <button
                onClick={() => handleToggleAudio(selectedSite.historyStory)}
                style={{
                  background: isPlayingAudio ? '#EF4444' : 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
                  color: isPlayingAudio ? '#FFF' : '#000',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.6rem 1.25rem',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 0 15px rgba(0, 242, 254, 0.3)'
                }}
              >
                {isPlayingAudio ? <VolumeX size={18} /> : <Volume2 size={18} />}
                <span>{isPlayingAudio ? 'Stop Audio Guide' : `Play AI Audio (${selectedSite.audioDuration})`}</span>
              </button>
            </div>

            {/* Historical Narrative */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <BookOpen size={16} />
                <span>Heritage Story & Tales</span>
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {selectedSite.historyStory}
              </p>
            </div>

            {/* Cultural Significance & Local Tips */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.3rem' }}>Cultural Importance</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedSite.culturalSignificance}</p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '0.3rem' }}>Visitor Secret Tip</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedSite.visitorTips}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar: Heritage Sites Selector & Cultural Event Calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Sites Selector */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              Select Heritage Landmark
            </h4>

            {heritageSites.map((site) => {
              const isSelected = site.id === selectedSite?.id;
              return (
                <div
                  key={site.id}
                  onClick={() => {
                    setSelectedSite(site);
                    if (isPlayingAudio) {
                      window.speechSynthesis.cancel();
                      setIsPlayingAudio(false);
                    }
                  }}
                  style={{
                    background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isSelected ? 'var(--accent-amber)' : 'var(--border-light)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <img src={site.imageUrlCurrent} alt={site.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: isSelected ? 'var(--accent-amber)' : 'var(--text-main)' }}>
                      {site.name}
                    </h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{site.era}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cultural Festival Calendar */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <Calendar size={18} style={{ color: 'var(--accent-purple)' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Upcoming Cultural Events</h4>
            </div>

            {culturalEvents.map((evt, idx) => (
              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 700 }}>
                  <span>{evt.date}</span>
                  <span>{evt.tag}</span>
                </div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0.2rem 0' }}>{evt.title}</h5>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {evt.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .history-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
