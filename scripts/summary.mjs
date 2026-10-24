import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyseCommute } from '../src/model/commute.js';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const load = (name) => readFile(resolve(root, 'data', name), 'utf8').then(JSON.parse);
const [employees, places, stations, assumptions] = await Promise.all([
  load('employees.json'), load('places.json'), load('stations.json'), load('assumptions.json'),
]);

const scenarios = [
  ['PMPML only (30 min)', { service: 'pmpml', headwayMin: 30, line3Open: false }],
  ['Company shuttle 15 min', { service: 'shuttle', headwayMin: 15, line3Open: false }],
  ['Company shuttle 10 min', { service: 'shuttle', headwayMin: 10, line3Open: false }],
  ['Company shuttle 15 min + Line 3', { service: 'shuttle', headwayMin: 15, line3Open: true }],
];

for (const [label, options] of scenarios) {
  const analysis = analyseCommute(employees, {
    ...options,
    office: places.office,
    stations,
    toleranceMin: 10,
  }, assumptions);
  const lakh = analysis.totals.netMonthlySaving / 100000;
  console.log(
    `${label}: ${analysis.totals.switchers} switchers / ${employees.length}; `
    + `${analysis.fleet.buses} buses; ₹${lakh.toFixed(1)} lakh net saving/month`,
  );
}
