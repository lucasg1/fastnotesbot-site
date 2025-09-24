const ready = (cb: () => void) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cb, { once: true });
  } else {
    cb();
  }
};

ready(() => {
  const root = document.getElementById('pricing-calculator');
  if (!root) return;

  const raw = root.getAttribute('data-options') || '[]';
  let options: Array<{ price: number; hours: number; months: number }>;
  try {
    options = JSON.parse(raw);
  } catch {
    options = [];
  }
  if (!Array.isArray(options) || options.length === 0) return;

  const slider = root.querySelector<HTMLInputElement>('#priceSlider');
  const priceDisplay = root.querySelector<HTMLSpanElement>('#priceDisplay');
  const hoursDisplay = root.querySelector<HTMLSpanElement>('#hoursDisplay');
  const expiryDisplay = root.querySelector<HTMLSpanElement>('#expiryDisplay');

  const fmtMonths = (m: number) => `${m} month${m === 1 ? '' : 's'}`;

  const update = (index: number) => {
    const i = Math.max(0, Math.min(index, options.length - 1));
    const sel = options[i];
    if (!sel) return;
    if (priceDisplay) priceDisplay.textContent = `$${sel.price}`;
    if (hoursDisplay) hoursDisplay.textContent = String(sel.hours);
    if (expiryDisplay) expiryDisplay.textContent = fmtMonths(sel.months);
  };

  if (slider) {
    const handler = (e: Event) => {
      const t = e.target as HTMLInputElement;
      const idx = parseInt(t.value, 10) || 0;
      update(idx);
    };
    slider.addEventListener('input', handler);
    slider.addEventListener('change', handler);
    update(parseInt(slider.value, 10) || 0);
  }
});

