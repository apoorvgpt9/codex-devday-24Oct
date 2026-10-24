export function bindControls(form, onChange) {
  const headway = form.elements.headway;
  const tolerance = form.elements.tolerance;
  const line3 = form.elements.line3;
  const headwayValue = document.querySelector('#headway-value');
  const toleranceValue = document.querySelector('#tolerance-value');

  function readContext() {
    const service = form.elements.service.value;
    headway.disabled = service === 'pmpml';
    headwayValue.textContent = service === 'pmpml' ? 'PMPML: 30 min' : `${headway.value} min`;
    toleranceValue.textContent = `+${tolerance.value} min`;
    return {
      service,
      headwayMin: Number(headway.value),
      toleranceMin: Number(tolerance.value),
      line3Open: line3.checked,
    };
  }

  form.addEventListener('input', () => onChange(readContext()));
  form.addEventListener('change', () => onChange(readContext()));
  return readContext();
}
