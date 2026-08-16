(() => {
  'use strict';

  const MAX_STUDENTS = 28;
  const GRID_SIZE = 10;
  const CELL_COUNT = GRID_SIZE * GRID_SIZE;
  const SAVED_CLASSES_KEY = 'teacherToolsRandomPickerSavedClasses';
  const SAVED_LAYOUTS_KEY = 'teacherToolsSeatingPlanLayoutsV1';
  const CURRENT_KEY = 'teacherToolsSeatingPlanCurrentV1';
  const THEME_KEY = 'teacherToolsTheme';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const refs = {
    namesInput: $('#namesInput'), studentCount: $('#studentCount'), rosterWarning: $('#rosterWarning'),
    savedClassSelect: $('#savedClassSelect'), classNameInput: $('#classNameInput'), saveClassBtn: $('#saveClassBtn'),
    loadClassBtn: $('#loadClassBtn'), deleteClassBtn: $('#deleteClassBtn'), cleanBtn: $('#cleanBtn'), sortBtn: $('#sortBtn'), clearBtn: $('#clearBtn'),
    arrangementSelect: $('#arrangementSelect'), arrangeBtn: $('#arrangeBtn'), schemeSelect: $('#schemeSelect'), singleColour: $('#singleColour'), applySchemeBtn: $('#applySchemeBtn'),
    classroomGrid: $('#classroomGrid'), placedCount: $('#placedCount'), clearFixturesBtn: $('#clearFixturesBtn'), resetRoomBtn: $('#resetRoomBtn'), clearPositionsBtn: $('#clearPositionsBtn'),
    selectionBar: $('#selectionBar'), selectedStudentName: $('#selectedStudentName'), studentColour: $('#studentColour'), closeSelectionBtn: $('#closeSelectionBtn'),
    printBtn: $('#printBtn'), themeBtn: $('#themeBtn'), showPlanBtn: $('#showPlanBtn'), planPanel: $('#planPanel'), toast: $('#toast')
  };

  const palettes = {
    pastel: ['#fde4ef','#fff0c9','#dff1ff','#dff7ef','#e8e0ff','#ffe3d2','#d9f4f1','#f3dcff','#dfe8ff','#f8e6c4','#e0f5d7','#ffdce8'],
    bright: ['#ff5d73','#ff8c42','#ffd166','#69d278','#3bc9db','#4dabf7','#748ffc','#9775fa','#e66bdb','#f06595'],
    cool: ['#b8f2e6','#aed9e0','#a9def9','#cdb4db','#d0c4ff','#bde0fe','#bee1e6','#c3f0ca'],
    warm: ['#ffd6a5','#fdffb6','#ffc6a8','#ffadad','#fbc4ab','#f8edeb','#fec89a','#ffe5d9'],
    rainbow: ['#ff6b6b','#ff922b','#ffd43b','#69db7c','#38d9a9','#4dabf7','#748ffc','#9775fa','#da77f2','#f06595']
  };

  const fixtureMeta = {
    teacher: { label: 'Teacher desk', icon: '🧑‍🏫' },
    door: { label: 'Door', icon: '🚪' },
    whiteboard: { label: 'Whiteboard', icon: '▭' },
    screen: { label: 'Screen', icon: '🖥️' }
  };

  const state = {
    students: [], fixtures: [], selected: null, dragItem: null,
    scheme: 'pastel', arrangement: 'rows', overLimit: false, fixtureCounter: 1
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  function normalizeLine(line) {
    return line.trim().replace(/\s+/g, ' ');
  }

  function rawRosterEntries(raw, applyLimit = true) {
    const lines = raw.split(/[\n\r\t;]+/).map(normalizeLine).filter(Boolean);
    const entries = [];
    for (const line of lines) {
      let first = '';
      let surname = '';
      if (line.includes(',')) {
        const parts = line.split(',').map(normalizeLine).filter(Boolean);
        surname = parts[0] || '';
        first = (parts[1] || '').split(' ')[0] || surname;
      } else {
        const words = line.split(' ').filter(Boolean);
        first = words[0] || '';
        surname = words.length > 1 ? words[words.length - 1] : '';
      }
      if (!first) continue;
      const key = `${first}|${surname}`.toLocaleLowerCase();
      if (!entries.some(entry => entry.key === key)) entries.push({ first, surname, key });
    }
    return applyLimit ? entries.slice(0, MAX_STUDENTS) : entries;
  }

  function cleanedDisplayNames(raw, applyLimit = true) {
    const entries = rawRosterEntries(raw, applyLimit);
    const byFirst = new Map();
    entries.forEach(entry => {
      const key = entry.first.toLocaleLowerCase();
      if (!byFirst.has(key)) byFirst.set(key, []);
      byFirst.get(key).push(entry);
    });

    return entries.map(entry => {
      const sameFirst = byFirst.get(entry.first.toLocaleLowerCase()) || [];
      if (sameFirst.length === 1) return entry.first;
      if (!entry.surname) return `${entry.first} ${sameFirst.indexOf(entry) + 1}`;
      let prefixLength = 1;
      const surnames = sameFirst.map(item => item.surname || '');
      while (prefixLength < entry.surname.length) {
        const prefix = entry.surname.slice(0, prefixLength).toLocaleLowerCase();
        if (surnames.filter(s => s.slice(0, prefixLength).toLocaleLowerCase() === prefix).length === 1) break;
        prefixLength += 1;
      }
      return `${entry.first} ${entry.surname.slice(0, prefixLength)}`;
    });
  }

  function hashString(value) {
    let hash = 0;
    for (const char of value) hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
    return Math.abs(hash);
  }

  function randomInt(max) {
    if (max <= 0) return 0;
    if (window.crypto?.getRandomValues) {
      const values = new Uint32Array(1);
      window.crypto.getRandomValues(values);
      return values[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function shuffled(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function textColour(hex) {
    const clean = hex.replace('#', '');
    if (clean.length !== 6) return '#243046';
    const r = parseInt(clean.slice(0,2), 16);
    const g = parseInt(clean.slice(2,4), 16);
    const b = parseInt(clean.slice(4,6), 16);
    const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
    return luminance > .63 ? '#243046' : '#ffffff';
  }

  function colourFor(name, index, scheme = state.scheme) {
    if (scheme === 'single') return refs.singleColour.value;
    const palette = palettes[scheme] || palettes.pastel;
    if (scheme === 'rainbow') return palette[index % palette.length];
    return palette[(hashString(name) + index * 3) % palette.length];
  }

  function createDefaultFixtures() {
    state.fixtures = [
      { id: 'fixture-default-board', type: 'whiteboard', cell: 4 },
      { id: 'fixture-default-desk', type: 'teacher', cell: 17 },
      { id: 'fixture-default-door', type: 'door', cell: 90 }
    ];
    state.fixtureCounter = 1;
  }

  function occupiedMap() {
    const map = new Map();
    state.students.forEach(student => { if (Number.isInteger(student.cell)) map.set(student.cell, { kind: 'student', id: student.id }); });
    state.fixtures.forEach(item => { if (Number.isInteger(item.cell)) map.set(item.cell, { kind: 'fixture', id: item.id }); });
    return map;
  }

  function availableCells(order = [...Array(CELL_COUNT).keys()]) {
    const fixtureCells = new Set(state.fixtures.map(item => item.cell));
    return order.filter(cell => !fixtureCells.has(cell));
  }

  function seatingOrder(type) {
    const cell = (r, c) => r * GRID_SIZE + c;
    let order = [];

    if (type === 'pairs') {
      const cols = [0,1,4,5,8,9];
      for (let r = 2; r < 10; r++) cols.forEach(c => order.push(cell(r,c)));
      for (let r = 1; r >= 0; r--) cols.forEach(c => order.push(cell(r,c)));
    } else if (type === 'groups') {
      const rowPairs = [[2,3],[5,6],[8,9],[0,1]];
      const colPairs = [[0,1],[4,5],[8,9]];
      rowPairs.forEach(rows => colPairs.forEach(cols => rows.forEach(r => cols.forEach(c => order.push(cell(r,c))))));
    } else if (type === 'ushape') {
      const seen = new Set();
      const push = (r,c) => { const value = cell(r,c); if (!seen.has(value)) { seen.add(value); order.push(value); } };
      for (let r = 2; r <= 9; r++) { push(r,0); push(r,1); push(r,8); push(r,9); }
      for (let c = 2; c <= 7; c++) { push(9,c); push(8,c); }
      for (let r = 2; r <= 7; r++) { push(r,2); push(r,7); }
      for (let i = 0; i < CELL_COUNT; i++) push(Math.floor(i/10), i%10);
    } else if (type === 'random') {
      order = shuffled([...Array(CELL_COUNT).keys()]);
    } else {
      const rows = [2,3,4,5,6,7,8,9,1,0];
      rows.forEach(r => { for (let c = 0; c < 10; c++) order.push(cell(r,c)); });
    }
    return availableCells(order);
  }

  function arrangeStudents(type = refs.arrangementSelect.value, announce = true) {
    state.arrangement = type;
    const cells = seatingOrder(type);
    state.students.forEach((student, index) => { student.cell = cells[index] ?? null; });
    state.selected = null;
    render();
    saveCurrent();
    if (announce) toast(`${labelForArrangement(type)} applied.`);
  }

  function labelForArrangement(type) {
    return ({ rows:'Rows', pairs:'Pairs + aisles', groups:'Groups of 4', ushape:'U-shape', random:'Random seating' })[type] || 'Layout';
  }

  function findFirstFreeCell() {
    const occupied = occupiedMap();
    const preferred = seatingOrder(state.arrangement);
    return preferred.find(cell => !occupied.has(cell)) ?? [...Array(CELL_COUNT).keys()].find(cell => !occupied.has(cell)) ?? null;
  }

  function syncStudents({ keepPositions = true } = {}) {
    const detected = rawRosterEntries(refs.namesInput.value, false).length;
    state.overLimit = detected > MAX_STUDENTS;
    refs.studentCount.textContent = detected;
    refs.rosterWarning.hidden = !state.overLimit;
    refs.rosterWarning.textContent = state.overLimit ? `${detected} students detected — maximum ${MAX_STUDENTS}. Remove ${detected - MAX_STUDENTS} to continue.` : '';
    refs.namesInput.setAttribute('aria-invalid', String(state.overLimit));

    const names = cleanedDisplayNames(refs.namesInput.value, true);
    const oldByName = new Map(state.students.map(student => [student.name.toLocaleLowerCase(), student]));
    const next = names.map((name, index) => {
      const old = oldByName.get(name.toLocaleLowerCase());
      return old ? { ...old, name } : {
        id: `student-${Date.now()}-${index}-${hashString(name)}`,
        name,
        cell: null,
        colour: colourFor(name, index),
        customColour: false
      };
    });
    state.students = next;

    if (!keepPositions) {
      arrangeStudents(state.arrangement, false);
    } else {
      state.students.forEach(student => {
        if (student.cell == null) student.cell = findFirstFreeCell();
      });
      render();
      saveCurrent();
    }
  }

  function renderGrid() {
    refs.classroomGrid.innerHTML = '';
    const studentsByCell = new Map(state.students.filter(s => s.cell != null).map(s => [s.cell, s]));
    const fixturesByCell = new Map(state.fixtures.filter(f => f.cell != null).map(f => [f.cell, f]));

    for (let i = 0; i < CELL_COUNT; i++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.cell = String(i);
      cell.setAttribute('role', 'gridcell');
      cell.tabIndex = 0;
      cell.addEventListener('dragover', event => { event.preventDefault(); cell.classList.add('drag-over'); });
      cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
      cell.addEventListener('drop', event => {
        event.preventDefault();
        cell.classList.remove('drag-over');
        if (state.dragItem) moveItemToCell(state.dragItem.kind, state.dragItem.id, i);
      });
      cell.addEventListener('click', event => {
        if (event.target.closest('.room-item')) return;
        if (state.selected) moveItemToCell(state.selected.kind, state.selected.id, i);
      });
      cell.addEventListener('keydown', event => {
        if ((event.key === 'Enter' || event.key === ' ') && state.selected) {
          event.preventDefault();
          moveItemToCell(state.selected.kind, state.selected.id, i);
        }
      });

      if (studentsByCell.has(i)) cell.append(createStudentCard(studentsByCell.get(i)));
      else if (fixturesByCell.has(i)) cell.append(createFixtureCard(fixturesByCell.get(i)));
      refs.classroomGrid.append(cell);
    }
    refs.placedCount.textContent = state.students.filter(student => student.cell != null).length;
  }

  function createStudentCard(student) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'room-item student-card';
    if (state.selected?.kind === 'student' && state.selected.id === student.id) button.classList.add('selected');
    button.draggable = true;
    button.dataset.kind = 'student';
    button.dataset.id = student.id;
    button.style.setProperty('--student-colour', student.colour);
    button.style.setProperty('--student-ink', textColour(student.colour));
    button.innerHTML = `<span>${escapeHtml(student.name)}</span>`;
    button.title = `${student.name} — drag to move, or tap to select`;
    button.addEventListener('dragstart', event => {
      state.dragItem = { kind: 'student', id: student.id };
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', student.id);
    });
    button.addEventListener('dragend', () => { state.dragItem = null; });
    button.addEventListener('click', event => {
      event.stopPropagation();
      selectItem('student', student.id);
    });
    return button;
  }

  function createFixtureCard(item) {
    const meta = fixtureMeta[item.type];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'room-item fixture-card';
    if (state.selected?.kind === 'fixture' && state.selected.id === item.id) button.classList.add('selected');
    button.draggable = true;
    button.innerHTML = `<span class="fixture-icon" aria-hidden="true">${meta.icon}</span><span>${escapeHtml(meta.label)}</span><span class="fixture-remove" aria-hidden="true">×</span>`;
    button.title = `${meta.label} — drag to move; double-click to remove`;
    button.addEventListener('dragstart', event => {
      state.dragItem = { kind: 'fixture', id: item.id };
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', item.id);
    });
    button.addEventListener('dragend', () => { state.dragItem = null; });
    button.addEventListener('click', event => {
      event.stopPropagation();
      if (event.target.closest('.fixture-remove')) { removeFixture(item.id); return; }
      selectItem('fixture', item.id);
    });
    button.addEventListener('dblclick', event => { event.preventDefault(); removeFixture(item.id); });
    return button;
  }

  function selectItem(kind, id) {
    const same = state.selected?.kind === kind && state.selected?.id === id;
    state.selected = same ? null : { kind, id };
    render();
  }

  function moveItemToCell(kind, id, targetCell) {
    const items = kind === 'student' ? state.students : state.fixtures;
    const moving = items.find(item => item.id === id);
    if (!moving || moving.cell === targetCell) { state.selected = null; render(); return; }

    const occupied = occupiedMap().get(targetCell);
    const oldCell = moving.cell;
    if (occupied) {
      const targetList = occupied.kind === 'student' ? state.students : state.fixtures;
      const target = targetList.find(item => item.id === occupied.id);
      if (target) target.cell = oldCell;
    }
    moving.cell = targetCell;
    state.selected = { kind, id };
    render();
    saveCurrent();
  }

  function addFixture(type) {
    const cell = findFirstFreeCell();
    if (cell == null) { toast('No empty squares left in the classroom.'); return; }
    const item = { id: `fixture-${type}-${Date.now()}-${state.fixtureCounter++}`, type, cell };
    state.fixtures.push(item);
    state.selected = { kind: 'fixture', id: item.id };
    render();
    saveCurrent();
    toast(`${fixtureMeta[type].label} added — move it where you want.`);
  }

  function removeFixture(id) {
    state.fixtures = state.fixtures.filter(item => item.id !== id);
    if (state.selected?.id === id) state.selected = null;
    render();
    saveCurrent();
  }

  function applyScheme() {
    state.scheme = refs.schemeSelect.value;
    state.students.forEach((student, index) => {
      student.colour = colourFor(student.name, index, state.scheme);
      student.customColour = false;
    });
    render();
    saveCurrent();
    toast('Student colours updated.');
  }

  function setSelectedStudentColour(colour) {
    if (state.selected?.kind !== 'student') return;
    const student = state.students.find(item => item.id === state.selected.id);
    if (!student) return;
    student.colour = colour;
    student.customColour = true;
    render();
    saveCurrent();
  }

  function renderSelectionBar() {
    if (state.selected?.kind !== 'student') {
      refs.selectionBar.hidden = true;
      return;
    }
    const student = state.students.find(item => item.id === state.selected.id);
    if (!student) { refs.selectionBar.hidden = true; return; }
    refs.selectionBar.hidden = false;
    refs.selectedStudentName.textContent = student.name;
    refs.studentColour.value = student.colour;
  }

  function render() {
    renderGrid();
    renderSelectionBar();
  }

  function cleanRoster() {
    const cleaned = cleanedDisplayNames(refs.namesInput.value, false);
    refs.namesInput.value = cleaned.join('\n');
    syncStudents({ keepPositions: true });
    const extra = Math.max(0, cleaned.length - MAX_STUDENTS);
    toast(extra ? `Cleaned ${cleaned.length} names. Remove ${extra} to use the plan.` : `Cleaned ${cleaned.length} student name${cleaned.length === 1 ? '' : 's'}.`);
  }

  function sortRoster() {
    const names = cleanedDisplayNames(refs.namesInput.value, false).sort((a,b) => a.localeCompare(b));
    refs.namesInput.value = names.join('\n');
    syncStudents({ keepPositions: true });
  }

  function clearRoster() {
    refs.namesInput.value = '';
    state.students = [];
    state.selected = null;
    refs.studentCount.textContent = '0';
    render();
    saveCurrent();
    toast('Student list cleared.');
  }

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value ?? fallback;
    } catch (_) { return fallback; }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (_) { toast('This browser could not save changes locally.'); return false; }
  }

  function readSavedClasses() {
    const classes = readJson(SAVED_CLASSES_KEY, {});
    return classes && typeof classes === 'object' && !Array.isArray(classes) ? classes : {};
  }

  function readSavedLayouts() {
    const layouts = readJson(SAVED_LAYOUTS_KEY, {});
    return layouts && typeof layouts === 'object' && !Array.isArray(layouts) ? layouts : {};
  }

  function refreshSavedClasses(selected = '') {
    const classes = readSavedClasses();
    const names = Object.keys(classes).sort((a,b) => a.localeCompare(b));
    refs.savedClassSelect.innerHTML = '<option value="">Choose saved class…</option>';
    names.forEach(name => {
      const option = document.createElement('option');
      option.value = name; option.textContent = name;
      refs.savedClassSelect.append(option);
    });
    if (names.includes(selected)) refs.savedClassSelect.value = selected;
  }

  function serialiseLayout() {
    return {
      names: state.students.map(student => student.name),
      students: state.students.map(student => ({ name: student.name, cell: student.cell, colour: student.colour, customColour: !!student.customColour })),
      fixtures: state.fixtures.map(item => ({ ...item })),
      scheme: state.scheme,
      arrangement: state.arrangement,
      singleColour: refs.singleColour.value
    };
  }

  function saveCurrent() {
    writeJson(CURRENT_KEY, serialiseLayout());
  }

  function saveClass() {
    const name = refs.classNameInput.value.trim();
    if (!name) { toast('Enter a class name first.'); refs.classNameInput.focus(); return; }
    const detected = rawRosterEntries(refs.namesInput.value, false).length;
    if (!detected) { toast('Add some student names before saving the class.'); return; }
    if (detected > MAX_STUDENTS) { toast(`Maximum ${MAX_STUDENTS} students. Remove ${detected - MAX_STUDENTS} before saving.`); return; }

    const classes = readSavedClasses();
    classes[name] = state.students.map(student => student.name);
    if (!writeJson(SAVED_CLASSES_KEY, classes)) return;
    const layouts = readSavedLayouts();
    layouts[name] = serialiseLayout();
    writeJson(SAVED_LAYOUTS_KEY, layouts);
    refreshSavedClasses(name);
    refs.savedClassSelect.value = name;
    toast(`${name} saved with its seating layout.`);
  }

  function restoreLayout(layout, fallbackNames = []) {
    if (!layout || typeof layout !== 'object') {
      refs.namesInput.value = fallbackNames.join('\n');
      syncStudents({ keepPositions: false });
      return;
    }
    const names = Array.isArray(layout.names) ? layout.names : fallbackNames;
    refs.namesInput.value = names.join('\n');
    const savedStudents = Array.isArray(layout.students) ? layout.students : [];
    const byName = new Map(savedStudents.map(student => [String(student.name).toLocaleLowerCase(), student]));
    state.scheme = layout.scheme || 'pastel';
    state.arrangement = layout.arrangement || 'rows';
    refs.schemeSelect.value = state.scheme;
    refs.arrangementSelect.value = state.arrangement;
    if (layout.singleColour) refs.singleColour.value = layout.singleColour;
    state.students = names.slice(0, MAX_STUDENTS).map((name, index) => {
      const saved = byName.get(String(name).toLocaleLowerCase());
      return {
        id: `student-${Date.now()}-${index}-${hashString(name)}`,
        name,
        cell: Number.isInteger(saved?.cell) ? saved.cell : null,
        colour: saved?.colour || colourFor(name, index, state.scheme),
        customColour: !!saved?.customColour
      };
    });
    state.fixtures = Array.isArray(layout.fixtures) ? layout.fixtures.filter(item => fixtureMeta[item.type] && Number.isInteger(item.cell)) : [];
    if (!state.fixtures.length) createDefaultFixtures();
    syncStudents({ keepPositions: true });
  }

  function loadClass() {
    const name = refs.savedClassSelect.value;
    if (!name) { toast('Choose a saved class first.'); return; }
    const classes = readSavedClasses();
    const names = Array.isArray(classes[name]) ? classes[name] : [];
    const layouts = readSavedLayouts();
    refs.classNameInput.value = name;
    restoreLayout(layouts[name], names);
    toast(layouts[name] ? `${name} and its seating layout loaded.` : `${name} loaded — ready to arrange.`);
  }

  function deleteClass() {
    const name = refs.savedClassSelect.value;
    if (!name) { toast('Choose a saved class first.'); return; }
    const classes = readSavedClasses();
    const layouts = readSavedLayouts();
    delete classes[name];
    delete layouts[name];
    writeJson(SAVED_CLASSES_KEY, classes);
    writeJson(SAVED_LAYOUTS_KEY, layouts);
    refreshSavedClasses();
    if (refs.classNameInput.value === name) refs.classNameInput.value = '';
    toast(`${name} deleted from saved classes.`);
  }

  function applyTheme(theme, persist = true) {
    const dark = theme === 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    refs.themeBtn.textContent = dark ? '☀️' : '🌙';
    refs.themeBtn.setAttribute('aria-pressed', String(dark));
    refs.themeBtn.setAttribute('aria-label', dark ? 'Turn on light mode' : 'Turn on dark mode');
    refs.themeBtn.title = dark ? 'Turn on light mode' : 'Turn on dark mode';
    if (persist) {
      try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch (_) {}
    }
  }

  function toast(message) {
    refs.toast.textContent = message;
    refs.toast.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => refs.toast.classList.remove('show'), 2200);
  }

  function initialiseGridState() {
    const current = readJson(CURRENT_KEY, null);
    if (current?.names?.length) {
      restoreLayout(current, current.names);
    } else {
      createDefaultFixtures();
      render();
    }
  }

  refs.namesInput.addEventListener('input', () => syncStudents({ keepPositions: true }));
  refs.cleanBtn.addEventListener('click', cleanRoster);
  refs.sortBtn.addEventListener('click', sortRoster);
  refs.clearBtn.addEventListener('click', clearRoster);
  refs.saveClassBtn.addEventListener('click', saveClass);
  refs.loadClassBtn.addEventListener('click', loadClass);
  refs.deleteClassBtn.addEventListener('click', deleteClass);
  refs.savedClassSelect.addEventListener('change', () => { if (refs.savedClassSelect.value) refs.classNameInput.value = refs.savedClassSelect.value; });
  refs.arrangeBtn.addEventListener('click', () => arrangeStudents(refs.arrangementSelect.value));
  refs.arrangementSelect.addEventListener('change', () => { state.arrangement = refs.arrangementSelect.value; saveCurrent(); });
  refs.applySchemeBtn.addEventListener('click', applyScheme);
  refs.schemeSelect.addEventListener('change', () => { state.scheme = refs.schemeSelect.value; });
  refs.singleColour.addEventListener('input', () => { if (refs.schemeSelect.value === 'single') applyScheme(); });
  $$('.fixture-button').forEach(button => button.addEventListener('click', () => addFixture(button.dataset.fixture)));
  refs.clearFixturesBtn.addEventListener('click', () => { state.fixtures = []; state.selected = null; render(); saveCurrent(); toast('Room items cleared.'); });
  refs.resetRoomBtn.addEventListener('click', () => { createDefaultFixtures(); arrangeStudents(state.arrangement, false); toast('Default classroom restored.'); });
  refs.clearPositionsBtn.addEventListener('click', () => arrangeStudents(state.arrangement));
  $$('.colour-swatch').forEach(button => button.addEventListener('click', () => setSelectedStudentColour(button.dataset.colour)));
  refs.studentColour.addEventListener('input', () => setSelectedStudentColour(refs.studentColour.value));
  refs.closeSelectionBtn.addEventListener('click', () => { state.selected = null; render(); });
  refs.printBtn.addEventListener('click', () => window.print());
  refs.themeBtn.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  refs.showPlanBtn.addEventListener('click', () => refs.planPanel.scrollIntoView({ behavior: 'smooth', block: 'start' }));

  try { applyTheme(localStorage.getItem(THEME_KEY) || 'light', false); } catch (_) { applyTheme('light', false); }
  refreshSavedClasses();
  initialiseGridState();
})();
