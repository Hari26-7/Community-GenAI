import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Bot,
  Users,
  Search,
  Sparkles,
  Megaphone,
  TrendingUp,
  BarChart3,
  Activity as ActivityIcon,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Layers,
  FileText,
  CreditCard,
  MapPin,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { VoiceAssistant, HeaderVoiceControls } from './VoiceAssistant';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [schemesExpanded, setSchemesExpanded] = useState(false);
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(0);

  const adjustFontSize = (delta: number) => {
    setFontSizeOffset((prev) => {
      const next = prev + delta;
      if (next < -2 || next > 4) return prev;
      document.documentElement.style.fontSize = `${16 + next}px`;
      return next;
    });
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  const navSections = [
    {
      title: 'MAIN',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'AI Assistant', path: '/ai-assistant', icon: Bot, badge: 'Copilot' },
        { label: 'Community', path: '/community', icon: Users },
      ],
    },
    {
      title: 'AI TOOLS',
      items: [
        { label: 'Problem Analyzer', path: '/problem-analyzer', icon: Search },
        { label: 'Solution Generator', path: '/solution-generator', icon: Sparkles },
        { label: 'Announcement Writer', path: '/announcement-writer', icon: Megaphone },
        { label: 'Community Insights', path: '/community-insights', icon: TrendingUp },
      ],
    },
    {
      title: 'INSIGHTS',
      items: [
        { label: 'Analytics', path: '/analytics', icon: BarChart3 },
        { label: 'Activity', path: '/activity', icon: ActivityIcon },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Notifications', path: '/notifications', icon: Bell },
        { label: 'Settings', path: '/settings', icon: SettingsIcon },
      ],
    },
  ];

  const nationalSchemesItems = [
    { label: 'Schemes Directory', path: '/schemes', icon: FileText },
    { label: 'Subsidy Stacking', path: '/scheme-stacking', icon: Layers },
    { label: 'Document Vault', path: '/documents', icon: ShieldCheck },
    { label: 'Credit Score & Finance', path: '/credit-score', icon: CreditCard },
    { label: 'Eligibility Roadmap', path: '/eligibility-roadmap', icon: MapPin },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* 1. Tricolor Top Accent Strip */}
      <div className="h-1 w-full grid grid-cols-3">
        <div className="bg-[#FF9933]"></div>
        <div className="bg-white"></div>
        <div className="bg-[#138808]"></div>
      </div>

      {/* 2. Top Portal Header */}
      <div className="w-full bg-[#0B3B60] text-white border-b border-[#082b47] text-xs py-1.5 px-4 sm:px-6">
        <div className="w-full flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-6 h-6 rounded bg-[#082b47] border border-blue-900/60 p-0.5 flex items-center justify-center shrink-0">
              <span className="text-amber-300 font-serif font-bold text-xs">स</span>
            </div>
            <div className="min-w-0 flex items-center gap-2 truncate">
              <span className="font-bold tracking-wide text-white text-xs truncate">
                Community Sahayak AI
              </span>
              <span className="text-amber-400 font-bold hidden sm:inline">|</span>
              <span className="text-[11px] text-slate-300 font-normal hidden sm:inline truncate">
                Your intelligent copilot for stronger communities
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-slate-200 shrink-0">
            {/* Live Sheets Status */}
            <a
              href="https://docs.google.com/spreadsheets/d/1rfT9LvjYD1FJQyqsVASVshZllne8lt1lEODQTgLqoIY/edit?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#082b47] text-emerald-300 border border-emerald-500/40 hover:bg-emerald-950/60 transition-colors"
              title="Inspect Connected Google Sheets Live Mirror"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Sheets Live</span>
            </a>

            {/* Accessibility Font Size */}
            <div className="hidden sm:flex items-center bg-[#082b47] rounded border border-blue-900 px-1.5 py-0.5 gap-1 text-[10px]">
              <button
                onClick={() => adjustFontSize(-1)}
                className="hover:text-amber-300 px-1 font-bold text-white transition-colors"
                title="Decrease Text Size"
              >
                A-
              </button>
              <button
                onClick={() => {
                  setFontSizeOffset(0);
                  document.documentElement.style.fontSize = '16px';
                }}
                className="hover:text-amber-300 px-1 font-bold text-white transition-colors"
                title="Standard Text Size"
              >
                A
              </button>
              <button
                onClick={() => adjustFontSize(1)}
                className="hover:text-amber-300 px-1 font-bold text-white transition-colors"
                title="Increase Text Size"
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* App Brand */}
            <Link to="/dashboard" className="flex items-center gap-2.5 text-decoration-none">
              <div className="w-8 h-8 rounded bg-[#0B3B60] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-[#082b47]">
                <span className="text-amber-300 font-serif">स</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    Community Sahayak AI
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#0B3B60] dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    SaaS Platform
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Your intelligent copilot for stronger communities
                </div>
              </div>
            </Link>
          </div>

          {/* Action Center */}
          <div className="flex items-center justify-end gap-2.5">
            {/* AI Active Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>AI Copilot Ready</span>
            </div>

            {/* Header Voice Assistant */}
            <HeaderVoiceControls />

            {/* Language Selector */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded border border-slate-300 dark:border-slate-700 text-[11px] font-semibold">
              <button
                className={`px-2 py-0.5 rounded transition-colors ${
                  language === 'en' ? 'bg-[#0B3B60] text-white dark:bg-blue-600' : 'text-slate-600 dark:text-slate-400'
                }`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
              <button
                className={`px-2 py-0.5 rounded transition-colors ${
                  language === 'hi' ? 'bg-[#0B3B60] text-white dark:bg-blue-600' : 'text-slate-600 dark:text-slate-400'
                }`}
                onClick={() => setLanguage('hi')}
              >
                हिन्दी
              </button>
              <button
                className={`px-2 py-0.5 rounded transition-colors ${
                  language === 'ta' ? 'bg-[#0B3B60] text-white dark:bg-blue-600' : 'text-slate-600 dark:text-slate-400'
                }`}
                onClick={() => setLanguage('ta')}
              >
                தமிழ்
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <span className="text-xs">☀️</span> : <span className="text-xs">🌙</span>}
            </button>

            {/* User Session Profile */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded bg-[#0B3B60] text-white font-bold text-xs flex items-center justify-center">
                    {(profile?.full_name || 'H').charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                      {profile?.full_name || 'Community Leader'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {profile?.email || 'leader@community.org'}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1 text-xs font-semibold rounded bg-[#0B3B60] text-white hover:bg-[#082b47] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 4. App Body & Sidebar */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar: Clean Deep Navy, Flat borders */}
        <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-[#0B3B60] text-white">
          <div className="sticky top-16 flex flex-col h-[calc(100vh-4.25rem)] justify-between overflow-y-auto custom-scrollbar p-3">
            <div className="space-y-4">
              {/* Sidebar Header Brand reminder */}
              <div className="p-2.5 rounded bg-[#082b47] border border-blue-900/60">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Community Sahayak AI</span>
                </div>
                <div className="text-[10px] text-slate-300 mt-1 leading-snug">
                  Your intelligent copilot for stronger communities.
                </div>
              </div>

              {/* Navigation Sections */}
              {navSections.map((section) => (
                <div key={section.title}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 px-3 mb-1">
                    {section.title}
                  </div>
                  <nav className="flex flex-col gap-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center justify-between px-3 py-2 rounded text-xs transition-colors ${
                            active
                              ? 'bg-blue-600 text-white font-semibold shadow-sm'
                              : 'text-slate-200 hover:text-white hover:bg-white/10 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className="w-4 h-4 shrink-0 opacity-80" />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-bold uppercase">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}

              {/* National Schemes & Finance (Collapsible) */}
              <div>
                <button
                  onClick={() => setSchemesExpanded(!schemesExpanded)}
                  className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-300 px-3 py-1 hover:text-white transition-colors"
                >
                  <span>SCHEMES & FINANCE</span>
                  {schemesExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>

                {schemesExpanded && (
                  <nav className="flex flex-col gap-0.5 mt-1 pl-2 border-l border-blue-900/60 ml-2">
                    {nationalSchemesItems.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${
                            active
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                )}
              </div>
            </div>

            {/* Sidebar Bottom Profile Card */}
            <div className="pt-3 mt-4 border-t border-blue-900/60">
              <div className="flex items-center justify-between p-2 rounded bg-[#082b47] border border-blue-900/50">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {(profile?.full_name || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {profile?.full_name || 'Community Leader'}
                    </div>
                    <div className="text-[10px] text-slate-300 truncate">
                      {profile?.email || 'leader@community.org'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 rounded text-slate-400 hover:text-red-300 hover:bg-white/5 transition-colors shrink-0"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-none"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            <div className="relative w-72 max-w-[80vw] bg-[#0B3B60] text-white p-4 flex flex-col justify-between h-full overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-blue-900">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center font-serif text-amber-300 text-xs">
                      स
                    </span>
                    <span>Community Sahayak</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded text-slate-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {navSections.map((section) => (
                  <div key={section.title}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
                      {section.title}
                    </div>
                    <nav className="flex flex-col gap-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs transition-colors ${
                              active
                                ? 'bg-blue-600 text-white font-semibold'
                                : 'text-slate-200 hover:bg-white/10'
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                ))}

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
                    SCHEMES & FINANCE
                  </div>
                  <nav className="flex flex-col gap-1">
                    {nationalSchemesItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-1.5 rounded text-xs text-slate-300 hover:bg-white/10"
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-900 mt-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded text-xs font-semibold bg-red-600/80 hover:bg-red-700 text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 pb-20 md:pb-8 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* 5. Mobile Bottom Quick Nav */}
      <nav className="fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 grid grid-cols-5 py-1 px-1 md:hidden z-30 shadow-sm">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center py-1 text-center ${
            isActive('/dashboard') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Dashboard</span>
        </Link>
        <Link
          to="/ai-assistant"
          className={`flex flex-col items-center justify-center py-1 text-center ${
            isActive('/ai-assistant') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Bot className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">AI Copilot</span>
        </Link>
        <Link
          to="/community"
          className={`flex flex-col items-center justify-center py-1 text-center ${
            isActive('/community') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Users className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Community</span>
        </Link>
        <Link
          to="/problem-analyzer"
          className={`flex flex-col items-center justify-center py-1 text-center ${
            isActive('/problem-analyzer') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Search className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Analyzer</span>
        </Link>
        <Link
          to="/settings"
          className={`flex flex-col items-center justify-center py-1 text-center ${
            isActive('/settings') ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <SettingsIcon className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Settings</span>
        </Link>
      </nav>

      {/* 6. Footer */}
      <footer className="mt-auto w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs py-3 px-4 md:px-8 text-slate-500 dark:text-slate-400">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Community Sahayak AI
            </span>
            <span>•</span>
            <span>Intelligent Community Development Platform</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>FastAPI Backend</span>
            <span>•</span>
            <span>Google Sheets Live Mirror</span>
            <span>•</span>
            <span>Production Ready</span>
          </div>
        </div>
      </footer>

      {/* 7. Ambient Voice Assistant */}
      <VoiceAssistant />
    </div>
  );
};
