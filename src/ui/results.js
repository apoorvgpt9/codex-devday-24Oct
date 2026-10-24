function formatLakh(amount) {
  return `₹${(amount / 100000).toFixed(1)} lakh`;
}

function formatCo2(tonnes) {
  return `${Math.round(tonnes)} t`;
}

export function renderResults(analysis) {
  document.querySelector('#switcher-count').textContent = analysis.totals.switchers.toLocaleString('en-IN');
  document.querySelector('#net-saving').textContent = formatLakh(analysis.totals.netMonthlySaving);
  document.querySelector('#bus-count').textContent = analysis.fleet.buses ? String(analysis.fleet.buses) : 'No company buses';
  document.querySelector('#co2-saved').textContent = formatCo2(analysis.totals.co2TonnesPerYear);

  const stations = document.querySelector('#boarding-stations');
  stations.replaceChildren(...analysis.totals.byBoardingStation.map((station) => {
    const item = document.createElement('li');
    const count = document.createElement('span');
    count.textContent = `${station.name}: ${station.switchers}`;
    item.append(count);
    return item;
  }));
}
