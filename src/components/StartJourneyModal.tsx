import React, { useState, useEffect } from 'react';
import { X, Navigation, AlertCircle, CheckCircle2, MapPin } from 'lucide-react';
import { Vehicle, User } from '../types';
import { getCurrentDriverLocation, GeoResult } from '../services/geolocation';

interface StartJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  currentUser: User;
  onConfirm: (data: {
    vehicleId: string;
    vehiclePlate: string;
    vehicleModel: string;
    km: number;
    locationName: string;
    lat?: number;
    lng?: number;
    accuracy?: number;
    isManualFallback?: boolean;
    manualReason?: string;
  }) => void;
}

export const StartJourneyModal: React.FC<StartJourneyModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  currentUser,
  onConfirm,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    currentUser.activeVehicleId || (vehicles[0]?.id || '')
  );
  const [km, setKm] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('');
  const [geoData, setGeoData] = useState<GeoResult | null>(null);
  const [loadingGeo, setLoadingGeo] = useState<boolean>(false);
  const [manualReason, setManualReason] = useState<string>('');
  const [error, setError] = useState<string>('');

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  useEffect(() => {
    if (isOpen) {
      if (selectedVehicle) {
        setKm(String(selectedVehicle.currentKm || ''));
      }
      fetchLocation();
    }
  }, [isOpen, selectedVehicleId]);

  const fetchLocation = async () => {
    setLoadingGeo(true);
    setError('');
    const res = await getCurrentDriverLocation();
    setGeoData(res);
    setLoadingGeo(false);
    if (res.success && res.locationName) {
      setLocationName(res.locationName);
    } else if (!locationName) {
      // Default common fallback locality for Portugal when GPS is offline/denied
      setLocationName('Lisboa, Portugal');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const kmNum = parseFloat(km);
    if (isNaN(kmNum) || kmNum <= 0) {
      setError('Por favor, introduza um valor de quilómetros válido.');
      return;
    }

    if (selectedVehicle && kmNum < selectedVehicle.currentKm) {
      setError(
        `O km inicial (${kmNum}) não pode ser inferior ao último registo da viatura (${selectedVehicle.currentKm} km).`
      );
      return;
    }

    if (!locationName.trim()) {
      setError('A identificação da localidade de início é obrigatória.');
      return;
    }

    if (!selectedVehicle) {
      setError('Selecione uma viatura válida.');
      return;
    }

    onConfirm({
      vehicleId: selectedVehicle.id,
      vehiclePlate: selectedVehicle.plate,
      vehicleModel: `${selectedVehicle.brand} ${selectedVehicle.model}`,
      km: kmNum,
      locationName: locationName.trim(),
      lat: geoData?.lat,
      lng: geoData?.lng,
      accuracy: geoData?.accuracy,
      isManualFallback: !geoData?.success,
      manualReason: !geoData?.success ? manualReason : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-amber-500 text-slate-950 px-6 py-4 flex items-center justify-between font-bold">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-slate-900" />
            <h3 className="text-base font-bold">Iniciar Novo Período de Trabalho</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-amber-600 transition-colors text-slate-900"
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

          {/* Viatura */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Viatura *
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => {
                setSelectedVehicleId(e.target.value);
                const v = vehicles.find((item) => item.id === e.target.value);
                if (v) setKm(String(v.currentKm));
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plate} - {v.brand} {v.model} ({v.currentKm} km)
                </option>
              ))}
            </select>
          </div>

          {/* Km Inicial */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Km Inicial do Odómetro *
              </label>
              {selectedVehicle && (
                <span className="text-[11px] text-slate-500">
                  Último registo: <strong className="tabular-nums">{selectedVehicle.currentKm} km</strong>
                </span>
              )}
            </div>
            <input
              type="number"
              value={km}
              onChange={(e) => setKm(e.target.value)}
              placeholder="Ex: 27666"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base font-semibold tabular-nums text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Localização */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Local de Início *
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
            {geoData?.success ? (
              <p className="mt-1 text-[11px] text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Coordenadas capturadas ({geoData.lat?.toFixed(4)}, {geoData.lng?.toFixed(4)}) · Precisão: {geoData.accuracy}m
                </span>
              </p>
            ) : geoData?.error ? (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800">
                <p className="font-medium">{geoData.error}</p>
                <input
                  type="text"
                  value={manualReason}
                  onChange={(e) => setManualReason(e.target.value)}
                  placeholder="Justificação da inserção manual (ex: sem sinal de GPS na garagem)"
                  className="mt-1 w-full p-1.5 bg-white border border-amber-300 rounded text-xs text-slate-800"
                />
              </div>
            ) : null}
          </div>

          {/* Informação Legal Portaria 7/2022 */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-800">Portaria n.º 7/2022:</span> O registo
            de início de jornada estabelece o momento de publicidade do trabalho de condução e gera
            timestamp certificado no servidor para auditoria.
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
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Iniciar</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
