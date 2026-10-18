/**
 * Livrete da ANE - Sistema de Gestão de Jornadas de Motoristas em Portugal
 * Conformidade com a Portaria n.º 7/2022
 */

import React, { useState, useEffect } from 'react';
import { User } from './types';
import { storage } from './services/storage';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DriverDashboard } from './pages/DriverDashboard';
import { FleetDashboard } from './pages/FleetDashboard';
import { PlatformAdmin } from './pages/PlatformAdmin';
import { LegalPage } from './pages/LegalPage';
import { AppLogo } from './components/AppLogo';
import { Car, Scale, Shield, ExternalLink, Heart } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(storage.getCurrentUser());
  const [currentView, setCurrentView] = useState<string>('driver');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  useEffect(() => {
    setAvailableUsers(storage.getUsers());
  }, []);

  const handleSelectUser = (user: User | null) => {
    storage.setCurrentUser(user);
    setCurrentUser(user);
    if (!user) {
      setCurrentView('landing');
    } else if (user.role === 'fleet_manager') {
      setCurrentView('fleet');
    } else if (user.role === 'platform_admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('driver');
    }
  };

  const handleQuickLoginFromLanding = (role: 'independent_driver' | 'fleet_manager' | 'company_driver') => {
    const target = availableUsers.find((u) => u.role === role) || availableUsers[0];
    handleSelectUser(target);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Navigation */}
      <Navbar
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        availableUsers={availableUsers}
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onQuickLogin={handleQuickLoginFromLanding}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'plans' && (
          <LandingPage
            onQuickLogin={handleQuickLoginFromLanding}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'legal' && <LegalPage />}

        {/* Driver Views */}
        {currentView === 'driver' && currentUser && (
          <DriverDashboard
            currentUser={currentUser}
            onNavigate={setCurrentView}
            initialTab="cockpit"
          />
        )}
        {currentView === 'driver_weekly' && currentUser && (
          <DriverDashboard
            currentUser={currentUser}
            onNavigate={setCurrentView}
            initialTab="weekly"
          />
        )}
        {currentView === 'driver_history' && currentUser && (
          <DriverDashboard
            currentUser={currentUser}
            onNavigate={setCurrentView}
            initialTab="daily"
          />
        )}
        {currentView === 'driver_reports' && currentUser && (
          <DriverDashboard
            currentUser={currentUser}
            onNavigate={setCurrentView}
            initialTab="reports"
          />
        )}

        {/* Fleet Views */}
        {currentView === 'fleet' && currentUser && (
          <FleetDashboard
            currentUser={currentUser}
            onNavigate={setCurrentView}
            subView="overview"
          />
        )}
        {currentView === 'fleet_drivers' && currentUser && (
          <FleetDashboard
            currentUser={currentUser}
            onNavigate={setCurrentView}
            subView="drivers"
          />
        )}
        {currentView === 'fleet_vehicles' && currentUser && (
          <FleetDashboard
            currentUser={currentUser}
            onNavigate={setCurrentView}
            subView="vehicles"
          />
        )}
        {currentView === 'fleet_reports' && currentUser && (
          <FleetDashboard
            currentUser={currentUser}
            onNavigate={setCurrentView}
            subView="reports"
          />
        )}
        {currentView === 'fleet_audit' && currentUser && (
          <FleetDashboard
            currentUser={currentUser}
            onNavigate={setCurrentView}
            subView="audit"
          />
        )}

        {/* Platform Admin View */}
        {currentView === 'admin' && currentUser && <PlatformAdmin />}
      </main>

      {/* Official Portuguese Legal Footer */}
      {/* Official Portuguese Legal Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-1">
              <AppLogo size="sm" variant="dark" />
              <p className="text-[11px] leading-relaxed text-slate-400">
                Livrete da ANE - Sistema oficial e independente de registo digital e publicidade dos tempos de trabalho de condução em Portugal.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
                Legislação & Conformidade
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button
                    onClick={() => setCurrentView('legal')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Portaria n.º 7/2022 de 4 de janeiro
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('legal')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Setores TVDE, Táxi e Mercadorias
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('legal')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Retenção Legal de 5 Anos
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
                Módulos do Sistema
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button
                    onClick={() => {
                      handleSelectUser(availableUsers[0]);
                      setCurrentView('driver');
                    }}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Livrete Condutor (Mobile)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const mgr = availableUsers.find((u) => u.role === 'fleet_manager') || availableUsers[0];
                      handleSelectUser(mgr);
                      setCurrentView('fleet');
                    }}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Livrete Gestão de Frotas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const admin = availableUsers.find((u) => u.role === 'platform_admin') || availableUsers[0];
                      handleSelectUser(admin);
                      setCurrentView('admin');
                    }}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Administração Central
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
                Garantias e Privacidade
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button
                    onClick={() => setCurrentView('legal')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Proteção de Dados & RGPD
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('legal')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Minimização de Geolocalização
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('legal')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    Exportação de Registos Oficiais
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} Livrete da ANE. Todos os direitos reservados. Fuso horário: Europe/Lisbon.
            </div>
            <div className="flex items-center gap-4">
              <span>Versão 1.4.0 (Build 3AD0E)</span>
              <span>·</span>
              <span className="text-slate-400">Conforme Portaria n.º 7/2022</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
