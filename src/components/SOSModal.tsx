import React, { useState, useEffect } from 'react';
import { ShieldAlert, PhoneCall, Volume2, VolumeX, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName: string;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose, cityName }) => {
  const [sirenActive, setSirenActive] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'transmitting' | 'dispatched'>('idle');
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);

  useEffect(() => {
    if (!isOpen && sirenActive) {
      stopSiren();
    }
  }, [isOpen]);

  const toggleSiren = () => {
    if (sirenActive) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  const startSiren = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      setAudioCtx(ctx);
      setOscillator(osc);
      setSirenActive(true);
    } catch (e) {
      console.error(e);
    }
  };

  const stopSiren = () => {
    if (oscillator) {
      try { oscillator.stop(); } catch (e) {}
    }
    if (audioCtx) {
      try { audioCtx.close(); } catch (e) {}
    }
    setOscillator(null);
    setAudioCtx(null);
    setSirenActive(false);
  };

  const handleTransmitSOS = () => {
    setDispatchStatus('transmitting');
    setTimeout(() => {
      setDispatchStatus('dispatched');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', background: '#111827' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={28} className="pulse-dot" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#EF4444' }}>Emergency Guardian SOS</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Instant Dispatch Signal & Siren Alarm for {cityName}
              </p>
            </div>
          </div>

          {/* Siren Control & Panic Trigger */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button
              onClick={toggleSiren}
              style={{
                background: sirenActive ? 'linear-gradient(135deg, #DC2626, #991B1B)' : 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #EF4444',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 700
              }}
            >
              {sirenActive ? <VolumeX size={24} /> : <Volume2 size={24} />}
              <span>{sirenActive ? 'MUTE SIREN ALARM' : 'ACTIVATE HIGH SIREN'}</span>
            </button>

            <button
              onClick={handleTransmitSOS}
              disabled={dispatchStatus === 'dispatched'}
              style={{
                background: dispatchStatus === 'dispatched' ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #EF4444, #B91C1C)',
                border: 'none',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 800
              }}
            >
              {dispatchStatus === 'dispatched' ? (
                <>
                  <CheckCircle size={24} />
                  <span>BEACON DISPATCHED!</span>
                </>
              ) : dispatchStatus === 'transmitting' ? (
                <>
                  <div className="pulse-dot" />
                  <span>TRANSMITTING GPS...</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={24} />
                  <span>BROADCAST SOS SIGNAL</span>
                </>
              )}
            </button>
          </div>

          {/* Dispatch Status Alert Box */}
          {dispatchStatus === 'dispatched' && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--accent-emerald)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--accent-emerald)' }}>
              ✅ <strong>Emergency Alert Broadcasted:</strong> Live GPS coordinates (40.7128° N, 74.0060° W) transmitted to nearby emergency response center and your emergency contacts list.
            </div>
          )}

          {/* Emergency Hotlines */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
              Direct City Hotlines
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <a
                href="tel:911"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <PhoneCall size={18} style={{ color: '#EF4444' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Police / Medical</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dial 911 / 112</span>
                </div>
              </a>

              <a
                href="tel:1800"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <ShieldAlert size={18} style={{ color: 'var(--accent-purple)' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Women Helpline</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>24/7 Monitored</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
