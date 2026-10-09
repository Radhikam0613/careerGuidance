
/* Chart.js helpers and the skill-career network graph (inline SVG) */
const CH = {};
let CQ = [];

const NAVY = '#1d4e89',
  BLUE = '#6a9fd4',
  PALE = '#b8cfe8',
  GRY = '#8a94a8',
  AMB = '#a86a00';

const rgba = (h, a) => {
  const n = parseInt(h.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
};

function chart(id, cfg) {
  cfg.options = Object.assign(
    { maintainAspectRatio: false, responsive: true },
    cfg.options || {}
  );
  CQ.push([id, cfg]);
}

function runCharts() {
  Object.keys(CH).forEach(k => {
    CH[k].destroy();
    delete CH[k];
  });

  if (window.Chart) {
    const s = getComputedStyle(document.documentElement);
    Chart.defaults.color =
      s.getPropertyValue('--mu').trim() || '#5d6679';
    Chart.defaults.borderColor =
      s.getPropertyValue('--bd').trim() || '#dde1e8';
    Chart.defaults.font.family = "'IBM Plex Sans',sans-serif";

    CQ.forEach(([id, cfg]) => {
      const e = document.getElementById(id);
      if (e) CH[id] = new Chart(e, cfg);
    });
  }

  CQ = [];
}

const cv = (id, h = 280, label = 'Chart') =>
  `<div style="position:relative;height:${h}px"><canvas id="${id}" role="img" aria-label="${label}"></canvas></div>`;

function net(sk = profile.skills) {
  const cs = Object.values(careers).sort(
    (a, b) => score(b, sk) - score(a, sk)
  );
  const ss = [...new Set(cs.flatMap(c => Object.keys(c.req)))];
  const H = Math.max(ss.length, cs.length) * 40 + 30;
  const Y = (i, n) => 25 + (i * (H - 50)) / Math.max(n - 1, 1);

  let e = '',
    n = '';

  cs.forEach((c, ci) =>
    Object.entries(c.req).forEach(([s, r]) => {
      const l = sk[s] || 0,
        k = l >= r ? 'g' : l ? 'a' : 'r';

      e += `<line x1="170" y1="${Y(ss.indexOf(s), ss.length)}" x2="530" y2="${Y(ci, cs.length)}" style="stroke:var(--${k})" stroke-width="${1 + r * 0.6}" opacity=".55"/>`;
    })
  );

  ss.forEach((s, i) => {
    const l = sk[s] || 0;

    n += `<circle cx="170" cy="${Y(i, ss.length)}" r="${4 + l * 1.6}" style="fill:${l ? 'var(--ac)' : 'var(--bg2)'};stroke:var(--ac)"/><text x="150" y="${Y(i, ss.length) + 4}" text-anchor="end">${s}${l ? ' (' + l + ')' : ''}</text>`;
  });

  cs.forEach((c, i) => {
    const v = score(c, sk);

    n += `<circle cx="530" cy="${Y(i, cs.length)}" r="${8 + v / 10}" style="fill:var(--${v >= 70 ? 'g' : v >= 50 ? 'a' : 'r'})"/><text x="552" y="${Y(i, cs.length) + 4}">${c.short} ${v}%</text>`;
  });

  return `<div class="tw"><svg class="net" viewBox="0 0 720 ${H}" style="min-width:600px;width:100%" role="img" aria-label="Network of your skills and the careers that require them">${e}${n}</svg></div><p class="sm mu">Left: your skills (larger = higher level). Right: careers (larger = better match). Lines: <span class="bd g">requirement met</span> <span class="bd a">partly met</span> <span class="bd r">missing</span></p>`;
}