function availableLines(stations, line3Open) {
  return stations.lines.filter((line) => line.status !== 'what-if' || line3Open);
}

export function openStations(stations, line3Open = false) {
  const seen = new Map();
  for (const line of availableLines(stations, line3Open)) {
    for (const station of line.stations) {
      if (!seen.has(station.id)) seen.set(station.id, station);
    }
  }
  return [...seen.values()];
}

export function routeToRamwadi(stations, originId, { line3Open = false } = {}) {
  const targetId = 'ramwadi';
  const queue = [{ stationId: originId, lineId: null, hops: 0, transfers: 0 }];
  const best = new Map();

  const edges = new Map();
  for (const line of availableLines(stations, line3Open)) {
    for (let index = 0; index < line.stations.length - 1; index += 1) {
      const from = line.stations[index].id;
      const to = line.stations[index + 1].id;
      for (const [start, end] of [[from, to], [to, from]]) {
        if (!edges.has(start)) edges.set(start, []);
        edges.get(start).push({ stationId: end, lineId: line.id });
      }
    }
  }

  while (queue.length) {
    queue.sort((a, b) => a.hops - b.hops || a.transfers - b.transfers);
    const current = queue.shift();
    const currentKey = `${current.stationId}:${current.lineId ?? 'start'}`;
    if (best.has(currentKey)) continue;
    best.set(currentKey, current);
    if (current.stationId === targetId) return current;

    for (const edge of edges.get(current.stationId) ?? []) {
      queue.push({
        stationId: edge.stationId,
        lineId: edge.lineId,
        hops: current.hops + 1,
        transfers: current.transfers + (current.lineId && current.lineId !== edge.lineId ? 1 : 0),
      });
    }
  }

  return null;
}
