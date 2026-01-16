import React, { useState } from 'react';

// Mender brand colors - adjusted for light theme
const MENDER_GREEN = '#00CC52'; // Slightly darker for better contrast on light bg
const MENDER_GREEN_LIGHT = '#00FF66';

const MenderDashboardLight = () => {
  const [activeNav, setActiveNav] = useState('Dashboard');
  
  const navItems = ['Dashboard', 'Upload', 'Valuations', 'Reports', 'Settings'];
  
  const summaryCards = [
    { label: 'Assets in Pipeline', value: '1,248', subtext: 'devices' },
    { label: 'Recovery YTD', value: '$847,200', subtext: null },
    { label: 'CO2e Avoided (est.)', value: '28.4', subtext: 't' },
  ];
  
  const impactCards = [
    { label: 'Environmental Impact', value: '$312,540', subtext: null },
  ];
  
  const recentValuations = [
    { asset: 'Dell Latitude 7420', condition: 'B', value: '$240', confidence: 0.82, action: 'Redeploy' },
    { asset: 'HP EliteBook 840 G7', condition: 'C', value: '$165', confidence: 0.76, action: 'Refurb' },
    { asset: 'Lenovo T14 Gen 1', condition: 'B', value: '$210', confidence: 0.80, action: 'Redeploy' },
    { asset: 'MacBook Pro 13 (2020)', condition: 'A', value: '$420', confidence: 0.88, action: 'Refurb' },
    { asset: 'Dell OptiPlex 7080', condition: 'C', value: '$95', confidence: 0.70, action: 'Recycle' },
    { asset: 'Surface Laptop 3', condition: 'B', value: '$190', confidence: 0.78, action: 'Refurb' },
  ];
  
  const getConditionStyle = (condition) => {
    const styles = {
      A: { background: 'rgba(0, 204, 82, 0.12)', color: '#00994D', border: '1px solid rgba(0, 204, 82, 0.3)' },
      B: { background: 'rgba(217, 119, 6, 0.12)', color: '#B45309', border: '1px solid rgba(217, 119, 6, 0.3)' },
      C: { background: 'rgba(220, 38, 38, 0.12)', color: '#DC2626', border: '1px solid rgba(220, 38, 38, 0.3)' },
    };
    return styles[condition] || { background: 'rgba(100, 116, 139, 0.12)', color: '#64748B' };
  };
  
  const getActionStyle = (action) => {
    const styles = {
      Redeploy: '#00994D',
      Refurb: '#0284C7',
      Recycle: '#B45309',
    };
    return styles[action] || '#64748B';
  };
  
  const ConfidenceBar = ({ value }) => (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${value * 100}%`,
            background: MENDER_GREEN
          }}
        />
      </div>
      <span className="text-xs text-neutral-500 font-mono">{value.toFixed(2)}</span>
    </div>
  );

  // Intel Logo SVG Component
  const IntelLogo = () => (
    <svg viewBox="0 0 100 40" className="h-8 w-auto">
      <rect width="100" height="40" fill="transparent"/>
      <text x="5" y="28" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#0071C5">intel</text>
      <circle cx="88" cy="10" r="4" fill="#0071C5"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex font-sans" style={{ background: '#F9FAFB' }}>
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-neutral-200 flex flex-col">
        {/* Customer Logo */}
        <div className="px-5 pt-5 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-wider mb-2">
            <span>Asset Processing</span>
          </div>
          <IntelLogo />
        </div>
        
        <nav className="flex-1 p-3 pt-4">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className="w-full text-left px-4 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all duration-200"
              style={
                activeNav === item
                  ? { background: 'rgba(0, 204, 82, 0.1)', color: MENDER_GREEN, borderLeft: `2px solid ${MENDER_GREEN}` }
                  : { color: '#525252' }
              }
              onMouseEnter={(e) => {
                if (activeNav !== item) {
                  e.currentTarget.style.color = '#171717';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeNav !== item) {
                  e.currentTarget.style.color = '#525252';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {item}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: MENDER_GREEN }}
            >
              <span className="text-xs text-white font-medium">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-900 truncate">John Doe</p>
              <p className="text-xs text-neutral-400">Admin</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-neutral-200 flex items-center justify-between px-8 bg-white">
          <h1 className="text-xl text-neutral-900 font-semibold tracking-tight">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-400 font-mono">Last sync: 2 min ago</span>
            <button 
              className="px-4 py-1.5 text-xs font-semibold rounded transition-colors"
              style={{ background: MENDER_GREEN, color: '#FFFFFF' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#00B347'}
              onMouseLeave={(e) => e.currentTarget.style.background = MENDER_GREEN}
            >
              Refresh
            </button>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <div className="flex-1 p-8 overflow-auto flex flex-col">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {summaryCards.map((card, index) => (
              <div
                key={card.label}
                className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-300 hover:shadow-sm transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                    {card.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold text-neutral-900 tracking-tight">
                    {card.value}
                  </span>
                  {card.subtext && (
                    <span className="text-sm text-neutral-400 font-medium">{card.subtext}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Impact Cards Row */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {impactCards.map((card, index) => (
              <div
                key={card.label}
                className="bg-white border border-neutral-200 rounded-xl p-6 hover:border-neutral-300 hover:shadow-sm transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                    {card.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold text-neutral-900 tracking-tight">
                    {card.value}
                  </span>
                  {card.subtext && (
                    <span className="text-sm text-neutral-400 font-medium">{card.subtext}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Valuations Table */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden flex-1">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                Recent Valuations
              </h2>
              <button 
                className="text-xs font-medium transition-colors"
                style={{ color: MENDER_GREEN }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#00994D'}
                onMouseLeave={(e) => e.currentTarget.style.color = MENDER_GREEN}
              >
                View All →
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Condition
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Est. Value
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Rec. Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentValuations.map((item, index) => (
                    <tr 
                      key={index}
                      className="hover:bg-neutral-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <span 
                          className="text-sm text-neutral-700 transition-colors"
                          onMouseEnter={(e) => e.currentTarget.style.color = MENDER_GREEN}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#404040'}
                        >
                          {item.asset}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span 
                          className="inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold"
                          style={getConditionStyle(item.condition)}
                        >
                          {item.condition}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm text-neutral-700 font-mono">
                          {item.value}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <ConfidenceBar value={item.confidence} />
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className="text-sm font-medium"
                          style={{ color: getActionStyle(item.action) }}
                        >
                          {item.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Mender Platform Branding - Bottom Right */}
          <div className="flex justify-end mt-6">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span className="text-xs">Powered by the</span>
              <span className="text-neutral-700 font-semibold text-sm">mender</span>
              <span className="font-medium text-sm" style={{ color: MENDER_GREEN }}>platform</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MenderDashboardLight;
