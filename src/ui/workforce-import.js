import { parseWorkforceCsv } from '../model/workforce.js';

export function setupWorkforceImport({ onImported, onReset }) {
  const input = document.querySelector('#workforce-file');
  const banner = document.querySelector('#upload-status');
  const reset = document.querySelector('#reset-workforce');

  input.addEventListener('change', () => {
    const [file] = input.files;
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      try {
        const report = parseWorkforceCsv(String(reader.result));
        if (!report.employees.length) throw new Error('No valid Pune-area rows were found.');
        onImported(report.employees);
        banner.textContent = `Using your uploaded data: ${report.employees.length} employees (${report.skipped} rows skipped).`;
        banner.hidden = false;
        reset.hidden = false;
      } catch (error) {
        banner.textContent = `Could not use this file: ${error.message}`;
        banner.hidden = false;
        reset.hidden = true;
      }
    });
    reader.readAsText(file);
  });

  reset.addEventListener('click', () => {
    input.value = '';
    banner.hidden = true;
    reset.hidden = true;
    onReset();
  });
}
