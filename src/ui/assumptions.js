function indianCurrency(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

function displayValue(detail) {
  const { value, unit } = detail;
  if (detail.label === 'Metro fare by stations travelled') {
    return value.map(([maximumStations, fare]) => `≤${maximumStations} stations ${indianCurrency(fare)}`).join(' · ');
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number' && unit.includes('₹')) {
    return `${indianCurrency(value)}${unit.replace('₹', '').replaceAll('/', ' / ')}`;
  }
  return String(value);
}

export function renderAssumptions(assumptionDocument) {
  const body = document.querySelector('#assumptions-body');
  const rows = Object.values(assumptionDocument)
    .filter((detail) => detail && typeof detail === 'object' && 'label' in detail)
    .map((detail) => {
      const row = document.createElement('tr');
      const cells = [
        detail.label,
        `${displayValue(detail)}${detail.unit && !detail.unit.includes('₹') ? ` ${detail.unit}` : ''}`,
        detail.source,
        detail.confidence,
      ];
      cells.forEach((text, index) => {
        const cell = document.createElement('td');
        cell.textContent = text;
        if (index === 3) cell.className = `assumption-confidence confidence--${detail.confidence}`;
        row.append(cell);
      });
      return row;
    });
  body.replaceChildren(...rows);
}
