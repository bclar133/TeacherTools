(() => {
  'use strict';

  if (window.__mobileStopwatchLayoutFixV1) return;
  window.__mobileStopwatchLayoutFixV1 = true;

  const style = document.createElement('style');
  style.id = 'mobileStopwatchLayoutFixV1';
  style.textContent = `
    @media (max-width:600px) {
      /* Normal phone view: the watch is positioned independently from the controls.
         Scaling a 370x450 element alone does not shrink its layout box, so make the
         scene a real compact box and absolutely position the physical watch inside it. */
      body:not(.presentation-mode) #stopwatchWorkspace .solo-panel {
        padding:8px!important;
      }

      body:not(.presentation-mode) #stopwatchWorkspace .mode-toolbar {
        margin-bottom:4px!important;
      }

      body:not(.presentation-mode) #stopwatchWorkspace #stopwatchStage {
        display:flex!important;
        flex-direction:column!important;
        align-items:stretch!important;
        min-height:0!important;
        height:auto!important;
        padding:5px 6px 7px!important;
        gap:4px!important;
        overflow:hidden!important;
      }

      body:not(.presentation-mode) #stopwatchWorkspace .stopwatch-scene {
        position:relative!important;
        display:block!important;
        flex:0 0 170px!important;
        width:100%!important;
        min-height:170px!important;
        height:170px!important;
        padding:0!important;
        margin:0!important;
        overflow:hidden!important;
      }

      body:not(.presentation-mode) #stopwatchWorkspace .stopwatch-body {
        position:absolute!important;
        left:50%!important;
        right:auto!important;
        top:25px!important;
        margin:0!important;
        transform:translateX(-50%) scale(.31)!important;
        transform-origin:50% 0!important;
      }

      body:not(.presentation-mode) #stopwatchWorkspace .stopwatch-actions {
        order:2!important;
        display:flex!important;
        flex-direction:row!important;
        flex-wrap:nowrap!important;
        width:100%!important;
        margin:0!important;
        padding:0!important;
        gap:5px!important;
      }

      body:not(.presentation-mode) #stopwatchWorkspace .stopwatch-actions .control-button {
        flex:1 1 0!important;
        width:0!important;
        min-width:0!important;
        min-height:40px!important;
        padding:0 5px!important;
        font-size:.74rem!important;
        white-space:nowrap!important;
      }

      body:not(.presentation-mode) #stopwatchWorkspace .laps-list {
        order:3!important;
        width:100%!important;
        max-height:44px!important;
        min-height:18px!important;
        margin:0!important;
        padding:2px 0 0!important;
        overflow:auto!important;
        font-size:.65rem!important;
        line-height:1.15!important;
      }

      body:not(.presentation-mode) #stopwatchWorkspace .laps-list li {
        padding:2px 5px!important;
      }

      body:not(.presentation-mode) #stopwatchWorkspace .mobile-fullscreen-entry {
        order:4!important;
        width:100%!important;
        margin:2px 0 0!important;
        gap:2px!important;
      }

      body:not(.presentation-mode) #stopwatchWorkspace .mobile-fullscreen-button {
        min-height:38px!important;
        font-size:.78rem!important;
      }

      body:not(.presentation-mode) #stopwatchWorkspace .mobile-fullscreen-note {
        font-size:.57rem!important;
        line-height:1.15!important;
      }

      /* Keep the portrait fullscreen watch compact enough to leave clear room for
         the floating lap panel and controls. */
      body.presentation-mode #stopwatchWorkspace .stopwatch-body {
        transform:scale(.47)!important;
        top:-34px!important;
      }
    }
  `;

  document.head.appendChild(style);
})();
