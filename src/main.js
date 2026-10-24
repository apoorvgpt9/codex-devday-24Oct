import { analyseCommute } from './model/commute.js';
import { createMap } from './ui/map.js';

const loadJson = (path) => fetch(path).then((response) => {
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
});

async function start() {
  const [employees, places, stations, assumptions] = await Promise.all([
    loadJson('data/employees.json'),
    loadJson('data/places.json'),
    loadJson('data/stations.json'),
    loadJson('data/assumptions.json'),
  ]);
  const context = {
    office: places.office,
    stations,
    service: 'shuttle',
    headwayMin: 15,
    toleranceMin: 10,
    line3Open: false,
  };
  const analysis = analyseCommute(employees, context, assumptions);
  createMap(document.querySelector('#map'), { stations, places, results: analysis.results, toleranceMin: context.toleranceMin });
  document.querySelector('#map-status').textContent = `${analysis.totals.switchers} of ${analysis.totals.workforce} synthetic employees can switch at the default setting.`;
}

start().catch((error) => {
  console.error(error);
  document.querySelector('#map-status').textContent = 'The local data files could not be loaded.';
});
