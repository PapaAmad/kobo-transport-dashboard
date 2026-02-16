"use client";

import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { GeoPoint } from "@/types/survey";
import "leaflet/dist/leaflet.css";

interface GeoMapInnerProps {
  points: GeoPoint[];
}

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function GeoMapInner({ points }: GeoMapInnerProps): JSX.Element {
  const center = useMemo<[number, number]>(() => {
    if (!points.length) {
      return [14.6928, -17.4467];
    }
    const lat = points.reduce((acc, current) => acc + current.lat, 0) / points.length;
    const lng = points.reduce((acc, current) => acc + current.lng, 0) / points.length;
    return [lat, lng];
  }, [points]);

  return (
    <MapContainer center={center} zoom={6} className="h-full w-full rounded-2xl" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((point, index) => (
        <Marker key={`${point.lat}-${point.lng}-${index}`} position={[point.lat, point.lng]} icon={markerIcon}>
          <Popup>
            Lat: {point.lat.toFixed(5)}, Lng: {point.lng.toFixed(5)}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
