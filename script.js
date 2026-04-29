const game = document.getElementById("game");
const sceneElement = document.getElementById("scene");
const roomName = document.getElementById("room-name");
const consoleOutput = document.getElementById("console-output");
const hotspots = document.querySelectorAll(".hotspot");
const navButtons = document.querySelectorAll(".scene-nav-button");
const toggleEditorButton = document.getElementById("toggle-editor");
const copyLayoutButton = document.getElementById("copy-layout");
const characters = document.querySelectorAll(".character");

const scenes = {
  reception: {
    label: "Reception",
    message: "Sei alla reception. Da qui puoi raggiungere le altre stanze."
  },
  camere: {
    label: "Camere",
    message: "Sei nella zona camere. Per ora tutto sembra calmo."
  },
  infermeria: {
    label: "Infermeria",
    message: "Sei in infermeria. L'ambiente e' tranquillo e in ordine."
  },
  "sala-ricreativa": {
    label: "Sala Ricreativa",
    message: "Sei nella sala ricreativa. Si sente un brusio lontano."
  },
  "sala-mensa": {
    label: "Sala Mensa",
    message: "Sei nella sala mensa. Nell'aria c'e' ancora odore di caffe'."
  }
};

const hotspotLayout = {
  reception: {
    telefono: { left: 14.41, top: 67.18, width: 11.88, height: 24.5 },
    camere: { left: 59.71, top: 25.84, width: 11.36, height: 4 },
    infermeria: { left: 26.32, top: 10.9, width: 7.51, height: 36.17 },
    "sala-ricreativa": { left: 60.69, top: 18.42, width: 8.48, height: 4 },
    "sala-mensa": { left: 60.88, top: 11.42, width: 8.28, height: 4.33 }
  },
  infermeria: {
    back: { left: 38, top: 36, width: 24, height: 14 }
  },
  camere: {
    back: { left: 38, top: 36, width: 24, height: 14 }
  },
  "sala-ricreativa": {
    back: { left: 38, top: 36, width: 24, height: 14 }
  },
  "sala-mensa": {
    back: { left: 4, top: 10, width: 18, height: 10 },
    posto1: { left: 28.98, top: 42.53, width: 4.32, height: 10.16 },
    posto2: { left: 36.21, top: 42.85, width: 4.71, height: 9.83 },
    posto3: { left: 43.68, top: 42.36, width: 4.56, height: 10 },
    posto4: { left: 51.71, top: 42.37, width: 4.24, height: 10.17 },
    posto5: { left: 59.58, top: 43.18, width: 4, height: 9.02 },
    posto6: { left: 66.49, top: 42.86, width: 4.48, height: 9.35 }
  }
};

const characterLayout = {
  "sala-mensa": {
    nonnogianni: { left: 18, top: 30, width: 20, height: 40 }
  }
};

let currentSceneId = "reception";
let editorEnabled = false;
let interaction = null;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function roundPercent(value) {
  return Math.round(value * 100) / 100;
}

function getLayout(sceneId, hotspotId) {
  return hotspotLayout[sceneId]?.[hotspotId];
}

function getCharacterLayout(sceneId, characterId) {
  return characterLayout[sceneId]?.[characterId];
}

function ensureSceneLayout(sceneId) {
  if (!hotspotLayout[sceneId]) {
    hotspotLayout[sceneId] = {};
  }
}

function ensureCharacterSceneLayout(sceneId) {
  if (!characterLayout[sceneId]) {
    characterLayout[sceneId] = {};
  }
}

function formatLayoutText(label, layout) {
  return `${label}\nL ${layout.left}% | T ${layout.top}%\nW ${layout.width}% | H ${layout.height}%`;
}

function updateHotspotMeta(hotspot, layout) {
  const meta = hotspot.querySelector(".hotspot-meta");
  meta.textContent = formatLayoutText(hotspot.dataset.label, layout);
}

function applyHotspotLayout(hotspot, layout) {
  hotspot.style.left = `${layout.left}%`;
  hotspot.style.top = `${layout.top}%`;
  hotspot.style.width = `${layout.width}%`;
  hotspot.style.height = `${layout.height}%`;
  updateHotspotMeta(hotspot, layout);
}

function updateCharacterMeta(character, layout) {
  const meta = character.querySelector(".character-meta");
  const label = character.querySelector(".character-label").textContent;
  meta.textContent = formatLayoutText(label, layout);
}

function applyCharacterLayout(character, layout) {
  character.style.left = `${layout.left}%`;
  character.style.top = `${layout.top}%`;
  character.style.width = `${layout.width}%`;
  character.style.height = `${layout.height}%`;
  updateCharacterMeta(character, layout);
}

function refreshCharacters() {
  for (const character of characters) {
    const isCurrentScene = character.dataset.scene === currentSceneId;
    character.classList.toggle("is-visible", isCurrentScene);
    character.classList.toggle("is-editor", editorEnabled && isCurrentScene);

    if (!isCurrentScene) {
      continue;
    }

    const layout = getCharacterLayout(currentSceneId, character.dataset.characterId);

    if (!layout) {
      character.classList.remove("is-visible");
      continue;
    }

    applyCharacterLayout(character, layout);
  }
}

function refreshHotspots() {
  for (const hotspot of hotspots) {
    const isCurrentScene = hotspot.dataset.scene === currentSceneId;
    hotspot.classList.toggle("is-visible", isCurrentScene);
    hotspot.classList.toggle("is-editor", editorEnabled && isCurrentScene);

    if (!isCurrentScene) {
      continue;
    }

    const layout = getLayout(currentSceneId, hotspot.dataset.hotspotId);

    if (!layout) {
      hotspot.classList.remove("is-visible");
      continue;
    }

    applyHotspotLayout(hotspot, layout);
  }
}

function renderScene(sceneId) {
  const scene = scenes[sceneId];

  if (!scene) {
    return;
  }

  currentSceneId = sceneId;
  game.dataset.scene = sceneId;
  sceneElement.setAttribute("aria-label", scene.label);
  roomName.textContent = scene.label;
  consoleOutput.textContent = scene.message;

  for (const navButton of navButtons) {
    const isActive = navButton.dataset.navTarget === sceneId;
    navButton.classList.toggle("is-active", isActive);
  }

  refreshHotspots();
  refreshCharacters();
}

function updateEditorState() {
  toggleEditorButton.classList.toggle("is-active", editorEnabled);
  toggleEditorButton.setAttribute("aria-pressed", String(editorEnabled));
  refreshHotspots();
  refreshCharacters();
}

function pointerToPercent(event) {
  const rect = sceneElement.getBoundingClientRect();
  return {
    left: ((event.clientX - rect.left) / rect.width) * 100,
    top: ((event.clientY - rect.top) / rect.height) * 100,
    sceneWidth: rect.width,
    sceneHeight: rect.height
  };
}

function startInteraction(event, hotspot, mode) {
  const layout = getLayout(currentSceneId, hotspot.dataset.hotspotId);

  if (!editorEnabled || !layout) {
    return;
  }

  const pointer = pointerToPercent(event);
  interaction = {
    hotspot,
    hotspotId: hotspot.dataset.hotspotId,
    mode,
    startLeft: layout.left,
    startTop: layout.top,
    startWidth: layout.width,
    startHeight: layout.height,
    pointerLeft: pointer.left,
    pointerTop: pointer.top
  };

  event.preventDefault();
}

function startCharacterInteraction(event, character, mode) {
  const layout = getCharacterLayout(currentSceneId, character.dataset.characterId);

  if (!editorEnabled || !layout) {
    return;
  }

  const pointer = pointerToPercent(event);
  interaction = {
    type: "character",
    character,
    characterId: character.dataset.characterId,
    mode,
    startLeft: layout.left,
    startTop: layout.top,
    startWidth: layout.width,
    startHeight: layout.height,
    pointerLeft: pointer.left,
    pointerTop: pointer.top
  };

  event.preventDefault();
}

function handlePointerMove(event) {
  if (!interaction) {
    return;
  }

  const layout = interaction.type === "character"
    ? getCharacterLayout(currentSceneId, interaction.characterId)
    : getLayout(currentSceneId, interaction.hotspotId);

  if (!layout) {
    return;
  }

  const pointer = pointerToPercent(event);
  const deltaLeft = pointer.left - interaction.pointerLeft;
  const deltaTop = pointer.top - interaction.pointerTop;

  if (interaction.mode === "move") {
    layout.left = roundPercent(clamp(interaction.startLeft + deltaLeft, 0, 100 - layout.width));
    layout.top = roundPercent(clamp(interaction.startTop + deltaTop, 0, 100 - layout.height));
  }

  if (interaction.mode === "resize") {
    layout.width = roundPercent(clamp(interaction.startWidth + deltaLeft, 4, 100 - interaction.startLeft));
    layout.height = roundPercent(clamp(interaction.startHeight + deltaTop, 4, 100 - interaction.startTop));
  }

  if (interaction.type === "character") {
    applyCharacterLayout(interaction.character, layout);
    return;
  }

  applyHotspotLayout(interaction.hotspot, layout);
}

function stopInteraction() {
  interaction = null;
}

function handleHotspotClick(event, hotspot) {
  if (editorEnabled) {
    event.preventDefault();
    return;
  }

  if (hotspot.dataset.action === "change-scene") {
    renderScene(hotspot.dataset.target);
    return;
  }

  if (currentSceneId === "sala-mensa" && hotspot.dataset.hotspotId === "posto1") {
    consoleOutput.textContent = "Nonno Gianni ti guarda in silenzio.";
    return;
  }

  const message = hotspot.dataset.message || "Nessun messaggio disponibile.";
  consoleOutput.textContent = message;
}

async function copyLayout() {
  const json = JSON.stringify({
    hotspotLayout,
    characterLayout
  }, null, 2);

  try {
    await navigator.clipboard.writeText(json);
    consoleOutput.textContent = "Layout copiato negli appunti.";
  } catch (error) {
    consoleOutput.textContent = "Impossibile copiare il layout negli appunti.";
  }
}

for (const hotspot of hotspots) {
  hotspot.addEventListener("click", (event) => {
    handleHotspotClick(event, hotspot);
  });

  hotspot.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    const isResizeHandle = event.target.classList.contains("hotspot-resize");
    startInteraction(event, hotspot, isResizeHandle ? "resize" : "move");
  });
}

for (const character of characters) {
  character.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    const isResizeHandle = event.target.classList.contains("character-resize");
    startCharacterInteraction(event, character, isResizeHandle ? "resize" : "move");
  });
}

for (const navButton of navButtons) {
  navButton.addEventListener("click", () => {
    renderScene(navButton.dataset.navTarget);
  });
}

toggleEditorButton.addEventListener("click", () => {
  editorEnabled = !editorEnabled;
  updateEditorState();
  consoleOutput.textContent = editorEnabled
    ? "Editor hotspot attivo. Trascina o ridimensiona le aree della scena corrente."
    : scenes[currentSceneId].message;
});

copyLayoutButton.addEventListener("click", () => {
  copyLayout();
});

window.addEventListener("pointermove", handlePointerMove);
window.addEventListener("pointerup", stopInteraction);
window.addEventListener("pointercancel", stopInteraction);

for (const hotspot of hotspots) {
  ensureSceneLayout(hotspot.dataset.scene);
}

for (const character of characters) {
  ensureCharacterSceneLayout(character.dataset.scene);
}

renderScene("reception");
updateEditorState();
