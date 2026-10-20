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
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl border border-indigo-500/30 p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden">
      {/* Background Decorative Blur Rings */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header with Glowing GenAI Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white shadow-md">
              ✨ Generative AI Engine v3.2
            </span>
            <span className="text-xs text-indigo-300 font-mono">Llama-3 & Gemini Pro Finetuned</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>🤖</span> Generative AI Proposal & Scheme Assistant
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Simulate instant Detailed Project Reports (DPR), evaluate joint cooperative subsidy stacking, and generate vernacular grant proposals for rural economic clusters.
          </p>
        </div>

        {/* Quick Copilot Status */}
        <div className="flex items-center gap-2 bg-slate-800/80 border border-indigo-400/30 px-3.5 py-2 rounded-lg text-xs font-medium shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-emerald-300 font-semibold">GenAI Copilot Online</span>
        </div>
      </div>

      {/* Interactive Prompt Chips */}
      <div className="space-y-2 relative z-10">
        <div className="text-xs font-semibold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
          <span>⚡</span> Quick GenAI Action Prompts:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_PROMPTS.map((p) => {
            const isSelected = selectedPromptId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPrompt(p.id)}
                className={`text-left p-3.5 rounded-lg border text-xs font-medium transition-all duration-200 flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600/40 to-purple-600/40 border-indigo-400 text-white shadow-lg ring-1 ring-indigo-400'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600'
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
      <form onSubmit={handleCustomSubmit} className="relative z-10 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Type any cooperative grant query (e.g. 'Cold storage feasibility for 50 farmers under PMEGP')..."
            className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-2.5 text-slate-500 text-xs">💬 Natural Language</span>
        </div>
        <button
          type="submit"
          disabled={isGenerating}
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold shadow-md transition-all shrink-0 flex items-center gap-1.5"
        >
          {isGenerating ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              <span>Synthesizing...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>Ask Copilot</span>
            </>
          )}
        </button>
      </form>

      {/* AI Response Box: Terminal-style Card Preview */}
      <div className="relative z-10 rounded-lg border border-indigo-500/40 bg-slate-950/90 shadow-2xl overflow-hidden">
        {/* Terminal Window Header Bar */}
        <div className="bg-slate-900/90 border-b border-indigo-500/30 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <span className="text-[11px] font-mono text-indigo-300 ml-2">
              genai-copilot://proposal-engine/{selectedPromptId}.json
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Vernacular Voice Synthesis Triggers */}
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-[11px]">
              <span className="text-slate-400 mr-1">🔊 Voice:</span>
              <button
                onClick={() => handleSpeak(activeData.vernacularSummary.en, 'en')}
                className={`px-1.5 py-0.5 rounded font-semibold transition-colors ${
                  speakingLang === 'en' ? 'bg-indigo-600 text-white animate-pulse' : 'text-slate-300 hover:text-white'
                }`}
                title="Listen in English"
              >
                EN
              </button>
              <button
                onClick={() => handleSpeak(activeData.vernacularSummary.ta, 'ta')}
                className={`px-1.5 py-0.5 rounded font-semibold transition-colors ${
                  speakingLang === 'ta' ? 'bg-indigo-600 text-white animate-pulse' : 'text-slate-300 hover:text-white'
                }`}
                title="Listen in Tamil (தமிழ்)"
              >
                தமிழ்
              </button>
              <button
                onClick={() => handleSpeak(activeData.vernacularSummary.hi, 'hi')}
                className={`px-1.5 py-0.5 rounded font-semibold transition-colors ${
                  speakingLang === 'hi' ? 'bg-indigo-600 text-white animate-pulse' : 'text-slate-300 hover:text-white'
                }`}
                title="Listen in Hindi (हिन्दी)"
              >
                हिन्दी
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-700 transition-colors flex items-center gap-1"
            >
              <span>{copied ? '✓ Copied' : '📋 Copy'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isGenerating ? (
          <div className="p-8 flex flex-col items-center justify-center space-y-3 min-h-[280px]">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin"></div>
            <div className="text-xs font-mono text-indigo-300 animate-pulse">
              Generating project report & calculating capital subsidy breakdown...
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5 text-slate-200">
            {/* Title & Target Scheme */}
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wide">
                Target Scheme: {activeData.schemeTarget}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">{activeData.title}</h3>
            </div>

            {/* Executive Summary */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
              <span className="text-indigo-400 font-bold">Executive Feasibility: </span>
              {activeData.executiveSummary}
            </div>

            {/* Capital Expenditure (CapEx) & Financial Model */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center justify-between">
                <span>💰 Capital Expenditure (CapEx) Breakdown</span>
                <span className="text-white font-mono">Total: {activeData.totalCost}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeData.capex.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-1"
                  >
                    <div className="text-[11px] text-slate-400">{item.item}</div>
                    <div className="text-sm font-bold text-white font-mono">{item.cost}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Means of Finance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                <div className="text-[10px] uppercase font-bold text-emerald-400">Government Capital Subsidy</div>
                <div className="text-base font-bold text-emerald-300 font-mono mt-0.5">
                  {activeData.subsidyBenefit}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30">
                <div className="text-[10px] uppercase font-bold text-blue-400">Bank Term Loan (JanSamarth)</div>
                <div className="text-base font-bold text-blue-300 font-mono mt-0.5">
                  {activeData.bankLoan}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/30">
                <div className="text-[10px] uppercase font-bold text-purple-400">SHG / Cooperative Equity</div>
                <div className="text-base font-bold text-purple-300 font-mono mt-0.5">
                  {activeData.ownEquity}
                </div>
              </div>
            </div>

            {/* Step-by-Step Approval Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                📋 Step-by-Step Grant Approval & Document Checklist:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeData.eligibilitySteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2.5 rounded bg-slate-900/60 border border-slate-800 text-slate-300"
                  >
                    <span className="text-emerald-400 font-bold shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Grant Stacking Insight */}
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 flex items-start gap-2.5 text-xs text-purple-200">
              <span className="text-lg shrink-0">⚡</span>
              <div>
                <span className="font-bold text-white">Multi-Grant Stacking Intelligence: </span>
                {activeData.stackingInsight}
              </div>
            </div>

            {/* Vernacular Summary Trigger Box */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-indigo-400/20 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🎙️</span>
                <span className="text-slate-300">
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
                className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shrink-0 flex items-center gap-1.5 transition-colors"
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
