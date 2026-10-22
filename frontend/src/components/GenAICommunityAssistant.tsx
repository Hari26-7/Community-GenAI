import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface AIProposalData {
  title: string;
  schemeTarget: string;
  executiveSummary: string;
  capex: { item: string; cost: string }[];
  totalCost: string;
  subsidyBenefit: string;
  ownEquity: string;
  bankLoan: string;
  eligibilitySteps: string[];
  stackingInsight: string;
  vernacularSummary: {
    en: string;
    ta: string;
    hi: string;
  };
}

const PRESET_PROMPTS = [
  {
    id: 'solar-cold-storage',
    icon: '💡',
    label: 'Generate project report for Rural Solar Cold Storage (PMEGP 35% Subsidy)',
    promptQuery: 'Generate project report for Rural Solar Cold Storage (PMEGP 35% Subsidy)',
  },
  {
    id: 'women-dairy-shg',
    icon: '🌾',
    label: 'Find joint cooperative schemes for Women Dairy Self-Help Groups',
    promptQuery: 'Find joint cooperative schemes for Women Dairy Self-Help Groups',
  },
  {
    id: 'nabard-cgtmse-stacking',
    icon: '📑',
    label: 'Analyze subsidy stacking compatibility between NABARD and CGTMSE',
    promptQuery: 'Analyze subsidy stacking compatibility between NABARD and CGTMSE',
  },
];

const GENERATED_RESPONSES: Record<string, AIProposalData> = {
  'solar-cold-storage': {
    title: 'Detailed Project Report (DPR): Rural Solar Micro-Cold Storage Unit',
    schemeTarget: 'PMEGP Rural Special Category (35% Capital Subsidy) + PM-KUSUM Solar Component',
    executiveSummary:
      'Feasibility analysis for establishing a 10 MT decentralized solar-powered micro-cold storage facility for rural farmer clusters and SHG vegetable producers in Thanjavur. Eliminates post-harvest spoilage and captures off-season premium prices.',
    capex: [
      { item: 'Thermal Insulated Storage Chamber (10 MT) & Hermetic Compressor', cost: '₹14,50,000' },
      { item: '10 kW Solar Photovoltaic Grid with Lithium-Ferro Battery Bank', cost: '₹6,50,000' },
      { item: 'Panchayat Civil Foundation, Internal Cabling & Pre-Cooling Racks', cost: '₹4,00,000' },
    ],
    totalCost: '₹25,00,000',
    subsidyBenefit: '₹8,75,000 (35% PMEGP Non-Refundable Capital Grant)',
    ownEquity: '₹1,25,000 (5% Beneficiary / SHG Equity)',
    bankLoan: '₹15,00,000 (60% Term Loan via JanSamarth / SBI Rural)',
    eligibilitySteps: [
      'Panchayat Land NOC & Cluster Resolution submitted through DigiLocker Vault.',
      'JanSamarth Single-Window Loan sanction with CGTMSE collateral-free guarantee.',
      'Physical inspection by DIC / KVIC nodal officer and 3-year subsidy lock-in in TDR.',
      'Integration with PM-KUSUM Component A for surplus solar feed-in grid tariff.',
    ],
    stackingInsight:
      'Compliant multi-grant stacking: PMEGP capital subsidy (35%) stacks with Agriculture Infrastructure Fund (AIF) 3% interest subvention for 7 years.',
    vernacularSummary: {
      en: 'This PMEGP project provides 35% capital subsidy (₹8.75 Lakhs) for a ₹25 Lakhs rural solar cold storage. SHG equity is only 5%. Stacks with AIF 3% interest subvention.',
      ta: 'இந்த திட்டத்தின் கீழ் ₹25 லட்சம் மதிப்புள்ள கிராமப்புற சூரிய ஒளி குளிர்பதன கிடங்கிற்கு 35% மூலதன மானியம் (₹8.75 லட்சம்) கிடைக்கிறது. சுயஉதவி குழு பங்கு 5% மட்டுமே.',
      hi: 'इस परियोजना के तहत 25 लाख रुपये के ग्रामीण सौर कोल्ड स्टोरेज के लिए 35% पूंजीगत सब्सिडी (8.75 लाख रुपये) मिलती है। एसएचजी का अंशदान केवल 5% है।',
    },
  },
  'women-dairy-shg': {
    title: 'Joint Cooperative Scheme Package: Women Dairy Self-Help Groups (SHGs)',
    schemeTarget: 'NRLM (DAY-NRLM) + AHIDF (3% Interest Subvention) + NABARD Dairy Entrepreneurship',
    executiveSummary:
      'Comprehensive grant and credit package designed for a federation of 12 village SHGs comprising 240 rural women milk producers. Funds bulk milk chillers, testing equipment, and cattle micro-finance.',
    capex: [
      { item: '2,000 Litre Stainless Steel Bulk Milk Chiller (BMC) & Generator', cost: '₹12,00,000' },
      { item: 'Automated Milk Collection Units (AMCU) & Ultrasonic Analyzers', cost: '₹3,50,000' },
      { item: 'Milking Machine Units & Insulated Canister Transit Vehicle', cost: '₹9,50,000' },
    ],
    totalCost: '₹25,00,000',
    subsidyBenefit: '₹8,25,000 (33% NABARD Dairy Grant & NRLM Revolving Fund)',
    ownEquity: '₹2,50,000 (10% SHG Federation Equity)',
    bankLoan: '₹14,25,000 (Bank Loan with 3% AHIDF Interest Subvention)',
    eligibilitySteps: [
      'SHG Panchasutra compliance verified via NRLM LokOS / State Portal.',
      'Panchayat grazing common land allocation and FSSAI basic registration.',
      'Aadhaar e-KYC authentication of 240 women members via DigiLocker.',
      'Direct linkage with District Milk Producers Union for daily offtake.',
    ],
    stackingInsight:
      'NRLM Community Investment Fund (CIF) provides low-cost equity, while AHIDF grants a 3% interest subvention along with NABARD 33% capital subsidy.',
    vernacularSummary: {
      en: 'Special women dairy package stacking NRLM and AHIDF for a 2,000L milk chilling cooperative. 33% capital subsidy with 3% interest subvention and guaranteed offtake.',
      ta: 'மகளிர் பால் உற்பத்தியாளர் சுயஉதவி குழுக்களுக்கு 33% மானியத்துடன் 2,000 லிட்டர் பால் குளிரூட்டும் மையம் அமைக்க NRLM மற்றும் AHIDF திட்டங்களின் கூட்டு ஆதரவு.',
      hi: 'महिला डेयरी स्वयं सहायता समूहों के लिए 33% सब्सिडी और 3% ब्याज छूट के साथ 2000 लीटर मिल्क चिलिंग प्लांट की संयुक्त सहकारी योजना।',
    },
  },
  'nabard-cgtmse-stacking': {
    title: 'Subsidy Stacking Intelligence: NABARD Capital Grant + CGTMSE Guarantee',
    schemeTarget: 'NABARD Agricultural Marketing Infrastructure (AMI) + CGTMSE Credit Guarantee Scheme',
    executiveSummary:
      'Regulatory compliance audit for simultaneous stacking of NABARD capital subsidies with Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE) collateral waivers for village cooperatives.',
    capex: [
      { item: 'Grain Grading, Sorting & Automated Cleaning Line', cost: '₹26,00,000' },
      { item: 'Pre-Engineered Steel Warehouse (500 MT Capacity)', cost: '₹18,00,000' },
      { item: 'Quality Testing Lab, Weighbridge & Software Management', cost: '₹6,00,000' },
    ],
    totalCost: '₹50,00,000',
    subsidyBenefit: '₹16,50,000 (33.33% NABARD AMI Capital Subsidy)',
    ownEquity: '₹5,00,000 (10% Village Cooperative Equity)',
    bankLoan: '₹28,50,000 (100% CGTMSE Collateral-Free Covered Loan)',
    eligibilitySteps: [
      'DPR vetting by NABARD District Development Manager (DDM).',
      'Net loan quantum calculation: Bank computes CGTMSE coverage on net loan after subsidy credit.',
      'Bank issues CGTMSE guarantee cover (up to 85% sovereign risk cover).',
      'Panchayat resolution declaring cooperative facility a public market yard.',
    ],
    stackingInsight:
      'COMPLIANT STACK: Under RBI master circular on priority lending, capital subsidy from NABARD does not breach CGTMSE guarantee guidelines if applied to project cost upfront.',
    vernacularSummary: {
      en: 'NABARD and CGTMSE stack seamlessly: ₹16.5 Lakhs capital subsidy combined with 85% collateral-free bank loan coverage for rural producer units.',
      ta: 'நபார்டு 33% மூலதன மானியம் மற்றும் CGTMSE பிணையற்ற கடன் உத்தரவாதம் இரண்டும் இணைந்து ₹50 லட்ச திட்டத்திற்கு முழுமையாக அனுமதிக்கப்படுகிறது.',
      hi: 'नाबार्ड की 33% पूंजीगत सब्सिडी और सीजीटीएमएसई की बिना गारंटी वाली ऋण सुविधा एक साथ 100% अनुपालन के साथ लागू की जा सकती है।',
    },
  },
};

export const GenAICommunityAssistant: React.FC = () => {
  const { language } = useLanguage();
  const [selectedPromptId, setSelectedPromptId] = useState<string>('solar-cold-storage');
  const [customInput, setCustomInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [speakingLang, setSpeakingLang] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const activeData: AIProposalData =
    GENERATED_RESPONSES[selectedPromptId] || GENERATED_RESPONSES['solar-cold-storage'];

  // Speech Synthesis Trigger
  const handleSpeak = (text: string, langCode: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device.');
      return;
    }

    if (speakingLang === langCode) {
      window.speechSynthesis.cancel();
      setSpeakingLang(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (langCode === 'ta') utterance.lang = 'ta-IN';
    else if (langCode === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-US';

    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingLang(null);
    utterance.onerror = () => setSpeakingLang(null);

    setSpeakingLang(langCode);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectPrompt = (promptId: string) => {
    setIsGenerating(true);
    setSelectedPromptId(promptId);
    setTimeout(() => {
      setIsGenerating(false);
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    setIsGenerating(true);
    // Find closest match or default to solar
    const lower = customInput.toLowerCase();
    if (lower.includes('dairy') || lower.includes('women') || lower.includes('milk')) {
      setSelectedPromptId('women-dairy-shg');
    } else if (lower.includes('nabard') || lower.includes('cgtmse') || lower.includes('stack')) {
      setSelectedPromptId('nabard-cgtmse-stacking');
    } else {
      setSelectedPromptId('solar-cold-storage');
    }

    setTimeout(() => {
      setIsGenerating(false);
    }, 700);
  };

  const handleCopy = () => {
    const textToCopy = `${activeData.title}\n\nScheme Target: ${activeData.schemeTarget}\nTotal Outlay: ${activeData.totalCost}\nSubsidy: ${activeData.subsidyBenefit}\nOwn Equity: ${activeData.ownEquity}\nBank Loan: ${activeData.bankLoan}\n\nSummary:\n${activeData.executiveSummary}\n\nStacking Insight:\n${activeData.stackingInsight}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-md border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
      {/* Header with Enterprise Badges and Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Proposal Synthesizer Engine v3.2</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Enterprise Service</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚙️</span> Detailed Project Report (DPR) & Scheme Intelligence Console
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Automate Detailed Project Reports (DPR), evaluate multi-grant stacking synergies, and format structured grant submissions for registered MSME clusters.
          </p>
        </div>

        {/* Engine Status */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md text-xs font-medium shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">Intelligence Engine Ready</span>
        </div>
      </div>

      {/* Quick Action Prompt Controls */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <span>⚡</span> Quick Action Presets:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_PROMPTS.map((p) => {
            const isSelected = selectedPromptId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPrompt(p.id)}
                className={`text-left p-3.5 rounded-md border text-xs font-medium transition-colors flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-600 text-blue-900 dark:text-blue-200 font-semibold'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-300'
                }`}
              >
                <span className="text-base shrink-0">{p.icon}</span>
                <span className="leading-snug">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Prompt Input Bar */}
      <form onSubmit={handleCustomSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Type any cooperative grant query (e.g. 'Cold storage feasibility for 50 farmers under PMEGP')..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
          />
          <span className="absolute right-3 top-2.5 text-slate-400 text-xs">Natural Language Query</span>
        </div>
        <button
          type="submit"
          disabled={isGenerating}
          className="px-4 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5"
        >
          {isGenerating ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>Execute Analysis</span>
            </>
          )}
        </button>
      </form>

      {/* AI Response Panel: Enterprise Report Console */}
      <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
        {/* Console Header Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
              dpr://feasibility-analysis/{selectedPromptId}.json
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Vernacular Voice Controls */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-700 text-xs">
              <span className="text-slate-500 mr-1 text-[11px]">Audio:</span>
              <button
                onClick={() => handleSpeak(activeData.vernacularSummary.en, 'en')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  speakingLang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Listen in English"
              >
                EN
              </button>
              <button
                onClick={() => handleSpeak(activeData.vernacularSummary.ta, 'ta')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  speakingLang === 'ta' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Listen in Tamil (தமிழ்)"
              >
                தமிழ்
              </button>
              <button
                onClick={() => handleSpeak(activeData.vernacularSummary.hi, 'hi')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  speakingLang === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Listen in Hindi (हिन्दी)"
              >
                हिन्दी
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1"
            >
              <span>{copied ? '✓ Copied' : '📋 Copy Report'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isGenerating ? (
          <div className="p-8 flex flex-col items-center justify-center space-y-3 min-h-[240px]">
            <div className="w-8 h-8 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Generating project report & calculating capital subsidy breakdown...
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5 text-slate-800 dark:text-slate-200">
            {/* Title & Target Scheme */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                Target Scheme: {activeData.schemeTarget}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{activeData.title}</h3>
            </div>

            {/* Executive Summary */}
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-md border border-slate-200 dark:border-slate-800">
              <span className="text-slate-900 dark:text-white font-bold">Executive Feasibility: </span>
              {activeData.executiveSummary}
            </div>

            {/* Capital Expenditure (CapEx) Structured Data Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <span>CapEx Line Item Specification</span>
                <span className="font-mono text-slate-900 dark:text-white font-semibold">Total Outlay: {activeData.totalCost}</span>
              </div>
              <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 uppercase font-semibold">
                      <th className="py-2.5 px-3">Component Item</th>
                      <th className="py-2.5 px-3 text-right">Estimated Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {activeData.capex.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{item.item}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 dark:text-white">{item.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Means of Finance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">Government Capital Subsidy</div>
                <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                  {activeData.subsidyBenefit}
                </div>
              </div>
              <div className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">Bank Term Loan (JanSamarth)</div>
                <div className="text-base font-bold text-blue-700 dark:text-blue-400 font-mono mt-0.5">
                  {activeData.bankLoan}
                </div>
              </div>
              <div className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">SHG / Cooperative Equity</div>
                <div className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  {activeData.ownEquity}
                </div>
              </div>
            </div>

            {/* Step-by-Step Approval Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Step-by-Step Grant Approval & Document Checklist:
              </div>
              <div className="border border-slate-200 dark:border-slate-800 rounded-md divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden bg-white dark:bg-slate-900">
                {activeData.eligibilitySteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-emerald-600 font-bold shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Grant Stacking Insight */}
            <div className="p-3.5 rounded-md bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/80 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
              <span className="text-base shrink-0">⚡</span>
              <div>
                <span className="font-bold">Multi-Grant Stacking Intelligence: </span>
                {activeData.stackingInsight}
              </div>
            </div>

            {/* Vernacular Summary Trigger Box */}
            <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🎙️</span>
                <span className="text-slate-600 dark:text-slate-300">
                  {language === 'ta'
                    ? activeData.vernacularSummary.ta
                    : language === 'hi'
                    ? activeData.vernacularSummary.hi
                    : activeData.vernacularSummary.en}
                </span>
              </div>
              <button
                onClick={() =>
                  handleSpeak(
                    language === 'ta'
                      ? activeData.vernacularSummary.ta
                      : language === 'hi'
                      ? activeData.vernacularSummary.hi
                      : activeData.vernacularSummary.en,
                    language
                  )
                }
                className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shrink-0 flex items-center gap-1.5 transition-colors"
              >
                <span>{speakingLang ? '⏹️ Stop Voice' : '🔊 Listen Voice'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
