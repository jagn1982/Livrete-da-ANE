/**
 * Livrete da ANE - Domain Types & Interfaces
 * Conformidade com a Portaria n.º 7/2022 e Regulamentação do Trabalho de Condução em Portugal
 */

export type UserRole = 'independent_driver' | 'company_driver' | 'fleet_manager' | 'platform_admin';

export type ActivityType =
  | 'driving'           // Condução (a)
  | 'resting'           // Repouso / Descanso
  | 'availability'      // Disponibilidade
  | 'other_work_same'   // Outro serviço para o mesmo empregador (b)
  | 'other_work_other'; // Serviço para outro empregador (c)

export type JourneyStatus =
  | 'no_journey'
  | 'in_progress'
  | 'completed'
  | 'pending_sync'
  | 'has_issues'
  | 'under_review';

export type VehicleCategory = 'tvde' | 'taxi' | 'mercadorias' | 'passageiros';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  nif?: string; // Número de Identificação Fiscal
  driverLicenseNumber?: string;
  companyId?: string;
  companyName?: string;
  activeVehicleId?: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface Company {
  id: string;
  name: string;
  nif: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  plan: 'independent' | 'fleet_starter' | 'fleet_pro' | 'fleet_enterprise';
  maxDrivers: number;
  maxVehicles: number;
  createdAt: string;
  legalRepresentative?: string;
  status: 'active' | 'suspended' | 'trial';
}

export interface Vehicle {
  id: string;
  plate: string; // Ex: "CG-52-BC"
  brand: string;
  model: string;
  year?: number;
  category: VehicleCategory;
  internalCode?: string;
  companyId: string;
  assignedDriverIds: string[];
  currentKm: number;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
}

export interface Fleet {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  vehicleIds: string[];
  createdAt: string;
}

export interface LocationPoint {
  timestamp: string;
  time: string; // "HH:MM"
  km: number;
  locationName: string;
  lat?: number;
  lng?: number;
  accuracy?: number; // em metros
  isManualFallback?: boolean;
  manualReason?: string;
}

export interface ActivityBreakdown {
  drivingMinutes: number;         // Condução (a)
  restingMinutes: number;         // Repouso
  availabilityMinutes: number;    // Disponibilidade
  otherWorkSameMinutes: number;   // Outro trabalho mesmo empregador (b)
  otherWorkOtherMinutes: number;  // Outro trabalho outro empregador (c)
  totalWorkMinutes: number;       // (a) + (b) + (c)
}

export interface ActivityEvent {
  id: string;
  journeyId: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehiclePlate: string;
  companyId?: string;
  type: ActivityType;
  startTime: string; // ISO
  endTime?: string;   // ISO
  durationMinutes?: number;
  locationName?: string;
  lat?: number;
  lng?: number;
  notes?: string;
  isCorrection?: boolean;
  correctionReason?: string;
  correctedByUserId?: string;
  recordedAt: string;
  syncStatus: 'synced' | 'pending_sync';
}

export interface Journey {
  id: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel?: string;
  companyId?: string;
  companyName?: string;
  date: string; // "YYYY-MM-DD"
  status: JourneyStatus;
  start: LocationPoint;
  end?: LocationPoint;
  totalKm?: number;
  breakdown: ActivityBreakdown;
  isClosed: boolean;
  syncStatus: 'synced' | 'pending_sync' | 'sync_error';
  offlineCreated?: boolean;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  entityType: 'journey' | 'activity' | 'vehicle' | 'driver' | 'company' | 'auth';
  entityId: string;
  action: 'create' | 'update' | 'close' | 'correction' | 'assign' | 'status_change' | 'login';
  performedByUserId: string;
  performedByUserName: string;
  userRole: UserRole;
  description: string;
  reason?: string;
  previousValue?: string;
  newValue?: string;
  source: 'web_driver' | 'web_fleet' | 'offline_sync' | 'admin';
}

export interface SyncQueueItem {
  id: string;
  timestamp: string;
  action: 'start_journey' | 'end_journey' | 'add_activity' | 'edit_journey';
  payload: any;
  status: 'queued' | 'processing' | 'failed';
  attempts: number;
  error?: string;
}

export interface PlanConfig {
  id: string;
  name: string;
  pricePerYear: number;
  vatRate: number;
  description: string;
  features: string[];
  maxDrivers: number;
  maxVehicles: number;
  isPopular?: boolean;
}
