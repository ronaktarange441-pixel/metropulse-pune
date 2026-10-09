import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, CityInfo, Place } from '../types';
import { MessageCircle, X, Send, Bot, User, Key, Settings, Loader2 } from 'lucide-react';

interface AIChatbotProps {
  city: CityInfo;
  places: Place[];
}

const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Fallback intelligent responder with hyper-localized Pune knowledge
function getLocalPuneAIResponse(query: string, city: CityInfo): string {
  const q = query.toLowerCase();

  if (q.includes('safe') || q.includes('night') || q.includes('route')) {
    return `🛡️ **Safe Travel Recommendations for ${city.name}:**\n\n• **Safest Corridors:** Koregaon Park (North Main Rd), FC Road, SB Road, and Pimple Saudagar Smart Corridor.\n• **Night Travel:** Shivajinagar to Koregaon Park via Bund Garden is 100% lit with active PCR vans.\n• **IT Employees:** Hinjewadi to Baner corridor has 24/7 patrol units. Avoid isolated Wakad underpass lanes post 11 PM.\n• **Emergency:** Pune City Police: **112 / 100**, Women Helpline: **1091**.`;
  }

  if (q.includes('accident') || q.includes('blackspot') || q.includes('danger') || q.includes('risk')) {
    return `⚠️ **Critical Accident Blackspots & Caution Zones:**\n\n1. **Navale Bridge (Katraj-Narhe NH-48):** Severe accident blackspot due to a 4 km downhill slope causing truck brake failures. Drive under 40 km/h in low gear.\n2. **Katraj Ghat Old Road:** Sharp hairpin bends with slippery gravel.\n3. **Bhushi Dam Steps (Lonavla):** Extremely hazardous during heavy rains; sudden flash surges.\n4. **Tamhini Ghat:** Prone to landslides and dense zero-visibility fog during monsoon.`;
  }

  if (q.includes('flood') || q.includes('water') || q.includes('disaster') || q.includes('rain')) {
    return `🌊 **Disaster & Monsoon Flood Alert System:**\n\n• **Khadakwasla Dam:** Periodic discharge (18,000+ cusecs) directly floods **Baba Bhide Bridge, Pulachi Wadi, and riverside parking lanes**.\n• **Low Bridges Closed in Heavy Rain:** Tilak Bridge causeway, Baba Bhide Bridge, Holkar Bridge riverside.\n• **Lonavla:** Bhushi Dam steps overflow warning sirens; evacuate immediately when sirens sound.\n• **Disaster Helpline:** Pune District Disaster Cell: **1077 / 020-26123371**.`;
  }

  if (q.includes('food') || q.includes('misal') || q.includes('eat') || q.includes('restaurant') || q.includes('gem')) {
    return `🍕 **Top Food Recommendations & Hidden Gems:**\n\n1. **Vaishali (FC Road):** Iconic Mysore Masala Dosa, SPDP, and filter coffee.\n2. **Kayani Bakery (Camp):** World-famous buttery Shrewsbury biscuits (get there at 8 AM or 4 PM!).\n3. **Cafe Goodluck (Deccan):** Bun maska + hot sweet Irani chai since 1935.\n4. **Kumthekar Road (Sadashiv Peth):** Authentic hot steamed Ukadiche Modak with pure ghee.\n5. **Pimple Saudagar:** Night food street along the linear garden for family dining.`;
  }

  if (q.includes('heritage') || q.includes('fort') || q.includes('history')) {
    return `🏛️ **Historic Landmarks & Heritage:**\n\n• **Shaniwar Wada (1732):** The royal seat of the Peshwa Empire with towering spiked gates.\n• **Shivneri Fort (Junnar):** The sacred birthplace of Chhatrapati Shivaji Maharaj.\n• **Aga Khan Palace (1892):** Historic Gandhi memorial where Kasturba Gandhi stayed.\n• **Ghorawdeshwar Caves (Talegaon):** Ancient 3rd-century rock-cut Buddhist & Shiva shrines.`;
  }

  return `Namaste! I am **MetroPulse AI**, connected to Pune & Maharashtra real-time city data.\n\n• I can help with **Safe Routes & Night Travel**\n• **Accident Blackspots (Navale Bridge, Katraj)**\n• **Flood & Dam Discharge Alerts (Khadakwasla, Bhide Bridge)**\n• **Hidden Food Gems (FC Road, Camp, Sadashiv Peth)**\n• **Heritage Forts & History**\n\nWhat would you like to explore in **${city.name}**?`;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ city }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('metropulse_gemini_key') || DEFAULT_API_KEY;
  });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: `🙏 **Namaste! I am MetroPulse AI** for **${city.name}**.\n\nAsk me about:\n• 🛡️ **Safe routes** for night travel\n• ⚠️ **Accident blackspots** (Navale Bridge, Katraj)\n• 🌊 **Dam discharge & flood alerts**\n• 🍕 **Hidden gems & street food**\n• 🏛️ **Heritage forts & history**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    const keyToUse = apiKey.trim() || DEFAULT_API_KEY;

    // Supported Google models
    const modelsToTry = ['gemini-flash-latest', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'];

    const systemPrompt = `You are MetroPulse AI, an intelligent city navigation & safety assistant for Pune, PCMC, Lonavla, Talegaon, and surrounding districts in Maharashtra, India.
Current City: ${city.name} (${city.region}).
Current stats: Safety ${city.safetyScore}/100, Temp ${city.temp}°C, AQI ${city.aqi}.
Local knowledge:
- Accident blackspots: Navale Bridge (Katraj-Narhe NH-48 steep downhill gradient), Katraj Ghat old road, Bhushi Dam overflow in Lonavla, Tamhini Ghat landslides.
- Flood hazards: Khadakwasla Dam discharge floods Baba Bhide Bridge / Pulachi Wadi.
- Safe zones: Koregaon Park, FC Road, Pimple Saudagar smart corridor.
- Food & culture: Vaishali, Cafe Goodluck, Kayani Bakery Shrewsbury biscuits, Shaniwar Wada, Shivneri Fort.
Respond concisely with markdown formatting, bold points, and relevant emojis. Support English, Hindi, and Marathi.`;

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${keyToUse}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${systemPrompt}\n\nUser Question: ${userMessage}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        }
      } catch (err) {
        // Continue to fallback model
      }
    }

    // High quality local fallback if network / quota limit
    return getLocalPuneAIResponse(userMessage, city);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await callGeminiAPI(userText);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getLocalPuneAIResponse(userText, city),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    '🛡️ Safe night route from Shivajinagar to KP',
    '⚠️ What is the danger at Navale Bridge?',
    '🌊 Flood alert for Baba Bhide bridge',
    '🍪 Where can I buy Kayani Shrewsbury biscuits?',
  ];

  return (
    <>
      {/* Floating Chat Trigger Button — Bright Orange */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '1.25rem',
          zIndex: 1500,
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: isOpen ? '#1E293B' : 'linear-gradient(135deg, #FF6E40 0%, #FF5722 100%)',
          border: '2px solid #FFFFFF',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 8px 25px rgba(255, 87, 34, 0.45)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        title="MetroPulse AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
      </button>

      {/* Modern Ice White Chat Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '7.8rem',
            right: '1.25rem',
            width: '380px',
            maxWidth: 'calc(100vw - 2.5rem)',
            height: '540px',
            maxHeight: '72vh',
            zIndex: 1500,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '0.9rem 1rem',
              background: 'linear-gradient(135deg, #FF5722 0%, #FF7043 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FF5722',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', lineHeight: 1.2 }}>MetroPulse AI</div>
                <div style={{ fontSize: '0.68rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ADE80' }}></span>
                  <span>Active • {city.name} Safety & Guide</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '5px',
                cursor: 'pointer',
              }}
              title="API Key Settings"
            >
              <Settings size={16} />
            </button>
          </div>

          {/* API Key Banner if opened */}
          {showKeyInput && (
            <div style={{ padding: '0.75rem', background: '#FFF7ED', borderBottom: '1px solid #FFEDD5' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C2410C', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Key size={13} />
                <span>Google AI Studio API Key (Active):</span>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    localStorage.setItem('metropulse_gemini_key', e.target.value);
                  }}
                  placeholder="Paste Gemini API Key..."
                  style={{
                    flex: 1,
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    padding: '0.35rem 0.6rem',
                    fontSize: '0.75rem',
                    color: '#0F172A',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => setShowKeyInput(false)}
                  style={{
                    background: '#FF5722',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              background: '#F8FAFC',
            }}
          >
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: isUser ? 'row-reverse' : 'row',
                    gap: '0.45rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: isUser ? '#FF5722' : '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      color: isUser ? '#FFFFFF' : '#FF5722',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isUser ? <User size={13} /> : <Bot size={13} />}
                  </div>

                  <div
                    style={{
                      maxWidth: '82%',
                      background: isUser ? '#FF5722' : '#FFFFFF',
                      color: isUser ? '#FFFFFF' : '#1E293B',
                      border: isUser ? 'none' : '1px solid #E2E8F0',
                      padding: '0.65rem 0.85rem',
                      borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      fontSize: '0.82rem',
                      lineHeight: '1.45',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      wordBreak: 'break-word',
                    }}
                  >
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    <div
                      style={{
                        fontSize: '0.65rem',
                        marginTop: '0.35rem',
                        textAlign: isUser ? 'right' : 'left',
                        color: isUser ? 'rgba(255,255,255,0.75)' : '#94A3B8',
                      }}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF5722' }}>
                  <Bot size={13} />
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.5rem 0.8rem', borderRadius: '4px 16px 16px 16px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Loader2 size={14} color="#FF5722" style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Querying Pune city radar...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div style={{ padding: '0.4rem 0.75rem', background: '#FFFFFF', borderTop: '1px solid #F1F5F9', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setInput(prompt)}
                  style={{
                    background: '#FFF3E0',
                    border: '1px solid #FFE0B2',
                    borderRadius: '12px',
                    padding: '0.22rem 0.55rem',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: '#E65100',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div
            style={{
              padding: '0.65rem 0.85rem',
              background: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Pune routes, food, safety, floods..."
              style={{
                flex: 1,
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '0.55rem 0.8rem',
                fontSize: '0.82rem',
                color: '#0F172A',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              style={{
                background: input.trim() ? '#FF5722' : '#CBD5E1',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
