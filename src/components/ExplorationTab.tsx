import React, { useState } from 'react';
import type { Place } from '../types';
import { Star, Sparkles, MapPin, Bookmark, ExternalLink, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExplorationTabProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  savedPlaceIds: string[];
  onToggleSave: (placeId: string) => void;
  searchQuery: string;
}

export const ExplorationTab: React.FC<ExplorationTabProps> = ({
  places,
  onSelectPlace,
  savedPlaceIds,
  onToggleSave,
  searchQuery
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [onlyHiddenGems, setOnlyHiddenGems] = useState(false);

  const categories = [
    { id: 'all', label: 'All Spot Types' },
    { id: 'food', label: '🍕 Local Food & Izakayas' },
    { id: 'attraction', label: '🏛️ Tourist Attractions' },
    { id: 'hotel', label: '🏨 Hotels & Hospitality' },
    { id: 'budget', label: '💰 Budget Friendly' },
    { id: 'nightlife', label: '🌙 Nightlife & Jazz' },
  ];

  const filteredPlaces = places.filter((place) => {
    // Category filter
    if (activeCategory !== 'all' && place.category !== activeCategory) return false;
    // Hidden gems filter
    if (onlyHiddenGems && !place.hiddenGem) return false;
    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = place.name.toLowerCase().includes(q);
      const matchDesc = place.description.toLowerCase().includes(q);
      const matchTag = place.tags.some((t) => t.toLowerCase().includes(q));
      return matchName || matchDesc || matchTag;
    }
    return true;
  });

  const handleSaveClick = (e: React.MouseEvent, placeId: string) => {
    e.stopPropagation();
    onToggleSave(placeId);
    if (!savedPlaceIds.includes(placeId)) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Search & Filter Header Bar */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Exploration & Local Hospitality</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Curated dining, budget spots, boutique hotels, and AI verified hidden gems
            </p>
          </div>

          <button
            onClick={() => setOnlyHiddenGems(!onlyHiddenGems)}
            className={`chip-btn ${onlyHiddenGems ? 'active' : ''}`}
            style={{
              background: onlyHiddenGems ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(139, 92, 246, 0.15)',
              color: 'white',
              borderColor: 'rgba(139, 92, 246, 0.4)'
            }}
          >
            <Sparkles size={16} />
            <span>Hidden Gem Filter {onlyHiddenGems ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="filter-chips-row" style={{ marginBottom: 0 }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`chip-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Places */}
      {filteredPlaces.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <Compass size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No Places Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            Try clearing filters or searching for different keywords like "noodles", "view", "jazz", or "hotel".
          </p>
        </div>
      ) : (
        <div className="grid-cards">
          {filteredPlaces.map((place) => {
            const isSaved = savedPlaceIds.includes(place.id);
            return (
              <div
                key={place.id}
                className="place-card"
                onClick={() => onSelectPlace(place)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-img-wrapper">
                  <img src={place.imageUrl} alt={place.name} className="card-img" />
                  
                  {place.hiddenGem && (
                    <div className="badge-hidden-gem">
                      <Sparkles size={12} />
                      <span>Gem Score {place.hiddenGemScore}</span>
                    </div>
                  )}

                  <div className="card-category-badge">
                    {place.categoryLabel}
                  </div>
                </div>

                <div className="card-body">
                  <div className="card-title-row">
                    <h3 className="card-title">{place.name}</h3>
                    <div className="rating-badge">
                      <Star size={13} fill="currentColor" />
                      <span>{place.rating}</span>
                    </div>
                  </div>

                  <p className="card-ai-summary">
                    ✨ <strong>AI Summary:</strong> {place.aiSummary}
                  </p>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} style={{ color: 'var(--accent-cyan)' }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place.address}</span>
                  </div>

                  <div className="card-tags">
                    {place.tags.map((tag, i) => (
                      <span key={i} className="tag-pill">#{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="card-footer">
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--accent-emerald)' }}>
                    {place.priceLevel} ({place.hours.split(' ')[0]})
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={(e) => handleSaveClick(e, place.id)}
                      style={{
                        background: isSaved ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        color: isSaved ? 'var(--accent-amber)' : 'var(--text-muted)',
                        border: `1px solid ${isSaved ? 'var(--accent-amber)' : 'var(--border-light)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '0.4rem 0.65rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                      title="Save to Itinerary"
                    >
                      <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>

                    <button className="btn-detail" onClick={() => onSelectPlace(place)}>
                      <span>Explore</span>
                      <ExternalLink size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
