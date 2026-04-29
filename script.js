const game = document.getElementById("game");
const sceneElement = document.getElementById("scene");
const roomName = document.getElementById("room-name");
const consoleOutput = document.getElementById("console-output");
const hotspots = document.querySelectorAll(".hotspot");
const navButtons = document.querySelectorAll(".scene-nav-button");
const toggleEditorButton = document.getElementById("toggle-editor");
const copyLayoutButton = document.getElementById("copy-layout");

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
    telefono: { left: 35, top: 60, width: 13, height: 16 },
    camere: { left: 69, top: 18, width: 12, height: 32 },
    infermeria: { left: 78, top: 56, width: 14, height: 28 },
    "sala-ricreativa": { left: 49, top: 14, width: 10, height: 28 },
    "sala-mensa": { left: 62, top: 16, width: 11, height: 28 }
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
    posto1: { left: 18, top: 44, width: 8, height: 10 },
    posto2: { left: 31, top: 44, width: 8, height: 10 },
    posto3: { left: 44, top: 44, width: 8, height: 10 },
    posto4: { left: 57, top: 44, width: 8, height: 10 },
    posto5: { left: 70, top: 44, width: 8, height: 10 },
    posto6: { left: 83, top: 44, width: 8, height: 10 }
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

function ensureSceneLayout(sceneId) {
  if (!hotspotLayout[sceneId]) {
    hotspotLayout[sceneId] = {};
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
}

function updateEditorState() {
  toggleEditorButton.classList.toggle("is-active", editorEnabled);
  toggleEditorButton.setAttribute("aria-pressed", String(editorEnabled));
  refreshHotspots();
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

function handlePointerMove(event) {
  if (!interaction) {
    return;
  }

  const layout = getLayout(currentSceneId, interaction.hotspotId);

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

  const message = hotspot.dataset.message || "Nessun messaggio disponibile.";
  consoleOutput.textContent = message;
}

async function copyLayout() {
  const json = JSON.stringify(hotspotLayout, null, 2);

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

renderScene("reception");
updateEditorState();
