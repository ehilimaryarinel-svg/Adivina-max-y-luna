/* =========================================================
   Luna & Max · Selector de cachorritos
   script.js — módulos: Storage, PuppyArt, Bed, Slider, App
   ========================================================= */

const STORAGE_KEY = "lunaMaxPuppyGenders";

/* ---------------------------------------------------------
   Módulo Storage — persiste el género de cada cachorrito
   --------------------------------------------------------- */
const Storage = {
  read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.warn("No se pudo leer el estado guardado:", err);
      return {};
    }
  },

  write(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn("No se pudo guardar el estado:", err);
    }
  },

  getGender(id, fallback) {
    const state = this.read();
    return state[id] || fallback;
  },

  setGender(id, gender) {
    const state = this.read();
    state[id] = gender;
    this.write(state);
  },
};

/* ---------------------------------------------------------
   Módulo PuppyArt — genera el SVG detallado de cada cabeza
   --------------------------------------------------------- */
const PuppyArt = {
  // Paletas de pelaje: [claro, oscuro] para el degradado
  furPalettes: [
    ["#fbe9c6", "#f3d29c"], // crema
    ["#eec18a", "#cf9556"], // beige/tostado
    ["#a97a56", "#6e4a30"], // marrón chocolate
  ],

  bowColors: {
    hembra: { light: "#cdeaff", dark: "#a9def2" }, // azul cielo pastel
    macho: { light: "#ffd6e6", dark: "#ffb9d6" }, // rosa pastel
  },

  furFor(index) {
    return this.furPalettes[index % this.furPalettes.length];
  },

  /**
   * Devuelve el markup SVG completo de una cabeza de cachorrito.
   * @param {number} id - índice único del cachorrito (para IDs de gradiente)
   * @param {string} gender - "hembra" | "macho"
   */
  render(id, gender) {
    const [furLight, furDark] = this.furFor(id);
    const bow = this.bowColors[gender];
    const uid = `p${id}`;

    return `
<svg class="puppy-svg" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="fur-${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${furLight}" />
      <stop offset="100%" stop-color="${furDark}" />
    </linearGradient>
    <linearGradient id="ear-${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${furDark}" />
      <stop offset="100%" stop-color="${furDark}" stop-opacity="0.85" />
    </linearGradient>
    <linearGradient id="muzzle-${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff8ec" />
      <stop offset="100%" stop-color="${furLight}" />
    </linearGradient>
    <linearGradient id="bow-${uid}" class="bow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bow.light}" />
      <stop offset="100%" stop-color="${bow.dark}" />
    </linearGradient>
  </defs>

  <!-- orejas caídas -->
  <path d="M38,44 C18,50 8,80 20,104 C27,117 46,113 49,97 C52,80 46,56 38,44 Z" fill="url(#ear-${uid})" />
  <path d="M102,44 C122,50 132,80 120,104 C113,117 94,113 91,97 C88,80 94,56 102,44 Z" fill="url(#ear-${uid})" />

  <!-- cabeza -->
  <path d="M70,18 C97,18 118,40 118,68 C118,97 99,120 70,120 C41,120 22,97 22,68 C22,40 43,18 70,18 Z" fill="url(#fur-${uid})" />

  <!-- mejillas sonrosadas -->
  <ellipse cx="38" cy="88" rx="9" ry="6" fill="#ffb9d6" opacity="0.35" />
  <ellipse cx="102" cy="88" rx="9" ry="6" fill="#ffb9d6" opacity="0.35" />

  <!-- hocico -->
  <ellipse cx="70" cy="94" rx="24" ry="18" fill="url(#muzzle-${uid})" />

  <!-- ojos -->
  <ellipse cx="53" cy="68" rx="7" ry="9" fill="#4a3327" />
  <ellipse cx="87" cy="68" rx="7" ry="9" fill="#4a3327" />
  <circle cx="55.5" cy="64.5" r="2.1" fill="#ffffff" opacity="0.9" />
  <circle cx="89.5" cy="64.5" r="2.1" fill="#ffffff" opacity="0.9" />

  <!-- nariz -->
  <ellipse cx="70" cy="86" rx="9" ry="6.5" fill="#4a3327" />
  <ellipse cx="67" cy="83.5" r="1.6" fill="#ffffff" opacity="0.55" />

  <!-- boca -->
  <path d="M62,96 Q70,104 78,96" fill="none" stroke="#4a3327" stroke-width="2.4" stroke-linecap="round" />

  <!-- lazo -->
  <g class="bow" data-role="bow">
    <path d="M53,16 C42,6 30,10 33,21 C36,30 48,27 53,16 Z" fill="url(#bow-${uid})" stroke="#ffffff" stroke-width="1" />
    <path d="M87,16 C98,6 110,10 107,21 C104,30 92,27 87,16 Z" fill="url(#bow-${uid})" stroke="#ffffff" stroke-width="1" />
    <circle cx="70" cy="17" r="7" fill="url(#bow-${uid})" stroke="#ffffff" stroke-width="1" />
  </g>
</svg>`.trim();
  },
};

/* ---------------------------------------------------------
   Módulo Bed — maneja la camada (grid) de cachorritos
   --------------------------------------------------------- */
const Bed = {
  el: null,

  init(el) {
    this.el = el;
  },

  puppyId(index) {
    return `cachorro${index + 1}`;
  },

  defaultGender(index) {
    // Alterna por defecto: par -> hembra, impar -> macho
    return index % 2 === 0 ? "hembra" : "macho";
  },

  createPuppyEl(index) {
    const id = this.puppyId(index);
    const gender = Storage.getGender(id, this.defaultGender(index));

    const wrapper = document.createElement("button");
    wrapper.type = "button";
    wrapper.className = "puppy";
    wrapper.dataset.id = id;
    wrapper.dataset.index = String(index);
    wrapper.dataset.gender = gender;
    wrapper.setAttribute("role", "listitem");
    wrapper.setAttribute(
      "aria-label",
      `Cachorrito número ${index + 1}, ${gender}. Toca para cambiar.`
    );

    wrapper.innerHTML = `
      ${PuppyArt.render(index, gender)}
      <span class="puppy-number">#${index + 1}</span>
    `;

    wrapper.addEventListener("click", () => this.toggleGender(wrapper));

    return wrapper;
  },

  toggleGender(wrapper) {
    const id = wrapper.dataset.id;
    const index = Number(wrapper.dataset.index);
    const current = wrapper.dataset.gender;
    const next = current === "hembra" ? "macho" : "hembra";

    Storage.setGender(id, next);
    wrapper.dataset.gender = next;
    wrapper.setAttribute(
      "aria-label",
      `Cachorrito número ${index + 1}, ${next}. Toca para cambiar.`
    );

    const svgHolder = wrapper.querySelector(".puppy-svg");
    if (svgHolder) {
      svgHolder.outerHTML = PuppyArt.render(index, next);
    }
  },

  /** Ajusta el número de cachorritos visibles al valor del slider */
  setCount(count) {
    const current = this.el.querySelectorAll(".puppy").length;

    if (count > current) {
      for (let i = current; i < count; i++) {
        this.el.appendChild(this.createPuppyEl(i));
      }
    } else if (count < current) {
      const toRemove = Array.from(this.el.querySelectorAll(".puppy")).slice(count);
      toRemove.forEach((node) => {
        node.classList.add("pop-out");
        node.addEventListener(
          "animationend",
          () => node.remove(),
          { once: true }
        );
      });
    }
  },
};

/* ---------------------------------------------------------
   Módulo Slider — sincroniza el input range con el texto y la camada
   --------------------------------------------------------- */
const Slider = {
  input: null,
  numberEl: null,

  init(input, numberEl) {
    this.input = input;
    this.numberEl = numberEl;
    this.input.addEventListener("input", () => this.handleChange());
  },

  handleChange() {
    const value = Number(this.input.value);
    this.updateNumber(value);
    Bed.setCount(value);
  },

  updateNumber(value) {
    this.numberEl.textContent = value;
    this.numberEl.classList.remove("bump");
    // Forzar reflow para reiniciar la animación
    void this.numberEl.offsetWidth;
    this.numberEl.classList.add("bump");
  },
};

/* ---------------------------------------------------------
   App — arranque
   --------------------------------------------------------- */
const App = {
  start() {
    const slider = document.getElementById("puppySlider");
    const numberEl = document.getElementById("countNumber");
    const bedEl = document.getElementById("puppyBed");

    Bed.init(bedEl);
    Slider.init(slider, numberEl);

    const initialValue = Number(slider.value);
    numberEl.textContent = initialValue;
    Bed.setCount(initialValue);
  },
};

document.addEventListener("DOMContentLoaded", () => App.start());
