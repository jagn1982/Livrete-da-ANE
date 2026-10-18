import React from 'react';
import {
  Car,
  ShieldCheck,
  Smartphone,
  Building,
  CheckCircle2,
  FileText,
  Clock,
  MapPin,
  FileCheck,
  ChevronRight,
  ArrowRight,
  Scale,
  Award,
} from 'lucide-react';
import { User } from '../types';
import { AppLogoIcon } from '../components/AppLogo';

interface LandingPageProps {
  onQuickLogin: (role: 'independent_driver' | 'fleet_manager' | 'company_driver') => void;
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onQuickLogin, onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION (Estilo Livrete Driver Image 1) */}
      <section className="bg-amber-500 text-slate-950 py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/10 text-slate-950 text-xs font-extrabold uppercase tracking-wider">
                <Scale className="w-4 h-4 text-slate-950" />
                <span>Portaria n.º 7/2022 · Portugal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-950">
                Sistema para registo e publicidade de trabalho de condução
              </h1>

              <p className="text-lg sm:text-xl font-medium text-slate-900 max-w-xl">
                A solução digital completa para condutores independentes, frotas TVDE, Táxis e transportadoras em Portugal. Diga adeus ao livrete em papel.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onQuickLogin('independent_driver')}
                  className="px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-base shadow-xl transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Experimentar como Condutor</span>
                  <ArrowRight className="w-5 h-5 text-amber-400" />
                </button>

                <button
                  onClick={() => onQuickLogin('fleet_manager')}
                  className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-950 font-bold text-base shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <Building className="w-5 h-5 text-amber-600" />
                  <span>Painel de Gestor de Frota</span>
                </button>
              </div>

              {/* Quick Login direct links */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-950 font-semibold">
                <button
                  onClick={() => onQuickLogin('fleet_manager')}
                  className="underline hover:text-white transition-colors"
                >
                  Sou um <strong>gestor</strong> já registado &rarr;
                </button>
                <button
                  onClick={() => onQuickLogin('independent_driver')}
                  className="underline hover:text-white transition-colors"
                >
                  Sou um <strong>condutor</strong> já registado &rarr;
                </button>
              </div>
            </div>

            {/* Mockup / Card Visual */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <AppLogoIcon sizeClass="w-8 h-8" />
                    <div>
                      <div className="font-bold text-sm">Livrete da ANE Driver</div>
                      <div className="text-[10px] text-amber-400">Registo Oficial Certificado</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Ao Vivo
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-800 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-slate-400">Viatura associada:</span>
                    <strong className="text-amber-300 font-mono">CG-52-BC (BYD Atto 3)</strong>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-slate-400">Atividade atual:</span>
                    <strong className="text-emerald-400 font-bold">Conduzir (a)</strong>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-slate-400">Local e Km de Início:</span>
                    <span className="text-slate-200">Belém, Lisboa · 27.518 km</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300">
                  Totalmente preparado para apresentação às autoridades em fiscalização de estrada (PSP, GNR, IMT, ACT).
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTOR COVERAGE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Praticidade e economia para cumprir as obrigações da Portaria n.º 7/2022
          </h2>
          <p className="text-sm text-slate-600">
            Criado especificamente para o quadro regulamentar do transporte rodoviário em Portugal:
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {['Transporte de Carga & Mercadorias', 'Transporte de Passageiros', 'Táxis', 'TVDE (Uber, Bolt)'].map((sect) => (
              <span
                key={sect}
                className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
              >
                • {sect}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-500 pt-3">
            Substitui o uso do Livrete em papel com vantagens operacionais e alinhamento com a legislação em vigor.
          </p>
        </div>
      </section>

      {/* DUAS SOLUÇÕES INTEGRADAS: DRIVER & FLEET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900">A Nossa Solução</h2>
          <p className="text-xs text-slate-500 mt-1">Concebida para a rotina diária no volante e para a gestão rigorosa no escritório</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Driver */}
          <div className="bg-amber-500 rounded-3xl p-8 text-slate-950 shadow-lg space-y-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-bold mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Livrete da ANE DRIVER</h3>
              <p className="text-xs font-semibold text-slate-900 mt-1">
                Para motoristas independentes e condutores ao serviço de empresas
              </p>

              <ul className="mt-6 space-y-2.5 text-xs font-medium text-slate-950">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-slate-950" />
                  <span>Registo de atividades ao segundo (Condução, Pausa, Disponibilidade, Outro Serviço)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-slate-950" />
                  <span>Aplicação web mobile-first otimizada para smartphones (iOS e Android)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-slate-950" />
                  <span>Registo de local de início e fim por geolocalização e odómetro com precisão</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-slate-950" />
                  <span>Geração imediata da folha semanal do condutor em formato oficial</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-slate-950" />
                  <span>Modo offline com sincronização automática quando a rede é restabelecida</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onQuickLogin('independent_driver')}
              className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs transition-colors"
            >
              Aceder ao Módulo do Condutor
            </button>
          </div>

          {/* Card Fleet */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-lg space-y-6 flex flex-col justify-between border border-slate-800">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold mb-4">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight">Livrete da ANE FLEET</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                Para gestores de frota, operadores TVDE, cooperativas de táxi e transportadoras
              </p>

              <ul className="mt-6 space-y-2.5 text-xs font-medium text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>Painel central com monitorização de motoristas e viaturas em tempo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>Gestão de matrículas, quilometragens e atribuições sem perda de histórico</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>Organização das viaturas e condutores por frotas ou polos regionais</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>Emissão de relatórios individuais e coletivos para contabilidade e ACT</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>Trilho inalterável de auditoria com conservação digital de 5 anos</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onQuickLogin('fleet_manager')}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Aceder ao Painel de Frota
            </button>
          </div>
        </div>
      </section>

      {/* O QUE DIZ A LEI (PORTARIA N.º 7/2022) */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">O que diz a lei?</h2>
            <p className="text-xs text-slate-400">
              Conheça os pontos fundamentais da Portaria n.º 7/2022 e evite autos e contraordenações
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <span className="font-bold text-amber-400 text-sm block">1. 5 Atividades Obrigatórias</span>
              <p className="text-slate-300 leading-relaxed">
                Registo contínuo de: Condução (a), Repouso, Disponibilidade, Outro serviço para o mesmo empregador (b) e Serviço para outro empregador (c).
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <span className="font-bold text-amber-400 text-sm block">2. Identificação Inequívoca</span>
              <p className="text-slate-300 leading-relaxed">
                Identificação do empregador, condutor, viatura (matrícula) e identificação do sistema emissor certificado em cada folha de registo.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <span className="font-bold text-amber-400 text-sm block">3. Conservação de 5 Anos</span>
              <p className="text-slate-300 leading-relaxed">
                A lei exige que os registos sejam conservados durante 5 anos e apresentados de imediato às entidades fiscalizadoras (PSP, GNR, IMT, ACT).
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <span className="font-bold text-amber-400 text-sm block">4. Odómetro e Localização</span>
              <p className="text-slate-300 leading-relaxed">
                Registo rigoroso da leitura do odómetro (km inicial e final) e local de início e termo do trabalho de condução.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <span className="font-bold text-amber-400 text-sm block">5. Integridade e Auditoria</span>
              <p className="text-slate-300 leading-relaxed">
                Garantia de que alterações posteriores não apagam o registo original e exigem justificação explícita do motivo.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-2">
              <span className="font-bold text-amber-400 text-sm block">6. Folhas Semanais</span>
              <p className="text-slate-300 leading-relaxed">
                Emissão de relatórios semanais com somatório total de horas de trabalho e repouso, assinados digitalmente pelas partes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANOS E PREÇOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Planos Transparentes</h2>
          <p className="text-xs text-slate-500">
            Sem fidelização e com valores acessíveis para condutores em nome individual ou grandes frotas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-500 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                Mais Popular
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Condutor Independente</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">€ 24,00</span>
                <span className="text-xs text-slate-500 font-medium">/ ano + IVA</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Para TVDE a recibos verdes ou táxis em nome individual.</p>

              <ul className="mt-6 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">✓ 1 Conta de condutor</li>
                <li className="flex items-center gap-2">✓ 1 Viatura associada</li>
                <li className="flex items-center gap-2">✓ Relatórios PDF oficiais</li>
                <li className="flex items-center gap-2">✓ Sem fidelização</li>
              </ul>
            </div>

            <button
              onClick={() => onQuickLogin('independent_driver')}
              className="mt-6 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Subscrever
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Operador Starter</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">€ 24,00</span>
                <span className="text-xs text-slate-500 font-medium">/ condutor / ano + IVA</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Para pequenas frotas até 5 condutores e viaturas.</p>

              <ul className="mt-6 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">✓ Até 5 condutores</li>
                <li className="flex items-center gap-2">✓ Substituição gratuita</li>
                <li className="flex items-center gap-2">✓ Painel de gestão de frota</li>
                <li className="flex items-center gap-2">✓ Exportação em lote</li>
              </ul>
            </div>

            <button
              onClick={() => onQuickLogin('fleet_manager')}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Criar Empresa
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Frota Pro</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">€ 22,00</span>
                <span className="text-xs text-slate-500 font-medium">/ condutor / ano + IVA</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Frotas até 30 viaturas com gestão por equipas.</p>

              <ul className="mt-6 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">✓ Até 30 viaturas</li>
                <li className="flex items-center gap-2">✓ Gestão de frotas regionais</li>
                <li className="flex items-center gap-2">✓ Alertas de odómetro</li>
                <li className="flex items-center gap-2">✓ Suporte telefónico PT</li>
              </ul>
            </div>

            <button
              onClick={() => onQuickLogin('fleet_manager')}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Falar com Consultor
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Enterprise</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">Sob Medida</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Grandes operadores e transportadoras de passageiros e carga.</p>

              <ul className="mt-6 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">✓ Condutores ilimitados</li>
                <li className="flex items-center gap-2">✓ API REST para ERPs</li>
                <li className="flex items-center gap-2">✓ Apoio jurídico especializado</li>
                <li className="flex items-center gap-2">✓ Retenção alargada</li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('legal')}
              className="mt-6 w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs"
            >
              Consultar Condições
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
