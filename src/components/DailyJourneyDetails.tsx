import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Car,
  MapPin,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Journey, ActivityEvent } from '../types';
import { formatMinutesToHours, formatDatePT } from '../services/reports';

interface DailyJourneyDetailsProps {
  journeys: Journey[];
  activities: ActivityEvent[];
  selectedDate?: string;
  onDateChange?: (date: string) => void;
}

export const DailyJourneyDetails: React.FC<DailyJourneyDetailsProps> = ({
  journeys,
  activities,
  selectedDate: initialDate,
  onDateChange,
}) => {
  // Data inicial default: 2026-10-15 (como no print da Livrete do utilizador)
  const [currentDateStr, setCurrentDateStr] = useState<string>(initialDate || '2026-10-15');

  const shift = journeys.find((j) => j.date === currentDateStr) || journeys[0];

  // Atividades deste dia/jornada
  const shiftActivities = shift
    ? activities.filter((a) => a.journeyId === shift.id)
    : activities.filter((a) => a.startTime.startsWith(currentDateStr));

  const changeDateBy = (days: number) => {
    const parts = currentDateStr.split('-');
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setDate(d.getDate() + days);
    const newStr = d.toISOString().slice(0, 10);
    setCurrentDateStr(newStr);
    onDateChange?.(newStr);
  };

  return (
    <div className="space-y-6">
      {/* Date Navigation Header (Amarelo / Mostarda como no screenshot da Livrete) */}
      <div className="bg-amber-500 rounded-xl px-4 py-2 flex items-center justify-between text-slate-950 font-bold shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDateBy(-1)}
            className="p-1 rounded bg-amber-600/40 hover:bg-amber-600/60 text-slate-950 transition-colors"
            title="Dia anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/90 rounded-lg text-sm tabular-nums font-extrabold text-slate-900">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>{formatDatePT(currentDateStr)}</span>
          </div>
          <button
            onClick={() => changeDateBy(1)}
            className="p-1 rounded bg-amber-600/40 hover:bg-amber-600/60 text-slate-950 transition-colors"
            title="Dia seguinte"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs font-semibold uppercase tracking-wider text-slate-900 hidden sm:block">
          {shift?.vehiclePlate || 'Sem Viatura'} · {shift?.isClosed ? 'Jornada Fechada' : 'Em Curso'}
        </div>
      </div>

      {/* 1. Viaturas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/70">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Viaturas Utilizadas no Período
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Matrícula</th>
                <th className="py-2.5 px-4 tabular-nums">km inicial</th>
                <th className="py-2.5 px-4 tabular-nums">km final</th>
                <th className="py-2.5 px-4 tabular-nums">Total</th>
                <th className="py-2.5 px-4">Observações</th>
                <th className="py-2.5 px-4">Registo</th>
                <th className="py-2.5 px-4 text-center">Fechado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shift ? (
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">{shift.vehiclePlate}</td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                    {shift.start.km}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                    {shift.end?.km || '--'}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold tabular-nums text-slate-900">
                    {shift.totalKm || (shift.end ? shift.end.km - shift.start.km : '--')} km
                  </td>
                  <td className="py-3 px-4 text-slate-500 italic">
                    {shift.reviewNotes || 'Registo normal'}
                  </td>
                  <td className="py-3 px-4 text-slate-600 truncate max-w-[200px]">
                    {shift.start.time} {shift.start.locationName}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {shift.isClosed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" />
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Aberto
                      </span>
                    )}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">
                    Não existem registos de viatura para este dia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Locais de Início e Fim */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/70">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Locais de Início e Término
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-500 block">Início da Jornada:</span>
              <span className="text-sm font-bold text-slate-900">
                {shift ? `${shift.start.time} · ${shift.start.locationName}` : '--'}
              </span>
              {shift?.start.accuracy && (
                <span className="block text-[11px] text-slate-400 mt-0.5">
                  Precisão GPS: {shift.start.accuracy} metros
                </span>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-800 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-500 block">Término da Jornada:</span>
              <span className="text-sm font-bold text-slate-900">
                {shift?.end ? `${shift.end.time} · ${shift.end.locationName}` : 'Em curso / por encerrar'}
              </span>
              {shift?.end?.accuracy && (
                <span className="block text-[11px] text-slate-400 mt-0.5">
                  Precisão GPS: {shift.end.accuracy} metros
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tempo nas Atividades (Matching Image 4 Exact Breakdown) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/70">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Tempo nas Atividades (Portaria n.º 7/2022)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Em descanso</th>
                <th className="py-2.5 px-3">Conduzir (a)</th>
                <th className="py-2.5 px-3">Disponível</th>
                <th className="py-2.5 px-3">Outro Trabalho (b)</th>
                <th className="py-2.5 px-3">Outro Emprego (c)</th>
                <th className="py-2.5 px-3 font-bold bg-amber-50 text-slate-950">
                  Total de trabalho (a)+(b)+(c)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="divide-x divide-slate-100">
                <td className="py-3 px-3 font-mono font-medium tabular-nums text-slate-800">
                  {formatMinutesToHours(shift?.breakdown.restingMinutes || 0)}
                </td>
                <td className="py-3 px-3 font-mono font-bold tabular-nums text-emerald-700">
                  {formatMinutesToHours(shift?.breakdown.drivingMinutes || 0)}
                </td>
                <td className="py-3 px-3 font-mono font-medium tabular-nums text-teal-700">
                  {formatMinutesToHours(shift?.breakdown.availabilityMinutes || 0)}
                </td>
                <td className="py-3 px-3 font-mono font-medium tabular-nums text-slate-600">
                  {formatMinutesToHours(shift?.breakdown.otherWorkSameMinutes || 0)}
                </td>
                <td className="py-3 px-3 font-mono font-medium tabular-nums text-slate-600">
                  {formatMinutesToHours(shift?.breakdown.otherWorkOtherMinutes || 0)}
                </td>
                <td className="py-3 px-3 font-mono font-black tabular-nums bg-amber-50/50 text-slate-950 text-sm">
                  {formatMinutesToHours(shift?.breakdown.totalWorkMinutes || 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Tabela Cronológica de Atividades */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Cronograma Detalhado de Atividades
          </h3>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {shiftActivities.length} registos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Atividade</th>
                <th className="py-2.5 px-4">Início</th>
                <th className="py-2.5 px-4">Término</th>
                <th className="py-2.5 px-4 text-right">Duração (HH:MM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shiftActivities.length > 0 ? (
                shiftActivities.map((act) => {
                  const getLabel = (type: string) => {
                    switch (type) {
                      case 'driving':
                        return 'Conduzir';
                      case 'resting':
                        return 'Repousar';
                      case 'availability':
                        return 'Disponível';
                      case 'other_work_same':
                        return 'Outro Trabalho';
                      case 'other_work_other':
                        return 'Outro Emprego';
                      default:
                        return type;
                    }
                  };

                  const startTimeFmt = new Date(act.startTime).toLocaleTimeString('pt-PT', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const endTimeFmt = act.endTime
                    ? new Date(act.endTime).toLocaleTimeString('pt-PT', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Em curso';

                  return (
                    <tr key={act.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-semibold text-slate-800">
                        {getLabel(act.type)}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 font-mono tabular-nums">
                        {startTimeFmt}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 font-mono tabular-nums">
                        {endTimeFmt}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-medium tabular-nums text-slate-900">
                        {act.durationMinutes ? formatMinutesToHours(act.durationMinutes) : '--:--'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    Nenhuma atividade registada para a data selecionada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
