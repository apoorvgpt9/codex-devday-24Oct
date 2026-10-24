import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateEmployees } from './gen-employees.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const places = JSON.parse(await readFile(resolve(root, 'data/places.json'), 'utf8'));
const employees = generateEmployees(places, { seed: 77, count: 150 });
const csv = ['lat,lng,shiftStart', ...employees.map((employee) => `${employee.lat},${employee.lng},${employee.shiftStart}`)].join('\n');
await writeFile(resolve(root, 'data/sample-upload.csv'), `${csv}\n`);
