import React from 'react';
import type { Place } from '../types';
import { X, Bookmark, Trash2, ExternalLink } from 'lucide-react';

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlaces: Place[];
  onRemoveSaved: (placeId: string) => void;
  onSelectPlace: (place: Place) => void;
}

export const SavedModal: React.FC<SavedModalProps> = ({
  isOpen,
  onClose,
  savedPlaces,
  onRemoveSaved,
  onSelectPlace
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            <Bookmark size={20} style={{ color: 'var(--accent-amber)' }} />
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Saved Exploration Itinerary</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {savedPlaces.length} bookmark{savedPlaces.length === 1 ? '' : 's'} ready for your city trip
              </p>
            </div>
          </div>

          {savedPlaces.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              <Bookmark size={36} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
              <p>No saved spots yet. Browse Explore & Food tab and click "Save Spot"!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '60vh', overflowY: 'auto' }}>
              {savedPlaces.map((place) => (
                <div
                  key={place.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <img src={place.imageUrl} alt={place.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />

                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>{place.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{place.categoryLabel}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)' }}>⭐ {place.rating} | {place.priceLevel}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPlace(place);
                      }}
                      style={{ background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)', border: '1px solid var(--border-glow)', padding: '0.4rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                      title="View Details"
                    >
                      <ExternalLink size={15} />
                    </button>

                    <button
                      onClick={() => onRemoveSaved(place.id)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.4rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                      title="Remove from Saved"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
