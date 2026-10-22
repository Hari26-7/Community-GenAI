import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import { Layout } from './components/Layout';

// Core Community Sahayak Pages
import { Dashboard } from './pages/Dashboard';
import { AIAssistant } from './pages/AIAssistant';
import { Community } from './pages/Community';
import { ProblemAnalyzer } from './pages/ProblemAnalyzer';
import { SolutionGenerator } from './pages/SolutionGenerator';
import { AnnouncementWriter } from './pages/AnnouncementWriter';
import { CommunityInsights } from './pages/CommunityInsights';
import { Analytics } from './pages/Analytics';
import { Activity } from './pages/Activity';
import { Settings } from './pages/Settings';

// Preserved National Schemes & Account Pages
import Schemes from './pages/Schemes';
import SchemeMatching from './pages/SchemeMatching';
import SchemeStacking from './pages/SchemeStacking';
import Applications from './pages/Applications';
import Documents from './pages/Documents';
import CreditScore from './pages/CreditScore';
import EligibilityRoadmap from './pages/EligibilityRoadmap';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import LanguageSelection from './pages/LanguageSelection';
import Login from './pages/Login';
import Register from './pages/Register';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <ErrorBoundary>
              <BrowserRouter>
                <Routes>
                  {/* Auth Pages without sidebar */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/language" element={<LanguageSelection />} />

                  {/* MAIN APPLICATION PAGES */}
                  <Route
                    path="/"
                    element={
                      <Layout>
                        <Dashboard />
                      </Layout>
                    }
                  />

                  <Route
                    path="/dashboard"
                    element={
                      <Layout>
                        <Dashboard />
                      </Layout>
                    }
                  />

                  <Route
                    path="/ai-assistant"
                    element={
                      <Layout>
                        <AIAssistant />
                      </Layout>
                    }
                  />

                  <Route
                    path="/community"
                    element={
                      <Layout>
                        <Community />
                      </Layout>
                    }
                  />

                  {/* AI TOOLS */}
                  <Route
                    path="/problem-analyzer"
                    element={
                      <Layout>
                        <ProblemAnalyzer />
                      </Layout>
                    }
                  />

                  <Route
                    path="/solution-generator"
                    element={
                      <Layout>
                        <SolutionGenerator />
                      </Layout>
                    }
                  />

                  <Route
                    path="/announcement-writer"
                    element={
                      <Layout>
                        <AnnouncementWriter />
                      </Layout>
                    }
                  />

                  <Route
                    path="/community-insights"
                    element={
                      <Layout>
                        <CommunityInsights />
                      </Layout>
                    }
                  />

                  {/* INSIGHTS */}
                  <Route
                    path="/analytics"
                    element={
                      <Layout>
                        <Analytics />
                      </Layout>
                    }
                  />

                  <Route
                    path="/activity"
                    element={
                      <Layout>
                        <Activity />
                      </Layout>
                    }
                  />

                  {/* SYSTEM & SETTINGS */}
                  <Route
                    path="/settings"
                    element={
                      <Layout>
                        <Settings />
                      </Layout>
                    }
                  />

                  <Route
                    path="/notifications"
                    element={
                      <Layout>
                        <Notifications />
                      </Layout>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <Layout>
                        <Profile />
                      </Layout>
                    }
                  />

                  {/* PRESERVED NATIONAL SCHEMES & FINANCE ROUTES */}
                  <Route
                    path="/schemes"
                    element={
                      <Layout>
                        <Schemes />
                      </Layout>
                    }
                  />

                  <Route
                    path="/scheme-matching"
                    element={
                      <Layout>
                        <SchemeMatching />
                      </Layout>
                    }
                  />

                  <Route
                    path="/sahayak-ai"
                    element={
                      <Layout>
                        <SchemeMatching />
                      </Layout>
                    }
                  />

                  <Route
                    path="/scheme-stacking"
                    element={
                      <Layout>
                        <SchemeStacking />
                      </Layout>
                    }
                  />

                  <Route
                    path="/documents"
                    element={
                      <Layout>
                        <Documents />
                      </Layout>
                    }
                  />

                  <Route
                    path="/credit-score"
                    element={
                      <Layout>
                        <CreditScore />
                      </Layout>
                    }
                  />

                  <Route
                    path="/eligibility-roadmap"
                    element={
                      <Layout>
                        <EligibilityRoadmap />
                      </Layout>
                    }
                  />

                  <Route
                    path="/applications"
                    element={
                      <Layout>
                        <Applications />
                      </Layout>
                    }
                  />

                  <Route
                    path="/face-verification"
                    element={<Navigate to="/documents" replace />}
                  />

                  {/* Aliases for backwards compatibility */}
                  <Route
                    path="/msme-connect"
                    element={<Navigate to="/community" replace />}
                  />
                  <Route
                    path="/community-connect"
                    element={<Navigate to="/community" replace />}
                  />

                  {/* Fallback */}
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </BrowserRouter>
            </ErrorBoundary>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
