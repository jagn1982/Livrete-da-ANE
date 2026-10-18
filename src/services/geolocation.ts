/**
 * JornadaPro PT - Geolocation Service
 * Obtenção de coordenadas reais do navegador e resolução de localidade em Portugal
 * Conforme Portaria n.º 7/2022: Nunca inventa coordenadas e regista precisão/motivo em caso de fallback
 */

export interface GeoResult {
  success: boolean;
  lat?: number;
  lng?: number;
  accuracy?: number;
  locationName: string;
  error?: string;
  isManualFallback?: boolean;
}

export async function getCurrentDriverLocation(): Promise<GeoResult> {
  if (!navigator.geolocation) {
    return {
      success: false,
      locationName: 'Localização não suportada pelo navegador',
      error: 'O dispositivo não suporta a API de geolocalização.',
      isManualFallback: true,
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy);

        // Tentativa de Reverse Geocoding via Nominatim OpenStreetMap
        let resolvedName = '';
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'pt-PT,pt;q=0.9',
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const suburb = addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || addr.hamlet || '';
            const city = addr.city || addr.town || addr.municipality || addr.county || 'Portugal';
            const district = addr.state_district || addr.region || '';
            resolvedName = [suburb, city, district].filter(Boolean).slice(0, 2).join(', ');
          }
        } catch {
          // Fallback silencioso para coordenadas formatadas
          resolvedName = `Coord. ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }

        if (!resolvedName) {
          resolvedName = `Coord. ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }

        resolve({
          success: true,
          lat,
          lng,
          accuracy,
          locationName: resolvedName,
        });
      },
      (err) => {
        let msg = 'Erro ao aceder à localização do dispositivo.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Permissão de localização negada pelo condutor.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Sinal de satélite/rede indisponível no momento.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Tempo limite excedido ao obter a localização.';
        }

        resolve({
          success: false,
          locationName: '',
          error: msg,
          isManualFallback: true,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 30000,
      }
    );
  });
}
