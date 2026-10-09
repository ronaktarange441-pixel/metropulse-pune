import React from 'react';
import { Map, Compass, Landmark, Shield, BarChart3, Radio } from 'lucide-react';

export type TabType = 'map' | 'explore' | 'history' | 'safety' | 'compare' | 'pulse';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'map' as TabType, label: 'Map & Safe Routes', icon: Map },
    { id: 'explore' as TabType, label: 'Explore & Food', icon: Compass },
    { id: 'history' as TabType, label: 'History & Audio Guide', icon: Landmark },
    { id: 'safety' as TabType, label: 'Safety & Emergency', icon: Shield },
    { id: 'compare' as TabType, label: 'Best vs Worst Matrix', icon: BarChart3 },
    { id: 'pulse' as TabType, label: 'Live City Pulse & Report', icon: Radio },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="nav-bar-desktop">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab-item ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Sticky Bottom Navigation */}
      <nav className="mobile-nav-bar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon size={20} />
              <span>{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
