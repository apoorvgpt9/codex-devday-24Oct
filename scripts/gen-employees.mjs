import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, '..');
const SEED = 2410;
const EMPLOYEE_COUNT = 1200;
const SCATTER_KM = 0.6;
const KM_PER_LATITUDE_DEGREE = 111;

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function normal(random) {
  const u = Math.max(random(), Number.MIN_VALUE);
  const v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function chooseWeighted(clusters, random) {
  const target = random();
  let total = 0;
  for (const cluster of clusters) {
    total += cluster.weight;
    if (target < total) return cluster;
  }
  return clusters.at(-1);
}

export function generateEmployees(places, { seed = SEED, count = EMPLOYEE_COUNT } = {}) {
  const random = mulberry32(seed);
  const shiftStarts = ['09:00', '10:00', '11:00'];

  return Array.from({ length: count }, (_, index) => {
    const cluster = chooseWeighted(places.clusters, random);
    const latitudeOffsetKm = normal(random) * SCATTER_KM;
    const longitudeOffsetKm = normal(random) * SCATTER_KM;
    const longitudeDegreesPerKm = 1 / (KM_PER_LATITUDE_DEGREE * Math.cos(cluster.lat * Math.PI / 180));

    return {
      id: `employee-${String(index + 1).padStart(4, '0')}`,
      cluster: cluster.id,
      lat: Number((cluster.lat + latitudeOffsetKm / KM_PER_LATITUDE_DEGREE).toFixed(6)),
      lng: Number((cluster.lng + longitudeOffsetKm * longitudeDegreesPerKm).toFixed(6)),
      shiftStart: shiftStarts[Math.floor(random() * shiftStarts.length)],
      currentMode: 'cab',
    };
  });
}

async function main() {
  const places = JSON.parse(await readFile(resolve(projectRoot, 'data/places.json'), 'utf8'));
  const employees = generateEmployees(places);
  const destination = resolve(projectRoot, 'data/employees.json');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(employees, null, 2)}\n`);
  console.log(`Wrote ${employees.length} deterministic synthetic employees to data/employees.json (seed ${SEED}).`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
