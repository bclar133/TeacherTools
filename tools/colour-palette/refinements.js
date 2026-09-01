(() => {
  'use strict';

  const wheel = document.getElementById('colourWheel');
  const brightnessControl = document.querySelector('.brightness-control');
  const rgbFieldset = document.querySelector('.rgb-fieldset');
  const rgbReadout = document.getElementById('rgbReadout');
  const toast = document.getElementById('toast');

  if (wheel) wheel.style.width = 'min(100%, 650px)';
  if (brightnessControl) brightnessControl.style.maxWidth = '650px';

  if (!rgbFieldset || !rgbReadout) return;

  const row = document.createElement('div');
  row.className = 'format-row rgb-copy-row';
  row.innerHTML = `
    <label for="rgbCopyInput">RGB code</label>
    <div class="input-with-action">
      <input id="rgbCopyInput" type="text" readonly aria-label="RGB code">
      <button class="copy-button" id="copyRgbBtn" type="button" aria-label="Copy RGB value">Copy</button>
    </div>
  `;
  rgbFieldset.insertAdjacentElement('afterend', row);

  const rgbCopyInput = document.getElementById('rgbCopyInput');
  const copyRgbBtn = document.getElementById('copyRgbBtn');
  let toastTimer = 0;

  function updateRgbCopy() {
    const parts = rgbReadout.textContent.split(',').map((part) => part.trim());
    rgbCopyInput.value = parts.length === 3 ? `(${parts.join(',')})` : rgbReadout.textContent.trim();
  }

  function showCopiedToast() {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = 'RGB copied to clipboard';
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1450);
  }

  async function copyRgb() {
    const value = rgbCopyInput.value;
    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        copied = true;
      }
    } catch (_) {}

    if (!copied) {
      rgbCopyInput.focus();
      rgbCopyInput.select();
      try { copied = document.execCommand('copy'); } catch (_) {}
    }

    if (copied) {
      const original = copyRgbBtn.textContent;
      copyRgbBtn.textContent = 'Copied';
      showCopiedToast();
      setTimeout(() => { copyRgbBtn.textContent = original; }, 900);
    }
  }

  new MutationObserver(updateRgbCopy).observe(rgbReadout, {
    childList: true,
    characterData: true,
    subtree: true
  });

  copyRgbBtn.addEventListener('click', copyRgb);
  updateRgbCopy();
})();
