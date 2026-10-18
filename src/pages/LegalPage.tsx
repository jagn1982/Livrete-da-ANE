import React, { useState } from 'react';
import { Scale, ShieldCheck, FileText, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'portaria' | 'rgpd' | 'termos'>('portaria');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5" />
          <span>Conformidade Legal & Regulamentação</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Quadro Jurídico do Trabalho de Condução em Portugal
        </h1>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Informações técnicas e legais sobre a Portaria n.º 7/2022, o Regulamento Geral sobre a Proteção de Dados (RGPD) e termos de utilização do Livrete da ANE.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 justify-center gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('portaria')}
          className={`pb-3 px-2 transition-colors ${
            activeTab === 'portaria'
              ? 'border-b-2 border-amber-500 text-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Portaria n.º 7/2022
        </button>
        <button
          onClick={() => setActiveTab('rgpd')}
          className={`pb-3 px-2 transition-colors ${
            activeTab === 'rgpd'
              ? 'border-b-2 border-amber-500 text-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Privacidade & RGPD
        </button>
        <button
          onClick={() => setActiveTab('termos')}
          className={`pb-3 px-2 transition-colors ${
            activeTab === 'termos'
              ? 'border-b-2 border-amber-500 text-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Termos de Utilização
        </button>
      </div>

      {/* TAB 1: PORTARIA N.º 7/2022 */}
      {activeTab === 'portaria' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Enquadramento da Portaria n.º 7/2022 de 4 de janeiro
              </h3>
              <p className="text-slate-700 mt-1">
                A Portaria n.º 7/2022 regulamenta as condições de publicidade e os procedimentos de registo dos tempos de trabalho e de repouso dos trabalhadores móveis que realizam atividade de condução de veículos ligeiros não abrangidos pelo tacógrafo, incluindo TVDE, Táxis e transporte rodoviário de passageiros e mercadorias.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
              Requisitos Obrigatórios Implementados no Livrete da ANE
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-1.5">
                <span className="font-bold text-slate-900 block">1. Registo das 5 Categorias</span>
                <p>
                  O sistema distingue estritamente: (a) tempo de condução efetiva; (b) tempo de outro trabalho para o mesmo empregador; (c) tempo de trabalho para outro empregador; tempos de disponibilidade; e intervalos de descanso/repouso.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-1.5">
                <span className="font-bold text-slate-900 block">2. Início e Termo da Jornada</span>
                <p>
                  Cada período de trabalho fixa com exatidão a data, hora, localização geográfica comprovada e leitura do odómetro (km inicial e final).
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-1.5">
                <span className="font-bold text-slate-900 block">3. Inviolabilidade e Auditoria</span>
                <p>
                  Os registos originais não são apagados. Qualquer correção posterior requer a indicação obrigatória do motivo e fica averbada no trilho de auditoria do sistema.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-1.5">
                <span className="font-bold text-slate-900 block">4. Retenção Legal de 5 Anos</span>
                <p>
                  A documentação relativa ao registo dos tempos de condução deve ser mantida em arquivo durante cinco anos civis, à disposição das autoridades fiscalizadoras (ACT, IMT, PSP, GNR).
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <p className="text-[11px] text-slate-500 italic">
              Aviso de Isenção: As informações disponibilizadas têm caráter técnico-operacional. Cada operador de transporte deve validar os seus procedimentos com os seus serviços jurídicos ou de segurança no trabalho para garantir total conformidade com a legislação específica aplicável ao seu setor.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: PRIVACIDADE E RGPD */}
      {activeTab === 'rgpd' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 text-xs text-slate-700 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900">
            Política de Privacidade e Proteção de Dados (RGPD)
          </h3>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-900">1. Princípio da Minimização de Dados</h4>
            <p>
              O Livrete da ANE recolhe dados de localização estritamente nos pontos de evento exigidos por lei (início de jornada, mudança de atividade e fim de jornada). O sistema <strong>não realiza rastreamento contínuo em segundo plano</strong> da vida privada do motorista, respeitando as deliberações da CNPD (Comissão Nacional de Proteção de Dados).
            </p>

            <h4 className="font-bold text-slate-900">2. Direitos dos Titulares dos Dados</h4>
            <p>
              Todos os condutores têm direito de acesso, consulta e exportação dos seus dados em formato estruturado (PDF e CSV). O pedido de retificação pode ser exercido na plataforma com salvaguarda do histórico original por imperativo legal.
            </p>

            <h4 className="font-bold text-slate-900">3. Segurança e Encriptação</h4>
            <p>
              Todos os canais de transmissão utilizam cifras TLS 1.3. O acesso aos dados de uma empresa é estritamente isolado através de regras de segurança baseadas em funções (RBAC).
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: TERMOS */}
      {activeTab === 'termos' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 text-xs text-slate-700 leading-relaxed">
          <h3 className="text-base font-bold text-slate-900">Termos Gerais de Utilização do Serviço SaaS</h3>
          <p>
            O serviço Livrete da ANE é disponibilizado como ferramenta de apoio à gestão e registo de trabalho. A exatidão dos dados inseridos (leitura de odómetros, notas de serviço) é da exclusiva responsabilidade do condutor e da empresa utilizadora.
          </p>
          <p>
            É expressamente vedada a utilização do sistema para adulteração de tempos de condução ou registo de falsas declarações perante as entidades reguladoras do setor dos transportes.
          </p>
        </div>
      )}
    </div>
  );
};
