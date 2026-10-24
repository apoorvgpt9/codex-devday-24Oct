const SVG_NS = 'http://www.w3.org/2000/svg';
const VIEWBOX = { width: 1000, height: 650, inset: 68 };

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

function snapAngle(deltaX, deltaY) {
  const angle = Math.atan2(deltaY, deltaX);
  return Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
}

function schematicLine(stations, bounds) {
  const positions = new Map();
  const first = project(stations[0], bounds);
  positions.set(stations[0].id, first);
  for (let index = 1; index < stations.length; index += 1) {
    const rawPrevious = project(stations[index - 1], bounds);
    const rawCurrent = project(stations[index], bounds);
    const previous = positions.get(stations[index - 1].id);
    const distance = Math.hypot(rawCurrent.x - rawPrevious.x, rawCurrent.y - rawPrevious.y);
    const angle = snapAngle(rawCurrent.x - rawPrevious.x, rawCurrent.y - rawPrevious.y);
    positions.set(stations[index].id, {
      x: previous.x + Math.cos(angle) * distance,
      y: previous.y + Math.sin(angle) * distance,
    });
  }
  return positions;
}

function employeeClass(result, toleranceMin) {
  if (!result.canSwitch) return 'stay';
  return result.deltaMin >= toleranceMin - 5 ? 'borderline' : 'can-switch';
}

export function createMap(container, { stations, places, results, toleranceMin, line3Open = false }) {
  const bounds = dataBounds(stations, places);
  const svg = svgElement('svg', { viewBox: `0 0 ${VIEWBOX.width} ${VIEWBOX.height}`, role: 'img', 'aria-label': 'Schematic Pune Metro map and synthetic employee commute verdicts' });
  const definitions = svgElement('defs');
  const marker = svgElement('marker', { id: 'shuttle-arrow', viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse' });
  marker.append(svgElement('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: '#F2B200' }));
  definitions.append(marker);
  svg.append(definitions);

  const lineLayer = svgElement('g', { 'aria-hidden': 'true' });
  const stationPositions = new Map();
  for (const line of stations.lines) {
    const points = schematicLine(line.stations, bounds);
    for (const [id, position] of points) {
      if (!stationPositions.has(id)) stationPositions.set(id, position);
    }
    const path = svgElement('path', {
      d: line.stations.map((station, index) => `${index ? 'L' : 'M'} ${points.get(station.id).x.toFixed(1)} ${points.get(station.id).y.toFixed(1)}`).join(' '),
      class: 'metro-line',
      'data-line': line.id,
    });
    lineLayer.append(path);
  }
  svg.append(lineLayer);

  const ramwadi = stationPositions.get('ramwadi');
  const office = project(places.office, bounds);
  const loop = svgElement('path', {
    d: `M ${ramwadi.x} ${ramwadi.y} C ${ramwadi.x + 75} ${ramwadi.y - 20}, ${office.x - 65} ${office.y + 30}, ${office.x} ${office.y}`,
    class: 'shuttle-loop',
    'marker-end': 'url(#shuttle-arrow)',
    pathLength: '1',
    'stroke-dasharray': '1',
  });
  svg.append(loop);
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
  const renderedStations = new Set();
  for (const line of stations.lines) {
    for (const station of line.stations) {
      if (renderedStations.has(station.id)) continue;
      renderedStations.add(station.id);
      const point = stationPositions.get(station.id);
      const group = svgElement('g', { class: 'station-group', tabindex: '0', role: 'img', 'aria-label': `${station.name}; Marathi: ${station.mr}` });
      group.append(svgElement('title')).textContent = `${station.name} · ${station.mr}`;
      group.append(svgElement('circle', { cx: point.x, cy: point.y, r: station.interchange ? '6' : '4', class: station.interchange ? 'station station--interchange' : 'station' }));
      const label = svgElement('text', { x: point.x + 8, y: point.y - 8, class: 'station-label' });
      label.textContent = station.name;
      group.append(label);
      stationLayer.append(group);
    }
  }
  svg.append(stationLayer);
  const note = svgElement('text', { x: VIEWBOX.inset, y: VIEWBOX.height - 22, class: 'map-note' });
  note.textContent = line3Open ? 'Line 3 shown as an open what-if route.' : 'Line 3 is dashed: a future what-if route.';
  svg.append(note);

  container.replaceChildren(svg);
  container.setAttribute('aria-busy', 'false');

  return {
    update(nextResults, nextToleranceMin, nextLine3Open) {
      for (const result of nextResults) {
        const node = employeeNodes.get(result.employee.id);
        if (node) node.setAttribute('class', `employee ${employeeClass(result, nextToleranceMin)}`);
      }
      const line3 = svg.querySelector('[data-line="L3"]');
      line3.classList.toggle('is-open', nextLine3Open);
      note.textContent = nextLine3Open ? 'Line 3 shown as an open what-if route.' : 'Line 3 is dashed: a future what-if route.';
    },
  };
}
