const LATITUDE_BOUNDS = [18.35, 18.75];
const LONGITUDE_BOUNDS = [73.60, 74.10];
const SHIFT_STARTS = new Set(['09:00', '10:00', '11:00']);

function rowValues(row) {
  return row.split(',').map((value) => value.trim());
}

function inBounds(value, [minimum, maximum]) {
  return value >= minimum && value <= maximum;
}

export function parseWorkforceCsv(text) {
  const rows = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  const header = rowValues(rows.shift() ?? '').map((value) => value.toLowerCase());
  const latIndex = header.indexOf('lat');
  const lngIndex = header.indexOf('lng');
  const shiftIndex = header.indexOf('shiftstart');
  if (latIndex < 0 || lngIndex < 0) throw new Error('CSV needs lat and lng headers.');

  while (rows.length && !rows.at(-1).trim()) rows.pop();
  const employees = [];
  let skipped = 0;
  rows.forEach((row) => {
    if (!row.trim()) {
      skipped += 1;
      return;
    }
    const values = rowValues(row);
    const lat = Number(values[latIndex]);
    const lng = Number(values[lngIndex]);
    const shiftStart = shiftIndex < 0 || !values[shiftIndex] ? '09:00' : values[shiftIndex];
    if (!Number.isFinite(lat) || !Number.isFinite(lng)
      || !inBounds(lat, LATITUDE_BOUNDS) || !inBounds(lng, LONGITUDE_BOUNDS)
      || !SHIFT_STARTS.has(shiftStart)) {
      skipped += 1;
      return;
    }
    employees.push({
      id: `uploaded-${String(employees.length + 1).padStart(4, '0')}`,
      cluster: 'uploaded workforce',
      lat,
      lng,
      shiftStart,
      currentMode: 'cab',
    });
  });
  return { employees, skipped };
}

export const workforceBounds = { latitude: LATITUDE_BOUNDS, longitude: LONGITUDE_BOUNDS };
