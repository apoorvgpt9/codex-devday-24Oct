import { valuesFromAssumptions } from '../model/commute.js';

const confidenceRank = { low: 0, medium: 1, high: 2 };

function formatLakh(amount) {
  return `₹${(amount / 100000).toFixed(1)} lakh`;
}

function serviceName(context) {
  return context.service === 'pmpml' ? 'PMPML-only plan' : `company shuttle every ${context.headwayMin} minutes`;
}

function recommendationName(recommendation) {
  return recommendation.service === 'pmpml'
    ? 'use PMPML only'
    : `run a company shuttle every ${recommendation.headwayMin} minutes`;
}

export function buildMemo({ analysis, context, recommendation, assumptionDocument }) {
  const recommended = recommendation.analysis;
  const topStations = recommended.totals.byBoardingStation
    .slice(0, 3)
    .map((station) => `${station.name} (${station.switchers})`)
    .join(', ');
  const lowestConfidence = Object.values(assumptionDocument)
    .filter((detail) => detail && typeof detail === 'object' && 'confidence' in detail)
    .sort((left, right) => confidenceRank[left.confidence] - confidenceRank[right.confidence])
    .slice(0, 3)
    .map((detail) => detail.label)
    .join(', ');
  const values = valuesFromAssumptions(assumptionDocument);
  const line3Note = context.line3Open
    ? 'Line 3 is included as an open what-if, so this is not a current-service commitment.'
    : 'Line 3 remains a future what-if and is excluded from this recommendation.';

  return `Finance,\n\nRecommendation: ${recommendationName(recommendation)}. It needs ${recommended.fleet.buses} buses and can shift ${recommended.totals.switchers} people to Metro + last mile, with ${formatLakh(recommended.totals.netMonthlySaving)} net monthly saving and ${Math.round(recommended.totals.co2TonnesPerYear)} t CO₂ avoided each year.\n\nAt the selected ${serviceName(context)}, ${analysis.totals.switchers} people can switch and net monthly saving is ${formatLakh(analysis.totals.netMonthlySaving)}. The three most-used boarding stations are ${topStations}. This comparison reimburses Metro, access, and PMPML fares where applicable across ${values.workDaysPerMonth} office days each month. ${line3Note} Validate the lowest-confidence inputs before contracting: ${lowestConfidence}. All figures use synthetic workforce data and the visible local assumptions.`;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const fallback = document.createElement('textarea');
  fallback.value = text;
  fallback.setAttribute('readonly', '');
  fallback.style.position = 'fixed';
  fallback.style.opacity = '0';
  document.body.append(fallback);
  fallback.select();
  document.execCommand('copy');
  fallback.remove();
}

export function setupMemo() {
  const copyButton = document.querySelector('#copy-memo');
  const copyStatus = document.querySelector('#copy-status');
  const memo = document.querySelector('#memo-text');
  let currentText = '';

  copyButton.addEventListener('click', async () => {
    try {
      await copyText(currentText);
      copyStatus.textContent = 'Memo copied to clipboard.';
    } catch {
      copyStatus.textContent = 'Could not copy automatically. Select the memo text and copy it.';
    }
  });

  return {
    render(data) {
      currentText = buildMemo(data);
      memo.textContent = currentText;
      copyStatus.textContent = '';
    },
  };
}
