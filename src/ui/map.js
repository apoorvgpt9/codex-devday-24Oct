const SVG_NS = 'http://www.w3.org/2000/svg';
const VIEWBOX = { width: 1000, height: 650, inset: 52 };

function svgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

function dataBounds(stations, places) {
  const points = [
    ...stations.lines.flatMap((line) => line.stations),
    places.office,
    ...places.clusters,
  ];
  return {
    minLat: Math.min(...points.map((point) => point.lat)),
    maxLat: Math.max(...points.map((point) => point.lat)),
    minLng: Math.min(...points.map((point) => point.lng)),
    maxLng: Math.max(...points.map((point) => point.lng)),
  };
}

function project(point, bounds) {
  const drawableWidth = VIEWBOX.width - 2 * VIEWBOX.inset;
  const drawableHeight = VIEWBOX.height - 2 * VIEWBOX.inset;
  return {
    x: VIEWBOX.inset + (point.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng) * drawableWidth,
    y: VIEWBOX.height - VIEWBOX.inset - (point.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat) * drawableHeight,
  };
}

function employeeClass(result, toleranceMin) {
  if (!result.canSwitch) return 'stay';
  return result.deltaMin >= toleranceMin - 5 ? 'borderline' : 'can-switch';
}

function coordinateKey(point) {
  return `${point.lat.toFixed(4)}:${point.lng.toFixed(4)}`;
}

function labelVisibility(station, terminalIds, boardingStationIds) {
  return terminalIds.has(station.id)
    || station.id === 'district-court'
    || station.name === 'Shivajinagar'
    || station.id === 'ramwadi'
    || boardingStationIds.has(station.id);
}

function labelBox({ x, y, text, anchor = 'start' }) {
  const width = text.length * 6.7;
  const left = anchor === 'middle' ? x - width / 2 : x;
  return { left, right: left + width, top: y - 12, bottom: y + 3 };
}

function boxesOverlap(left, right) {
  return left.left < right.right && left.right > right.left && left.top < right.bottom && left.bottom > right.top;
}

export function createMap(container, { stations, places, results, toleranceMin, line3Open = false, boardingStations = [] }) {
  const bounds = dataBounds(stations, places);
  const svg = svgElement('svg', { viewBox: `0 0 ${VIEWBOX.width} ${VIEWBOX.height}`, role: 'img', 'aria-label': 'Schematic Pune Metro map and synthetic employee commute verdicts' });
  const definitions = svgElement('defs');
  const marker = svgElement('marker', { id: 'shuttle-arrow', viewBox: '0 0 18 18', refX: '16', refY: '9', markerWidth: '18', markerHeight: '18', markerUnits: 'userSpaceOnUse', orient: 'auto-start-reverse' });
  marker.append(svgElement('path', { d: 'M 0 1 L 18 9 L 0 17 z', fill: '#F2B200' }));
  definitions.append(marker);
  svg.append(definitions);

  const lineLayer = svgElement('g', { 'aria-hidden': 'true' });
  const stationPositions = new Map();
  for (const line of stations.lines) {
    for (const station of line.stations) {
      if (!stationPositions.has(station.id)) {
        stationPositions.set(station.id, project(station, bounds));
      }
    }
    const path = svgElement('path', {
      d: line.stations.map((station, index) => {
        const point = stationPositions.get(station.id);
        return `${index ? 'L' : 'M'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
      }).join(' '),
      class: 'metro-line',
      'data-line': line.id,
    });
    lineLayer.append(path);
  }
  svg.append(lineLayer);

  const ramwadi = stationPositions.get('ramwadi');
  const office = project(places.office, bounds);
  const loopPath = `M ${ramwadi.x} ${ramwadi.y} C ${ramwadi.x + 75} ${ramwadi.y - 20}, ${office.x - 65} ${office.y + 30}, ${office.x} ${office.y}`;
  const casing = svgElement('path', {
    d: loopPath,
    class: 'shuttle-casing',
  });
  const loop = svgElement('path', {
    d: loopPath,
    class: 'shuttle-loop',
    'marker-end': 'url(#shuttle-arrow)',
    pathLength: '1',
    'stroke-dasharray': '1',
  });
  svg.append(casing);
  svg.append(loop);
  const shuttleMarker = svgElement('circle', { cx: ramwadi.x, cy: ramwadi.y, r: '6', class: 'shuttle-marker' });
  shuttleMarker.append(svgElement('animateMotion', { class: 'shuttle-marker-motion', dur: '1.2s', path: loopPath, fill: 'freeze' }));
  svg.append(shuttleMarker);
  const officeLabel = svgElement('text', { x: office.x + 10, y: office.y - 10, class: 'station-label' });
  officeLabel.textContent = 'EON IT Park';
  svg.append(officeLabel);

  const employeeLayer = svgElement('g', { class: 'employee-layer', 'aria-hidden': 'true' });
  const employeeNodes = new Map();
  for (const result of results) {
    const point = project(result.employee, bounds);
    const employee = svgElement('circle', { cx: point.x.toFixed(1), cy: point.y.toFixed(1), r: '2.15', class: `employee ${employeeClass(result, toleranceMin)}` });
    employeeLayer.append(employee);
    employeeNodes.set(result.employee.id, employee);
  }
  svg.append(employeeLayer);

  const stationLayer = svgElement('g', { class: 'station-layer' });
  const terminalIds = new Set(stations.lines.flatMap((line) => [line.stations[0].id, line.stations.at(-1).id]));
  const stationLabels = [];
  const stationLabelBoxes = [labelBox({ x: office.x + 10, y: office.y - 10, text: 'EON IT Park' })];
  const renderedStations = new Set();
  const boardingStationIds = new Set(boardingStations.map((station) => station.stationId));
  for (const line of stations.lines) {
    for (const station of line.stations) {
      const key = `${station.name}:${coordinateKey(station)}`;
      if (renderedStations.has(key)) continue;
      renderedStations.add(key);
      const point = stationPositions.get(station.id);
      const group = svgElement('g', { class: 'station-group', tabindex: '0', role: 'img', 'aria-label': `${station.name}; Marathi: ${station.mr}` });
      const title = svgElement('title');
      title.textContent = `${station.name} — ${station.mr}`;
      group.append(title);
      group.append(svgElement('circle', { cx: point.x, cy: point.y, r: station.interchange ? '6' : '4', class: station.interchange ? 'station station--interchange' : 'station' }));
      const label = svgElement('text', { x: point.x + 8, y: point.y - 8, class: 'station-label' });
      label.textContent = station.name;
      label.classList.toggle('station-label--hidden', !labelVisibility(station, terminalIds, boardingStationIds));
      group.append(label);
      stationLabels.push({ station, label });
      stationLabelBoxes.push(labelBox({ x: point.x + 8, y: point.y - 8, text: station.name }));
      stationLayer.append(group);
    }
  }
  const clusterNames = new Set(['wagholi', 'hadapsar', 'viman-nagar', 'kharadi', 'kothrud', 'pcmc', 'wakad-hinjewadi', 'baner-balewadi']);
  const clusterLayer = svgElement('g', { class: 'cluster-layer', 'aria-hidden': 'true' });
  for (const cluster of places.clusters.filter((cluster) => clusterNames.has(cluster.id))) {
    const point = project(cluster, bounds);
    const labelPosition = { x: point.x, y: point.y + 28, text: cluster.name, anchor: 'middle' };
    if (stationLabelBoxes.some((stationBox) => boxesOverlap(labelBox(labelPosition), stationBox))) continue;
    const label = svgElement('text', { x: labelPosition.x, y: labelPosition.y, 'text-anchor': 'middle', class: 'cluster-label' });
    label.textContent = cluster.name;
    clusterLayer.append(label);
  }
  svg.append(clusterLayer);
  svg.append(stationLayer);
  const note = svgElement('text', { x: VIEWBOX.inset, y: VIEWBOX.height - 22, class: 'map-note' });
  note.textContent = line3Open ? 'Approximate positions. Line 3 is shown as an open what-if route.' : 'Approximate positions. Line 3 is dashed: a future what-if route.';
  svg.append(note);

  container.replaceChildren(svg);
  container.setAttribute('aria-busy', 'false');

  return {
    update(nextResults, nextToleranceMin, nextLine3Open, nextBoardingStations) {
      for (const result of nextResults) {
        const node = employeeNodes.get(result.employee.id);
        if (node) node.setAttribute('class', `employee ${employeeClass(result, nextToleranceMin)}`);
      }
      const line3 = svg.querySelector('[data-line="L3"]');
      line3.classList.toggle('is-open', nextLine3Open);
      const nextBoardingIds = new Set(nextBoardingStations.map((station) => station.stationId));
      stationLabels.forEach(({ station, label }) => {
        label.classList.toggle('station-label--hidden', !labelVisibility(station, terminalIds, nextBoardingIds));
      });
      note.textContent = nextLine3Open ? 'Approximate positions. Line 3 is shown as an open what-if route.' : 'Approximate positions. Line 3 is dashed: a future what-if route.';
    },
  };
}
