const EARTH_RADIUS_KM = 6371;

export function haversineKm(a, b) {
  const degreesToRadians = Math.PI / 180;
  const latitudeDelta = (b.lat - a.lat) * degreesToRadians;
  const longitudeDelta = (b.lng - a.lng) * degreesToRadians;
  const aTerm = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(a.lat * degreesToRadians)
    * Math.cos(b.lat * degreesToRadians)
    * Math.sin(longitudeDelta / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(aTerm), Math.sqrt(1 - aTerm));
}
