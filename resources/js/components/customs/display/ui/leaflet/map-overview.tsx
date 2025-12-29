'use client';

import { tournamentIcon } from '@/lib/leaflet/icon';
import { userPulseIcon } from '@/lib/leaflet/icon';
import { getDistanceKm } from '@/lib/leaflet/distance';
import { TournamentCoordinates } from '@/types/tournaments';
import { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from 'react-leaflet';

function FitBounds({ points }: { points: TournamentCoordinates[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length < 2) return;

    map.fitBounds(
      points.map((p) => [p.lat, p.lng]),
      { padding: [40, 40], animate: true },
    );
  }, [points, map]);

  return null;
}

interface MapOverviewProps {
  tournamentCoords: TournamentCoordinates;
  locationName?: string | null;
}

export default function MapOverview({
  tournamentCoords,
  locationName,
}: MapOverviewProps) {
  const [userCoords, setUserCoords] = useState<TournamentCoordinates | null>(
    null,
  );

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {},
    );
  }, []);

  const distanceKm = useMemo(() => {
    if (!userCoords) return null;
    return getDistanceKm(userCoords, tournamentCoords);
  }, [userCoords, tournamentCoords]);

  const boundsPoints = userCoords
    ? [tournamentCoords, userCoords]
    : [tournamentCoords];

  return (
    <MapContainer
      center={[tournamentCoords.lat, tournamentCoords.lng]}
      zoom={15}
      scrollWheelZoom={true}
      zoomControl={false}
      className="h-full w-full overflow-hidden rounded-lg"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap & CARTO"
      />

      <ZoomControl position="bottomright" />
      <FitBounds points={boundsPoints} />

      {/* Tournament */}
      <Marker
        position={[tournamentCoords.lat, tournamentCoords.lng]}
        icon={tournamentIcon}
      >
        <Popup>
          <div className="space-y-2 text-sm">
            <strong>Tournament Location</strong>
            {locationName && (
              <div className="text-xs text-gray-500 mt-1">{locationName}</div>
            )}
            {distanceKm && (
              <div className="text-xs text-blue-400">
                {distanceKm.toFixed(1)} km from you
              </div>
            )}
          </div>
        </Popup>
      </Marker>

      {/* User (Pulse) */}
      {userCoords && (
        <Marker
          position={[userCoords.lat, userCoords.lng]}
          icon={userPulseIcon}
        >
          <Popup>
            <strong>Your Location</strong>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
