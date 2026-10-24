import { analyseCommute, compareHeadways } from './model/commute.js';
import { renderAssumptions } from './ui/assumptions.js';
import { bindControls } from './ui/controls.js';
import { renderFrequencyChart } from './ui/frequency-chart.js';
import { createMap } from './ui/map.js';
import { setupMemo } from './ui/memo.js';
import { setupRobustness } from './ui/robustness.js';
import { renderResults } from './ui/results.js';
import { setupWorkforceImport } from './ui/workforce-import.js';

const loadJson = (path) => fetch(path).then((response) => {
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
});

async function start() {
  const [syntheticEmployees, places, stations, assumptions] = await Promise.all([
    loadJson('data/employees.json'),
    loadJson('data/places.json'),
    loadJson('data/stations.json'),
    loadJson('data/assumptions.json'),
  ]);
  let employees = syntheticEmployees;
  let workforceType = 'synthetic';
  const fixedContext = {
    office: places.office,
    stations,
  };
  let map;
  let comparisons;
  let recommendation;
  let recommendationKey;
  let currentContext;
  const memo = setupMemo();
  const robustness = setupRobustness(() => ({
    employees,
    context: currentContext,
    assumptionDocument: assumptions,
  }));
  renderAssumptions(assumptions);

  function changeWorkforce(nextEmployees, nextWorkforceType) {
    employees = nextEmployees;
    workforceType = nextWorkforceType;
    map = null;
    recommendationKey = null;
    update(currentContext);
  }
  setupWorkforceImport({
    onImported: (uploadedEmployees) => changeWorkforce(uploadedEmployees, 'uploaded'),
    onReset: () => changeWorkforce(syntheticEmployees, 'synthetic'),
  });

  function update(nextContext) {
    const context = { ...fixedContext, ...nextContext };
    currentContext = context;
    const analysis = analyseCommute(employees, context, assumptions);
    const nextRecommendationKey = `${context.toleranceMin}:${context.line3Open}`;
    if (recommendationKey !== nextRecommendationKey) {
      comparisons = compareHeadways(employees, context, assumptions);
      recommendation = comparisons
        .slice()
        .sort((left, right) => right.analysis.totals.netMonthlySaving - left.analysis.totals.netMonthlySaving)[0];
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
        workforceType,
      });
    } else {
      map.update(analysis.results, context.toleranceMin, context.line3Open, analysis.totals.byBoardingStation);
    }
    renderResults(analysis);
    renderFrequencyChart(comparisons, recommendation, context);
    memo.render({
      analysis,
      context,
      recommendation,
      assumptionDocument: assumptions,
      workforceType,
    });
    robustness.invalidate();
    document.querySelector('#workforce-notice').textContent = `${workforceType === 'uploaded' ? 'Uploaded' : 'Synthetic'} workforce data.`;
    document.querySelector('#memo-intro').textContent = `Generated from the selected scenario and the locally stored ${workforceType} workforce model.`;
    document.querySelector('#map-status').textContent = `${analysis.totals.switchers} of ${analysis.totals.workforce} ${workforceType} employees can switch with this plan.`;
  }

  const initialContext = bindControls(document.querySelector('#controls'), update);
  update(initialContext);
}

start().catch((error) => {
  console.error(error);
  document.querySelector('#map-status').textContent = 'The local data files could not be loaded.';
});
