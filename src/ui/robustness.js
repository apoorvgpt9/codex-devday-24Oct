import { sensitivity } from '../model/sensitivity.js';

function planLabel(recommendation) {
  return recommendation.service === 'pmpml'
    ? 'PMPML only'
    : `${recommendation.headwayMin} min shuttle`;
}

function sentenceCase(value) {
  return value ? `${value[0].toLowerCase()}${value.slice(1)}` : value;
}

export function setupRobustness(getInput) {
  const button = document.querySelector('#run-robustness');
  const result = document.querySelector('#robustness-result');
  const summary = document.querySelector('#robustness-summary');
  const sensitive = document.querySelector('#robustness-sensitive');
  const body = document.querySelector('#robustness-body');
  function render() {
    const { employees, context, assumptionDocument } = getInput();
    const report = sensitivity(employees, context, assumptionDocument);
    const recommended = planLabel(report.baseline);
    summary.textContent = `${recommended} stays the best plan in ${report.summary.baselineHolds} of ${report.summary.testsRun} tests (±25% on each low-confidence input).`;
    sensitive.textContent = report.summary.mostSensitive
      ? `Most sensitive to ${sentenceCase(report.summary.mostSensitive.label)} — measure it before contracting buses.`
      : '';
    body.replaceChildren(...report.rows.map((row) => {
      const tableRow = document.createElement('tr');
      if (row.changesRecommendation) tableRow.classList.add('robustness-row--changes');
      const status = row.changesRecommendation ? 'Changes the plan' : 'Plan holds';
      tableRow.innerHTML = `<th scope="row">${row.label}</th><td>${planLabel(row.lowRecommendation)}</td><td>${planLabel(row.highRecommendation)}</td><td>${status}</td>`;
      return tableRow;
    }));
    result.hidden = false;
    button.textContent = 'Run robustness test again';
  }

  button.addEventListener('click', render);

  return {
    invalidate() {
      result.hidden = true;
      button.textContent = 'Run robustness test';
    },
  };
}
