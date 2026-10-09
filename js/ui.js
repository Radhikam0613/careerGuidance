/* View registry: each page registers V.name = () => html */
const V = {};

const S = {
  saved: [],
  done: {},
  simSel: [],
  ob: 1,
  qp: 0,
  err: '',
  user: null,
  toast: '',
  nav: false,
  target: '',
  dom: '',
  sort: 'best'
};

const lvl = (m, c) => m >= c ? 'g' : m >= c - 1 ? 'a' : 'r';

const pri = g => g >= 2
  ? ['High', 'r']
  : g == 1
    ? ['Medium', 'a']
    : ['None', 'g'];

const gaps = c => Object.entries(c.req)
  .map(([s, r]) => ({
    s,
    r,
    c: profile.skills[s] || 0,
    g: Math.max(0, r - (profile.skills[s] || 0))
  }))
  .sort((a, b) => b.g - a.g);

const bar = (v, m = 100) =>
  `<div class="bar" role="progressbar" aria-valuenow="${v}"><i style="width:${v / m * 100}%"></i></div>`;

const bdg = (t, k) => `<span class="bd ${k}">${t}</span>`;

const disc = 'Suitability is an AI-estimated assessment based on available profile data and occupational requirements. It is not a prediction of employment or career success.';

const mockNote = '<div class="note mock">Demo data: occupational details are mock data modelled on O*NET fields, not live O*NET results.</div>';

function toast(m) {
  S.toast = m;
  draw();
  setTimeout(() => {
    S.toast = '';
    draw();
  }, 2200);
}

const nav = [
  ['dashboard', 'Dashboard'],
  ['profile', 'My Profile'],
  ['assessment', 'Career Assessment'],
  ['careers', 'Career Matches'],
  ['skill-gap', 'Skill Gap'],
  ['career-path', 'Career Path'],
  ['simulation', 'Simulation'],
  ['saved', 'Saved Careers']
];

function shell(t, b) {
  const r = location.hash.slice(2).split('/')[0];

  return `
    <div class="app">
      <aside class="side ${S.nav ? 'open' : ''}" aria-label="Main">
        <div class="logo"></div>
        ${nav.map(([k, n]) => `
          <a href="#/${k}" class="${r == k ? 'on' : ''}">${n}</a>
        `).join('')}
        <div class="bot">
          <a href="#" onclick="logout();return false">Log out</a>
          <div class="hs" style="padding:8px 10px">
            <span class="chip" style="margin:0">${(profile.name || '?')[0]}</span>
            ${profile.name}
          </div>
        </div>
      </aside>
      <div class="main">
        <div class="top">
          <button class="btn menu" onclick="S.nav=!S.nav;draw()" aria-label="Menu">☰</button>
          <span class="t">${t}</span>
        </div>
        <main class="pg">${b}</main>
      </div>
    </div>
  `;
}

const ring = v =>
  `<div class="ring" style="--p:${v};--c:var(--${v >= 70 ? 'g' : v >= 50 ? 'a' : 'r'})"><span>${v}%</span></div>`;

function cc(c, extra = '') {
  const g = gaps(c).filter(x => x.g);

  return `
    <article class="card h100">
      <div class="hs sp">
        <div>
          <h3 style="margin:0">${c.title}</h3>
          <span class="mu sm">${c.domain} · ${c.soc}</span>
        </div>
        ${ring(c.score)}
      </div>
      <p class="mu sm" style="margin:8px 0 4px">AI-estimated suitability</p>
      ${bar(c.score)}
      <p style="margin-top:10px"><b>Strengths:</b> ${c.why.slice(0, 2).join('; ')}</p>
      <p><b>Main gap:</b> ${g.length ? g.slice(0, 2).map(x => x.s).join(', ') : 'None identified'}</p>
      <div class="hs" style="margin-top:auto">
        <a class="btn p" href="#/careers/${c.id}">View details</a>
        ${extra}
      </div>
    </article>
  `;
}