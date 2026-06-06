/* ═══════════════════════════════════════════════════════
   PP PROJEKT s.r.o. — Sdílená logika aplikace
   API vrstva (Google Apps Script) · Sidebar · Utility
   ═══════════════════════════════════════════════════════

   KONFIGURACE:
   Nastavte APP_SCRIPT_URL po nasazení Google Apps Script.
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── KONFIGURACE ─────────────────────────────────────── */
const CONFIG = {
  // Sem vložte URL vašeho Apps Script Web App po nasazení:
  APP_SCRIPT_URL: localStorage.getItem('pp_api_url') || 'https://script.google.com/macros/s/AKfycbztqeODoMe7IYACqoTe0yB__jLqEnasr8BioKTLMWOvPEzqN5M9dPIDalankWy2W-zYMw/exec',

  // Barvy projektů (přiřazují se automaticky)
  PROJECT_COLORS: [
    '#0563C1','#2a7a4a','#8a3a1e','#c49a2a',
    '#5a3a7a','#1a6a6a','#7a1a4a','#3a5a1a'
  ],

  // Šablony fází z Excelu
  PHASE_TEMPLATES: {
    'priprava':  { label: 'Příprava projektu',      icon: '📋', tasks: [
      { id:'PR-1', name:'Zadání a konzultace s investorem', sub:'Příprava' },
      { id:'PR-2', name:'Převzetí dostupných podkladů', sub:'Příprava' },
      { id:'PR-3', name:'Příprava cenové nabídky', sub:'Příprava' },
      { id:'PR-4', name:'Podpis smlouvy o dílo', sub:'Smluvní' },
      { id:'PR-5', name:'Zajištění plné moci', sub:'Právní' },
    ]},
    'zamereni': { label: 'Zaměření a podklady',     icon: '📐', tasks: [
      { id:'ZA-1', name:'Shromáždění dostupných podkladů', sub:'Podklad' },
      { id:'ZA-2', name:'Průzkum objektu v terénu', sub:'Zaměření' },
      { id:'ZA-3', name:'Zaměření stávajícího stavu', sub:'Zaměření' },
      { id:'ZA-4', name:'Fotodokumentace stávajícího stavu', sub:'Podklad' },
      { id:'ZA-5', name:'Zpracování mračna bodů a 360 fotografií', sub:'Zaměření' },
    ]},
    'pasport':  { label: 'Pasport stavby',           icon: '🏛️', tasks: [
      { id:'PS-A',  name:'A — Průvodní list ke stavebnímu pasportu', sub:'PAS' },
      { id:'PS-B',  name:'B — Souhrnná technická zpráva pasportu', sub:'PAS' },
      { id:'PS-C1', name:'C.1 — Situační výkres širších vztahů', sub:'PAS' },
      { id:'PS-C2', name:'C.2 — Katastrální situace', sub:'PAS' },
      { id:'PS-C3', name:'C.3 — Koordinační situace', sub:'PAS' },
      { id:'PS-D1', name:'D.1.1 — Půdorys 1.PP', sub:'PAS' },
      { id:'PS-D2', name:'D.1.2 — Půdorys 1.NP', sub:'PAS' },
      { id:'PS-D3', name:'D.1.3 — Půdorys 2.NP', sub:'PAS' },
      { id:'PS-D4', name:'D.1.4 — Půdorys podkroví', sub:'PAS' },
      { id:'PS-D5', name:"D.1.5 — Řez A-A'", sub:'PAS' },
      { id:'PS-D6', name:"D.1.6 — Řez B-B'", sub:'PAS' },
      { id:'PS-D7', name:'D.1.7–10 — Pohledy J, V, S, Z', sub:'PAS' },
      { id:'PS-D11',name:'D.1.11 — Skladby konstrukcí', sub:'PAS' },
      { id:'PS-D12',name:'D.1.12 — Schéma zahradního objektu', sub:'PAS' },
      { id:'PS-K1', name:'Interní kontrola pasportu', sub:'Kontrola' },
      { id:'PS-K2', name:'Finální kontrola a předání stavebníkovi', sub:'Kontrola' },
    ]},
    'studie':   { label: 'Studie',                   icon: '✏️', tasks: [
      { id:'ST-1',  name:'Úvodní strana + obsah, fotky pozemku', sub:'Studie' },
      { id:'ST-2',  name:'A — Úvodní údaje', sub:'Studie' },
      { id:'ST-3',  name:'B — Technická zpráva', sub:'Studie' },
      { id:'ST-4',  name:'Situace širších vztahů', sub:'Studie' },
      { id:'ST-5',  name:'Koordinační situace', sub:'Studie' },
      { id:'ST-6',  name:'Půdorys 1.NP', sub:'Studie' },
      { id:'ST-7',  name:'Půdorys 2.NP', sub:'Studie' },
      { id:'ST-8',  name:'Pohledy S, J, V, Z', sub:'Studie' },
      { id:'ST-9',  name:"Řez A-A'", sub:'Studie' },
      { id:'ST-10', name:"Řez B-B'", sub:'Studie' },
      { id:'ST-11', name:'Vizualizace', sub:'Studie' },
      { id:'ST-12', name:'Interní kontrola', sub:'Kontrola' },
      { id:'ST-13', name:'Autorizace projektu', sub:'Kontrola' },
      { id:'ST-14', name:'Finální kontrola a předání stavebníkovi', sub:'Kontrola' },
    ]},
    'pd_sp':    { label: 'Projektová dokumentace SP', icon: '📁', tasks: [
      { id:'PD-A',  name:'A — Průvodní list', sub:'PD' },
      { id:'PD-B',  name:'B — Souhrnná technická zpráva', sub:'PD' },
      { id:'PD-C1', name:'C.1 — Situační výkres širších vztahů', sub:'PD' },
      { id:'PD-C2', name:'C.2 — Katastrální situace', sub:'PD' },
      { id:'PD-C3', name:'C.3 — Koordinační situace', sub:'PD' },
      { id:'PD-C4', name:'C.4 — Situace souhlas se stavbou', sub:'PD' },
      { id:'PD-TZ', name:'D.1.1 — Technická zpráva ASŘ', sub:'PD' },
      { id:'PD-S1', name:'SS+BP — Půdorysy 1.NP a podkroví', sub:'PD' },
      { id:'PD-S2', name:"SS+BP — Řezy A-A', B-B'", sub:'PD' },
      { id:'PD-S3', name:'SS+BP — Pohledy J, V, S, Z', sub:'PD' },
      { id:'PD-S4', name:'SS+BP — Půdorys krovu', sub:'PD' },
      { id:'PD-S5', name:'SS+BP — Skladby konstrukcí', sub:'PD' },
      { id:'PD-K1', name:'Interní kontrola SS+BP', sub:'Kontrola' },
      { id:'PD-N1', name:'NS — Půdorysy 1.NP a podkroví', sub:'PD' },
      { id:'PD-N2', name:"NS — Řezy A-A', B-B'", sub:'PD' },
      { id:'PD-N3', name:'NS — Pohledy J, V, S, Z', sub:'PD' },
      { id:'PD-N4', name:'NS — Půdorys krovu', sub:'PD' },
      { id:'PD-N5', name:'NS — Skladby konstrukcí', sub:'PD' },
      { id:'PD-K2', name:'Interní kontrola NS', sub:'Kontrola' },
      { id:'PD-SK', name:'D.1.2 — Technická zpráva SKŘ + výkresy', sub:'PD' },
      { id:'PD-PB', name:'D.1.3 — Technická zpráva PBŘ + výkresy', sub:'PD' },
      { id:'PD-TZ2',name:'D.1.4 — Technická zpráva technologií + výkresy', sub:'PD' },
      { id:'PD-EN', name:'D.1.5 — PENB (energetické posouzení)', sub:'PD' },
      { id:'PD-AU', name:'Autorizace projektu', sub:'Kontrola' },
      { id:'PD-KF', name:'Předání stavebníkovi', sub:'Kontrola' },
    ]},
    'inzenyring':{ label: 'Inženýrská činnost',     icon: '🔧', tasks: [
      { id:'IN-1', name:'Vyjádření — elektro (ČEZ)', sub:'Sítě' },
      { id:'IN-2', name:'Vyjádření — plynovod (GasNet)', sub:'Sítě' },
      { id:'IN-3', name:'Vyjádření — vodovod a kanalizace (VaK)', sub:'Sítě' },
      { id:'IN-4', name:'Vyjádření — telekomunikace (O2)', sub:'Sítě' },
      { id:'IN-5', name:'Závazné stanovisko — OŽP', sub:'DO' },
      { id:'IN-6', name:'Závazné stanovisko — HZS', sub:'DO' },
      { id:'IN-7', name:'Závazné stanovisko — NPÚ / KPÚ', sub:'DO' },
      { id:'IN-8', name:'Závazné stanovisko — SÚ (doprava, přípojky)', sub:'DO' },
      { id:'IN-9', name:'Souhlas vlastníků sousedních pozemků', sub:'Souhlas' },
      { id:'IN-10',name:'Energetický průkaz budovy (PENB)', sub:'Energetika' },
    ]},
    'povoleni': { label: 'Povolení stavby',          icon: '🏛️', tasks: [
      { id:'PO-1', name:'Kompletace žádosti o povolení stavby', sub:'Žádost' },
      { id:'PO-2', name:'Podání žádosti na stavební úřad', sub:'Žádost' },
      { id:'PO-3', name:'Komunikace se SÚ — výzvy k doplnění', sub:'Řízení' },
      { id:'PO-4', name:'Vydání povolení stavby', sub:'Výsledek' },
    ]},
    'realizace':{ label: 'Realizace stavby',         icon: '🏗️', tasks: [
      { id:'RE-1', name:'Výběr zhotovitele stavby', sub:'Příprava' },
      { id:'RE-2', name:'Zahájení stavby — oznámení SÚ', sub:'Realizace' },
      { id:'RE-3', name:'Autorský dozor projektanta', sub:'Dozor' },
      { id:'RE-4', name:'Kontrolní prohlídky SÚ', sub:'Kontrola' },
      { id:'RE-5', name:'Kolaudace / oznámení o užívání stavby', sub:'Závěr' },
    ]},
  },

  // Pořadí šablon pro zobrazení
  PHASE_ORDER: ['priprava','zamereni','pasport','studie','pd_sp','inzenyring','povoleni','realizace'],
};

/* ── API VRSTVA ──────────────────────────────────────── */
const API = {
  url: () => CONFIG.APP_SCRIPT_URL,

  async call(action, sheet, payload) {
    const url = this.url();
    if (!url) {
      console.warn('API URL není nastaveno — používám localStorage');
      return null;
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ action, sheet, payload }),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'Chyba API');
      return json.data;
    } catch (e) {
      console.warn('API chyba:', e.message);
      return null;
    }
  },

  async read(sheet) {
    // 1. zkus API
    const remote = await this.call('read', sheet, null);
    if (remote !== null) {
      localStorage.setItem('pp_' + sheet, JSON.stringify(remote));
      return remote;
    }
    // 2. záloha localStorage
    const local = localStorage.getItem('pp_' + sheet);
    return local ? JSON.parse(local) : null;
  },

  async write(sheet, data) {
    // Vždy uložit lokálně
    localStorage.setItem('pp_' + sheet, JSON.stringify(data));
    // Zkus API
    await this.call('write', sheet, data);
  },
};

/* ── DATA STORE ──────────────────────────────────────── */
const STORE = {
  _config: null,
  _workers: null,
  _finance: null,

  async getConfig() {
    if (!this._config) {
      this._config = await API.read('CONFIG') || { projects: [], nextColor: 0 };
    }
    return this._config;
  },

  async saveConfig() {
    await API.write('CONFIG', this._config);
  },

  async getProjects() {
    const cfg = await this.getConfig();
    return cfg.projects || [];
  },

  async saveProject(project) {
    const cfg = await this.getConfig();
    const idx = cfg.projects.findIndex(p => p.id === project.id);
    if (idx >= 0) cfg.projects[idx] = project;
    else cfg.projects.push(project);
    await this.saveConfig();
  },

  async deleteProject(id) {
    const cfg = await this.getConfig();
    cfg.projects = cfg.projects.filter(p => p.id !== id);
    await this.saveConfig();
  },

  async getWorkers() {
    if (!this._workers) {
      this._workers = await API.read('WORKERS') || { workers: [] };
    }
    return this._workers.workers || [];
  },

  async saveWorkers(workers) {
    this._workers = { workers };
    await API.write('WORKERS', { workers });
  },

  async getTasks(projectId) {
    const data = await API.read('TASKS_' + projectId);
    return data || { tasks: [], collapsed: {} };
  },

  async saveTasks(projectId, data) {
    await API.write('TASKS_' + projectId, data);
  },

  async getFinance() {
    if (!this._finance) {
      this._finance = await API.read('FINANCE') || { projects: {} };
    }
    return this._finance;
  },

  async saveFinance(data) {
    this._finance = data;
    await API.write('FINANCE', data);
  },

  nextColor() {
    if (!this._config) return CONFIG.PROJECT_COLORS[0];
    const idx = (this._config.nextColor || 0) % CONFIG.PROJECT_COLORS.length;
    this._config.nextColor = idx + 1;
    return CONFIG.PROJECT_COLORS[idx];
  },

  makeProjectId(name) {
    return 'p-' + name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 24) + '-' + Date.now().toString(36);
  },
};

/* ── SIDEBAR ─────────────────────────────────────────── */
const Sidebar = {
  currentPage: '',

  async render(activePage) {
    this.currentPage = activePage;
    const projects = await STORE.getProjects();
    const el = document.getElementById('sidebar');
    if (!el) return;

    const nav = [
      { id: 'index',       href: 'index.html',       icon: '◉', label: 'Dashboard' },
      { id: 'harmonogram', href: 'harmonogram.html',  icon: '▦', label: 'Harmonogram' },
      { id: 'finance',     href: 'finance.html',      icon: '₿', label: 'Finance' },
      { id: 'pracovnici',  href: 'pracovnici.html',   icon: '◈', label: 'Pracovníci' },
    ];

    el.innerHTML = `
      <div class="sb-logo">
        <div class="sb-logo-dot">PP</div>
        <div class="sb-logo-text">
          <div class="sb-logo-name">PP projekt s.r.o.</div>
          <div class="sb-logo-sub">Projektový systém</div>
        </div>
      </div>
      <div class="sb-section">
        <div class="sb-section-label">Přehled</div>
        ${nav.map(n => `
          <a href="${n.href}" class="sb-item${activePage === n.id ? ' active' : ''}">
            <span class="sb-icon">${n.icon}</span>
            <span>${n.label}</span>
          </a>`).join('')}
        <div class="sb-divider"></div>
        <div class="sb-projects-label">
          Projekty
          <span class="sb-proj-count">${projects.length}</span>
        </div>
        ${projects.length === 0
          ? '<div style="padding:6px 16px;font-size:11px;color:#3a4a5a;font-family:var(--mono)">Žádné projekty</div>'
          : projects.map(p => `
          <a href="projekt.html?id=${p.id}"
             class="sb-project-item${activePage === 'projekt-' + p.id ? ' active' : ''}">
            <span class="sb-proj-dot" style="background:${p.color}"></span>
            <span class="sb-proj-name">${p.name.split(' ').slice(0,4).join(' ')}</span>
          </a>`).join('')}
      </div>
      <div class="sb-footer">
        PP projekt s.r.o.<br>
        Pouze pro interní použití
      </div>
    `;
  }
};

/* ── TOAST ───────────────────────────────────────────── */
const Toast = {
  el: null,
  timer: null,

  show(msg, type = '') {
    if (!this.el) {
      this.el = document.createElement('div');
      this.el.className = 'toast';
      document.body.appendChild(this.el);
    }
    clearTimeout(this.timer);
    this.el.textContent = msg;
    this.el.className = 'toast' + (type ? ' toast-' + type : '');
    requestAnimationFrame(() => this.el.classList.add('show'));
    this.timer = setTimeout(() => this.el.classList.remove('show'), 2800);
  },

  ok(msg)   { this.show(msg, 'ok'); },
  warn(msg) { this.show(msg, 'warn'); },
  err(msg)  { this.show(msg, 'err'); },
};

/* ── UTILITY ─────────────────────────────────────────── */
const Utils = {
  /* Formátování částky */
  formatKc(num) {
    if (!num && num !== 0) return '—';
    return Number(num).toLocaleString('cs-CZ') + ' Kč';
  },

  parseKc(str) {
    if (!str) return 0;
    return parseFloat(String(str).replace(/\s/g,'').replace('Kč','').replace(',','.')) || 0;
  },

  /* Formátování data */
  formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('cs-CZ', { day:'2-digit', month:'2-digit', year:'numeric' });
  },

  formatDateShort(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('cs-CZ', { day:'2-digit', month:'2-digit' });
  },

  /* Dnešní datum jako YYYY-MM-DD */
  today() {
    return new Date().toISOString().slice(0, 10);
  },

  /* Přidat dny k datu */
  addDays(iso, n) {
    const d = new Date(iso);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  },

  /* Progress úkolů */
  calcProgress(tasks) {
    if (!tasks || !tasks.length) return { total:0, done:0, inprog:0, waiting:0, open:0, pct:0 };
    const total   = tasks.length;
    const done    = tasks.filter(t => t.status === 2 || t.completed).length;
    const inprog  = tasks.filter(t => t.status === 1).length;
    const waiting = tasks.filter(t => t.status === 3).length;
    const open    = tasks.filter(t => t.status === 0).length;
    const pct     = total ? Math.round(done / total * 100) : 0;
    return { total, done, inprog, waiting, open, pct };
  },

  /* Stav projektu jako text */
  projectStatusLabel(status) {
    return { new:'Nová', active:'Probíhá', done:'Dokončena', hold:'Pozastavena' }[status] || status;
  },

  /* Modal helpers */
  openModal(id)  { document.getElementById(id)?.classList.add('open'); },
  closeModal(id) { document.getElementById(id)?.classList.remove('open'); },

  /* Zavřít modal kliknutím na overlay */
  setupModalClose(id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', e => { if (e.target === el) Utils.closeModal(id); });
  },

  /* SVG donut */
  buildDonut(pct, color, size = 80) {
    const r = size / 2 - 7;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="transform:rotate(-90deg)">
      <circle fill="none" stroke="var(--border)" stroke-width="8" cx="${size/2}" cy="${size/2}" r="${r}"/>
      <circle fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"
        cx="${size/2}" cy="${size/2}" r="${r}"
        stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
        style="transition:stroke-dashoffset .6s ease"/>
    </svg>`;
  },

  /* Získat parametr z URL */
  getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  },

  /* Nastavit URL parametr */
  setApiUrl(url) {
    CONFIG.APP_SCRIPT_URL = url;
    localStorage.setItem('pp_api_url', url);
    Toast.ok('API URL uložena ✓');
  },
};

/* ── API URL SETUP (pokud chybí) ─────────────────────── */
function checkApiUrl() {
  if (!CONFIG.APP_SCRIPT_URL) {
    const stored = localStorage.getItem('pp_api_url');
    if (stored) {
      CONFIG.APP_SCRIPT_URL = stored;
    }
    // Systém funguje i bez API (localStorage záloha)
  }
}

checkApiUrl();
