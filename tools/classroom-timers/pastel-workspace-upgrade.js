(() => {
  'use strict';

  if (window.__pastelWorkspaceUpgradeV1) return;
  window.__pastelWorkspaceUpgradeV1 = true;

  const style = document.createElement('style');
  style.id = 'pastelWorkspaceUpgradeStyleV1';
  style.textContent = `
    /* The three live timer areas use the same ambient pastel treatment as DVD Bounce. */
    #intervalWorkspace .builder-stage,
    #scheduleWorkspace .builder-stage,
    #focusWorkspace .focus-panel {
      background-image:none!important;
      background:var(--workspace-pastel,#f3c6d8)!important;
      transition:background-color 7s ease-in-out, background 7s ease-in-out!important;
    }

    /* Make sure presentation mode does not replace the colour with the old panel background. */
    body.presentation-mode #intervalWorkspace .builder-stage,
    body.presentation-mode #scheduleWorkspace .builder-stage,
    body.presentation-mode #focusWorkspace .focus-panel {
      background-image:none!important;
      background:var(--workspace-pastel,#f3c6d8)!important;
    }

    /* Keep text readable over every pastel. */
    #intervalWorkspace .builder-stage,
    #scheduleWorkspace .builder-stage,
    #focusWorkspace .focus-panel {
      color:#172033;
    }
    #intervalWorkspace .builder-stage .eyebrow,
    #scheduleWorkspace .builder-stage .eyebrow,
    #focusWorkspace .focus-panel .eyebrow {
      color:#5548b8;
    }

    html[data-theme="dark"] #intervalWorkspace .builder-stage,
    html[data-theme="dark"] #scheduleWorkspace .builder-stage,
    html[data-theme="dark"] #focusWorkspace .focus-panel {
      color:#172033;
      filter:saturate(.78) brightness(.82);
    }
  `;
  document.head.appendChild(style);

  const PASTELS = [
    '#f3c6d8',
    '#ffd0c2',
    '#ffe3a8',
    '#cdebbf',
    '#bdebdc',
    '#bcdff5',
    '#c9d0f4',
    '#d9c6f2',
    '#efc7e8'
  ];

  const targets = [
    document.querySelector('#intervalWorkspace .builder-stage'),
    document.querySelector('#focusWorkspace .focus-panel'),
    document.querySelector('#scheduleWorkspace .builder-stage')
  ].filter(Boolean);

  const states = new Map(targets.map((el, index) => [el, { index: index % PASTELS.length }]));

  function chooseNext(el) {
    const state = states.get(el);
    if (!state) return;
    let next = state.index;
    while (next === state.index && PASTELS.length > 1) {
      next = Math.floor(Math.random() * PASTELS.length);
    }
    state.index = next;
    el.style.setProperty('--workspace-pastel', PASTELS[next]);
  }

  /* Give each workspace an immediate visible colour, then drift independently. */
  targets.forEach((el, index) => {
    el.style.setProperty('--workspace-pastel', PASTELS[(index * 3) % PASTELS.length]);
  });

  window.setInterval(() => {
    targets.forEach(chooseNext);
  }, 8000);
})();
