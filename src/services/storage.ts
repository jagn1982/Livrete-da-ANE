/**
 * Livrete da ANE - Data Persistence & Audit Trail Service
 * Armazenamento persistente local com controlo de auditoria e conformidade Portaria n.º 7/2022
 */

import {
  User,
  Company,
  Vehicle,
  Journey,
  ActivityEvent,
  AuditEvent,
  SyncQueueItem,
  PlanConfig,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'jornadapro_users_v1',
  COMPANIES: 'jornadapro_companies_v1',
  VEHICLES: 'jornadapro_vehicles_v1',
  JOURNEYS: 'jornadapro_journeys_v1',
  ACTIVITIES: 'jornadapro_activities_v1',
  AUDIT_LOGS: 'jornadapro_audit_logs_v1',
  SYNC_QUEUE: 'jornadapro_sync_queue_v1',
  CURRENT_USER: 'jornadapro_current_user_v1',
  SYSTEM_PLANS: 'jornadapro_plans_v1',
};

// Seed inicial com dados realistas portugueses (como no print da Livrete: CG-52-BC BYD Atto 3, Belém, Lisboa, etc.)
const INITIAL_USERS: User[] = [
  {
    id: 'usr_condutor_indep',
    name: 'Carlos Alberto Ferreira',
    email: 'carlos.ferreira@motorista.pt',
    role: 'independent_driver',
    phone: '+351 912 345 678',
    nif: '245678910',
    driverLicenseNumber: 'L-1428570',
    activeVehicleId: 'veh_byd_atto3',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'usr_condutor_frota_1',
    name: 'Rui Manuel Santos',
    email: 'rui.santos@transul.pt',
    role: 'company_driver',
    phone: '+351 923 456 789',
    nif: '234567891',
    driverLicenseNumber: 'L-2983411',
    companyId: 'comp_transul',
    companyName: 'Transul Mobilidade Urbana Lda',
    activeVehicleId: 'veh_mercedes_e220',
    createdAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'usr_condutor_frota_2',
    name: 'Ana Sofia Rodrigues',
    email: 'ana.rodrigues@transul.pt',
    role: 'company_driver',
    phone: '+351 934 567 890',
    nif: '256789012',
    driverLicenseNumber: 'L-3312984',
    companyId: 'comp_transul',
    companyName: 'Transul Mobilidade Urbana Lda',
    activeVehicleId: 'veh_byd_seal',
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'usr_gestor_frota',
    name: 'João Pedro Mendonça',
    email: 'gestao@transul.pt',
    role: 'fleet_manager',
    phone: '+351 961 234 567',
    nif: '198765432',
    companyId: 'comp_transul',
    companyName: 'Transul Mobilidade Urbana Lda',
    createdAt: '2025-11-20T11:00:00Z',
  },
  {
    id: 'usr_admin_plataforma',
    name: 'Administrador Livrete da ANE',
    email: 'admin@livrete-ane.pt',
    role: 'platform_admin',
    createdAt: '2025-10-01T00:00:00Z',
  },
];

const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp_transul',
    name: 'Transul Mobilidade Urbana Lda',
    nif: '516802569',
    address: 'Avenida da Liberdade 245, 4º Andar, 1250-143 Lisboa',
    contactEmail: 'geral@transul.pt',
    contactPhone: '+351 213 456 789',
    plan: 'fleet_pro',
    maxDrivers: 25,
    maxVehicles: 30,
    createdAt: '2025-11-20T10:00:00Z',
    legalRepresentative: 'João Pedro Mendonça',
    status: 'active',
  },
  {
    id: 'comp_norte_cargas',
    name: 'Norte Express Transportes Rodoviários Lda',
    nif: '509876543',
    address: 'Zona Industrial da Maia, Setor X, 4470-000 Maia',
    contactEmail: 'operacoes@norteexpress.pt',
    contactPhone: '+351 229 876 543',
    plan: 'fleet_starter',
    maxDrivers: 8,
    maxVehicles: 8,
    createdAt: '2026-01-05T09:00:00Z',
    legalRepresentative: 'Mário Jorge Costa',
    status: 'active',
  },
];

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh_byd_atto3',
    plate: 'CG-52-BC',
    brand: 'BYD',
    model: 'Atto 3 Electric',
    year: 2024,
    category: 'tvde',
    internalCode: 'TVDE-01',
    companyId: '', // Condutor independente
    assignedDriverIds: ['usr_condutor_indep'],
    currentKm: 27666,
    status: 'active',
    createdAt: '2026-01-10T08:30:00Z',
  },
  {
    id: 'veh_mercedes_e220',
    plate: '98-TX-12',
    brand: 'Mercedes-Benz',
    model: 'E220d Station Taxi',
    year: 2023,
    category: 'taxi',
    internalCode: 'TX-04',
    companyId: 'comp_transul',
    assignedDriverIds: ['usr_condutor_frota_1'],
    currentKm: 142380,
    status: 'active',
    createdAt: '2025-11-21T09:00:00Z',
  },
  {
    id: 'veh_byd_seal',
    plate: 'AA-44-BC',
    brand: 'BYD',
    model: 'Seal Excellence EV',
    year: 2024,
    category: 'tvde',
    internalCode: 'TVDE-02',
    companyId: 'comp_transul',
    assignedDriverIds: ['usr_condutor_frota_2'],
    currentKm: 34120,
    status: 'active',
    createdAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'veh_iveco_daily',
    plate: '72-ZH-91',
    brand: 'Iveco',
    model: 'Daily 35S15 Furgão',
    year: 2022,
    category: 'mercadorias',
    internalCode: 'CRG-01',
    companyId: 'comp_norte_cargas',
    assignedDriverIds: [],
    currentKm: 189500,
    status: 'active',
    createdAt: '2026-01-05T09:30:00Z',
  },
];

export const INITIAL_PLANS: PlanConfig[] = [
  {
    id: 'independent',
    name: 'Condutor Independente',
    pricePerYear: 24.0,
    vatRate: 23,
    description: 'Ideal para condutores em nome individual, emissor de Recibo Verde, TVDE e Táxi.',
    features: [
      '1 Conta de Condutor autorizada',
      '1 Viatura associada',
      'Registo digital de início e fim de jornada com geolocalização',
      'Registo das 5 atividades legais (Portaria 7/2022)',
      'Folha semanal do condutor em PDF e CSV',
      'Histórico auditável e retenção legal',
      'Modo offline resiliente com sincronização automática',
      'Sem fidelização',
    ],
    maxDrivers: 1,
    maxVehicles: 1,
    isPopular: true,
  },
  {
    id: 'fleet_starter',
    name: 'Operador Empresa Starter',
    pricePerYear: 24.0,
    vatRate: 23,
    description: 'Por condutor/ano. Para pequenas empresas de transporte e frotas de TVDE/Táxi.',
    features: [
      'Até 5 condutores e 5 viaturas',
      'Painel de gestão de frota em tempo real',
      'Substituição gratuita de condutores e viaturas',
      'Monitorização de jornadas abertas e alertas de km',
      'Relatórios individuais e consolidados da empresa',
      'Exportação para fiscalização (PDF/CSV)',
      'Backup automático e histórico inalterável',
    ],
    maxDrivers: 5,
    maxVehicles: 5,
  },
  {
    id: 'fleet_pro',
    name: 'Operador Empresa Frota Pro',
    pricePerYear: 22.0,
    vatRate: 23,
    description: 'Por condutor/ano. Para frotas médias com organização por equipas e veículos.',
    features: [
      'Até 30 condutores e viaturas',
      'Organização de viaturas por frotas regionais',
      'Gestão de convites e permissões multi-utilizador',
      'Painel avançado com estatísticas de condução (a)+(b)+(c)',
      'Auditoria completa de alterações com registo de motivos',
      'Suporte prioritário via WhatsApp e Telefone em Portugal',
    ],
    maxDrivers: 30,
    maxVehicles: 30,
  },
  {
    id: 'fleet_enterprise',
    name: 'Enterprise / Transportadoras',
    pricePerYear: 19.0,
    vatRate: 23,
    description: 'Para operadores com grandes frotas e integração API com sistemas de faturação.',
    features: [
      'Condutores e viaturas ilimitados',
      'API de integração para ERPs e sistemas de recursos humanos',
      'Apoio jurídico especializado na Portaria n.º 7/2022',
      'SLA de 99.9% e gestor de conta dedicado em Portugal',
      'Retenção extensiva e relatórios fiscais personalizados',
    ],
    maxDrivers: 999,
    maxVehicles: 999,
  },
];

// Seed inicial de jornadas para o condutor independente (baseado nos screenshots do usuário)
const INITIAL_JOURNEYS: Journey[] = [
  {
    id: 'jrn_2026_10_15_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    vehicleModel: 'BYD Atto 3',
    date: '2026-10-15',
    status: 'completed',
    isClosed: true,
    syncStatus: 'synced',
    start: {
      timestamp: '2026-10-15T03:53:00Z',
      time: '03:53',
      km: 27518,
      locationName: 'Belém, Lisboa',
      lat: 38.6979,
      lng: -9.2065,
      accuracy: 12,
    },
    end: {
      timestamp: '2026-10-15T12:35:00Z',
      time: '12:35',
      km: 27666,
      locationName: 'Belém, Lisboa',
      lat: 38.6982,
      lng: -9.2071,
      accuracy: 15,
    },
    totalKm: 148,
    breakdown: {
      drivingMinutes: 406,       // 06:46
      restingMinutes: 1003,      // 16:43 (inclui repouso fora e dentro de turno)
      availabilityMinutes: 31,   // 00:31
      otherWorkSameMinutes: 0,
      otherWorkOtherMinutes: 0,
      totalWorkMinutes: 406,
    },
    createdAt: '2026-10-15T03:53:00Z',
    updatedAt: '2026-10-15T12:35:00Z',
  },
  {
    id: 'jrn_2026_10_14_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    vehicleModel: 'BYD Atto 3',
    date: '2026-10-14',
    status: 'completed',
    isClosed: true,
    syncStatus: 'synced',
    start: {
      timestamp: '2026-10-14T04:10:00Z',
      time: '04:10',
      km: 27432,
      locationName: 'Algés, Oeiras',
      lat: 38.7001,
      lng: -9.2312,
      accuracy: 14,
    },
    end: {
      timestamp: '2026-10-14T11:20:00Z',
      time: '11:20',
      km: 27510,
      locationName: 'Parque das Nações, Lisboa',
      lat: 38.7675,
      lng: -9.0963,
      accuracy: 18,
    },
    totalKm: 78,
    breakdown: {
      drivingMinutes: 360,
      restingMinutes: 1020,
      availabilityMinutes: 60,
      otherWorkSameMinutes: 0,
      otherWorkOtherMinutes: 0,
      totalWorkMinutes: 360,
    },
    reviewNotes: 'Parei de trabalhar ontem mais cedo por manutenção programada do veículo.',
    createdAt: '2026-10-14T04:10:00Z',
    updatedAt: '2026-10-14T11:20:00Z',
  },
  {
    id: 'jrn_2026_10_17_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    vehicleModel: 'BYD Atto 3',
    date: '2026-10-17',
    status: 'in_progress',
    isClosed: false,
    syncStatus: 'synced',
    start: {
      timestamp: '2026-10-17T06:00:00Z',
      time: '06:00',
      km: 27666,
      locationName: 'Belém, Lisboa',
      lat: 38.6979,
      lng: -9.2065,
      accuracy: 10,
    },
    breakdown: {
      drivingMinutes: 187,       // 03:07
      restingMinutes: 45,        // 00:45
      availabilityMinutes: 65,   // 01:05
      otherWorkSameMinutes: 0,
      otherWorkOtherMinutes: 0,
      totalWorkMinutes: 187,
    },
    createdAt: '2026-10-17T06:00:00Z',
    updatedAt: '2026-10-17T09:57:00Z',
  },
];

const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act_1015_01',
    journeyId: 'jrn_2026_10_15_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    type: 'resting',
    startTime: '2026-10-15T00:00:00Z',
    endTime: '2026-10-15T03:56:00Z',
    durationMinutes: 236,
    locationName: 'Belém, Lisboa',
    recordedAt: '2026-10-15T00:00:00Z',
    syncStatus: 'synced',
  },
  {
    id: 'act_1015_02',
    journeyId: 'jrn_2026_10_15_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    type: 'availability',
    startTime: '2026-10-15T03:56:00Z',
    endTime: '2026-10-15T03:58:00Z',
    durationMinutes: 2,
    locationName: 'Belém, Lisboa',
    recordedAt: '2026-10-15T03:56:00Z',
    syncStatus: 'synced',
  },
  {
    id: 'act_1015_03',
    journeyId: 'jrn_2026_10_15_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    type: 'driving',
    startTime: '2026-10-15T03:58:00Z',
    endTime: '2026-10-15T04:50:00Z',
    durationMinutes: 52,
    locationName: 'Lisboa Centro',
    recordedAt: '2026-10-15T03:58:00Z',
    syncStatus: 'synced',
  },
  {
    id: 'act_1015_04',
    journeyId: 'jrn_2026_10_15_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    type: 'resting',
    startTime: '2026-10-15T04:50:00Z',
    endTime: '2026-10-15T05:10:00Z',
    durationMinutes: 20,
    locationName: 'Área de Serviço A5 Oeiras',
    recordedAt: '2026-10-15T04:50:00Z',
    syncStatus: 'synced',
  },
  {
    id: 'act_1015_05',
    journeyId: 'jrn_2026_10_15_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    type: 'driving',
    startTime: '2026-10-15T05:10:00Z',
    endTime: '2026-10-15T07:20:00Z',
    durationMinutes: 130,
    locationName: 'Lisboa - Cascais',
    recordedAt: '2026-10-15T05:10:00Z',
    syncStatus: 'synced',
  },
  {
    id: 'act_1015_06',
    journeyId: 'jrn_2026_10_15_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    type: 'resting',
    startTime: '2026-10-15T07:20:00Z',
    endTime: '2026-10-15T07:59:00Z',
    durationMinutes: 39,
    locationName: 'Cascais Shopping',
    recordedAt: '2026-10-15T07:20:00Z',
    syncStatus: 'synced',
  },
  {
    id: 'act_1015_07',
    journeyId: 'jrn_2026_10_15_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    type: 'driving',
    startTime: '2026-10-15T07:59:00Z',
    endTime: '2026-10-15T10:07:00Z',
    durationMinutes: 128,
    locationName: 'Cascais - Lisboa Aeroporto',
    recordedAt: '2026-10-15T07:59:00Z',
    syncStatus: 'synced',
  },
  {
    id: 'act_1015_08',
    journeyId: 'jrn_2026_10_15_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    type: 'availability',
    startTime: '2026-10-15T10:07:00Z',
    endTime: '2026-10-15T10:35:00Z',
    durationMinutes: 28,
    locationName: 'Aeroporto Humberto Delgado, T1',
    recordedAt: '2026-10-15T10:07:00Z',
    syncStatus: 'synced',
  },
  {
    id: 'act_1015_09',
    journeyId: 'jrn_2026_10_15_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    type: 'driving',
    startTime: '2026-10-15T10:35:00Z',
    endTime: '2026-10-15T12:11:00Z',
    durationMinutes: 96,
    locationName: 'Lisboa - Belém',
    recordedAt: '2026-10-15T10:35:00Z',
    syncStatus: 'synced',
  },
  {
    id: 'act_1015_10',
    journeyId: 'jrn_2026_10_15_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    type: 'resting',
    startTime: '2026-10-15T12:11:00Z',
    endTime: '2026-10-15T23:59:00Z',
    durationMinutes: 708,
    locationName: 'Belém, Lisboa',
    recordedAt: '2026-10-15T12:11:00Z',
    syncStatus: 'synced',
  },
  // Atividades do dia em curso (17/10/2026)
  {
    id: 'act_1017_01',
    journeyId: 'jrn_2026_10_17_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    type: 'availability',
    startTime: '2026-10-17T06:00:00Z',
    endTime: '2026-10-17T06:20:00Z',
    durationMinutes: 20,
    locationName: 'Belém, Lisboa',
    recordedAt: '2026-10-17T06:00:00Z',
    syncStatus: 'synced',
  },
  {
    id: 'act_1017_02',
    journeyId: 'jrn_2026_10_17_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    type: 'driving',
    startTime: '2026-10-17T06:20:00Z',
    endTime: '2026-10-17T09:27:00Z',
    durationMinutes: 187,
    locationName: 'Lisboa Metropolitana',
    recordedAt: '2026-10-17T06:20:00Z',
    syncStatus: 'synced',
  },
  {
    id: 'act_1017_03',
    journeyId: 'jrn_2026_10_17_01',
    driverId: 'usr_condutor_indep',
    driverName: 'Carlos Alberto Ferreira',
    vehicleId: 'veh_byd_atto3',
    vehiclePlate: 'CG-52-BC',
    type: 'availability',
    startTime: '2026-10-17T09:27:00Z',
    locationName: 'Gare do Oriente, Lisboa',
    recordedAt: '2026-10-17T09:27:00Z',
    syncStatus: 'synced',
  },
];

const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud_001',
    timestamp: '2026-10-15T03:53:00Z',
    entityType: 'journey',
    entityId: 'jrn_2026_10_15_01',
    action: 'create',
    performedByUserId: 'usr_condutor_indep',
    performedByUserName: 'Carlos Alberto Ferreira',
    userRole: 'independent_driver',
    description: 'Início de período de trabalho registado com km 27518 em Belém, Lisboa',
    source: 'web_driver',
  },
  {
    id: 'aud_002',
    timestamp: '2026-10-15T12:35:00Z',
    entityType: 'journey',
    entityId: 'jrn_2026_10_15_01',
    action: 'close',
    performedByUserId: 'usr_condutor_indep',
    performedByUserName: 'Carlos Alberto Ferreira',
    userRole: 'independent_driver',
    description: 'Encerramento de jornada registado com km 27666 (Distância: 148 km)',
    source: 'web_driver',
  },
  {
    id: 'aud_003',
    timestamp: '2026-10-17T06:00:00Z',
    entityType: 'journey',
    entityId: 'jrn_2026_10_17_01',
    action: 'create',
    performedByUserId: 'usr_condutor_indep',
    performedByUserName: 'Carlos Alberto Ferreira',
    userRole: 'independent_driver',
    description: 'Início de período de trabalho registado com km 27666 em Belém, Lisboa',
    source: 'web_driver',
  },
];

class StorageService {
  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.save(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMPANIES)) {
      this.save(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
      this.save(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.JOURNEYS)) {
      this.save(STORAGE_KEYS.JOURNEYS, INITIAL_JOURNEYS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
      this.save(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      this.save(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE)) {
      this.save(STORAGE_KEYS.SYNC_QUEUE, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SYSTEM_PLANS)) {
      this.save(STORAGE_KEYS.SYSTEM_PLANS, INITIAL_PLANS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Por padrão entra com o condutor independente para demonstração imediata do app do motorista
      this.save(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
    }
  }

  private get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Erro ao guardar no localStorage:', e);
    }
  }

  // Current User Session
  getCurrentUser(): User | null {
    return this.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  setCurrentUser(user: User | null): void {
    this.save(STORAGE_KEYS.CURRENT_USER, user);
  }

  // Users
  getUsers(): User[] {
    return this.get<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    this.save(STORAGE_KEYS.USERS, users);
  }

  // Companies
  getCompanies(): Company[] {
    return this.get<Company[]>(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
  }

  getCompanyById(id: string): Company | undefined {
    return this.getCompanies().find((c) => c.id === id);
  }

  saveCompany(company: Company): void {
    const companies = this.getCompanies();
    const idx = companies.findIndex((c) => c.id === company.id);
    if (idx >= 0) {
      companies[idx] = company;
    } else {
      companies.push(company);
    }
    this.save(STORAGE_KEYS.COMPANIES, companies);
  }

  // Vehicles
  getVehicles(companyId?: string): Vehicle[] {
    const list = this.get<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    if (companyId === undefined) return list;
    if (companyId === '') {
      // Independent drivers
      return list.filter((v) => !v.companyId || v.companyId === '');
    }
    return list.filter((v) => v.companyId === companyId);
  }

  getVehicleById(id: string): Vehicle | undefined {
    return this.getVehicles().find((v) => v.id === id);
  }

  saveVehicle(vehicle: Vehicle): void {
    const list = this.getVehicles();
    const idx = list.findIndex((v) => v.id === vehicle.id);
    if (idx >= 0) {
      list[idx] = vehicle;
    } else {
      list.push(vehicle);
    }
    this.save(STORAGE_KEYS.VEHICLES, list);
  }

  // Journeys
  getJourneys(driverId?: string, companyId?: string): Journey[] {
    const list = this.get<Journey[]>(STORAGE_KEYS.JOURNEYS, INITIAL_JOURNEYS);
    let filtered = list;
    if (driverId) {
      filtered = filtered.filter((j) => j.driverId === driverId);
    }
    if (companyId) {
      filtered = filtered.filter((j) => j.companyId === companyId);
    }
    // Sort descending by date & start time
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getJourneyById(id: string): Journey | undefined {
    return this.get<Journey[]>(STORAGE_KEYS.JOURNEYS, []).find((j) => j.id === id);
  }

  getActiveJourney(driverId: string): Journey | undefined {
    return this.getJourneys(driverId).find((j) => !j.isClosed && j.status === 'in_progress');
  }

  saveJourney(journey: Journey, performedBy: User, auditReason?: string): void {
    const list = this.get<Journey[]>(STORAGE_KEYS.JOURNEYS, INITIAL_JOURNEYS);
    const idx = list.findIndex((j) => j.id === journey.id);
    const isNew = idx < 0;

    if (isNew) {
      list.unshift(journey);
    } else {
      list[idx] = journey;
    }
    this.save(STORAGE_KEYS.JOURNEYS, list);

    // Update vehicle odometer if closed
    if (journey.end && journey.end.km > 0) {
      const vehicle = this.getVehicleById(journey.vehicleId);
      if (vehicle && journey.end.km > vehicle.currentKm) {
        vehicle.currentKm = journey.end.km;
        this.saveVehicle(vehicle);
      }
    }

    // Registo de auditoria obrigatório
    this.addAuditLog({
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      entityType: 'journey',
      entityId: journey.id,
      action: isNew ? 'create' : journey.isClosed ? 'close' : 'update',
      performedByUserId: performedBy.id,
      performedByUserName: performedBy.name,
      userRole: performedBy.role,
      description: isNew
        ? `Início de período de trabalho registado para a viatura ${journey.vehiclePlate} (${journey.start.km} km em ${journey.start.locationName})`
        : journey.isClosed
        ? `Encerramento de jornada registado para a viatura ${journey.vehiclePlate} (${journey.end?.km} km, Total: ${journey.totalKm} km)`
        : `Atualização de período de trabalho ${journey.id}`,
      reason: auditReason,
      source: performedBy.role === 'fleet_manager' ? 'web_fleet' : 'web_driver',
    });
  }

  // Activities
  getActivities(journeyId?: string): ActivityEvent[] {
    const list = this.get<ActivityEvent[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    if (!journeyId) return list;
    return list
      .filter((a) => a.journeyId === journeyId)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  saveActivity(activity: ActivityEvent): void {
    const list = this.get<ActivityEvent[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    const idx = list.findIndex((a) => a.id === activity.id);
    if (idx >= 0) {
      list[idx] = activity;
    } else {
      list.push(activity);
    }
    this.save(STORAGE_KEYS.ACTIVITIES, list);
  }

  // Audit Logs
  getAuditLogs(): AuditEvent[] {
    return this.get<AuditEvent[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  addAuditLog(entry: AuditEvent): void {
    const list = this.getAuditLogs();
    list.unshift(entry);
    this.save(STORAGE_KEYS.AUDIT_LOGS, list);
  }

  // Plans
  getPlans(): PlanConfig[] {
    return this.get<PlanConfig[]>(STORAGE_KEYS.SYSTEM_PLANS, INITIAL_PLANS);
  }

  // Sync Queue (Offline mode)
  getSyncQueue(): SyncQueueItem[] {
    return this.get<SyncQueueItem[]>(STORAGE_KEYS.SYNC_QUEUE, []);
  }

  addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'status' | 'attempts'>): void {
    const list = this.getSyncQueue();
    list.push({
      ...item,
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      status: 'queued',
      attempts: 0,
    });
    this.save(STORAGE_KEYS.SYNC_QUEUE, list);
  }

  clearSyncedQueue(): void {
    const list = this.getSyncQueue().filter((item) => item.status !== 'queued');
    this.save(STORAGE_KEYS.SYNC_QUEUE, list);
  }

  // Limpar todas as jornadas (começar com 0 jornadas limpas)
  clearAllJourneys(performedBy?: User): void {
    this.save(STORAGE_KEYS.JOURNEYS, []);
    this.save(STORAGE_KEYS.ACTIVITIES, []);
    this.save(STORAGE_KEYS.SYNC_QUEUE, []);
    if (performedBy) {
      this.addAuditLog({
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        entityType: 'journey',
        entityId: 'all',
        action: 'status_change',
        performedByUserId: performedBy.id,
        performedByUserName: performedBy.name,
        userRole: performedBy.role,
        description: 'Todos os registos de jornada foram zerados pelo utilizador.',
        source: performedBy.role === 'fleet_manager' ? 'web_fleet' : 'web_driver',
      });
    }
  }

  // Reset demo data
  resetDemoData(): void {
    this.save(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.save(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
    this.save(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    this.save(STORAGE_KEYS.JOURNEYS, INITIAL_JOURNEYS);
    this.save(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    this.save(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    this.save(STORAGE_KEYS.SYNC_QUEUE, []);
    this.save(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  }
}

export const storage = new StorageService();
