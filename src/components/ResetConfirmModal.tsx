import React from 'react';
import { X, Trash2, RotateCcw, RefreshCw, AlertTriangle } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClearAll: () => void;
  onConfirmRestoreDemo?: () => void;
  title?: string;
  driverName?: string;
  description?: string;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmClearAll,
  onConfirmRestoreDemo,
  title = 'Zerar Registos de Trabalho',
  driverName,
  description,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white tracking-tight">{title}</h3>
              {driverName && (
                <p className="text-[11px] text-slate-400 font-medium">Condutor: {driverName}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span>
                {description ||
                  'Esta ação vai eliminar o histórico de jornadas e turnos ativos, deixando todos os contadores a 0.'}
              </span>
            </div>
          </div>

          {/* Opção 1: Zerar Tudo (0 Registos) */}
          <div className="p-4 rounded-2xl border-2 border-rose-200 bg-rose-50/40 hover:bg-rose-50/70 transition-colors space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-600" />
                Zerar Todos os Registos (Histórico a 0)
              </span>
              <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                0 Registos
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Elimina todas as jornadas abertas, turnos em curso e registos de atividades. O sistema
              fica totalmente limpo e pronto para iniciar novos registos do zero.
            </p>
            <button
              type="button"
              onClick={() => {
                onConfirmClearAll();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Confirmar e Zerar Registos (0)</span>
            </button>
          </div>

          {/* Opção 2: Restaurar Dados Demo */}
          {onConfirmRestoreDemo && (
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                  Restaurar Demonstração Inicial
                </span>
                <span className="text-[10px] font-semibold text-slate-500">Seed Portugal</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Repõe os dados de exemplo de Portugal (TVDE BYD, Táxi Mercedes, Lisboa) para testar
                os relatórios e a grelha semanal da Portaria 7/2022.
              </p>
              <button
                type="button"
                onClick={() => {
                  onConfirmRestoreDemo();
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-xl border border-slate-300 hover:bg-white active:scale-[0.98] text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Restaurar Dados Demo Originais</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
