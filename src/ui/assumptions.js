function displayValue(value) {
  if (Array.isArray(value)) return value.map((item) => `[${item.join(', ')}]`).join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
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
        `${displayValue(detail.value)}${detail.unit ? ` ${detail.unit}` : ''}`,
        detail.source,
        detail.confidence,
      ];
      cells.forEach((text) => {
        const cell = document.createElement('td');
        cell.textContent = text;
        row.append(cell);
      });
      return row;
    });
  body.replaceChildren(...rows);
}
