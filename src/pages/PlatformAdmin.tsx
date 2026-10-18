import React, { useState, useEffect } from 'react';
import { Shield, Building, Users, Car, Database, Activity, RefreshCw } from 'lucide-react';
import { storage } from '../services/storage';
import { Company, User, Vehicle, PlanConfig } from '../types';
import { ResetConfirmModal } from '../components/ResetConfirmModal';

export const PlatformAdmin: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [showResetModal, setShowResetModal] = useState(false);

  const loadData = () => {
    setCompanies(storage.getCompanies());
    setUsers(storage.getUsers());
    setVehicles(storage.getVehicles());
    setPlans(storage.getPlans());
  };

  useEffect(() => {
    loadData();
    const handleDataChange = () => loadData();
    window.addEventListener('jornadapro-data-changed', handleDataChange);
    return () => {
      window.removeEventListener('jornadapro-data-changed', handleDataChange);
    };
  }, []);

  const handleClearAll = () => {
    storage.clearAllJourneys();
    window.dispatchEvent(new CustomEvent('jornadapro-data-changed'));
    loadData();
    setShowResetModal(false);
  };

  const handleRestoreDemo = () => {
    storage.resetDemoData();
    window.dispatchEvent(new CustomEvent('jornadapro-data-changed'));
    loadData();
    setShowResetModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Supervisão Global do Sistema</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Consola de Administração da Plataforma
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de operadores, planos de subscrição, limites de condutores e auditoria de segurança.
          </p>
        </div>

        <button
          onClick={() => setShowResetModal(true)}
          className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Repor / Zerar Dados</span>
        </button>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Empresas Registadas
          </span>
          <span className="text-2xl font-black text-slate-900 tabular-nums block mt-2">
            {companies.length}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            Todas ativas e licenciadas
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Utilizadores Totais
          </span>
          <span className="text-2xl font-black text-slate-900 tabular-nums block mt-2">
            {users.length}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {users.filter((u) => u.role.includes('driver')).length} condutores registados
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Viaturas em Sistema
          </span>
          <span className="text-2xl font-black text-slate-900 tabular-nums block mt-2">
            {vehicles.length}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            TVDE, Táxis e Mercadorias
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Retenção Legal (5 Anos)
          </span>
          <span className="text-2xl font-black text-emerald-700 tabular-nums block mt-2">
            Ativa
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Portaria n.º 7/2022
          </span>
        </div>
      </div>

      {/* Tabela de Empresas Clientes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Empresas e Operadores TVDE / Frota</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Nome da Empresa</th>
                <th className="py-2.5 px-4">NIF</th>
                <th className="py-2.5 px-4">Contacto</th>
                <th className="py-2.5 px-4">Plano Ativo</th>
                <th className="py-2.5 px-4">Limite Condutores</th>
                <th className="py-2.5 px-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-700">{c.nif}</td>
                  <td className="py-3 px-4 text-slate-600">{c.contactEmail}</td>
                  <td className="py-3 px-4 uppercase font-semibold text-slate-800">{c.plan}</td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-700">{c.maxDrivers} condutores</td>
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

      <ResetConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirmClearAll={handleClearAll}
        onConfirmRestoreDemo={handleRestoreDemo}
        title="Gestão de Dados do Sistema"
      />
    </div>
  );
};
