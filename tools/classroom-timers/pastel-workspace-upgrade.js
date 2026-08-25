(() => {
  'use strict';

  if (window.__pastelWorkspaceUpgradeV3) return;
  window.__pastelWorkspaceUpgradeV3 = true;

  const style = document.createElement('style');
  style.id = 'pastelWorkspaceUpgradeStyleV3';
  style.textContent = `
    /* Interval, Focus, Schedule and Stopwatch share the same ambient pastel treatment. */
    #intervalWorkspace .builder-stage,
    #scheduleWorkspace .builder-stage,
    #focusWorkspace .focus-panel,
    #stopwatchWorkspace #stopwatchStage {
      background-image:none!important;
      background-color:var(--workspace-pastel,#f3c6d8)!important;
      transition:background-color 7s ease-in-out!important;
    }

    /* Presentation mode must keep the same visible pastel rather than restoring an old panel/stage background. */
    body.presentation-mode #intervalWorkspace .builder-stage,
    body.presentation-mode #scheduleWorkspace .builder-stage,
    body.presentation-mode #focusWorkspace .focus-panel,
    body.presentation-mode #stopwatchWorkspace #stopwatchStage {
      background-image:none!important;
      background-color:var(--workspace-pastel,#f3c6d8)!important;
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

    /* Make the Interval values much easier to read at a glance. */
    #intervalWorkspace .form-grid input {
      font-family:var(--display,'Fredoka',sans-serif)!important;
      font-size:1.45rem!important;
      font-weight:800!important;
      line-height:1!important;
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
    document.querySelector('#scheduleWorkspace .builder-stage'),
    document.querySelector('#stopwatchWorkspace #stopwatchStage')
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

  /* Give each workspace an immediate visible colour, then let each drift independently. */
  targets.forEach((el, index) => {
    const first = (index * 3) % PASTELS.length;
    states.get(el).index = first;
    el.style.setProperty('--workspace-pastel', PASTELS[first]);
  });

  window.setInterval(() => {
    targets.forEach(chooseNext);
  }, 8000);
})();
