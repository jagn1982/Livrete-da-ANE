import React, { useState } from 'react';
import {
  Car,
  Shield,
  FileText,
  Users,
  LogOut,
  ChevronDown,
  UserCheck,
  Building,
  Menu,
  X,
  Scale,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { SyncStatusBadge } from './SyncStatusBadge';
import { storage } from '../services/storage';
import { ResetConfirmModal } from './ResetConfirmModal';
import { AppLogo } from './AppLogo';

interface NavbarProps {
  currentUser: User | null;
  onSelectUser: (user: User | null) => void;
  availableUsers: User[];
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectUser,
  availableUsers,
  currentView,
  onNavigate,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const getRoleLabel = (role?: UserRole) => {
    switch (role) {
      case 'independent_driver':
        return 'Condutor Independente';
      case 'company_driver':
        return 'Condutor de Frota';
      case 'fleet_manager':
        return 'Gestor de Frota';
      case 'platform_admin':
        return 'Administrador';
      default:
        return 'Visitante';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Wordmark Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate(currentUser ? (currentUser.role === 'fleet_manager' ? 'fleet' : currentUser.role === 'platform_admin' ? 'admin' : 'driver') : 'landing')}
              className="flex items-center text-left group focus:outline-none cursor-pointer"
            >
              <AppLogo size="md" variant="dark" />
            </button>
          </div>

          {/* Navigation Links (Zone 2) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            {!currentUser ? (
              <>
                <button
                  onClick={() => onNavigate('landing')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'landing' ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  Início
                </button>
                <button
                  onClick={() => onNavigate('plans')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'plans' ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  Planos e Preços
                </button>
                <button
                  onClick={() => onNavigate('legal')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'legal' ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  Legislação Portaria 7/2022
                </button>
              </>
            ) : currentUser.role === 'fleet_manager' ? (
              <>
                <button
                  onClick={() => onNavigate('fleet')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'fleet' ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  Painel de Frota
                </button>
                <button
                  onClick={() => onNavigate('fleet_drivers')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'fleet_drivers' ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  Condutores
                </button>
                <button
                  onClick={() => onNavigate('fleet_vehicles')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'fleet_vehicles' ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  Viaturas
                </button>
                <button
                  onClick={() => onNavigate('fleet_reports')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'fleet_reports' ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  Relatórios Semanais
                </button>
                <button
                  onClick={() => onNavigate('fleet_audit')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'fleet_audit' ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  Auditoria e Histórico
                </button>
              </>
            ) : currentUser.role === 'platform_admin' ? (
              <>
                <button
                  onClick={() => onNavigate('admin')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'admin' ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  Consola de Administração
                </button>
                <button
                  onClick={() => onNavigate('fleet_audit')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'fleet_audit' ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  Trilho Técnico de Auditoria
                </button>
                <button
                  onClick={() => onNavigate('legal')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'legal' ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  Conformidade Legal & RGPD
                </button>
              </>
            ) : (
              // Driver navigation
              <>
                <button
                  onClick={() => onNavigate('driver')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'driver' ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  Minha Jornada
                </button>
                <button
                  onClick={() => onNavigate('driver_weekly')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'driver_weekly' ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  Grelha Semanal
                </button>
                <button
                  onClick={() => onNavigate('driver_history')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'driver_history' ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  Histórico de Dias
                </button>
                <button
                  onClick={() => onNavigate('driver_reports')}
                  className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'driver_reports' ? 'text-amber-400 font-semibold' : ''
                  }`}
                >
                  Folha Semanal (PDF/CSV)
                </button>
              </>
            )}
          </nav>

          {/* Action & Profile Switcher Zone (Zone 3) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:block">
              <SyncStatusBadge />
            </div>

            {/* Quick Demo Profile Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
                title="Alternar perfil de utilizador para testes rápidos de permissões"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[11px]">
                  {currentUser ? currentUser.name.charAt(0) : '?'}
                </div>
                <div className="text-left hidden lg:block leading-tight">
                  <span className="block font-semibold text-slate-100 truncate max-w-[130px]">
                    {currentUser ? currentUser.name : 'Modo Visitante'}
                  </span>
                  <span className="block text-[10px] text-amber-400">
                    {getRoleLabel(currentUser?.role)}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800"
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Perfis de Demonstração (Permissões Reais)
                    </p>
                  </div>

                  <div className="py-1">
                    {availableUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSelectUser(u);
                          setShowUserMenu(false);
                          if (u.role === 'fleet_manager') onNavigate('fleet');
                          else if (u.role === 'platform_admin') onNavigate('admin');
                          else onNavigate('driver');
                        }}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center justify-between ${
                          currentUser?.id === u.id ? 'bg-amber-50/60 font-semibold text-slate-900' : ''
                        }`}
                      >
                        <div>
                          <div className="font-medium text-slate-900">{u.name}</div>
                          <div className="text-[10px] text-slate-500">
                            {getRoleLabel(u.role)} {u.companyName ? `· ${u.companyName}` : ''}
                          </div>
                        </div>
                        {currentUser?.id === u.id && (
                          <UserCheck className="w-4 h-4 text-amber-600" />
                        )}
                      </button>
                    ))}

                    <div className="border-t border-slate-100 my-1"></div>

                    {/* Opções diretas para Zerar / Restaurar Registos */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowResetModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-semibold cursor-pointer"
                    >
                      <span>🗑️</span>
                      <span>Zerar Jornadas (Começar com 0 registos)</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowResetModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                    >
                      <span>🔄</span>
                      <span>Restaurar Demonstração (Seed Inicial)</span>
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        onSelectUser(null);
                        setShowUserMenu(false);
                        onNavigate('landing');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Terminar Sessão / Ver Landing Page</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
          {!currentUser ? (
            <>
              <button
                onClick={() => {
                  onNavigate('landing');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white"
              >
                Início
              </button>
              <button
                onClick={() => {
                  onNavigate('plans');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white"
              >
                Planos e Preços
              </button>
              <button
                onClick={() => {
                  onNavigate('legal');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white"
              >
                Legislação Portaria 7/2022
              </button>
            </>
          ) : currentUser.role === 'fleet_manager' ? (
            <>
              <button
                onClick={() => {
                  onNavigate('fleet');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white"
              >
                Painel de Frota
              </button>
              <button
                onClick={() => {
                  onNavigate('fleet_drivers');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white"
              >
                Condutores
              </button>
              <button
                onClick={() => {
                  onNavigate('fleet_vehicles');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white"
              >
                Viaturas
              </button>
              <button
                onClick={() => {
                  onNavigate('fleet_reports');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white"
              >
                Relatórios Semanais
              </button>
              <button
                onClick={() => {
                  onNavigate('fleet_audit');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white"
              >
                Auditoria e Histórico
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onNavigate('driver');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white"
              >
                Minha Jornada
              </button>
              <button
                onClick={() => {
                  onNavigate('driver_weekly');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white"
              >
                Grelha Semanal
              </button>
              <button
                onClick={() => {
                  onNavigate('driver_history');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white"
              >
                Histórico de Dias
              </button>
              <button
                onClick={() => {
                  onNavigate('driver_reports');
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white"
              >
                Folha Semanal (PDF/CSV)
              </button>
            </>
          )}

          <div className="pt-2 border-t border-slate-800">
            <SyncStatusBadge />
          </div>
        </div>
      )}

      {/* Modal In-App para Zerar / Restaurar Registos */}
      <ResetConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirmClearAll={() => {
          storage.clearAllJourneys(currentUser || undefined);
          window.dispatchEvent(new CustomEvent('jornadapro-data-changed'));
          setShowResetModal(false);
        }}
        onConfirmRestoreDemo={() => {
          storage.resetDemoData();
          window.dispatchEvent(new CustomEvent('jornadapro-data-changed'));
          setShowResetModal(false);
        }}
        driverName={currentUser?.name}
        title="Zerar Registos da Plataforma"
      />
    </header>
  );
};
