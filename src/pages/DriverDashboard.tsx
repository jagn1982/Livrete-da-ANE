import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  Clock,
  Car,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  FileDown,
  Printer,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  Coffee,
  Info,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { Journey, User, Vehicle, ActivityType, ActivityEvent } from '../types';
import { storage } from '../services/storage';
import { formatMinutesToHours, exportJourneysToCSV, generateWeeklyReportPDF } from '../services/reports';
import { StartJourneyModal } from '../components/StartJourneyModal';
import { EndJourneyModal } from '../components/EndJourneyModal';
import { ActivitySwitcherModal } from '../components/ActivitySwitcherModal';
import { DriverWeeklyGrid } from '../components/DriverWeeklyGrid';
import { DailyJourneyDetails } from '../components/DailyJourneyDetails';
import { ResetConfirmModal } from '../components/ResetConfirmModal';
import { CarFront2DIcon } from '../components/AppLogo';

interface DriverDashboardProps {
  currentUser: User;
  onNavigate: (view: string) => void;
  initialTab?: 'cockpit' | 'weekly' | 'daily' | 'reports';
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({
  currentUser,
  onNavigate,
  initialTab = 'cockpit',
}) => {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'weekly' | 'daily' | 'reports'>(initialTab);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [currentActivity, setCurrentActivity] = useState<ActivityEvent | null>(null);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  // Modais
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  // Live timer tick for active shift
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    loadData();
    const handleDataChange = () => loadData();
    window.addEventListener('jornadapro-data-changed', handleDataChange);
    return () => {
      window.removeEventListener('jornadapro-data-changed', handleDataChange);
    };
  }, [currentUser]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (activeJourney && !activeJourney.isClosed) {
        const startMs = new Date(activeJourney.start.timestamp).getTime();
        const diffSecs = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
        setElapsedSeconds(diffSecs);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [activeJourney]);

  const loadData = () => {
    const userJourneys = storage.getJourneys(currentUser.id);
    setJourneys(userJourneys);

    const userVehicles = storage.getVehicles(currentUser.companyId);
    setVehicles(userVehicles);

    const ongoing = storage.getActiveJourney(currentUser.id) || null;
    setActiveJourney(ongoing);

    const allActs = storage.getActivities();
    setActivities(allActs);

    if (ongoing) {
      const journeyActs = allActs
        .filter((a) => a.journeyId === ongoing.id)
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      setCurrentActivity(journeyActs[0] || null);
    } else {
      setCurrentActivity(null);
    }
  };

  // Handler para zerar todos os registos
  const handleClearAllJourneys = () => {
    storage.clearAllJourneys(currentUser);
    setJourneys([]);
    setActiveJourney(null);
    setCurrentActivity(null);
    setActivities([]);
    setToastMessage('Registos zerados com sucesso! Todos os períodos estão limpos (0 registos).');
    window.dispatchEvent(new CustomEvent('jornadapro-data-changed'));
  };

  // Handler para restaurar dados de demonstração de Portugal
  const handleRestoreDemoData = () => {
    storage.resetDemoData();
    loadData();
    setToastMessage('Dados de demonstração de Portugal restaurados com sucesso!');
    window.dispatchEvent(new CustomEvent('jornadapro-data-changed'));
  };

  // Handler para iniciar jornada
  const handleStartJourneyConfirm = (data: {
    vehicleId: string;
    vehiclePlate: string;
    vehicleModel: string;
    km: number;
    locationName: string;
    lat?: number;
    lng?: number;
    accuracy?: number;
    isManualFallback?: boolean;
    manualReason?: string;
  }) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().slice(0, 10);

    const newJourney: Journey = {
      id: `jrn_${Date.now()}`,
      driverId: currentUser.id,
      driverName: currentUser.name,
      vehicleId: data.vehicleId,
      vehiclePlate: data.vehiclePlate,
      vehicleModel: data.vehicleModel,
      companyId: currentUser.companyId,
      companyName: currentUser.companyName,
      date: dateStr,
      status: 'in_progress',
      isClosed: false,
      syncStatus: 'synced',
      start: {
        timestamp: now.toISOString(),
        time: timeStr,
        km: data.km,
        locationName: data.locationName,
        lat: data.lat,
        lng: data.lng,
        accuracy: data.accuracy,
        isManualFallback: data.isManualFallback,
        manualReason: data.manualReason,
      },
      breakdown: {
        drivingMinutes: 0,
        restingMinutes: 0,
        availabilityMinutes: 0,
        otherWorkSameMinutes: 0,
        otherWorkOtherMinutes: 0,
        totalWorkMinutes: 0,
      },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    storage.saveJourney(newJourney, currentUser, 'Início de período de trabalho');

    // Primeira atividade: Disponível / Preparação inicial
    const initialActivity: ActivityEvent = {
      id: `act_${Date.now()}`,
      journeyId: newJourney.id,
      driverId: currentUser.id,
      driverName: currentUser.name,
      vehicleId: data.vehicleId,
      vehiclePlate: data.vehiclePlate,
      type: 'availability',
      startTime: now.toISOString(),
      locationName: data.locationName,
      recordedAt: now.toISOString(),
      syncStatus: 'synced',
    };
    storage.saveActivity(initialActivity);

    setShowStartModal(false);
    loadData();
  };

  // Handler para encerrar jornada
  const handleEndJourneyConfirm = (data: {
    km: number;
    locationName: string;
    lat?: number;
    lng?: number;
    accuracy?: number;
    totalKm: number;
    notes?: string;
  }) => {
    if (!activeJourney) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

    // Fechar a atividade corrente se houver
    if (currentActivity && !currentActivity.endTime) {
      const startMs = new Date(currentActivity.startTime).getTime();
      const durationMins = Math.max(1, Math.round((now.getTime() - startMs) / 60000));
      currentActivity.endTime = now.toISOString();
      currentActivity.durationMinutes = durationMins;
      storage.saveActivity(currentActivity);

      // Atualizar o breakdown da jornada
      if (currentActivity.type === 'driving') {
        activeJourney.breakdown.drivingMinutes += durationMins;
        activeJourney.breakdown.totalWorkMinutes += durationMins;
      } else if (currentActivity.type === 'availability') {
        activeJourney.breakdown.availabilityMinutes += durationMins;
      } else if (currentActivity.type === 'resting') {
        activeJourney.breakdown.restingMinutes += durationMins;
      } else if (currentActivity.type === 'other_work_same') {
        activeJourney.breakdown.otherWorkSameMinutes += durationMins;
        activeJourney.breakdown.totalWorkMinutes += durationMins;
      } else if (currentActivity.type === 'other_work_other') {
        activeJourney.breakdown.otherWorkOtherMinutes += durationMins;
      }
    }

    const updatedJourney: Journey = {
      ...activeJourney,
      isClosed: true,
      status: 'completed',
      end: {
        timestamp: now.toISOString(),
        time: timeStr,
        km: data.km,
        locationName: data.locationName,
        lat: data.lat,
        lng: data.lng,
        accuracy: data.accuracy,
      },
      totalKm: data.totalKm,
      reviewNotes: data.notes,
      updatedAt: now.toISOString(),
    };

    storage.saveJourney(updatedJourney, currentUser, 'Encerramento oficial de jornada');

    setShowEndModal(false);
    loadData();
  };

  // Handler para alternar atividade
  const handleSelectActivity = (newType: ActivityType, notes?: string) => {
    if (!activeJourney) return;

    const now = new Date();

    // Fechar a anterior
    if (currentActivity && !currentActivity.endTime) {
      const startMs = new Date(currentActivity.startTime).getTime();
      const durMins = Math.max(1, Math.round((now.getTime() - startMs) / 60000));
      currentActivity.endTime = now.toISOString();
      currentActivity.durationMinutes = durMins;
      storage.saveActivity(currentActivity);

      // Somar ao total da jornada
      if (currentActivity.type === 'driving') {
        activeJourney.breakdown.drivingMinutes += durMins;
        activeJourney.breakdown.totalWorkMinutes += durMins;
      } else if (currentActivity.type === 'availability') {
        activeJourney.breakdown.availabilityMinutes += durMins;
      } else if (currentActivity.type === 'resting') {
        activeJourney.breakdown.restingMinutes += durMins;
      } else if (currentActivity.type === 'other_work_same') {
        activeJourney.breakdown.otherWorkSameMinutes += durMins;
        activeJourney.breakdown.totalWorkMinutes += durMins;
      } else if (currentActivity.type === 'other_work_other') {
        activeJourney.breakdown.otherWorkOtherMinutes += durMins;
      }
      storage.saveJourney(activeJourney, currentUser, `Mudança de atividade para ${newType}`);
    }

    // Criar nova atividade
    const newAct: ActivityEvent = {
      id: `act_${Date.now()}`,
      journeyId: activeJourney.id,
      driverId: currentUser.id,
      driverName: currentUser.name,
      vehicleId: activeJourney.vehicleId,
      vehiclePlate: activeJourney.vehiclePlate,
      type: newType,
      startTime: now.toISOString(),
      notes,
      recordedAt: now.toISOString(),
      syncStatus: 'synced',
    };
    storage.saveActivity(newAct);

    loadData();
  };

  const unclosedCount = journeys.filter((j) => !j.isClosed && j.id !== activeJourney?.id).length;

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Toast Notification de Sucesso */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage('')}
            className="text-white hover:text-emerald-100 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Driver Sub-Navigation Bar & Compact Zerar Action */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex items-center justify-between shadow-xs gap-2">
        <div className="grid grid-cols-4 flex-1 gap-1">
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cockpit'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="w-4 h-4 shrink-0 flex items-center justify-center">
              <CarFront2DIcon className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline">Painel do Condutor</span>
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'weekly'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Grelha Semanal</span>
          </button>

          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'daily'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Detalhes do Dia</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reports'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Relatórios PDF</span>
          </button>
        </div>

        {/* Botão Menor e Funcional de Zerar Registos */}
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

      {/* Alerta de Períodos Não Encerrados (como no print da Livrete Image 2) */}
      {unclosedCount > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Períodos não encerrados</h4>
              <p className="text-xs text-slate-600">Falta informar o km final de jornadas anteriores</p>
            </div>
          </div>
          <div className="text-xl font-extrabold text-amber-800 tabular-nums bg-white px-3 py-1 rounded-xl border border-amber-200">
            {unclosedCount}
          </div>
        </div>
      )}

      {/* TAB 1: COCKPIT OPERACIONAL */}
      {activeTab === 'cockpit' && (
        <div className="space-y-6">
          {activeJourney ? (
            /* Card de Jornada em Curso */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
              <div className="bg-slate-900 text-white p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-slate-950 uppercase tracking-wider mb-2">
                      <span className="w-2 h-2 rounded-full bg-slate-950"></span>
                      Jornada em Curso
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {currentUser.name}
                    </h2>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Viatura: <strong className="text-amber-400 font-mono">{activeJourney.vehiclePlate}</strong> · {activeJourney.vehicleModel}
                    </p>
                  </div>

                  {/* Cronómetro em Tempo Real */}
                  <div className="text-right">
                    <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                      Tempo Total do Turno
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tabular-nums">
                      {formatTimer(elapsedSeconds)}
                    </span>
                  </div>
                </div>

                {/* Caixa de Estado Atual da Atividade */}
                <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Atividade Atual
                    </span>
                    <span className="text-base font-bold text-emerald-400 flex items-center gap-2 mt-0.5">
                      {currentActivity?.type === 'driving' ? (
                        <>
                          <Car className="w-4 h-4 text-emerald-400" /> Conduzir (a)
                        </>
                      ) : currentActivity?.type === 'resting' ? (
                        <>
                          <Coffee className="w-4 h-4 text-blue-400" /> Repousar
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-teal-400" /> Disponível
                        </>
                      )}
                    </span>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Início da Atividade
                    </span>
                    <span className="text-sm font-semibold text-slate-200 tabular-nums block mt-0.5">
                      {activeJourney.start.time} ({activeJourney.start.km} km)
                    </span>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Local de Partida
                    </span>
                    <span className="text-xs font-medium text-slate-300 truncate block mt-0.5">
                      {activeJourney.start.locationName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação Imediata */}
              <div className="p-6 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setShowActivityModal(true)}
                  className="py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Clock className="w-5 h-5 text-slate-950" />
                  <span>Mudar Atividade (Condução / Pausa)</span>
                </button>

                <button
                  onClick={() => setShowEndModal(true)}
                  className="py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Square className="w-5 h-5 text-rose-400" />
                  <span>Encerrar Jornada (Registar Km Final)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Ecrã de Início de Jornada (Fiel ao screenshot do Livrete Driver Image 2) */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 text-center max-w-xl mx-auto space-y-6">
              <div className="w-20 h-24 flex items-center justify-center mx-auto filter drop-shadow-xl hover:scale-105 transition-transform duration-200">
                <CarFront2DIcon className="w-full h-full" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Não há períodos de trabalho em curso</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Para iniciar a circulação e cumprir as obrigações da Portaria n.º 7/2022, registe o odómetro e a localização da sua viatura.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Viatura predefinida:</span>
                  <strong className="text-slate-900 font-bold">
                    {vehicles[0]?.plate || 'CG-52-BC'} ({vehicles[0]?.brand} {vehicles[0]?.model})
                  </strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Odómetro registado:</span>
                  <span className="font-mono tabular-nums font-bold text-slate-900">
                    {vehicles[0]?.currentKm || 27666} km
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowStartModal(true)}
                className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>Iniciar Novo Período de Trabalho</span>
              </button>
            </div>
          )}

          {/* Resumo Rápido dos Últimos Registos */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Últimos Períodos de Trabalho Concluídos
              </h3>
              <button
                onClick={() => setActiveTab('daily')}
                className="text-xs text-amber-700 font-semibold hover:text-amber-800 flex items-center gap-1"
              >
                <span>Ver todos os dias</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {journeys.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs font-medium">
                  Não existem períodos de trabalho registados. O sistema está limpo a zero (0 registos).
                </div>
              ) : (
                journeys.slice(0, 3).map((j) => (
                  <div key={j.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{j.vehiclePlate}</span>
                        <span className="text-slate-400 font-normal">·</span>
                        <span className="text-slate-600 tabular-nums">{j.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {j.start.locationName} → {j.end?.locationName || 'Em curso'}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold font-mono text-slate-900 tabular-nums">
                        {j.totalKm || (j.end ? j.end.km - j.start.km : '--')} km
                      </span>
                      <span className="block text-[10px] text-emerald-700 font-semibold">
                        Condução: {formatMinutesToHours(j.breakdown.drivingMinutes)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GRELHA SEMANAL */}
      {activeTab === 'weekly' && (
        <DriverWeeklyGrid
          journeys={journeys}
          activities={activities}
          onSelectJourney={() => setActiveTab('daily')}
        />
      )}

      {/* TAB 3: DETALHES DO DIA E VIATURAS */}
      {activeTab === 'daily' && (
        <DailyJourneyDetails
          journeys={journeys}
          activities={activities}
        />
      )}

      {/* TAB 4: RELATÓRIOS E EXPORTAÇÃO */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Folha de Registo Semanal do Condutor
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Emissão oficial para fiscalização (Portaria n.º 7/2022, TVDE, Táxis e Mercadorias).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportJourneysToCSV(journeys, currentUser.name, currentUser.companyName)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <FileDown className="w-4 h-4 text-slate-500" />
                <span>Exportar CSV</span>
              </button>

              <button
                onClick={() =>
                  generateWeeklyReportPDF({
                    driver: currentUser,
                    company: null,
                    vehicle: vehicles[0] || null,
                    journeys,
                    startDateStr: '2026-10-12',
                    endDateStr: '2026-10-18',
                  })
                }
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Gerar PDF Oficial</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-600">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-600" />
              <span>Instruções de Apresentação em Fiscalizações de Estrada</span>
            </h4>
            <p>
              Em caso de fiscalização pela PSP, GNR, IMT ou ACT, apresente este ecrã ou o documento PDF gerado.
              O ficheiro PDF contém todos os elementos previstos no modelo oficial da Portaria n.º 7/2022:
              identificação completa do motorista e viatura, tempos de condução (a), disponibilidade, descanso,
              odómetro e quilómetros totais percorridos.
            </p>
          </div>

          {/* Pré-visualização da Tabela de Registos */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Matrícula</th>
                  <th className="py-2.5 px-3">Início</th>
                  <th className="py-2.5 px-3">Fim</th>
                  <th className="py-2.5 px-3">Distância</th>
                  <th className="py-2.5 px-3">Condução (a)</th>
                  <th className="py-2.5 px-3">Total Trab.</th>
                  <th className="py-2.5 px-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {journeys.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 text-xs font-medium">
                      Não existem registos de jornada no sistema. O histórico está limpo a zero (0 registos).
                    </td>
                  </tr>
                ) : (
                  journeys.map((j) => (
                    <tr key={j.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 tabular-nums">{j.date}</td>
                      <td className="py-2.5 px-3 font-mono">{j.vehiclePlate}</td>
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
                      <td className="py-2.5 px-3">
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
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modais */}
      <StartJourneyModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        vehicles={vehicles}
        currentUser={currentUser}
        onConfirm={handleStartJourneyConfirm}
      />

      <EndJourneyModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        activeJourney={activeJourney}
        onConfirm={handleEndJourneyConfirm}
      />

      {activeJourney && (
        <ActivitySwitcherModal
          isOpen={showActivityModal}
          onClose={() => setShowActivityModal(false)}
          currentActivityType={currentActivity?.type || 'availability'}
          onSelectActivity={handleSelectActivity}
        />
      )}

      <ResetConfirmModal
        isOpen={showResetConfirmModal}
        onClose={() => setShowResetConfirmModal(false)}
        onConfirmClearAll={handleClearAllJourneys}
        onConfirmRestoreDemo={handleRestoreDemoData}
        driverName={currentUser.name}
        title="Zerar Registos de Trabalho"
      />
    </div>
  );
};
