'use client';

import L from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

interface MapPickerProps {
  value?: { lat: number; lng: number };
  onChange?: (coords: { lat: number; lng: number }) => void;
}

function LocationMarker({ value, onChange }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  // 🔁 sync dari value (termasuk hasil geolocation)
  useEffect(() => {
    if (value) {
      setPosition(new L.LatLng(value.lat, value.lng));
    }
  }, [value]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onChange?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  if (!position) return null;

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          setPosition(latlng);
          onChange?.({ lat: latlng.lat, lng: latlng.lng });
        },
      }}
    />
  );
}

export function MapPicker({ value, onChange }: MapPickerProps) {
  const [center, setCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (value) {
      setCenter([value.lat, value.lng]);
      return;
    }

    if (!navigator.geolocation) {
      setCenter([-6.2, 106.816666]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setCenter([coords.lat, coords.lng]);
        onChange?.(coords); // 🔥 ini trigger marker
      },
      () => {
        setCenter([-6.2, 106.816666]);
      },
    );
  }, [value]);

  if (!center) return null;

  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker value={value} onChange={onChange} />
    </MapContainer>
  );
}
