import React, { useState, useEffect } from 'react';
import {
  Users,
  Car,
  Clock,
  AlertTriangle,
  FileText,
  Shield,
  Plus,
  Search,
  CheckCircle,
  FileDown,
  Printer,
  ChevronRight,
  Filter,
  Building,
  UserPlus,
  RotateCcw,
} from 'lucide-react';
import { User, Vehicle, Journey, ActivityEvent, AuditEvent, Company } from '../types';
import { storage } from '../services/storage';
import { formatMinutesToHours, exportJourneysToCSV, generateWeeklyReportPDF } from '../services/reports';
import { CarFront2DIcon } from '../components/AppLogo';
import { ResetConfirmModal } from '../components/ResetConfirmModal';

interface FleetDashboardProps {
  currentUser: User;
  onNavigate: (view: string) => void;
  subView?: 'overview' | 'drivers' | 'vehicles' | 'reports' | 'audit';
}

export const FleetDashboard: React.FC<FleetDashboardProps> = ({
  currentUser,
  onNavigate,
  subView = 'overview',
}) => {
  const [currentSubView, setCurrentSubView] = useState<'overview' | 'drivers' | 'vehicles' | 'reports' | 'audit'>(subView);
  const [company, setCompany] = useState<Company | null>(null);
  const [drivers, setDrivers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  // Modais de criação rápida e reset
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [newDriverData, setNewDriverData] = useState({ name: '', email: '', phone: '', nif: '', license: '' });
  const [newVehicleData, setNewVehicleData] = useState({ plate: '', brand: '', model: '', year: 2024, category: 'tvde' as const, currentKm: 0 });

  const handleClearAllJourneys = () => {
    storage.clearAllJourneys(currentUser);
    loadData();
    setShowResetConfirmModal(false);
    window.dispatchEvent(new CustomEvent('jornadapro-data-changed'));
  };

  const handleRestoreDemoData = () => {
    storage.resetDemoData();
    loadData();
    setShowResetConfirmModal(false);
    window.dispatchEvent(new CustomEvent('jornadapro-data-changed'));
  };

  useEffect(() => {
    loadData();
    const handleDataChange = () => loadData();
    window.addEventListener('jornadapro-data-changed', handleDataChange);
    return () => {
      window.removeEventListener('jornadapro-data-changed', handleDataChange);
    };
  }, [currentUser]);

  const loadData = () => {
    const comp = currentUser.companyId ? storage.getCompanyById(currentUser.companyId) || null : null;
    setCompany(comp);

    const allUsers = storage.getUsers();
    const companyDrivers = allUsers.filter((u) => u.companyId === currentUser.companyId && u.role === 'company_driver');
    setDrivers(companyDrivers);

    const compVehicles = storage.getVehicles(currentUser.companyId);
    setVehicles(compVehicles);

    const compJourneys = storage.getJourneys(undefined, currentUser.companyId);
    setJourneys(compJourneys);

    const logs = storage.getAuditLogs();
    setAuditLogs(logs);
  };

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverData.name || !newDriverData.email) return;

    const newDriver: User = {
      id: `usr_${Date.now()}`,
      name: newDriverData.name.trim(),
      email: newDriverData.email.trim(),
      phone: newDriverData.phone.trim() || undefined,
      nif: newDriverData.nif.trim() || undefined,
      driverLicenseNumber: newDriverData.license.trim() || undefined,
      role: 'company_driver',
      companyId: currentUser.companyId,
      companyName: company?.name,
      createdAt: new Date().toISOString(),
    };

    storage.saveUser(newDriver);
    storage.addAuditLog({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      entityType: 'driver',
      entityId: newDriver.id,
      action: 'create',
      performedByUserId: currentUser.id,
      performedByUserName: currentUser.name,
      userRole: currentUser.role,
      description: `Condutor ${newDriver.name} associado à empresa ${company?.name}`,
      source: 'web_fleet',
    });

    setShowAddDriverModal(false);
    setNewDriverData({ name: '', email: '', phone: '', nif: '', license: '' });
    loadData();
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicleData.plate || !newVehicleData.brand) return;

    const newVeh: Vehicle = {
      id: `veh_${Date.now()}`,
      plate: newVehicleData.plate.toUpperCase().trim(),
      brand: newVehicleData.brand.trim(),
      model: newVehicleData.model.trim(),
      year: newVehicleData.year,
      category: newVehicleData.category,
      companyId: currentUser.companyId || '',
      assignedDriverIds: [],
      currentKm: Number(newVehicleData.currentKm) || 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    storage.saveVehicle(newVeh);
    storage.addAuditLog({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      entityType: 'vehicle',
      entityId: newVeh.id,
      action: 'create',
      performedByUserId: currentUser.id,
      performedByUserName: currentUser.name,
      userRole: currentUser.role,
      description: `Viatura ${newVeh.plate} (${newVeh.brand} ${newVeh.model}) adicionada à frota`,
      source: 'web_fleet',
    });

    setShowAddVehicleModal(false);
    setNewVehicleData({ plate: '', brand: '', model: '', year: 2024, category: 'tvde', currentKm: 0 });
    loadData();
  };

  const unclosedJourneys = journeys.filter((j) => !j.isClosed);
  const totalKmRecorded = journeys.reduce((sum, j) => sum + (j.totalKm || 0), 0);
  const totalDrivingMins = journeys.reduce((sum, j) => sum + j.breakdown.drivingMinutes, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Company Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-md border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" />
            <span>Operador Empresa · Livrete Fleet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {company?.name || 'Transul Mobilidade Urbana Lda'}
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            NIF: <span className="text-slate-200 font-mono font-medium">{company?.nif || '516802569'}</span> · {company?.address || 'Lisboa, Portugal'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowAddDriverModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Condutor</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddVehicleModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-700"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Viatura</span>
          </button>
        </div>
      </div>

      {/* Sub-menu Tabs & Botão Menor de Zerar - EXATAMENTE IGUAL AO PAINEL DO CONDUTOR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex items-center justify-between shadow-xs gap-2">
        <div className="grid grid-cols-5 flex-1 gap-1">
          <button
            onClick={() => setCurrentSubView('overview')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              currentSubView === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentSubView('drivers')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              currentSubView === 'drivers'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Condutores</span> ({drivers.length})
          </button>
          <button
            onClick={() => setCurrentSubView('vehicles')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              currentSubView === 'vehicles'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="w-4 h-4 shrink-0 flex items-center justify-center">
              <CarFront2DIcon className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline">Viaturas</span> ({vehicles.length})
          </button>
          <button
            onClick={() => setCurrentSubView('reports')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              currentSubView === 'reports'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Relatórios</span>
          </button>
          <button
            onClick={() => setCurrentSubView('audit')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              currentSubView === 'audit'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Auditoria</span>
          </button>
        </div>

        {/* Botão Menor e Funcional de Zerar Registos (IGUAL à barra do condutor) */}
        <div className="flex items-center gap-1.5 shrink-0 pl-1 border-l border-slate-200">
          <button
            type="button"
            onClick={() => setShowResetConfirmModal(true)}
            className="px-2.5 py-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            title="Zerar todos os registos e começar com histórico limpo a 0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span className="text-[11px] font-bold">Zerar</span>
          </button>
        </div>
      </div>

      {/* SUBVIEW 1: OVERVIEW */}
      {currentSubView === 'overview' && (
        <div className="space-y-6">
          {/* 4 Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Condutores Ativos
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-900 tabular-nums">{drivers.length}</span>
                <span className="text-xs font-medium text-slate-500">Limite: {company?.maxDrivers || 25}</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Viaturas em Frota
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-900 tabular-nums">{vehicles.length}</span>
                <span className="text-xs font-medium text-emerald-700 font-semibold">100% operacionais</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Jornadas Registadas
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-900 tabular-nums">{journeys.length}</span>
                <span className="text-xs font-medium text-slate-600 font-mono tabular-nums">{totalKmRecorded} km totais</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Alertas de Pendência
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className={`text-2xl font-black tabular-nums ${unclosedJourneys.length > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {unclosedJourneys.length}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {unclosedJourneys.length > 0 ? 'Sem km final' : 'Tudo regularizado'}
                </span>
              </div>
            </div>
          </div>

          {/* Master Journeys Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Registo Consolidado de Jornadas da Frota
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualização em tempo real de períodos de trabalho de condução e descansos.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportJourneysToCSV(journeys, undefined, company?.name)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <FileDown className="w-4 h-4 text-slate-500" />
                  <span>Descarregar CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Data</th>
                    <th className="py-2.5 px-3">Condutor</th>
                    <th className="py-2.5 px-3">Matrícula</th>
                    <th className="py-2.5 px-3">Início</th>
                    <th className="py-2.5 px-3">Fim</th>
                    <th className="py-2.5 px-3">Distância</th>
                    <th className="py-2.5 px-3">Condução (a)</th>
                    <th className="py-2.5 px-3">Total Trab.</th>
                    <th className="py-2.5 px-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {journeys.length > 0 ? (
                    journeys.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 tabular-nums">{j.date}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{j.driverName}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{j.vehiclePlate}</td>
                        <td className="py-2.5 px-3 tabular-nums text-slate-600">{j.start.time} ({j.start.km} km)</td>
                        <td className="py-2.5 px-3 tabular-nums text-slate-600">
                          {j.end ? `${j.end.time} (${j.end.km} km)` : 'Em curso'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 tabular-nums">
                          {j.totalKm || (j.end ? j.end.km - j.start.km : '--')} km
                        </td>
                        <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold tabular-nums">
                          {formatMinutesToHours(j.breakdown.drivingMinutes)}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-900 font-bold tabular-nums">
                          {formatMinutesToHours(j.breakdown.totalWorkMinutes)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {j.isClosed ? (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Fechado
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                              Aberto
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        Nenhuma jornada registada para a empresa até ao momento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 2: DRIVERS */}
      {currentSubView === 'drivers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Condutores da Frota</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Gestão de condutores associados, licenças e viaturas atribuídas.
              </p>
            </div>
            <button
              onClick={() => setShowAddDriverModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Convidar / Registar Condutor</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Nome do Condutor</th>
                  <th className="py-2.5 px-4">E-mail</th>
                  <th className="py-2.5 px-4">NIF</th>
                  <th className="py-2.5 px-4">Carta de Condução</th>
                  <th className="py-2.5 px-4">Telefone</th>
                  <th className="py-2.5 px-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {drivers.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.name}</td>
                    <td className="py-3 px-4 text-slate-600">{d.email}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700">{d.nif || '--'}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700">{d.driverLicenseNumber || '--'}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700">{d.phone || '--'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Ativo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBVIEW 3: VEHICLES */}
      {currentSubView === 'vehicles' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Viaturas da Frota</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Registo de veículos, matrículas, categoria TVDE/Táxi/Mercadorias e quilometragem atualizada.
              </p>
            </div>
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Viatura</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Matrícula</th>
                  <th className="py-2.5 px-4">Marca & Modelo</th>
                  <th className="py-2.5 px-4">Ano</th>
                  <th className="py-2.5 px-4">Categoria</th>
                  <th className="py-2.5 px-4 tabular-nums">Odómetro Atual</th>
                  <th className="py-2.5 px-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-black text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 shrink-0">
                          <CarFront2DIcon className="w-full h-full" />
                        </div>
                        <span>{v.plate}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{v.brand} {v.model}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-600">{v.year || '--'}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {v.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">
                      {v.currentKm} km
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Ativa
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBVIEW 4: REPORTS */}
      {currentSubView === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Relatórios Oficiais da Empresa (Portaria n.º 7/2022)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Emissão consolidada de folhas semanais e mensais para arquivo legal de 5 anos e fiscalização.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportJourneysToCSV(journeys, undefined, company?.name)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <FileDown className="w-4 h-4 text-slate-500" />
                <span>Exportar CSV Completo</span>
              </button>

              <button
                onClick={() =>
                  generateWeeklyReportPDF({
                    driver: drivers[0] || currentUser,
                    company,
                    vehicle: vehicles[0] || null,
                    journeys,
                    startDateStr: '2026-10-12',
                    endDateStr: '2026-10-18',
                  })
                }
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Emitir PDF Semanal</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">
              Conformidade com a Portaria n.º 7/2022 e Regulamentação do Trabalho de Condução:
            </p>
            <p>
              Os dados recolhidos pelo sistema Livrete da ANE incluem identificação inequívoca de empregador,
              condutor, viatura, início/fim com geolocalização e odómetro, e descriminação das 5 atividades legais.
              O empregador é obrigado por lei a conservar os registos durante 5 anos.
            </p>
          </div>
        </div>
      )}

      {/* SUBVIEW 5: AUDIT LOGS */}
      {currentSubView === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <span>Trilho Inalterável de Auditoria (Audit Trail)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Registo criptograficamente rastreável de todas as criações, alterações e encerramentos com identidade e timestamp.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Data e Hora (UTC)</th>
                  <th className="py-2.5 px-3">Autor</th>
                  <th className="py-2.5 px-3">Entidade</th>
                  <th className="py-2.5 px-3">Operação</th>
                  <th className="py-2.5 px-3">Descrição do Evento</th>
                  <th className="py-2.5 px-3">Origem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600">
                      {new Date(log.timestamp).toLocaleString('pt-PT')}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{log.performedByUserName}</td>
                    <td className="py-2.5 px-3 capitalize text-slate-600">{log.entityType}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-800">{log.description}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{log.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Adicionar Condutor */}
      {showAddDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Adicionar Novo Condutor à Frota</h3>
            <form onSubmit={handleAddDriver} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={newDriverData.name}
                  onChange={(e) => setNewDriverData({ ...newDriverData, name: e.target.value })}
                  placeholder="Ex: Pedro Miguel Silva"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={newDriverData.email}
                  onChange={(e) => setNewDriverData({ ...newDriverData, email: e.target.value })}
                  placeholder="pedro.silva@empresa.pt"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIF</label>
                  <input
                    type="text"
                    value={newDriverData.nif}
                    onChange={(e) => setNewDriverData({ ...newDriverData, nif: e.target.value })}
                    placeholder="234567890"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Carta / Licença</label>
                  <input
                    type="text"
                    value={newDriverData.license}
                    onChange={(e) => setNewDriverData({ ...newDriverData, license: e.target.value })}
                    placeholder="L-1234567"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone</label>
                <input
                  type="text"
                  value={newDriverData.phone}
                  onChange={(e) => setNewDriverData({ ...newDriverData, phone: e.target.value })}
                  placeholder="+351 912 345 678"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Registar Condutor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Adicionar Viatura */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Registar Nova Viatura na Frota</h3>
            <form onSubmit={handleAddVehicle} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Matrícula *</label>
                  <input
                    type="text"
                    required
                    value={newVehicleData.plate}
                    onChange={(e) => setNewVehicleData({ ...newVehicleData, plate: e.target.value })}
                    placeholder="XX-00-XX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria *</label>
                  <select
                    value={newVehicleData.category}
                    onChange={(e) => setNewVehicleData({ ...newVehicleData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  >
                    <option value="tvde">TVDE</option>
                    <option value="taxi">Táxi</option>
                    <option value="mercadorias">Mercadorias</option>
                    <option value="passageiros">Passageiros</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Marca *</label>
                  <input
                    type="text"
                    required
                    value={newVehicleData.brand}
                    onChange={(e) => setNewVehicleData({ ...newVehicleData, brand: e.target.value })}
                    placeholder="Ex: Mercedes-Benz"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Modelo *</label>
                  <input
                    type="text"
                    required
                    value={newVehicleData.model}
                    onChange={(e) => setNewVehicleData({ ...newVehicleData, model: e.target.value })}
                    placeholder="Ex: E220d"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ano</label>
                  <input
                    type="number"
                    value={newVehicleData.year}
                    onChange={(e) => setNewVehicleData({ ...newVehicleData, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Odómetro Atual (Km)</label>
                  <input
                    type="number"
                    value={newVehicleData.currentKm}
                    onChange={(e) => setNewVehicleData({ ...newVehicleData, currentKm: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Registar Viatura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal In-App para Zerar / Restaurar Registos da Frota */}
      <ResetConfirmModal
        isOpen={showResetConfirmModal}
        onClose={() => setShowResetConfirmModal(false)}
        onConfirmClearAll={handleClearAllJourneys}
        onConfirmRestoreDemo={handleRestoreDemoData}
        title="Zerar Registos da Frota"
        description="Pode escolher entre limpar completamente todos os registos de jornada e atividades da frota para começar com histórico limpo a zero (0) ou restaurar os dados de demonstração oficiais de Portugal."
      />
    </div>
  );
};
