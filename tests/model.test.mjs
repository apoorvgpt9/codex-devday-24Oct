import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { analyseCommute, evaluateEmployee, valuesFromAssumptions } from '../src/model/commute.js';
import { haversineKm } from '../src/model/geo.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const load = (name) => readFile(resolve(root, 'data', name), 'utf8').then(JSON.parse);
const [employees, places, stations, assumptionDocument] = await Promise.all([
  load('employees.json'), load('places.json'), load('stations.json'), load('assumptions.json'),
]);
const assumptions = valuesFromAssumptions(assumptionDocument);
const context = { office: places.office, stations, service: 'shuttle', headwayMin: 15, line3Open: false, toleranceMin: 10 };

function employeeAt(id, lat, lng, shiftStart = '09:00') {
  return { id, cluster: 'test', lat, lng, shiftStart, currentMode: 'cab' };
}

test('Ramwadi to EON is approximately 3.5–4.5 km straight-line', () => {
  const ramwadi = stations.lines.flatMap((line) => line.stations).find((station) => station.id === 'ramwadi');
  const distance = haversineKm(ramwadi, places.office);
  assert.ok(distance >= 3.5 && distance <= 4.5, `expected 3.5–4.5 km, got ${distance}`);
});

test('an employee near Vanaz switches at the default settings', () => {
  const vanaz = stations.lines[0].stations[0];
  const result = evaluateEmployee(employeeAt('vanaz-test', vanaz.lat, vanaz.lng), context, assumptions);
  assert.equal(result.canSwitch, true);
});

test('an employee near Kalyani Nagar stays on a cab because the cab ride is short', () => {
  const kalyani = stations.lines[0].stations.find((station) => station.id === 'kalyani-nagar');
  const result = evaluateEmployee(employeeAt('kalyani-test', kalyani.lat, kalyani.lng), context, assumptions);
  assert.equal(result.canSwitch, false);
});

test('an employee in Wagholi is ineligible because no station is within reach', () => {
  const wagholi = places.clusters.find((cluster) => cluster.id === 'wagholi');
  const result = evaluateEmployee(employeeAt('wagholi-test', wagholi.lat, wagholi.lng), context, assumptions);
  assert.equal(result.canSwitch, false);
  assert.equal(result.reason, 'too far from any station');
});

test('opening Line 3 changes the verdict for a Wakad/Hinjewadi employee', () => {
  const wakad = places.clusters.find((cluster) => cluster.id === 'wakad-hinjewadi');
  const employee = employeeAt('wakad-test', wakad.lat, wakad.lng);
  const withoutLine3 = evaluateEmployee(employee, context, assumptions);
  const withLine3 = evaluateEmployee(employee, { ...context, line3Open: true }, assumptions);
  assert.notEqual(withoutLine3.canSwitch, withLine3.canSwitch);
  assert.equal(withLine3.canSwitch, true);
});

test('fleet sizing returns at least one bus whenever there are switchers', () => {
  const analysis = analyseCommute(employees, context, assumptionDocument);
  assert.ok(analysis.totals.switchers > 0);
  assert.ok(analysis.fleet.buses >= 1);
});

test('PMPML-only service produces fewer switchers than a 15-minute company shuttle', () => {
  const pmpml = analyseCommute(employees, { ...context, service: 'pmpml', headwayMin: 30 }, assumptionDocument);
  const shuttle = analyseCommute(employees, context, assumptionDocument);
  assert.ok(pmpml.totals.switchers < shuttle.totals.switchers);
});

test('PMPML switchers do not exceed the available feeder seats across three shifts', () => {
  const pmpml = analyseCommute(employees, { ...context, service: 'pmpml', headwayMin: 30 }, assumptionDocument);
  const capacityPerShift = Math.floor(assumptions.shiftWindowMin / assumptions.pmpmlHeadwayMin)
    * assumptions.pmpmlSpareSeatsPerBus;
  assert.ok(pmpml.totals.switchers <= 3 * capacityPerShift);
});

test('reimbursed fares charge a single switcher for round-trip fares across work days', () => {
  const vanaz = stations.lines[0].stations[0];
  const employee = employeeAt('single-vanaz', vanaz.lat, vanaz.lng);
  const analysis = analyseCommute([employee], context, assumptionDocument);
  const [result] = analysis.switchers;
  const expected = 2 * (result.metro.metroFare + result.metro.accessCost) * assumptions.workDaysPerMonth;
  assert.equal(analysis.totals.reimbursedFares, expected);
});

test('a 15-minute company shuttle saves more than PMPML-only and a 10-minute shuttle', () => {
  const pmpml = analyseCommute(employees, { ...context, service: 'pmpml', headwayMin: 30 }, assumptionDocument);
  const shuttle15 = analyseCommute(employees, context, assumptionDocument);
  const shuttle10 = analyseCommute(employees, { ...context, headwayMin: 10 }, assumptionDocument);
  assert.ok(shuttle15.totals.netMonthlySaving > pmpml.totals.netMonthlySaving);
  assert.ok(shuttle15.totals.netMonthlySaving > shuttle10.totals.netMonthlySaving);
});
