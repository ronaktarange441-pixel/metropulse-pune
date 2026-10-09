# 🏙️ MetroPulse AI — Smart City Life & Urban Chaos Navigator

> **City Life: Exploring, Experiencing & Navigating the Chaos We Call Home**  
> *Transforming real-world city data, safety alerts, and cultural heritage into smart insights for citizens and travelers.*

---

## 🌟 Overview & Problem Statement

City life is one big adventure — from discovering hidden food spots and historical landmarks to dealing with chaotic traffic, sudden weather changes, flash flooding, and unexpected safety hazards.

**MetroPulse AI** is an intelligent, interactive civic exploration platform built specifically for **Pune, Pimpri-Chinchwad (PCMC), Lonavla, Talegaon, Mulshi, and surrounding Maharashtra districts**. It blends open-source geospatial mapping, AI assistance, and real-time citizen crowdsourcing to make city living safer, richer, and stress-free.

---

## ✨ Core Pillars & Features

### 1. 🗺️ Live Open-Source Map Radar (Zero API Key Required)
- **100% Free OpenStreetMap & Esri World Street Map engine** with zero API keys or billing barriers.
- **Bright Orange Custom Pins**: High-visibility glowing map pins for verified spots, hidden gems, and heritage locations.
- **Accident Blackspot Warnings**: Flags dangerous zones (e.g., *Navale Bridge NH-48 steep downhill gradient*, *Katraj Ghat old road*).
- **Natural Disaster & Flood Radar**: Real-time riverbank discharge zones (*Khadakwasla Dam overflow at Baba Bhide Bridge*, *Bhushi Dam steps in Lonavla*).
- **Safe Night Routes**: Color-coded corridors with street lighting ratings, CCTV surveillance scores, and police patrol coverage.

### 2. 🤖 MetroPulse AI Chatbot (Powered by Google Gemini)
- Integrated with **Google AI Studio Gemini API** (`gemini-flash-latest` & `gemini-3.1-flash-lite`).
- **Hyper-Localized Knowledge Engine**: Answers questions about Pune transit, safe night travel, accident blackspots, flood alerts, and heritage.
- **Multi-lingual Support**: English, Hindi, and Marathi query assistance.
- **Resilient Fallback Engine**: If offline or during quota limits, the local Pune AI knowledge engine responds in under 0.5s.

### 3. 🏛️ History & Culture Time Machine
- **Interactive Audio Guide**: Web Speech API audio narration for historic sites (*Shaniwar Wada, Aga Khan Palace, Shivneri Fort*).
- **Time Machine Image Comparison**: Compare modern site photos with historical archival views.
- **Architectural & Dynasty Timelines**: Discover the Maratha Peshwa era, Hemadpanthi temple architecture, and freedom struggle milestones.

### 4. 📊 Best vs. Worst Location Matrix (Radar Spider Chart)
- Side-by-side multi-parameter comparison (*Safety, Cleanliness, Affordability, Ratings, Transit Accessibility*).
- Interactive Chart.js radar visualization to help travelers and newcomers choose the ideal neighborhood.

### 5. 📡 Live City Pulse & Citizen Crowdsourced Reporting
- **Multi-modal Citizen Reports**: Submit incidents with photos, location pins, and **real-time audio voice notes**.
- **Disaster Alerts**: Categorized alerts for floods, waterlogging, fire hazards, and accident spots.
- **Community Upvotes & AI Risk Assessment**: Automatically categorizes risk level from *Low* to *Critical*.

### 6. 🚨 Emergency One-Click SOS Dispatch
- Instant alarm modal with immediate emergency speed-dials (**Pune Police: 112**, **Disaster Management: 1077**, **Women Helpline: 1091**, **Traffic WhatsApp**).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Geospatial Mapping** | Leaflet.js, OpenStreetMap, Humanitarian OSM, Esri World Maps |
| **AI & NLP** | Google Gemini API (AI Studio), Web Speech API |
| **Data Visualization** | Chart.js, React-Chartjs-2 (Radar & Trend Analytics) |
| **Icons & Design** | Lucide React, Custom Ice-White × Bright Orange Design Tokens |
| **Styling** | Vanilla CSS (Glassmorphism, Plus Jakarta Sans, Responsive Layouts) |

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/metropulse-pune.git
cd metropulse-pune

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open **[http://localhost:5173/](http://localhost:5173/)** in your browser!

### Building for Production

```bash
npm run build
```
The optimized bundle will be created in the `dist/` directory.

---

## 🌐 Deploy to the Web for Free (Step-by-Step)

### Option A: Deploy on Vercel (Recommended — Takes 1 Minute)
1. Push your code to a GitHub repository (see GitHub instructions below).
2. Go to **[vercel.com](https://vercel.com/)** and sign in with GitHub.
3. Click **"Add New Project"** and select your `metropulse-pune` repository.
4. Keep the default settings (Framework: *Vite*, Root: `./`, Build: `npm run build`).
5. Click **"Deploy"**! Your site is now live with an HTTPS link (e.g., `https://metropulse.vercel.app`).

### Option B: Deploy on Netlify
1. Go to **[netlify.com](https://netlify.com/)** and sign in with GitHub.
2. Select your repository.
3. Set Build Command: `npm run build` and Publish Directory: `dist`.
4. Click **"Deploy Site"**.

---

## 📂 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Top navigation, city switcher, SOS button
│   │   ├── Navigation.tsx      # Tab selector (Map, Explore, History, Safety, etc.)
│   │   ├── MapView.tsx         # OpenStreetMap with bright orange pins & hazard layers
│   │   ├── ExplorationTab.tsx  # Place cards, filters, search & bookmarks
│   │   ├── HistoryTab.tsx      # Audio guides, time machine & timeline
│   │   ├── SafetyTab.tsx       # Safety score metrics, trends & blackspots
│   │   ├── ComparisonTab.tsx   # Radar spider chart comparison
│   │   ├── SmartPulseTab.tsx   # Citizen reporting with voice notes & disaster feed
│   │   ├── AIChatbot.tsx       # Gemini AI chatbot with Pune city knowledge
│   │   ├── SOSModal.tsx        # Emergency numbers & one-click dispatch
│   │   ├── DetailModal.tsx     # Full details modal for places
│   │   └── SavedModal.tsx      # Bookmarked places drawer
│   ├── data/
│   │   └── mockData.ts         # Verified Pune, PCMC, Lonavla & Talegaon dataset
│   ├── types.ts                # TypeScript schemas for places, routes, reports
│   ├── index.css               # Ice-White & Bright Orange design system
│   ├── App.tsx                 # Main application controller & state
│   └── main.tsx                # React root entry
├── index.html                  # HTML entry point with Leaflet styles
├── package.json                # Dependencies and build scripts
└── README.md                   # Project documentation
```

---

## 🏆 Hackathon Submission Notes

- **Problem Statement Alignment**: Addresses exploration, cultural heritage, safety navigation, neighborhood comparison, and smart crowdsourced alerts.
- **Geographical Focus**: Designed with authentic local data for Pune, PCMC, and Maval/Lonavla.
- **Resilience**: Zero dependency on paid map services; reliable Gemini AI integration with smart local fallback.

---

## 📄 License
MIT License © 2026 MetroPulse Team
