const game = document.getElementById("game");
const sceneElement = document.getElementById("scene");
const roomName = document.getElementById("room-name");
const consoleOutput = document.getElementById("console-output");
const consoleActions = document.getElementById("console-actions");
const hotspots = document.querySelectorAll(".hotspot");
const navButtons = document.querySelectorAll(".scene-nav-button");
const toggleEditorButton = document.getElementById("toggle-editor");
const togglePreviewButton = document.getElementById("toggle-preview");
const toggleTimeOfDayButton = document.getElementById("toggle-time-of-day");
const randomizeDiningSeatsButton = document.getElementById("randomize-dining-seats");
const copyLayoutButton = document.getElementById("copy-layout");
const seatAnchorElements = document.querySelectorAll(".seat-anchor");
const characters = document.querySelectorAll(".character");
const speechBubbles = document.querySelectorAll(".speech-bubble");
const receptionBubble = document.getElementById("reception-bubble");

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

const roomBackgrounds = {
  reception: {
    day: "assets/img/reception.png",
    night: "assets/img/receptionnotte.png"
  },
  infermeria: {
    day: "assets/img/infermieria.png",
    night: "assets/img/infermierianotte.png"
  },
  camere: {
    day: "assets/img/stanzalettogiorno.png",
    night: "assets/img/stanzalettonotte.png"
  },
  "sala-mensa": {
    day: "assets/img/sala mensa.png",
    night: "assets/img/mensanotte.png"
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
  reception: {
    "reception-slot1": { left: 27.86, top: 0.99, width: 21.29, height: 63.01 },
    "reception-slot2": { left: 48.41, top: 15.04, width: 17.45, height: 48.48 },
    "reception-slot3": { left: 63.44, top: 4.26, width: 21.62, height: 58.82 }
  },
  "sala-mensa": {
    nonnogianni: { left: 32.64, top: 34.24, width: 11.51, height: 18.76 },
    lauda: { left: 55.85, top: 34.24, width: 11.51, height: 18.76 },
    orietta: { left: 25.25, top: 34.3, width: 11.5, height: 18.7 },
    sandra: { left: 63.25, top: 34.3, width: 11.5, height: 18.7 },
    liliana: { left: 40.25, top: 34.3, width: 11.5, height: 18.7 }
  }
};

const bubbleLayout = {
  "sala-mensa": {
    posto1: { left: 22.11, top: 23.29, width: 14.16, height: 10.23 },
    posto2: { left: 35.32, top: 19.52, width: 15.29, height: 10.07 },
    posto3: { left: 39.86, top: 27.36, width: 12.88, height: 9.74 },
    posto4: { left: 49.22, top: 16.58, width: 17.37, height: 9.58 },
    posto5: { left: 54.96, top: 24.42, width: 14.08, height: 10.07 },
    posto6: { left: 68.71, top: 23.93, width: 17.45, height: 10.56 }
  }
};

const seatAnchors = {
  "sala-mensa": {
    posto1: { x: 31, y: 53 },
    posto2: { x: 38.4, y: 53 },
    posto3: { x: 46, y: 53 },
    posto4: { x: 54, y: 53 },
    posto5: { x: 61.6, y: 53 },
    posto6: { x: 69, y: 53 }
  }
};

const characterSeats = {
  nonnogianni: "posto2",
  lauda: "posto5",
  orietta: "posto1",
  liliana: "posto3",
  sandra: "posto6"
};

const nonnoGianniLines = [
  "vorrei una zuppa.",
  "che schifo l'aceto.",
  "passami la lavatrice",
  "prendi l'ascia"
];

const laudaLines = [
  "Non mi piace questo posto.",
  "Ho fame.",
  "Dov'e' il dolce?",
  "Questo non e' il mio bicchiere."
];

const characterDialogues = {
  orietta: [
    "Acqua calda per me!",
    "Brodo di acqua grazie.",
    "Zucchine lesse, senza sale."
  ],
  sandra: [
    "Vuoi che ti aiuto?",
    "Un piatto di pasta va bene.",
    "Dammi quello che c'e'."
  ],
  liliana: [
    "Alessandro ti sei alzato!",
    "Matteo... Gianni... Ivo ehm..",
    "Faccio il caffe'?"
  ]
};

const diningCharacters = ["nonnogianni", "lauda", "orietta", "liliana", "sandra"];
const diningDialogueCharacters = ["nonnogianni", "lauda", "orietta", "sandra", "liliana"];

let currentSceneId = "reception";
let timeOfDay = "day";
let editorEnabled = false;
let gamePreviewEnabled = false;
let interaction = null;
let activeBubbleId = null;
let bubbleTimeoutId = null;
let diningDialoguesIntervalId = null;
let spokenThisRound = new Set();
let lastSpeakerId = null;
const lastDialogueByCharacter = {};
let isSpecialDialogueRunning = false;
let gianniLaudaDebateAlreadyTriggered = false;
let isUpdatingDiningSeats = false;
let isReceptionEventRunning = false;
let receptionEventTimerId = null;
let receptionEventRunId = 0;
let activeReceptionCharacterSlotId = null;
let receptionEventAttemptedThisVisit = false;

const adjacentSeats = {
  posto1: ["posto2"],
  posto2: ["posto1", "posto3"],
  posto3: ["posto2", "posto4"],
  posto4: ["posto3", "posto5"],
  posto5: ["posto4", "posto6"],
  posto6: ["posto5"]
};

const receptionDaySlots = ["reception-slot1", "reception-slot3"];
const receptionEvents = [
  {
    id: "reception-liliana",
    enabled: true,
    run: startLilianaReceptionEvent
  },
  {
    id: "reception-placeholder-2",
    enabled: false,
    run: null
  }
];

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

function getBubbleLayout(sceneId, bubbleId) {
  return bubbleLayout[sceneId]?.[bubbleId];
}

function getSeatAnchorLayout(sceneId, seatId) {
  return seatAnchors[sceneId]?.[seatId];
}

function updateTimeOfDayButton() {
  toggleTimeOfDayButton.textContent = timeOfDay === "day" ? "Ora: Giorno" : "Ora: Notte";
}

function updateRoomBackground(sceneId) {
  const sceneBackgrounds = roomBackgrounds[sceneId];
  const backgroundPath = sceneBackgrounds?.[timeOfDay];

  if (!backgroundPath) {
    game.style.removeProperty("background-image");
    console.warn(`Nessuna immagine definita per la scena "${sceneId}" in modalita' "${timeOfDay}".`);
    return;
  }

  game.style.backgroundImage = `url("${backgroundPath}")`;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
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

function ensureBubbleSceneLayout(sceneId) {
  if (!bubbleLayout[sceneId]) {
    bubbleLayout[sceneId] = {};
  }
}

function ensureSeatAnchorSceneLayout(sceneId) {
  if (!seatAnchors[sceneId]) {
    seatAnchors[sceneId] = {};
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

function updateBubbleMeta(bubble, layout) {
  const meta = bubble.querySelector(".speech-bubble-meta");
  const label = bubble.querySelector(".speech-bubble-label").textContent;
  meta.textContent = formatLayoutText(label, layout);
}

function applyBubbleLayout(bubble, layout) {
  bubble.style.left = `${layout.left}%`;
  bubble.style.top = `${layout.top}%`;
  bubble.style.width = `${layout.width}%`;
  bubble.style.height = `${layout.height}%`;
  updateBubbleMeta(bubble, layout);
}

function updateSeatAnchorMeta(seatAnchor, layout) {
  const label = seatAnchor.querySelector(".seat-anchor-label").textContent;
  const meta = seatAnchor.querySelector(".seat-anchor-meta");
  meta.textContent = `${label}\nX ${layout.x}% | Y ${layout.y}%`;
}

function applySeatAnchorLayout(seatAnchor, layout) {
  seatAnchor.style.left = `${layout.x}%`;
  seatAnchor.style.top = `${layout.y}%`;
  updateSeatAnchorMeta(seatAnchor, layout);
}

function refreshCharacters() {
  for (const character of characters) {
    const isCurrentScene = character.dataset.scene === currentSceneId;
    character.classList.toggle("is-editor", editorEnabled && isCurrentScene);

    if (!isCurrentScene) {
      character.classList.remove("is-visible");
      continue;
    }

    const layout = getCharacterLayout(currentSceneId, character.dataset.characterId);

    if (!layout) {
      character.classList.remove("is-visible");
      continue;
    }

    const isReceptionCharacterSlot = character.classList.contains("reception-character-slot");
    const isFadingOut = character.classList.contains("fading-out");
    const shouldShow = isReceptionCharacterSlot
      ? editorEnabled || character.classList.contains("active") || isFadingOut
      : true;

    character.classList.toggle("is-visible", shouldShow);
    applyCharacterLayout(character, layout);
  }
}

function clearConsoleActions() {
  consoleActions.innerHTML = "";
}

function isLaudaReceptionCharacter(imageSrc, altText) {
  return imageSrc.includes("lauda") || altText.trim().toLowerCase() === "lauda";
}

function getAvailableReceptionSlot(preferredSlotId) {
  if (preferredSlotId && receptionDaySlots.includes(preferredSlotId)) {
    return preferredSlotId;
  }

  for (const slotId of receptionDaySlots) {
    const slotElement = document.getElementById(`character-${slotId}`);

    if (slotElement && !slotElement.classList.contains("active")) {
      return slotId;
    }
  }

  return receptionDaySlots[0];
}

function showReceptionCharacter(slotId, imageSrc, altText = "") {
  if (timeOfDay !== "day") {
    console.warn("Tentativo di mostrare un personaggio in reception di notte ignorato.");
    return;
  }

  const isLauda = isLaudaReceptionCharacter(imageSrc, altText);
  const targetSlotId = isLauda
    ? "reception-slot2"
    : getAvailableReceptionSlot(slotId);
  const element = document.getElementById(`character-${targetSlotId}`);

  if (!element) {
    return;
  }

  const image = element.querySelector("img");

  if (!image) {
    return;
  }

  image.src = imageSrc;
  image.alt = altText;
  element.classList.remove("fading-out");
  element.classList.add("active");
  element.setAttribute("aria-hidden", "false");
  refreshCharacters();
  return targetSlotId;
}

function hideReceptionCharacter(slotId) {
  const element = document.getElementById(`character-${slotId}`);

  if (!element) {
    return;
  }

  element.classList.remove("active");
  element.classList.add("fading-out");
  refreshCharacters();

  window.setTimeout(() => {
    const image = element.querySelector("img");

    if (image && !element.classList.contains("active")) {
      image.src = "";
      image.alt = "";
    }

    if (!element.classList.contains("active")) {
      element.classList.remove("fading-out");
      element.setAttribute("aria-hidden", "true");
      refreshCharacters();
    }
  }, 2800);
}

function clearReceptionCharacters() {
  hideReceptionCharacter("reception-slot1");
  hideReceptionCharacter("reception-slot2");
  hideReceptionCharacter("reception-slot3");
  activeReceptionCharacterSlotId = null;
}

function showReceptionBubble(slotId, text) {
  const layout = characterLayout.reception?.[slotId];

  if (!receptionBubble || !layout) {
    return;
  }

  receptionBubble.querySelector(".reception-bubble-text").textContent = text;
  receptionBubble.style.left = `${roundPercent(layout.left + layout.width * 0.08)}%`;
  receptionBubble.style.top = `${roundPercent(Math.max(1, layout.top - 9))}%`;
  receptionBubble.setAttribute("aria-hidden", "false");
  receptionBubble.classList.add("is-visible");
}

function hideReceptionBubble() {
  if (!receptionBubble) {
    return;
  }

  receptionBubble.classList.remove("is-visible");
  receptionBubble.setAttribute("aria-hidden", "true");
}

function stopReceptionEventTimer() {
  if (!receptionEventTimerId) {
    return;
  }

  clearTimeout(receptionEventTimerId);
  receptionEventTimerId = null;
}

function cleanupReceptionEvent() {
  receptionEventRunId += 1;
  isReceptionEventRunning = false;
  hideReceptionBubble();
  clearReceptionCharacters();
  clearConsoleActions();
}

function finishReceptionEvent() {
  cleanupReceptionEvent();
}

function canRunReceptionEvents() {
  return currentSceneId === "reception" && timeOfDay === "day";
}

function pickReceptionEvent() {
  const enabledEvents = receptionEvents.filter((event) => event.enabled && typeof event.run === "function");

  if (enabledEvents.length === 0) {
    return null;
  }

  return enabledEvents[Math.floor(Math.random() * enabledEvents.length)];
}

function scheduleReceptionEventCheck() {
  stopReceptionEventTimer();

  if (!canRunReceptionEvents() || isReceptionEventRunning || receptionEventAttemptedThisVisit) {
    return;
  }

  receptionEventTimerId = window.setTimeout(() => {
    receptionEventTimerId = null;

    if (!canRunReceptionEvents() || isReceptionEventRunning || receptionEventAttemptedThisVisit) {
      return;
    }

    receptionEventAttemptedThisVisit = true;

    const nextEvent = pickReceptionEvent();

    if (!nextEvent) {
      return;
    }

    nextEvent.run();
  }, 5000);
}

function cancelReceptionEvents() {
  stopReceptionEventTimer();
  receptionEventAttemptedThisVisit = false;
  cleanupReceptionEvent();
}

function showReceptionChoices(choices, onSelect) {
  clearConsoleActions();

  for (const choice of choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "console-action-button";
    button.textContent = choice;
    button.addEventListener("click", () => {
      onSelect(choice);
    });
    consoleActions.appendChild(button);
  }
}

async function startLilianaReceptionEvent() {
  if (!canRunReceptionEvents() || isReceptionEventRunning) {
    return;
  }

  isReceptionEventRunning = true;
  const eventRunId = receptionEventRunId + 1;
  receptionEventRunId = eventRunId;
  consoleOutput.textContent = "Si avvicina Liliana";
  activeReceptionCharacterSlotId = showReceptionCharacter("reception-slot1", "assets/characters/liliana.png", "Liliana");

  if (!activeReceptionCharacterSlotId) {
    isReceptionEventRunning = false;
    scheduleReceptionEventCheck();
    return;
  }

  await wait(3000);

  if (receptionEventRunId !== eventRunId || !canRunReceptionEvents()) {
    return;
  }

  showReceptionBubble(activeReceptionCharacterSlotId, "Hai visto la tartaruga?");
  showReceptionChoices(["Si", "No"], () => {
    if (receptionEventRunId !== eventRunId) {
      return;
    }

    finishReceptionEvent();
  });
}

function hideBubbles() {
  activeBubbleId = null;
  if (bubbleTimeoutId) {
    clearTimeout(bubbleTimeoutId);
    bubbleTimeoutId = null;
  }

  for (const bubble of speechBubbles) {
    bubble.classList.remove("is-visible");
  }
}

function hideAllBubbles() {
  hideBubbles();
}

function refreshBubbles() {
  for (const bubble of speechBubbles) {
    const isCurrentScene = bubble.dataset.scene === currentSceneId;
    const layout = getBubbleLayout(currentSceneId, bubble.dataset.bubbleId);
    const shouldShow = isCurrentScene && (editorEnabled || activeBubbleId === bubble.dataset.bubbleId);

    bubble.classList.toggle("is-visible", shouldShow && Boolean(layout));
    bubble.classList.toggle("is-editor", editorEnabled && isCurrentScene);

    if (!isCurrentScene || !layout) {
      continue;
    }

    applyBubbleLayout(bubble, layout);
  }
}

function refreshSeatAnchors() {
  for (const seatAnchor of seatAnchorElements) {
    const isCurrentScene = seatAnchor.dataset.scene === currentSceneId;
    const layout = getSeatAnchorLayout(currentSceneId, seatAnchor.dataset.seatId);
    const shouldShow = editorEnabled && isCurrentScene;

    seatAnchor.classList.toggle("is-visible", shouldShow && Boolean(layout));

    if (!isCurrentScene || !layout) {
      continue;
    }

    applySeatAnchorLayout(seatAnchor, layout);
  }
}

function refreshHotspots() {
  for (const hotspot of hotspots) {
    const isSeatSlot = currentSceneId === "sala-mensa" && hotspot.classList.contains("seat-slot");
    const isCurrentScene = hotspot.dataset.scene === currentSceneId;
    hotspot.classList.toggle("is-visible", isCurrentScene && !isSeatSlot);
    hotspot.classList.toggle("is-editor", editorEnabled && isCurrentScene && !isSeatSlot);

    if (!isCurrentScene || isSeatSlot) {
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

function syncDiningCharacterPositions() {
  for (const characterId of diningCharacters) {
    const seatId = characterSeats[characterId];
    const character = characterLayout["sala-mensa"]?.[characterId];
    const seat = seatAnchors["sala-mensa"]?.[seatId];

    if (!character || !seat) {
      continue;
    }

    character.left = roundPercent(seat.x - character.width / 2);
    character.top = roundPercent(seat.y - character.height);
  }
}

function getOccupiedSeats() {
  const occupiedSeats = [];

  for (const characterId of diningCharacters) {
    const seatId = characterSeats[characterId];

    if (seatAnchors["sala-mensa"]?.[seatId]) {
      occupiedSeats.push(seatId);
    }
  }

  return occupiedSeats;
}

function getFreeSeats() {
  const diningSeats = ["posto1", "posto2", "posto3", "posto4", "posto5", "posto6"];
  const occupiedSeats = new Set(getOccupiedSeats());

  return diningSeats.filter((seatId) => {
    return seatAnchors["sala-mensa"]?.[seatId] && !occupiedSeats.has(seatId);
  });
}

function hasValidDiningSeat(characterId) {
  const seatId = characterSeats[characterId];
  if (!seatAnchors["sala-mensa"]?.[seatId]) {
    return false;
  }

  const occupiedByOthers = diningCharacters.some((otherCharacterId) => {
    return otherCharacterId !== characterId && characterSeats[otherCharacterId] === seatId;
  });

  return !occupiedByOthers;
}

function areSeatsAdjacent(seatA, seatB) {
  if (!seatA || !seatB) {
    return false;
  }

  return adjacentSeats[seatA]?.includes(seatB) || false;
}

function setCharacterImage(characterId, src) {
  const image = document.querySelector(`#character-${characterId} img`);

  if (image) {
    image.src = src;
  }
}

function getDialogueLines(characterId) {
  return characterId === "nonnogianni"
    ? nonnoGianniLines
    : characterId === "lauda"
      ? laudaLines
      : characterDialogues[characterId];
}

function getRandomDialogue(characterId) {
  const lines = getDialogueLines(characterId);

  if (!lines || lines.length === 0) {
    return "";
  }

  const lastDialogue = lastDialogueByCharacter[characterId];
  const availableLines = lines.length > 1
    ? lines.filter((line) => line !== lastDialogue)
    : lines;
  const nextDialogue = availableLines[Math.floor(Math.random() * availableLines.length)];

  lastDialogueByCharacter[characterId] = nextDialogue;
  return nextDialogue;
}

function pickNextSpeaker(characters) {
  const validCharacters = characters.filter((characterId) => {
    const lines = getDialogueLines(characterId);
    return lines && lines.length > 0;
  });

  let available = validCharacters.filter((characterId) => !spokenThisRound.has(characterId));

  if (available.length === 0) {
    spokenThisRound.clear();
    available = validCharacters;
  }

  available = available.filter((characterId) => characterId !== lastSpeakerId);

  if (available.length === 0) {
    available = validCharacters.filter((characterId) => !spokenThisRound.has(characterId));
  }

  if (available.length === 0) {
    return null;
  }

  return available[Math.floor(Math.random() * available.length)];
}

function showBubble(characterId) {
  if (isSpecialDialogueRunning) {
    return;
  }

  const seatId = characterSeats[characterId];
  const bubble = document.getElementById(`bubble-${seatId}`);

  if (!bubble) {
    return;
  }

  const dialogue = getRandomDialogue(characterId);

  if (!dialogue) {
    return;
  }

  showSpeechBubbleForCharacter(characterId, dialogue, 4000);
}

function startDiningDialogues() {
  if (diningDialoguesIntervalId) {
    return;
  }

  diningDialoguesIntervalId = window.setInterval(() => {
    if (currentSceneId !== "sala-mensa" || isSpecialDialogueRunning) {
      return;
    }

    const nextSpeaker = pickNextSpeaker(diningDialogueCharacters);

    if (!nextSpeaker) {
      return;
    }

    showBubble(nextSpeaker);
    spokenThisRound.add(nextSpeaker);
    lastSpeakerId = nextSpeaker;
  }, 5000);
}

function stopDiningDialogues() {
  if (!diningDialoguesIntervalId) {
    return;
  }

  clearInterval(diningDialoguesIntervalId);
  diningDialoguesIntervalId = null;
  spokenThisRound.clear();
  lastSpeakerId = null;
}

function showSpecificBubble(characterId, textContent) {
  showSpeechBubbleForCharacter(characterId, textContent, 2500);
}

async function startGianniLaudaDebate() {
  if (isSpecialDialogueRunning) {
    return;
  }

  isSpecialDialogueRunning = true;
  gianniLaudaDebateAlreadyTriggered = true;
  hideAllBubbles();

  setCharacterImage("nonnogianni", "assets/characters/nonnogiannirabbia.png");
  setCharacterImage("lauda", "assets/characters/laudarabbia.png");

  const sequence = [
    { characterId: "nonnogianni", text: "Lauda! Ingorda!" },
    { characterId: "lauda", text: "non ti curar di loro..." },
    { characterId: "nonnogianni", text: "Guardate Lauda! Ha le mani prensili!" },
    { characterId: "lauda", text: "Vattenaffanculo!" },
    { characterId: "nonnogianni", text: "ahahahahah" },
    { characterId: "lauda", text: "*borbotta*" }
  ];

  for (const line of sequence) {
    hideAllBubbles();
    showSpecificBubble(line.characterId, line.text);
    await wait(2500);
    hideAllBubbles();
    await wait(400);
  }

  await wait(800);

  setCharacterImage("nonnogianni", "assets/characters/nonnogianni.png");
  setCharacterImage("lauda", "assets/characters/lauda.png");
  isSpecialDialogueRunning = false;
}

function checkGianniLaudaDebate() {
  if (currentSceneId !== "sala-mensa") {
    return;
  }

  if (isUpdatingDiningSeats || isSpecialDialogueRunning || gianniLaudaDebateAlreadyTriggered) {
    return;
  }

  const gianniSeat = characterSeats.nonnogianni;
  const laudaSeat = characterSeats.lauda;

  if (areSeatsAdjacent(gianniSeat, laudaSeat)) {
    startGianniLaudaDebate();
  }
}

function renderScene(sceneId) {
  const scene = scenes[sceneId];

  if (!scene) {
    return;
  }

  currentSceneId = sceneId;
  hideBubbles();

  if (sceneId === "reception") {
    receptionEventAttemptedThisVisit = false;
  } else {
    cancelReceptionEvents();
  }

  if (sceneId === "sala-mensa") {
    startDiningDialogues();
  } else {
    stopDiningDialogues();
  }

  if (sceneId === "sala-mensa" && diningCharacters.some((characterId) => !hasValidDiningSeat(characterId))) {
    randomizeDiningSeats();
  }

  game.dataset.scene = sceneId;
  updateRoomBackground(sceneId);
  sceneElement.setAttribute("aria-label", scene.label);
  roomName.textContent = scene.label;
  consoleOutput.textContent = scene.message;

  for (const navButton of navButtons) {
    const isActive = navButton.dataset.navTarget === sceneId;
    navButton.classList.toggle("is-active", isActive);
  }

  refreshHotspots();
  refreshCharacters();
  refreshBubbles();
  refreshSeatAnchors();

  if (sceneId === "reception" && timeOfDay === "day") {
    scheduleReceptionEventCheck();
  }

  if (sceneId === "sala-mensa") {
    checkGianniLaudaDebate();
  }
}

function updateEditorState() {
  toggleEditorButton.classList.toggle("is-active", editorEnabled);
  toggleEditorButton.setAttribute("aria-pressed", String(editorEnabled));
  refreshHotspots();
  refreshCharacters();
  refreshBubbles();
  refreshSeatAnchors();
}

function updatePreviewState() {
  document.body.classList.toggle("game-preview", gamePreviewEnabled);
  togglePreviewButton.classList.toggle("is-active", gamePreviewEnabled);
  togglePreviewButton.setAttribute("aria-pressed", String(gamePreviewEnabled));
  togglePreviewButton.textContent = gamePreviewEnabled ? "Vista Editor" : "Vista Gioco";
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

function startBubbleInteraction(event, bubble, mode) {
  const layout = getBubbleLayout(currentSceneId, bubble.dataset.bubbleId);

  if (!editorEnabled || !layout) {
    return;
  }

  const pointer = pointerToPercent(event);
  interaction = {
    type: "bubble",
    bubble,
    bubbleId: bubble.dataset.bubbleId,
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

function startSeatAnchorInteraction(event, seatAnchor) {
  const layout = getSeatAnchorLayout(currentSceneId, seatAnchor.dataset.seatId);

  if (!editorEnabled || !layout) {
    return;
  }

  const pointer = pointerToPercent(event);
  interaction = {
    type: "seat-anchor",
    seatAnchor,
    seatId: seatAnchor.dataset.seatId,
    pointerLeft: pointer.left,
    pointerTop: pointer.top,
    startX: layout.x,
    startY: layout.y
  };

  event.preventDefault();
}

function handlePointerMove(event) {
  if (!interaction) {
    return;
  }

  const layout = interaction.type === "character"
    ? getCharacterLayout(currentSceneId, interaction.characterId)
    : interaction.type === "bubble"
      ? getBubbleLayout(currentSceneId, interaction.bubbleId)
      : interaction.type === "seat-anchor"
        ? getSeatAnchorLayout(currentSceneId, interaction.seatId)
    : getLayout(currentSceneId, interaction.hotspotId);

  if (!layout) {
    return;
  }

  const pointer = pointerToPercent(event);
  const deltaLeft = pointer.left - interaction.pointerLeft;
  const deltaTop = pointer.top - interaction.pointerTop;

  if (interaction.type === "seat-anchor") {
    layout.x = roundPercent(clamp(interaction.startX + deltaLeft, 0, 100));
    layout.y = roundPercent(clamp(interaction.startY + deltaTop, 0, 100));
    applySeatAnchorLayout(interaction.seatAnchor, layout);
    return;
  }

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

  if (interaction.type === "bubble") {
    applyBubbleLayout(interaction.bubble, layout);
    return;
  }

  applyHotspotLayout(interaction.hotspot, layout);
}

function stopInteraction() {
  interaction = null;
}

function showNonnoGianniBubble() {
  if (isSpecialDialogueRunning) {
    return;
  }

  const randomLine = nonnoGianniLines[Math.floor(Math.random() * nonnoGianniLines.length)];
  showSpeechBubbleForCharacter("nonnogianni", randomLine);
  consoleOutput.textContent = "Nonno Gianni ti guarda in silenzio.";
}

function showLaudaBubble() {
  if (isSpecialDialogueRunning) {
    return;
  }

  const randomLine = laudaLines[Math.floor(Math.random() * laudaLines.length)];
  showSpeechBubbleForCharacter("lauda", randomLine);
  consoleOutput.textContent = "Lauda sistema il vassoio e borbotta qualcosa.";
}

function showSpeechBubbleForCharacter(characterId, text, duration = 3000) {
  const seatId = characterSeats[characterId];

  if (!seatId || currentSceneId !== "sala-mensa") {
    return;
  }

  const bubble = document.getElementById(`bubble-${seatId}`);

  if (!bubble) {
    return;
  }

  if (bubbleTimeoutId) {
    clearTimeout(bubbleTimeoutId);
    bubbleTimeoutId = null;
  }

  bubble.querySelector(".speech-bubble-text").textContent = text;
  activeBubbleId = seatId;
  refreshBubbles();

  bubbleTimeoutId = window.setTimeout(() => {
    if (!editorEnabled) {
      activeBubbleId = null;
      refreshBubbles();
    }

    bubbleTimeoutId = null;
  }, duration);
}

function placeCharacterAtSeat(characterId, seatId) {
  const character = characterLayout["sala-mensa"]?.[characterId];
  let targetSeatId = seatId;

  const isSeatOccupiedByAnotherCharacter = diningCharacters.some((otherCharacterId) => {
    return otherCharacterId !== characterId && characterSeats[otherCharacterId] === targetSeatId;
  });

  if (isSeatOccupiedByAnotherCharacter || !seatAnchors["sala-mensa"]?.[targetSeatId]) {
    const freeSeats = getFreeSeats();

    if (freeSeats.length === 0) {
      return;
    }

    targetSeatId = freeSeats[Math.floor(Math.random() * freeSeats.length)];
  }

  const seat = seatAnchors["sala-mensa"]?.[targetSeatId];

  if (!character || !seat) {
    return;
  }

  character.left = roundPercent(seat.x - character.width / 2);
  character.top = roundPercent(seat.y - character.height);
  characterSeats[characterId] = targetSeatId;

  refreshCharacters();
  refreshBubbles();
  checkGianniLaudaDebate();
}

function randomizeDiningSeats() {
  const availableSeats = ["posto1", "posto2", "posto3", "posto4", "posto5", "posto6"].filter((seatId) => {
    return Boolean(seatAnchors["sala-mensa"]?.[seatId]);
  });

  if (availableSeats.length < diningCharacters.length) {
    return;
  }

  hideBubbles();
  isUpdatingDiningSeats = true;

  try {
    for (const characterId of diningCharacters) {
      characterSeats[characterId] = null;
    }

    for (const characterId of diningCharacters) {
      const freeSeats = getFreeSeats();

      if (freeSeats.length === 0) {
        return;
      }

      const randomSeatId = freeSeats[Math.floor(Math.random() * freeSeats.length)];
      placeCharacterAtSeat(characterId, randomSeatId);
    }
  } finally {
    isUpdatingDiningSeats = false;
  }

  checkGianniLaudaDebate();
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

  if (currentSceneId === "sala-mensa" && hotspot.classList.contains("seat-slot")) {
    return;
  }

  const message = hotspot.dataset.message || "Nessun messaggio disponibile.";
  consoleOutput.textContent = message;
}

async function copyLayout() {
  const exportData = {
    hotspotLayout: structuredClone(hotspotLayout),
    characterLayout: structuredClone(characterLayout),
    bubbleLayout: structuredClone(bubbleLayout),
    seatAnchors: structuredClone(seatAnchors),
    characterSeats: structuredClone(characterSeats)
  };
  const json = JSON.stringify(exportData, null, 2);

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
  character.addEventListener("click", (event) => {
    if (editorEnabled) {
      event.preventDefault();
      return;
    }

    if (currentSceneId !== "sala-mensa") {
      return;
    }

    if (character.dataset.characterId === "nonnogianni") {
      showNonnoGianniBubble();
      return;
    }

    if (character.dataset.characterId === "lauda") {
      showLaudaBubble();
    }
  });

  character.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    const isResizeHandle = event.target.classList.contains("character-resize");
    startCharacterInteraction(event, character, isResizeHandle ? "resize" : "move");
  });
}

for (const bubble of speechBubbles) {
  bubble.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    const isResizeHandle = event.target.classList.contains("speech-bubble-resize");
    startBubbleInteraction(event, bubble, isResizeHandle ? "resize" : "move");
  });
}

for (const seatAnchor of seatAnchorElements) {
  seatAnchor.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    startSeatAnchorInteraction(event, seatAnchor);
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

togglePreviewButton.addEventListener("click", () => {
  gamePreviewEnabled = !gamePreviewEnabled;
  updatePreviewState();
});

toggleTimeOfDayButton.addEventListener("click", () => {
  timeOfDay = timeOfDay === "day" ? "night" : "day";

  if (timeOfDay === "night") {
    cancelReceptionEvents();
  }

  updateTimeOfDayButton();
  updateRoomBackground(currentSceneId);

  if (timeOfDay === "day" && currentSceneId === "reception") {
    scheduleReceptionEventCheck();
  }
});

randomizeDiningSeatsButton.addEventListener("click", () => {
  randomizeDiningSeats();
  consoleOutput.textContent = "Posti della mensa randomizzati.";
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

for (const bubble of speechBubbles) {
  ensureBubbleSceneLayout(bubble.dataset.scene);
}

for (const seatAnchor of seatAnchorElements) {
  ensureSeatAnchorSceneLayout(seatAnchor.dataset.scene);
}

syncDiningCharacterPositions();
renderScene("reception");
updateEditorState();
updatePreviewState();
updateTimeOfDayButton();
