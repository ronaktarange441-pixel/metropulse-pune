import React from 'react';
import type { Place } from '../types';
import { X, Star, MapPin, Sparkles, Bookmark } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DetailModalProps {
  place: Place | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (placeId: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  place,
  onClose,
  isSaved,
  onToggleSave
}) => {
  if (!place) return null;

  const handleSave = () => {
    onToggleSave(place.id);
    if (!isSaved) {
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Hero Image */}
        <div style={{ position: 'relative', height: '260px', width: '100%' }}>
          <img src={place.imageUrl} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

          {place.hiddenGem && (
            <div className="badge-hidden-gem" style={{ top: '1rem', left: '1rem' }}>
              <Sparkles size={14} />
              <span>Hidden Gem Score {place.hiddenGemScore}/100</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', background: 'rgba(0, 242, 254, 0.15)', color: 'var(--accent-cyan)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>
                {place.categoryLabel}
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.3rem' }}>{place.name}</h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                <MapPin size={14} style={{ color: 'var(--accent-cyan)' }} />
                <span>{place.address}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div className="rating-badge" style={{ fontSize: '1rem', padding: '0.3rem 0.6rem' }}>
                <Star size={16} fill="currentColor" />
                <span>{place.rating}</span>
              </div>

              <button
                onClick={handleSave}
                style={{
                  background: isSaved ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSaved ? 'var(--accent-amber)' : 'var(--text-muted)',
                  border: `1px solid ${isSaved ? 'var(--accent-amber)' : 'var(--border-light)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem 0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                <span>{isSaved ? 'Saved in Itinerary' : 'Save Spot'}</span>
              </button>
            </div>
          </div>

          {/* AI Summary Box */}
          <div style={{ background: 'rgba(0, 242, 254, 0.08)', border: '1px solid var(--border-glow)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <Sparkles size={16} />
              <span>AI Explorer Insights</span>
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
              {place.aiSummary}
            </p>
          </div>

          {/* Key Metrics Dashboard */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>SAFETY</span>
              <strong style={{ fontSize: '1rem', color: 'var(--accent-emerald)' }}>{place.safetyRating}/10</strong>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>CLEANLINESS</span>
              <strong style={{ fontSize: '1rem', color: 'var(--accent-cyan)' }}>{place.cleanlinessRating}/10</strong>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>PRICE</span>
              <strong style={{ fontSize: '1rem', color: 'var(--accent-amber)' }}>{place.priceLevel}</strong>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>TRANSIT</span>
              <strong style={{ fontSize: '1rem', color: 'var(--accent-purple)' }}>{place.transitAccess}/10</strong>
            </div>
          </div>

          {/* Local Secret Tip & Hours */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '0.2rem' }}>💡 Local Secret Tip</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{place.localTip}</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>🕒 Operating Hours</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{place.hours}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
