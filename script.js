// ============================================================
// Luna & Max — Lógica de la app
// Todo se guarda en localStorage del navegador de cada visitante.
// ============================================================

const STORAGE_KEYS = {
  predictions: 'lunamax_predictions',
  result: 'lunamax_result',
  adminSession: 'lunamax_admin_ok',
};

// Cambia esta contraseña por la que quieras usar para el panel de la dueña.
const ADMIN_PASSWORD = 'LunaYMax2026';

// Tonos de pelaje inspirados en Luna y papá Max (labrador dorado)
const FUR_SHADES = [
  { id: 'miel',      hex: '#e3a85e', label: 'Miel' },
  { id: 'dorado',    hex: '#f0c27b', label: 'Dorado' },
  { id: 'crema',     hex: '#f6e4c3', label: 'Crema' },
  { id: 'caramelo',  hex: '#c9843a', label: 'Caramelo' },
  { id: 'chocolate', hex: '#8b5e3c', label: 'Chocolate' },
];

// ------------------------------------------------------------
// Estado en memoria de la camita que se está armando
// ------------------------------------------------------------
let currentCount = 3;
let puppyDraft = []; // [{ sex: 'niño'|'niña'|null, shade: 'miel' }]
let activePuppyIndex = null;

function defaultPuppy() {
  return { sex: null, shade: FUR_SHADES[Math.floor(Math.random() * FUR_SHADES.length)].id };
}

function syncDraftLength() {
  while (puppyDraft.length < currentCount) puppyDraft.push(defaultPuppy());
  while (puppyDraft.length > currentCount) puppyDraft.pop();
}

// ------------------------------------------------------------
// Render de la camita
// ------------------------------------------------------------
const puppyBedEl = document.getElementById('puppyBed');
const counterDisplay = document.getElementById('counterDisplay');
const formCountPreview = document.getElementById('formCountPreview');
const slider = document.getElementById('puppySlider');

function shadeHex(id) {
  const found = FUR_SHADES.find(s => s.id === id);
  return found ? found.hex : FUR_SHADES[0].hex;
}

function bowFor(sex) {
  // Según lo pedido: Niño = lazo/collar rosa, Niña = lazo/collar azul
  if (sex === 'niño') return '🎀';
  if (sex === 'niña') return '🎗️';
  return '';
}

function renderPuppyBed(animateNew) {
  const existingEls = Array.from(puppyBedEl.children);

  // Quitar cachorritos sobrantes con animación de salida
  if (existingEls.length > currentCount) {
    for (let i = currentCount; i < existingEls.length; i++) {
      existingEls[i].classList.add('leaving');
      setTimeout(() => existingEls[i].remove(), 220);
    }
  }

  for (let i = 0; i < currentCount; i++) {
    let el = puppyBedEl.children[i];
    const data = puppyDraft[i];
    if (!el) {
      el = document.createElement('div');
      el.className = 'puppy';
      el.dataset.index = i;
      el.innerHTML = `
        <div class="puppy-ear left"></div>
        <div class="puppy-ear right"></div>
        <div class="puppy-head">
          <div class="puppy-bow">${bowFor(data.sex)}</div>
          <div class="puppy-face">
            <div class="puppy-eye left"></div>
            <div class="puppy-eye right"></div>
            <div class="puppy-nose"></div>
          </div>
        </div>
        <div class="puppy-body"></div>
        <div class="puppy-index-tag">#${i + 1}</div>
      `;
      el.addEventListener('click', () => openPuppyModal(i));
      puppyBedEl.appendChild(el);
    }
    // Colorear según tono elegido
    const hex = shadeHex(data.shade);
    el.querySelector('.puppy-head').style.background = hex;
    el.querySelector('.puppy-ear.left').style.background = hex;
    el.querySelector('.puppy-ear.right').style.background = hex;
    el.querySelector('.puppy-body').style.background = hex;
    el.querySelector('.puppy-bow').textContent = bowFor(data.sex);
  }
}

function bumpCounter() {
  counterDisplay.classList.add('bump');
  setTimeout(() => counterDisplay.classList.remove('bump'), 150);
}

slider.addEventListener('input', () => {
  currentCount = parseInt(slider.value, 10);
  counterDisplay.textContent = currentCount;
  formCountPreview.textContent = currentCount;
  bumpCounter();
  syncDraftLength();
  renderPuppyBed(true);
});

// ------------------------------------------------------------
// Modal de personalización de cachorrito
// ------------------------------------------------------------
const puppyModal = document.getElementById('puppyModal');
const puppyModalIndex = document.getElementById('puppyModalIndex');
const shadeOptionsEl = document.getElementById('shadeOptions');

function buildShadeOptions() {
  shadeOptionsEl.innerHTML = '';
  FUR_SHADES.forEach(shade => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'shade-swatch';
    btn.style.background = shade.hex;
    btn.title = shade.label;
    btn.dataset.shade = shade.id;
    btn.addEventListener('click', () => {
      if (activePuppyIndex === null) return;
      puppyDraft[activePuppyIndex].shade = shade.id;
      refreshShadeSelection();
      renderPuppyBed(false);
    });
    shadeOptionsEl.appendChild(btn);
  });
}

function refreshShadeSelection() {
  const data = puppyDraft[activePuppyIndex];
  Array.from(shadeOptionsEl.children).forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.shade === data.shade);
  });
}

function refreshSexSelection() {
  const data = puppyDraft[activePuppyIndex];
  document.querySelectorAll('.sex-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.sex === data.sex);
  });
}

function openPuppyModal(index) {
  activePuppyIndex = index;
  puppyModalIndex.textContent = `#${index + 1}`;
  refreshSexSelection();
  refreshShadeSelection();
  puppyModal.classList.remove('hidden');
}

document.getElementById('puppyModalClose').addEventListener('click', () => {
  puppyModal.classList.add('hidden');
});

puppyModal.addEventListener('click', (e) => {
  if (e.target === puppyModal) puppyModal.classList.add('hidden');
});

document.querySelectorAll('.sex-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (activePuppyIndex === null) return;
    puppyDraft[activePuppyIndex].sex = btn.dataset.sex;
    refreshSexSelection();
    renderPuppyBed(false);
  });
});

// ------------------------------------------------------------
// Formulario de registro
// ------------------------------------------------------------
const form = document.getElementById('predictionForm');
const formFeedback = document.getElementById('formFeedback');

function getPredictions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.predictions)) || [];
  } catch {
    return [];
  }
}

function savePredictions(list) {
  localStorage.setItem(STORAGE_KEYS.predictions, JSON.stringify(list));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('nameInput').value.trim();
  const message = document.getElementById('messageInput').value.trim();

  if (!name || !message) return;

  const prediction = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name,
    message,
    count: currentCount,
    puppies: puppyDraft.map(p => ({ sex: p.sex, shade: p.shade })),
    timestamp: new Date().toISOString(),
  };

  const list = getPredictions();
  list.push(prediction);
  savePredictions(list);

  formFeedback.textContent = '¡Gracias! Tu apuesta ya está en el muro de la comunidad 🎉';
  formFeedback.classList.remove('hidden', 'error');
  form.reset();
  document.getElementById('messageInput').value = '';

  renderWall();

  setTimeout(() => {
    document.getElementById('muro').scrollIntoView({ behavior: 'smooth' });
  }, 500);
});

// ------------------------------------------------------------
// Muro de la comunidad + estadísticas
// ------------------------------------------------------------
const wallGrid = document.getElementById('wallGrid');
const wallEmpty = document.getElementById('wallEmpty');
const statAverage = document.getElementById('statAverage');
const statTotal = document.getElementById('statTotal');

function getResult() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.result));
  } catch {
    return null;
  }
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

function renderWall() {
  const list = getPredictions();
  const result = getResult();

  statTotal.textContent = list.length;
  statAverage.textContent = list.length
    ? (list.reduce((sum, p) => sum + p.count, 0) / list.length).toFixed(1)
    : '–';

  wallGrid.innerHTML = '';

  if (!list.length) {
    wallEmpty.classList.remove('hidden');
    return;
  }
  wallEmpty.classList.add('hidden');

  // Si ya hay resultado, ordenamos por cercanía al número real
  let sorted = [...list];
  let minDiff = null;
  if (result && typeof result.count === 'number') {
    sorted.forEach(p => { p.__diff = Math.abs(p.count - result.count); });
    sorted.sort((a, b) => a.__diff - b.__diff);
    minDiff = Math.min(...sorted.map(p => p.__diff));
  } else {
    sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  sorted.forEach(p => {
    const card = document.createElement('div');
    card.className = 'wall-card';

    let badgeHtml = '';
    if (result && typeof result.count === 'number') {
      if (p.__diff === 0) {
        card.classList.add('winner-exact');
        badgeHtml = `<span class="wall-card-badge badge-exact">🎯 ¡Adivinó exacto!</span>`;
      } else if (p.__diff === minDiff) {
        card.classList.add('winner-close');
        badgeHtml = `<span class="wall-card-badge badge-close">🐾 Más cercano/a</span>`;
      }
    }

    const miniBed = (p.puppies || []).map(pup => {
      const hex = shadeHex(pup.shade);
      const ring = pup.sex === 'niño' ? '2px solid #ef9fbb' : pup.sex === 'niña' ? '2px solid #8fc7e0' : '2px solid transparent';
      return `<span class="mini-puppy" style="background:${hex}; border:${ring};"></span>`;
    }).join('');

    card.innerHTML = `
      <div class="wall-card-mini-bed">${miniBed}</div>
      <span class="wall-card-name">${escapeHtml(p.name)}</span><span class="wall-card-count">${p.count} 🐶</span>
      <p class="wall-card-message">"${escapeHtml(p.message)}"</p>
      <div style="font-size:0.72rem; color:var(--coffee-soft); margin-top:6px;">${formatDate(p.timestamp)}</div>
      ${badgeHtml}
    `;
    wallGrid.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ------------------------------------------------------------
// Celebración
// ------------------------------------------------------------
const celebrationBanner = document.getElementById('celebration-banner');
const celebrationText = document.getElementById('celebration-text');

function renderCelebrationIfNeeded() {
  const result = getResult();
  if (result && typeof result.count === 'number') {
    celebrationBanner.classList.remove('hidden');
    const dateText = result.date ? ` el ${formatDate(result.date)}` : '';
    celebrationText.textContent = `Luna y Max tuvieron ${result.count} cachorrito${result.count === 1 ? '' : 's'}${dateText} 🐾💛`;
  } else {
    celebrationBanner.classList.add('hidden');
  }
}

function launchConfetti() {
  const colors = ['#e3a85e', '#f7c9d8', '#bfe1f0', '#f6e4c3', '#ef9fbb'];
  const total = 120;
  for (let i = 0; i < total; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const size = 6 + Math.random() * 8;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 0.4}px`;
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    const duration = 2.5 + Math.random() * 2;
    piece.style.animationDuration = `${duration}s`;
    piece.style.opacity = String(0.7 + Math.random() * 0.3);
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), duration * 1000 + 200);
  }
}

// ------------------------------------------------------------
// Panel de administración
// ------------------------------------------------------------
const adminAccessBtn = document.getElementById('adminAccessBtn');
const adminModal = document.getElementById('adminModal');
const adminLogin = document.getElementById('adminLogin');
const adminPanel = document.getElementById('adminPanel');
const adminPasswordInput = document.getElementById('adminPasswordInput');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminLoginError = document.getElementById('adminLoginError');
const adminFeedback = document.getElementById('adminFeedback');

adminAccessBtn.addEventListener('click', () => {
  adminModal.classList.remove('hidden');
  const isLoggedIn = sessionStorage.getItem(STORAGE_KEYS.adminSession) === 'true';
  adminLogin.classList.toggle('hidden', isLoggedIn);
  adminPanel.classList.toggle('hidden', !isLoggedIn);
});

document.getElementById('adminModalClose').addEventListener('click', () => {
  adminModal.classList.add('hidden');
});

adminModal.addEventListener('click', (e) => {
  if (e.target === adminModal) adminModal.classList.add('hidden');
});

adminLoginBtn.addEventListener('click', () => {
  if (adminPasswordInput.value === ADMIN_PASSWORD) {
    sessionStorage.setItem(STORAGE_KEYS.adminSession, 'true');
    adminLogin.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    adminLoginError.classList.add('hidden');
    adminPasswordInput.value = '';
  } else {
    adminLoginError.textContent = 'Contraseña incorrecta 🔒';
    adminLoginError.classList.remove('hidden');
    adminLoginError.classList.add('error');
  }
});

document.getElementById('publishResultBtn').addEventListener('click', () => {
  const countVal = document.getElementById('realCountInput').value;
  const dateVal = document.getElementById('realDateInput').value;

  if (countVal === '' || isNaN(Number(countVal))) {
    adminFeedback.textContent = 'Ingresa un número válido de cachorritos.';
    adminFeedback.classList.remove('hidden');
    adminFeedback.classList.add('error');
    return;
  }

  const result = { count: Number(countVal), date: dateVal || null };
  localStorage.setItem(STORAGE_KEYS.result, JSON.stringify(result));

  adminFeedback.textContent = '¡Resultado publicado! 🎉';
  adminFeedback.classList.remove('hidden', 'error');

  renderCelebrationIfNeeded();
  renderWall();
  launchConfetti();
  setTimeout(launchConfetti, 600);

  setTimeout(() => {
    adminModal.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 900);
});

document.getElementById('resetContestBtn').addEventListener('click', () => {
  const confirmReset = confirm('¿Seguro que quieres borrar todas las apuestas y el resultado? Esta acción no se puede deshacer.');
  if (!confirmReset) return;
  localStorage.removeItem(STORAGE_KEYS.predictions);
  localStorage.removeItem(STORAGE_KEYS.result);
  renderWall();
  renderCelebrationIfNeeded();
  adminFeedback.textContent = 'Concurso reiniciado.';
  adminFeedback.classList.remove('hidden', 'error');
});

// ------------------------------------------------------------
// Inicialización
// ------------------------------------------------------------
function init() {
  syncDraftLength();
  buildShadeOptions();
  renderPuppyBed(false);
  renderWall();
  renderCelebrationIfNeeded();
}

init();
