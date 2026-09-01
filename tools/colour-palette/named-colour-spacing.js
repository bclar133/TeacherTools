(() => {
  'use strict';

  function spacedColourName(value) {
    return String(value || '')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      .trim();
  }

  function updateNames(root = document) {
    root.querySelectorAll?.('.named-colour-name, #namedColourSelectedName, #gameV2Target').forEach((node) => {
      const current = node.textContent.trim();
      const spaced = spacedColourName(current);
      if (spaced && spaced !== current) node.textContent = spaced;
    });
  }

  updateNames();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.nodeType === Node.ELEMENT_NODE) updateNames(mutation.target);
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches?.('.named-colour-name, #namedColourSelectedName, #gameV2Target')) {
            const current = node.textContent.trim();
            const spaced = spacedColourName(current);
            if (spaced && spaced !== current) node.textContent = spaced;
          }
          updateNames(node);
        }
      });
    });
  });

  observer.observe(document.body, { childList:true, subtree:true, characterData:true });
})();
