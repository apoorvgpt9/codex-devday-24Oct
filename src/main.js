import { analyseCommute, recommendHeadway } from './model/commute.js';
import { renderAssumptions } from './ui/assumptions.js';
import { bindControls } from './ui/controls.js';
import { createMap } from './ui/map.js';
import { setupMemo } from './ui/memo.js';
import { renderResults } from './ui/results.js';

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
  const fixedContext = {
    office: places.office,
    stations,
  };
  let map;
  let recommendation;
  let recommendationKey;
  const memo = setupMemo();
  renderAssumptions(assumptions);

  function update(nextContext) {
    const context = { ...fixedContext, ...nextContext };
    const analysis = analyseCommute(employees, context, assumptions);
    const nextRecommendationKey = `${context.toleranceMin}:${context.line3Open}`;
    if (recommendationKey !== nextRecommendationKey) {
      recommendation = recommendHeadway(employees, context, assumptions);
      recommendationKey = nextRecommendationKey;
    }
    if (!map) {
      map = createMap(document.querySelector('#map'), {
        stations,
        places,
        results: analysis.results,
        toleranceMin: context.toleranceMin,
        line3Open: context.line3Open,
        boardingStations: analysis.totals.byBoardingStation,
      });
    } else {
      map.update(analysis.results, context.toleranceMin, context.line3Open, analysis.totals.byBoardingStation);
    }
    renderResults(analysis);
    memo.render({
      analysis,
      context,
      recommendation,
      assumptionDocument: assumptions,
    });
    document.querySelector('#map-status').textContent = `${analysis.totals.switchers} of ${analysis.totals.workforce} synthetic employees can switch with this plan.`;
  }

  const initialContext = bindControls(document.querySelector('#controls'), update);
  update(initialContext);
}

start().catch((error) => {
  console.error(error);
  document.querySelector('#map-status').textContent = 'The local data files could not be loaded.';
});
