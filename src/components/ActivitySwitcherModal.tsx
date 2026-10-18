import React, { useState } from 'react';
import { X, Play, Clock, Coffee, Briefcase, Car, AlertCircle } from 'lucide-react';
import { ActivityType } from '../types';

interface ActivitySwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentActivityType: ActivityType;
  onSelectActivity: (type: ActivityType, notes?: string) => void;
}

const ACTIVITIES_LIST: {
  type: ActivityType;
  label: string;
  categoryCode: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}[] = [
  {
    type: 'driving',
    label: 'Conduzir',
    categoryCode: '(a)',
    description: 'Tempo ao volante em condução efetiva do veículo.',
    icon: <Car className="w-5 h-5" />,
    colorClass: 'border-emerald-500 bg-emerald-50 text-emerald-900 hover:bg-emerald-100',
  },
  {
    type: 'resting',
    label: 'Repousar / Pausa',
    categoryCode: '',
    description: 'Pausa legal de descanso, refeição ou tempo de repouso.',
    icon: <Coffee className="w-5 h-5" />,
    colorClass: 'border-blue-500 bg-blue-50 text-blue-900 hover:bg-blue-100',
  },
  {
    type: 'availability',
    label: 'Disponível',
    categoryCode: '',
    description: 'À espera de clientes, chamadas TVDE/Táxi ou ordens de serviço.',
    icon: <Clock className="w-5 h-5" />,
    colorClass: 'border-teal-500 bg-teal-50 text-teal-900 hover:bg-teal-100',
  },
  {
    type: 'other_work_same',
    label: 'Outro Trabalho (Mesmo Empregador)',
    categoryCode: '(b)',
    description: 'Limpeza, manutenção, abastecimento, carga ou tarefas administrativas.',
    icon: <Briefcase className="w-5 h-5" />,
    colorClass: 'border-amber-500 bg-amber-50 text-amber-900 hover:bg-amber-100',
  },
  {
    type: 'other_work_other',
    label: 'Outro Emprego / Serviço Externo',
    categoryCode: '(c)',
    description: 'Trabalho realizado para outra entidade empregadora ou por conta própria.',
    icon: <AlertCircle className="w-5 h-5" />,
    colorClass: 'border-purple-500 bg-purple-50 text-purple-900 hover:bg-purple-100',
  },
];

export const ActivitySwitcherModal: React.FC<ActivitySwitcherModalProps> = ({
  isOpen,
  onClose,
  currentActivityType,
  onSelectActivity,
}) => {
  const [selectedType, setSelectedType] = useState<ActivityType>(currentActivityType);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectActivity(selectedType, notes.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between font-bold">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold">Alterar Estado de Atividade</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 transition-colors text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Conforme a Portaria n.º 7/2022, qualquer transição entre condução, pausa e outros
            trabalhos deve ser registada no momento exato:
          </p>

          <div className="space-y-2">
            {ACTIVITIES_LIST.map((act) => {
              const isCurrent = currentActivityType === act.type;
              const isSelected = selectedType === act.type;
              return (
                <button
                  key={act.type}
                  type="button"
                  onClick={() => setSelectedType(act.type)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-2 border-amber-500 bg-amber-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${act.colorClass} shrink-0`}>
                    {act.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">
                        {act.label} {act.categoryCode && <span className="text-amber-600 font-extrabold">{act.categoryCode}</span>}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Atual
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{act.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Observações (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Abastecimento de combustível, paragem para refeição..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Registar Mudança</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
