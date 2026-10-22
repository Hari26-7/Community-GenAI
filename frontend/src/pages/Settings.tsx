import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bot,
  Bell,
  Palette,
  CheckCircle2,
  Lock,
  Save
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState<'profile' | 'ai' | 'notifications' | 'appearance' | 'security'>('profile');

  // Profile form
  const [name, setName] = useState(profile?.full_name || 'Hari Haran');
  const [email, setEmail] = useState(profile?.email || 'leader@community.org');
  const [ward, setWard] = useState('Ward 14, Main Residential Sector');
  const [phone, setPhone] = useState('+91 98765 43210');

  // AI Preferences
  const [aiTone, setAiTone] = useState('Empathetic & Action-Oriented');
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [autoDpr, setAutoDpr] = useState(true);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings saved successfully', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Platform Settings"
        subtitle="Manage your personal profile, AI copilot behaviors, notification preferences, and system security."
        badge={
          <Badge variant="secondary">
            <SettingsIcon className="w-3 h-3 text-slate-500" />
            <span>Preferences</span>
          </Badge>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-3 space-y-1">
          {[
            { id: 'profile', label: 'Profile & Contact', icon: User },
            { id: 'ai', label: 'AI Preferences', icon: Bot },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'security', label: 'Account Security', icon: Shield },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold transition-colors text-left ${
                  active
                    ? 'bg-[#0B3B60] text-white dark:bg-blue-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-9 space-y-4">
          <form onSubmit={handleSave}>
            {activeSection === 'profile' && (
              <Card>
                <CardHeader>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Profile & Community Identity
                  </h3>
                </CardHeader>
                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#0B3B60] text-white font-bold text-lg flex items-center justify-center border border-[#082b47]">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Verified Community Representative • {ward}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Ward / Community Sector</label>
                      <input
                        type="text"
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === 'ai' && (
              <Card>
                <CardHeader>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    AI Copilot Preferences
                  </h3>
                </CardHeader>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Default AI Tone</label>
                    <select
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-xs"
                    >
                      <option value="Empathetic & Action-Oriented">Empathetic & Action-Oriented</option>
                      <option value="Formal Administrative">Formal Administrative & Statutory</option>
                      <option value="Concise Tactical">Concise Tactical & Bulleted</option>
                    </select>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aiSuggestions}
                        onChange={(e) => setAiSuggestions(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-700 dark:text-slate-300">
                        Enable proactive problem prompt chips in AI Assistant
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoDpr}
                        onChange={(e) => setAutoDpr(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-700 dark:text-slate-300">
                        Include Detailed Project Report (DPR) capex breakdowns for grant schemes
                      </span>
                    </label>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === 'notifications' && (
              <Card>
                <CardHeader>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Notification Channels
                  </h3>
                </CardHeader>
                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between p-3 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        Email Notifications
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Receive daily briefings on critical community issues and status updates
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        WhatsApp Instant Alerts
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Receive immediate ping when high-priority municipal tickets change status
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={whatsappAlerts}
                      onChange={(e) => setWhatsappAlerts(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600"
                    />
                  </label>
                </div>
              </Card>
            )}

            {activeSection === 'appearance' && (
              <Card>
                <CardHeader>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Interface Theme
                  </h3>
                </CardHeader>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        Current Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        High-contrast enterprise color scheme with accessible borders
                      </div>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={toggleTheme}>
                      Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {activeSection === 'security' && (
              <Card>
                <CardHeader>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Security & Session Integrity
                  </h3>
                </CardHeader>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>All API keys and secrets are securely encapsulated in the server-side FastAPI environment.</span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="text-slate-500">Active Authentication:</span>
                      <span className="font-mono font-semibold">JWT HS256 Token Session</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="text-slate-500">Database Mirror:</span>
                      <span className="font-semibold">Google Sheets & Local Resilient Store</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <div className="pt-4 flex justify-end">
              <Button type="submit" size="md">
                <Save className="w-3.5 h-3.5 mr-1.5" />
                <span>Save Changes</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
