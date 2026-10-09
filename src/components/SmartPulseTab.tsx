import React, { useState, useRef } from 'react';
import type { CityInfo, CitizenReport, SocialPulseItem, WeatherAlert } from '../types';
import { Radio, Mic, MicOff, Camera, CloudRain, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SmartPulseTabProps {
  city: CityInfo;
  reports: CitizenReport[];
  socialPulse: SocialPulseItem[];
  weatherAlerts: WeatherAlert[];
  onAddReport: (newReport: CitizenReport) => void;
}

export const SmartPulseTab: React.FC<SmartPulseTabProps> = ({
  city,
  reports,
  socialPulse,
  weatherAlerts,
  onAddReport
}) => {
  // Citizen Form state
  const [reportTitle, setReportTitle] = useState('');
  const [reportCategory, setReportCategory] = useState<'Safety' | 'Civic Maintenance' | 'Traffic Hazard' | 'Hidden Gem Spot'>('Safety');
  const [reportDesc, setReportDesc] = useState('');
  const [reportLocation, setReportLocation] = useState('');
  
  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);

  // Photo state
  const [photoUploaded, setPhotoUploaded] = useState(false);

  // Voice recording toggle
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (e) {
      // Fallback simulation if microphone permissions are disabled
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current) {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      } catch (e) {}
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
    setVoiceRecorded(true);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportDesc.trim()) {
      alert('Please provide a title and description for your citizen report.');
      return;
    }

    const newReport: CitizenReport = {
      id: 'cr-' + Date.now(),
      cityId: city.id,
      title: reportTitle,
      category: reportCategory,
      description: reportDesc,
      locationName: reportLocation || `${city.name} Central Zone`,
      lat: city.lat + (Math.random() - 0.5) * 0.02,
      lng: city.lng + (Math.random() - 0.5) * 0.02,
      timestamp: 'Just now',
      votes: 1,
      status: 'Verified by AI',
      hasVoiceNote: voiceRecorded,
      voiceNoteDuration: voiceRecorded ? `0:${recordingTime < 10 ? '0' + recordingTime : recordingTime}` : undefined,
      audioTranscript: voiceRecorded ? reportDesc : undefined,
      imageUrl: photoUploaded ? 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80' : undefined,
      aiRiskScore: reportCategory === 'Safety' ? 'High' : reportCategory === 'Traffic Hazard' ? 'Medium' : 'Low'
    };

    onAddReport(newReport);
    confetti({ particleCount: 60, spread: 70 });

    // Reset Form
    setReportTitle('');
    setReportDesc('');
    setReportLocation('');
    setVoiceRecorded(false);
    setPhotoUploaded(false);
    setRecordingTime(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(15, 23, 42, 0.85))', borderColor: 'rgba(0, 242, 254, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(0, 242, 254, 0.2)', color: 'var(--accent-cyan)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Smart City Insights & Live Urban Pulse</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Micro-climate weather alerts, live traffic radar, and voice-enabled crowdsourced citizen reporting
            </p>
          </div>
        </div>
      </div>

      {/* Weather & Micro-climate Alert Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {weatherAlerts.map((w) => (
          <div
            key={w.id}
            className="glass-panel"
            style={{
              borderColor: w.severity === 'warning' ? 'var(--accent-amber)' : 'var(--accent-cyan)',
              background: w.severity === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(0, 242, 254, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <CloudRain size={18} style={{ color: w.severity === 'warning' ? 'var(--accent-amber)' : 'var(--accent-cyan)' }} />
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>{w.title}</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>{w.description}</p>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
              💡 <strong>Advice:</strong> {w.recommendation}
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Citizen Report Form + Live Citizen Feed & Social Pulse */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px minmax(0, 1fr)', gap: '1.25rem' }} className="pulse-grid-layout">
        {/* Submit Citizen Incident Form */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.6rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span>Report Issue or Hidden Spot</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              AI verified citizen contribution with voice & photo support
            </p>
          </div>

          <form onSubmit={handleSubmitReport} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                CATEGORY
              </label>
              <select
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value as any)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', padding: '0.5rem', borderRadius: 'var(--radius-md)', color: 'white', fontSize: '0.85rem' }}
              >
                <option value="Safety" style={{ background: '#0F172A' }}>🚨 Safety / Dark Lighting Hazard</option>
                <option value="Civic Maintenance" style={{ background: '#0F172A' }}>🛠️ Civic Maintenance / Pothole</option>
                <option value="Traffic Hazard" style={{ background: '#0F172A' }}>🚦 Traffic Bottleneck</option>
                <option value="Hidden Gem Spot" style={{ background: '#0F172A' }}>💎 Hidden Gem Food / Spot</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                TITLE / ISSUE NAME
              </label>
              <input
                type="text"
                placeholder="e.g. Broken Streetlight on 5th Ave..."
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                LOCATION / STREET NAME
              </label>
              <input
                type="text"
                placeholder="e.g. Washington Square North Entrance"
                value={reportLocation}
                onChange={(e) => setReportLocation(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                DESCRIPTION / VOICE NOTE
              </label>
              <textarea
                rows={3}
                placeholder="Describe details for municipal crew..."
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', color: 'white', fontSize: '0.85rem', outline: 'none', resize: 'none' }}
              />
            </div>

            {/* Media Attachment Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              {/* Voice Note Button */}
              <button
                type="button"
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                style={{
                  background: isRecording ? '#EF4444' : voiceRecorded ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${isRecording ? '#EF4444' : voiceRecorded ? 'var(--accent-emerald)' : 'var(--border-light)'}`,
                  color: isRecording ? 'white' : voiceRecorded ? 'var(--accent-emerald)' : 'var(--text-main)',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem'
                }}
              >
                {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
                <span>
                  {isRecording ? `Recording (${recordingTime}s)` : voiceRecorded ? 'Voice Note Recorded' : 'Record Voice Note'}
                </span>
              </button>

              {/* Photo Simulator Button */}
              <button
                type="button"
                onClick={() => setPhotoUploaded(!photoUploaded)}
                style={{
                  background: photoUploaded ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${photoUploaded ? 'var(--accent-cyan)' : 'var(--border-light)'}`,
                  color: photoUploaded ? 'var(--accent-cyan)' : 'var(--text-main)',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem'
                }}
              >
                <Camera size={15} />
                <span>{photoUploaded ? 'Photo Attached' : 'Attach Photo'}</span>
              </button>
            </div>

            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
                color: '#000',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem'
              }}
            >
              <Send size={16} />
              <span>Submit to Smart City AI Portal</span>
            </button>
          </form>
        </div>

        {/* Public Citizen Reports Feed & Live Social Pulse */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Reports Feed */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              Verified Citizen Reports ({reports.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {reports.map((rep) => (
                <div key={rep.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', padding: '0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>{rep.title}</h4>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(0, 242, 254, 0.15)', color: 'var(--accent-cyan)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>
                      {rep.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{rep.description}</p>

                  {rep.hasVoiceNote && (
                    <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--accent-purple)' }}>
                      <Mic size={14} />
                      <span>Audio Note ({rep.voiceNoteDuration})</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginLeft: 'auto' }}>
                        "{rep.audioTranscript}"
                      </span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', paddingTop: '0.3rem' }}>
                    <span>📍 {rep.locationName}</span>
                    <span>🕒 {rep.timestamp} | 👍 {rep.votes} Upvotes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media City Pulse */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              Live Social Media Buzz
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
              {socialPulse.map((post) => (
                <div key={post.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={post.avatar} alt={post.username} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{post.username}</div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{post.userHandle}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{post.content}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
                    <span>{post.tag}</span>
                    <span>❤️ {post.likes} | 🔄 {post.shares}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pulse-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
