import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const tournamentIcon = new L.Icon({
  iconUrl: '/assets/icons/marker-tournament.svg',
  iconSize: [40, 40],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const userIcon = new L.Icon({
  iconUrl: '/assets/icons/marker-user.svg',
  iconSize: [32, 32],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

export const userPulseIcon = new L.DivIcon({
  className: '',
  html: `
    <div class="pulse-wrapper">
      <span class="pulse-ring"></span>
      <span class="pulse-dot"></span>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});
