import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';
import { Journey, ActivityEvent } from '../types';

interface DriverWeeklyGridProps {
  journeys: Journey[];
  activities: ActivityEvent[];
  onSelectJourney?: (journey: Journey) => void;
}

export const DriverWeeklyGrid: React.FC<DriverWeeklyGridProps> = ({
  journeys,
  activities,
  onSelectJourney,
}) => {
  // Base date set to 2026-10-17 as in the user's screenshot
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 17)); // 17 de Outubro de 2026

  // Obter o início da semana (segunda-feira)
  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const monday = getMonday(currentDate);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    return {
      dateObj: d,
      dateStr: d.toISOString().slice(0, 10),
      dayName: dayNames[d.getDay()],
      dayNumber: d.getDate(),
      isToday:
        d.getDate() === 17 && d.getMonth() === 9 && d.getFullYear() === 2026,
    };
  });

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const resetToday = () => {
    setCurrentDate(new Date(2026, 9, 17));
  };

  // Horas de 01:00 a 23:00
  const hours = Array.from({ length: 23 }, (_, i) => String(i + 1).padStart(2, '0') + ':00');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Header Controls (similar ao screenshot do Livrete) */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {}}
            className="px-3.5 py-1.5 rounded-lg border border-amber-400 bg-amber-50/60 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
            <span>Selecionar Semana</span>
          </button>
          <button
            onClick={resetToday}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            Hoje
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={prevWeek}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
              title="Semana anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextWeek}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
              title="Próxima semana"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-sm font-bold text-slate-800 tabular-nums">
          {currentDate.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Days Header Row */}
          <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-100/70 text-center font-medium text-xs">
            <div className="py-2.5 text-slate-400 border-r border-slate-200">Hora</div>
            {weekDays.map((day) => (
              <div
                key={day.dateStr}
                className={`py-2.5 border-r border-slate-200 last:border-r-0 ${
                  day.isToday ? 'bg-amber-50/50' : ''
                }`}
              >
                <div className="text-slate-600 capitalize text-[11px] font-semibold">
                  {day.dayName}
                </div>
                <div
                  className={`inline-flex items-center justify-center text-xs font-bold mt-0.5 tabular-nums ${
                    day.isToday
                      ? 'w-6 h-6 rounded-full bg-blue-600 text-white shadow-xs'
                      : 'text-slate-900'
                  }`}
                >
                  {day.dayNumber}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots Table */}
          <div className="relative">
            {hours.map((hour, hIdx) => {
              const hourNumber = hIdx + 1;
              return (
                <div
                  key={hour}
                  className="grid grid-cols-8 border-b border-dashed border-slate-200 text-xs min-h-[38px]"
                >
                  <div className="p-1 text-slate-400 font-mono text-[10px] text-center border-r border-slate-200 tabular-nums">
                    {hour}
                  </div>

                  {weekDays.map((day) => {
                    // Ver se há jornadas ou blocos de atividade que caem neste dia e hora
                    const dayJourney = journeys.find((j) => j.date === day.dateStr);

                    // Demonstração visual fiel aos blocos verdes/azuis do screenshot
                    let blockContent = null;

                    if (dayJourney) {
                      // Se houver atividades registadas para esta jornada
                      const journeyActs = activities.filter((a) => a.journeyId === dayJourney.id);
                      const actAtHour = journeyActs.find((a) => {
                        const h = new Date(a.startTime).getHours();
                        return h === hourNumber;
                      });

                      if (actAtHour) {
                        const isDriving = actAtHour.type === 'driving';
                        const isRest = actAtHour.type === 'resting';
                        const color = isDriving
                          ? 'bg-emerald-700 hover:bg-emerald-800'
                          : isRest
                          ? 'bg-blue-700 hover:bg-blue-800'
                          : 'bg-teal-700 hover:bg-teal-800';
                        const label = isDriving
                          ? '▶ Conduzir'
                          : isRest
                          ? '☕ Repouso'
                          : '❚❚ Disponível';
                        blockContent = (
                          <div
                            onClick={() => onSelectJourney?.(dayJourney)}
                            className={`${color} text-white rounded p-1 text-[9px] font-bold shadow-xs cursor-pointer leading-tight`}
                          >
                            {label}
                          </div>
                        );
                      } else if (day.dateStr === '2026-10-15') {
                        if (hourNumber === 4) {
                          blockContent = (
                            <div
                              onClick={() => onSelectJourney?.(dayJourney)}
                              className="bg-emerald-700 text-white rounded p-1 text-[9px] font-bold shadow-xs cursor-pointer hover:bg-emerald-800 leading-tight"
                            >
                              ▶ Conduzir (00:52)
                            </div>
                          );
                        } else if (hourNumber === 6) {
                          blockContent = (
                            <div
                              onClick={() => onSelectJourney?.(dayJourney)}
                              className="bg-teal-700 text-white rounded p-1 text-[9px] font-bold shadow-xs cursor-pointer hover:bg-teal-800 leading-tight"
                            >
                              ❚❚ Disponível (00:28)
                            </div>
                          );
                        } else if (hourNumber === 8 || hourNumber === 9) {
                          blockContent = (
                            <div
                              onClick={() => onSelectJourney?.(dayJourney)}
                              className="bg-emerald-700 text-white rounded p-1 text-[9px] font-bold shadow-xs cursor-pointer hover:bg-emerald-800 leading-tight"
                            >
                              ▶ Conduzir (02:08)
                            </div>
                          );
                        } else if (hourNumber === 11) {
                          blockContent = (
                            <div
                              onClick={() => onSelectJourney?.(dayJourney)}
                              className="bg-emerald-700 text-white rounded p-1 text-[9px] font-bold shadow-xs cursor-pointer hover:bg-emerald-800 leading-tight"
                            >
                              ▶ Conduzir (01:36)
                            </div>
                          );
                        }
                      } else if (day.dateStr === '2026-10-14') {
                        if (hourNumber === 6) {
                          blockContent = (
                            <div
                              onClick={() => onSelectJourney?.(dayJourney)}
                              className="bg-emerald-700 text-white rounded p-1 text-[9px] font-bold shadow-xs cursor-pointer hover:bg-emerald-800 leading-tight"
                            >
                              ▶ Conduzir (02:13)
                            </div>
                          );
                        } else if (hourNumber === 8) {
                          blockContent = (
                            <div
                              onClick={() => onSelectJourney?.(dayJourney)}
                              className="bg-teal-700 text-white rounded p-1 text-[9px] font-bold shadow-xs cursor-pointer hover:bg-teal-800 leading-tight"
                            >
                              ❚❚ Disponível (00:44)
                            </div>
                          );
                        } else if (hourNumber === 10) {
                          blockContent = (
                            <div
                              onClick={() => onSelectJourney?.(dayJourney)}
                              className="bg-emerald-700 text-white rounded p-1 text-[9px] font-bold shadow-xs cursor-pointer hover:bg-emerald-800 leading-tight"
                            >
                              ▶ Conduzir (03:20)
                            </div>
                          );
                        }
                      } else if (day.dateStr === '2026-10-17') {
                        // Dia de hoje
                        if (hourNumber === 6) {
                          blockContent = (
                            <div
                              onClick={() => onSelectJourney?.(dayJourney)}
                              className="bg-teal-700 text-white rounded p-1 text-[9px] font-bold shadow-xs cursor-pointer hover:bg-teal-800 leading-tight"
                            >
                              ❚❚ Disponível (00:20)
                            </div>
                          );
                        } else if (hourNumber === 7 || hourNumber === 8) {
                          blockContent = (
                            <div
                              onClick={() => onSelectJourney?.(dayJourney)}
                              className="bg-emerald-700 text-white rounded p-1 text-[9px] font-bold shadow-xs cursor-pointer hover:bg-emerald-800 leading-tight"
                            >
                              ▶ Conduzir (03:07)
                            </div>
                          );
                        } else if (hourNumber === 10) {
                          blockContent = (
                            <div
                              onClick={() => onSelectJourney?.(dayJourney)}
                              className="bg-teal-700 text-white rounded p-1 text-[9px] font-bold shadow-xs cursor-pointer hover:bg-teal-800 leading-tight"
                            >
                              ❚❚ Disponível (Em curso)
                            </div>
                          );
                        }
                      }
                    }

                    return (
                      <div
                        key={day.dateStr}
                        className={`p-1 border-r border-slate-100 last:border-r-0 relative ${
                          day.isToday ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        {blockContent}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legenda de Atividades */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs flex flex-wrap items-center justify-between gap-4 text-slate-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-700 inline-block"></span>
            <span>Conduzir (a)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-teal-700 inline-block"></span>
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-600 inline-block"></span>
            <span>Repousar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-600 inline-block"></span>
            <span>Outro Trabalho (b)</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500">
          Clique num bloco para inspecionar os detalhes do período de trabalho
        </div>
      </div>
    </div>
  );
};
