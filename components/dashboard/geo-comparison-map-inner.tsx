"use client";

import { Fragment, useMemo } from "react";
import { MapContainer, Marker, Popup, Polyline, TileLayer } from "react-leaflet";
import L from "leaflet";
import { GeoAuditEntry } from "@/types/survey";

interface GeoComparisonMapInnerProps {
  entries: GeoAuditEntry[];
}

const expectedIcon = L.divIcon({
  className: "gps-expected-marker",
  html: "<div style='height:14px;width:14px;border-radius:9999px;background:#1d4ed8;border:2px solid #ffffff;box-shadow:0 0 0 2px rgba(29,78,216,0.25);'></div>",
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const actualIcon = L.divIcon({
  className: "gps-actual-marker",
  html: "<div style='height:14px;width:14px;border-radius:9999px;background:#059669;border:2px solid #ffffff;box-shadow:0 0 0 2px rgba(5,150,105,0.25);'></div>",
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

export function GeoComparisonMapInner({
  entries
}: GeoComparisonMapInnerProps): JSX.Element {
  const valid = useMemo(
    () =>
      entries.filter(
        (entry) => Boolean(entry.expectedGps) && Boolean(entry.actualGps)
      ),
    [entries]
  );

  const center = useMemo<[number, number]>(() => {
    if (!valid.length) {
      return [14.6928, -17.4467];
    }

    const totals = valid.reduce(
      (acc, entry) => {
        const expected = entry.expectedGps!;
        const actual = entry.actualGps!;
        acc.lat += expected.lat + actual.lat;
        acc.lng += expected.lng + actual.lng;
        return acc;
      },
      { lat: 0, lng: 0 }
    );
    const count = valid.length * 2;
    return [totals.lat / count, totals.lng / count];
  }, [valid]);

  return (
    <MapContainer center={center} zoom={8} className="h-full w-full rounded-2xl" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {valid.map((entry, index) => {
        const expected = entry.expectedGps!;
        const actual = entry.actualGps!;

        return (
          <Fragment key={`${entry.submissionId}-${entry.commercantId}-${index}`}>
            <Marker position={[expected.lat, expected.lng]} icon={expectedIcon}>
              <Popup>
                Attendu<br />
                {entry.commercantLabel}
              </Popup>
            </Marker>
            <Marker position={[actual.lat, actual.lng]} icon={actualIcon}>
              <Popup>
                Reel<br />
                {entry.commercantLabel}
              </Popup>
            </Marker>
            <Polyline
              positions={[
                [expected.lat, expected.lng],
                [actual.lat, actual.lng]
              ]}
              pathOptions={{
                color: entry.status === "critical" ? "#dc2626" : "#059669",
                weight: 2,
                opacity: 0.85
              }}
            />
          </Fragment>
        );
      })}
    </MapContainer>
  );
}
