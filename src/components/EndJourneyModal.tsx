import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, MapPin, Gauge } from 'lucide-react';
import { Journey } from '../types';
import { getCurrentDriverLocation, GeoResult } from '../services/geolocation';
import { formatMinutesToHours } from '../services/reports';

interface EndJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeJourney: Journey | null;
  onConfirm: (data: {
    km: number;
    locationName: string;
    lat?: number;
    lng?: number;
    accuracy?: number;
    totalKm: number;
    notes?: string;
  }) => void;
}

export const EndJourneyModal: React.FC<EndJourneyModalProps> = ({
  isOpen,
  onClose,
  activeJourney,
  onConfirm,
}) => {
  const [km, setKm] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('');
  const [geoData, setGeoData] = useState<GeoResult | null>(null);
  const [loadingGeo, setLoadingGeo] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && activeJourney) {
      setKm(String(activeJourney.start.km + 45)); // Default suggested estimate
      fetchLocation();
    }
  }, [isOpen, activeJourney]);

  const fetchLocation = async () => {
    setLoadingGeo(true);
    setError('');
    const res = await getCurrentDriverLocation();
    setGeoData(res);
    setLoadingGeo(false);
    if (res.success && res.locationName) {
      setLocationName(res.locationName);
    } else if (!locationName) {
      setLocationName('Lisboa, Portugal');
    }
  };

  if (!isOpen || !activeJourney) return null;

  const startKm = activeJourney.start.km;
  const currentKmNum = parseFloat(km) || 0;
  const calculatedDistance = currentKmNum >= startKm ? currentKmNum - startKm : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const kmNum = parseFloat(km);
    if (isNaN(kmNum) || kmNum <= 0) {
      setError('Por favor, indique os quilómetros finais válidos do odómetro.');
      return;
    }

    if (kmNum < startKm) {
      setError(
        `Os quilómetros finais (${kmNum} km) não podem ser inferiores aos quilómetros iniciais (${startKm} km). Em caso de substituição de odómetro ou correção, registe uma justificação formal.`
      );
      return;
    }

    if (!locationName.trim()) {
      setError('A identificação da localidade final é obrigatória.');
      return;
    }

    onConfirm({
      km: kmNum,
      locationName: locationName.trim(),
      lat: geoData?.lat,
      lng: geoData?.lng,
      accuracy: geoData?.accuracy,
      totalKm: kmNum - startKm,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between font-bold">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold">Encerrar Período de Trabalho</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 transition-colors text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Resumo da Jornada */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Viatura associada:</span>
              <strong className="text-slate-900">{activeJourney.vehiclePlate} ({activeJourney.vehicleModel})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Início da jornada:</span>
              <span>{activeJourney.start.time} · {activeJourney.start.locationName} ({activeJourney.start.km} km)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tempo de condução acumulado:</span>
              <span className="font-semibold text-emerald-700 tabular-nums">
                {formatMinutesToHours(activeJourney.breakdown.drivingMinutes)}
              </span>
            </div>
          </div>

          {/* Km Final */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Km Final do Odómetro *
              </label>
              <span className="text-[11px] text-slate-500">
                Início: <strong className="tabular-nums">{startKm} km</strong>
              </span>
            </div>
            <input
              type="number"
              value={km}
              onChange={(e) => setKm(e.target.value)}
              placeholder={`Mínimo: ${startKm}`}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            {currentKmNum >= startKm && (
              <div className="mt-1 text-xs text-slate-600 flex items-center justify-between px-1">
                <span>Distância percorrida no período:</span>
                <span className="font-bold text-slate-900 tabular-nums">{calculatedDistance} km</span>
              </div>
            )}
          </div>

          {/* Local de Término */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Local de Término *
              </label>
              <button
                type="button"
                onClick={fetchLocation}
                disabled={loadingGeo}
                className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1 font-medium"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{loadingGeo ? 'A obter GPS...' : 'Atualizar GPS'}</span>
              </button>
            </div>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Ex: Belém, Lisboa"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Observações / Justificações (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Manutenção agendada, tráfego invulgar..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Botões */}
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
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Confirmar Encerramento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
