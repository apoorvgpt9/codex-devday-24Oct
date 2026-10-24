function formatLakh(amount) {
  return `₹${(amount / 100000).toFixed(1)}L`;
}

function labelFor(option) {
  return option.service === 'pmpml' ? 'PMPML' : `${option.headwayMin} min`;
}

function svgElement(name, attributes = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

export function renderFrequencyChart(comparisons, recommendation, context) {
  const svg = document.querySelector('#frequency-chart');
  const maximum = Math.max(...comparisons.map((option) => option.analysis.totals.netMonthlySaving));
  const chart = { left: 10, top: 20, width: 300, height: 58, gap: 8 };
  const barWidth = (chart.width - chart.gap * (comparisons.length - 1)) / comparisons.length;

  svg.replaceChildren();
  comparisons.forEach((option, index) => {
    const amount = option.analysis.totals.netMonthlySaving;
    const height = Math.max(4, amount / maximum * chart.height);
    const x = chart.left + index * (barWidth + chart.gap);
    const y = chart.top + chart.height - height;
    const isRecommended = option.service === recommendation.service && option.headwayMin === recommendation.headwayMin;
    const isCurrent = option.service === context.service
      && (option.service === 'pmpml' || option.headwayMin === context.headwayMin);
    const bar = svgElement('rect', {
      x: x.toFixed(1), y: y.toFixed(1), width: barWidth.toFixed(1), height: height.toFixed(1), rx: '1.5',
      class: `frequency-bar${isRecommended ? ' frequency-bar--recommended' : ''}`,
    });
    const title = svgElement('title');
    title.textContent = `${labelFor(option)}: ${formatLakh(amount)} net monthly saving`;
    bar.append(title);
    svg.append(bar);
    if (isCurrent) {
      svg.append(svgElement('rect', {
        x: x.toFixed(1), y: y.toFixed(1), width: barWidth.toFixed(1), height: height.toFixed(1), rx: '1.5',
        class: 'frequency-current-outline',
      }));
    }

    const value = svgElement('text', { x: (x + barWidth / 2).toFixed(1), y: (y - 6).toFixed(1), class: 'frequency-value', 'text-anchor': 'middle' });
    value.textContent = formatLakh(amount);
    svg.append(value);
    const label = svgElement('text', { x: (x + barWidth / 2).toFixed(1), y: '97', class: 'frequency-label', 'text-anchor': 'middle' });
    label.textContent = labelFor(option);
    svg.append(label);
  });
}
