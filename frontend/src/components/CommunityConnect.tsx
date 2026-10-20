import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export interface CommunityClusterEntity {
  id: string;
  name: string;
  tag: string;
  category: 'SHG' | 'Artisan' | 'CleanEnergy' | 'Cooperative';
  aiSynergyScore: number;
  location: string;
  membersCount: string;
  verified: boolean;
  synergyReason: string;
  openGrantTender: string;
  grantValue: string;
  cooperativeId: string;
  keyBenefits: string[];
}

export const COMMUNITY_ENTITIES: CommunityClusterEntity[] = [
  {
    id: 'cluster-01',
    name: "Kaveri Women's Agro Producer Cooperative",
    tag: 'Self-Help Group (SHG) / Agriculture',
    category: 'SHG',
    aiSynergyScore: 95,
    location: 'Thanjavur & Coimbatore, Tamil Nadu',
    membersCount: '240 Rural Women Members',
    verified: true,
    synergyReason: 'Fertilizer bulk purchasing & cold storage sharing with JanSamarth priority subsidy eligibility.',
    openGrantTender: 'Joint Solar Cold Chain & Grain Storage Facility (Panchayat Ref #TN-SHG-2026-89)',
    grantValue: '₹45.0 Lakhs (NABARD & State Co-op Grant)',
    cooperativeId: 'TN-SHG-COOP-88219',
    keyBenefits: [
      '35% Capital Subsidy under PMEGP Agriculture Cluster',
      'Shared Solar Cold Storage reducing post-harvest losses by 28%',
      'Collective fertilizer procurement yielding 18% margin discount',
    ],
  },
  {
    id: 'cluster-02',
    name: 'Madurai Handloom Weavers Artisans Collective',
    tag: 'Traditional Artisan Cluster',
    category: 'Artisan',
    aiSynergyScore: 89,
    location: 'Madurai & Paramakudi, Tamil Nadu',
    membersCount: '185 Master Artisans & Weavers',
    verified: true,
    synergyReason: 'Direct yarn procurement & export subsidy linkage under PM Vishwakarma and NHDP schemes.',
    openGrantTender: 'Direct Natural Yarn Procurement & ODOP Export Hub (Cluster Code #MDU-TEX-44)',
    grantValue: '₹28.5 Lakhs (ODOP & PM Vishwakarma)',
    cooperativeId: 'TN-WEAV-ART-39104',
    keyBenefits: [
      'Pehchan Card & DigiLocker Artisan Verification synced',
      'Zero-interest collateral-free credit under PM Vishwakarma Tranche 2',
      'Direct GeM Rural B2B marketplace seller onboarding',
    ],
  },
  {
    id: 'cluster-03',
    name: 'GreenBio Rural Biomass Processing Unit',
    tag: 'Clean Energy Cooperative',
    category: 'CleanEnergy',
    aiSynergyScore: 92,
    location: 'Dharmapuri, Tamil Nadu',
    membersCount: '90 Farmer Producers',
    verified: true,
    synergyReason: 'Waste-to-energy machinery grant synergy with SATAT and MNRE Bio-Energy scheme stacking.',
    openGrantTender: 'Agricultural Waste Briquetting & Gasification Grid (MNRE CFA Ref #SATAT-2026-11)',
    grantValue: '₹65.0 Lakhs (MNRE CFA & CGTMSE Cover)',
    cooperativeId: 'TN-BIO-COOP-55012',
    keyBenefits: [
      'Stackable subsidy: ₹40L Central Financial Assistance + CGTMSE',
      'Panchayat biomass collection network covering 14 villages',
      'Carbon credit revenue distribution directly to cooperative members',
    ],
  },
];

export const CommunityConnect: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t } = useLanguage();
  const [connectedIds, setConnectedIds] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<'All' | 'SHG' | 'Artisan' | 'CleanEnergy'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleConnect = (entity: CommunityClusterEntity) => {
    const isNowConnected = !connectedIds[entity.id];
    setConnectedIds((prev) => ({ ...prev, [entity.id]: isNowConnected }));

    if (isNowConnected) {
      setToastMessage(`✨ AI Connection Sent to ${entity.name}! Joint proposal drafting unlocked.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const filteredEntities = COMMUNITY_ENTITIES.filter((entity) => {
    if (filter === 'All') return true;
    return entity.category === filter;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-blue-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <span className="text-xl">🤝</span>
          <div className="text-xs font-medium">{toastMessage}</div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-2.5 py-0.5 rounded-full text-xs">
                🌾 Rural Economic Clusters
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Panchayat & Cooperative Registry Synchronized
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>🌐</span> {t('b2bTitle')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Connect with village cooperatives, Self-Help Groups (SHGs), and traditional artisan clusters. Stack joint grant applications, share cold storage and machinery, and unlock rural economies of scale through Generative AI.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-5 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                3
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Active Clusters
              </div>
            </div>
            <div className="h-8 w-px bg-slate-300 dark:bg-slate-700"></div>
            <div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ₹1.38 Cr
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Joint Grant Potential
              </div>
            </div>
            <div className="h-8 w-px bg-slate-300 dark:bg-slate-700"></div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                92%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Avg AI Synergy
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-5 border-t border-slate-100 dark:border-slate-800 mt-5 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2 shrink-0">
            Cluster Filter:
          </span>
          {(
            [
              { id: 'All', label: 'All Clusters (3)' },
              { id: 'SHG', label: '🌾 Women SHGs (1)' },
              { id: 'Artisan', label: '🧵 Traditional Artisans (1)' },
              { id: 'CleanEnergy', label: '⚡ Clean Energy & Bio (1)' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors shrink-0 ${
                filter === item.id
                  ? 'bg-[#0B3B60] text-white dark:bg-blue-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cluster Entities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredEntities.map((entity) => {
          const isConnected = !!connectedIds[entity.id];
          const isExpanded = expandedId === entity.id;

          return (
            <div
              key={entity.id}
              className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
            >
              <div className="p-5 space-y-4">
                {/* Header: Tag & AI Synergy Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {entity.tag}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      {entity.name}
                    </h3>
                  </div>

                  {/* AI Synergy Match Badge */}
                  <div className="flex flex-col items-end shrink-0">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-bold text-xs shadow-xs">
                      <span>✨</span>
                      <span>{entity.aiSynergyScore}% Match</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">GenAI Synergy</span>
                  </div>
                </div>

                {/* Cooperative Location & Verification Meta */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span>📍</span>
                    <span>{entity.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>👥</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{entity.membersCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600">✓</span>
                    <span className="font-mono text-[11px] text-slate-500">{entity.cooperativeId}</span>
                  </div>
                </div>

                {/* AI Synergy Narrative Box */}
                <div className="p-3 rounded-md bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <div className="font-semibold text-[#0B3B60] dark:text-blue-300 mb-1 flex items-center gap-1">
                    <span>💡</span> GenAI Cluster Compatibility:
                  </div>
                  {entity.synergyReason}
                </div>

                {/* Active Grant / Tender */}
                <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Active Joint Grant / Tender:
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {entity.openGrantTender}
                  </div>
                  <div className="text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    Subsidy Value: {entity.grantValue}
                  </div>
                </div>

                {/* Expandable Key Benefits */}
                {isExpanded && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-in fade-in duration-300">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Cooperative Stacking Benefits:
                    </div>
                    <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300 pl-4 list-disc">
                      {entity.keyBenefits.map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : entity.id)}
                  className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline"
                >
                  {isExpanded ? 'Hide Details' : 'View Synergy Breakdown →'}
                </button>

                <button
                  onClick={() => handleConnect(entity)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isConnected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-[#0B3B60] hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-sm'
                  }`}
                >
                  <span>{isConnected ? '✓ Connected' : '🤝 Connect & Stack'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
