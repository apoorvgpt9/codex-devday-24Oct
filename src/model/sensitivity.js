import { recommendHeadway } from './commute.js';

function samePlan(left, right) {
  return left.service === right.service && left.headwayMin === right.headwayMin;
}

function withAdjustedValue(assumptions, key, value) {
  return {
    ...assumptions,
    [key]: { ...assumptions[key], value },
  };
}

function recommendationFor(assumptions, employees, context) {
  return recommendHeadway(employees, context, assumptions);
}

export function sensitivity(employees, context, assumptionDocument, { deltaPct = 25 } = {}) {
  const baseline = recommendationFor(assumptionDocument, employees, context);
  const delta = deltaPct / 100;
  const baselineSaving = baseline.analysis.totals.netMonthlySaving;
  const rows = Object.entries(assumptionDocument)
    .filter(([, input]) => input?.confidence === 'low' && typeof input.value === 'number')
    .map(([key, input]) => {
      const lowValue = input.value * (1 - delta);
      const highValue = input.value * (1 + delta);
      const lowRecommendation = recommendationFor(withAdjustedValue(assumptionDocument, key, lowValue), employees, context);
      const highRecommendation = recommendationFor(withAdjustedValue(assumptionDocument, key, highValue), employees, context);
      const lowHolds = samePlan(lowRecommendation, baseline);
      const highHolds = samePlan(highRecommendation, baseline);
      const lowNetSaving = lowRecommendation.analysis.totals.netMonthlySaving;
      const highNetSaving = highRecommendation.analysis.totals.netMonthlySaving;

      return {
        key,
        label: input.label,
        lowValue,
        highValue,
        lowRecommendation,
        highRecommendation,
        lowNetSaving,
        highNetSaving,
        changesRecommendation: !lowHolds || !highHolds,
        testsHolding: Number(lowHolds) + Number(highHolds),
        sensitivityScore: Math.abs(lowNetSaving - baselineSaving) + Math.abs(highNetSaving - baselineSaving),
      };
    });
  const testsRun = rows.length * 2;
  const baselineHolds = rows.reduce((count, row) => count + row.testsHolding, 0);
  const mostSensitive = rows.slice().sort((left, right) => right.sensitivityScore - left.sensitivityScore)[0] ?? null;

  return {
    baseline,
    rows,
    summary: { testsRun, baselineHolds, mostSensitive },
  };
}
