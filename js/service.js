const KEY = 'careertwin.v2';

const DEP = {
  'Machine Learning': 'Statistics',
  Statistics: 'Python',
  'Cloud Computing': 'Git',
  'Data Visualization': 'Python'
};

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      profile,
      saved: S.saved,
      done: S.done,
      user: S.user
    }));
  } catch (e) {}
}

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (d) {
      profile = Object.assign(blank(), d.profile);
      S.saved = d.saved;
      S.done = d.done;
      S.user = d.user;
    }
  } catch (e) {}
}

const answered = () => profile.rs.filter(Boolean).length;

function rsum() {
  const o = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  profile.rs.forEach((v, i) => o[RQ[i][0]] += v);
  return o;
}

function fit(c, sk) {
  const n = Object.entries(c.req);
  return n.reduce((a, [s, v]) => a + Math.min(sk[s] || 0, v), 0)
    / n.reduce((a, [, v]) => a + v, 0) * 100;
}

function parts(c, sk = profile.skills) {
  const o = rsum();
  const n = c.rc.map(k => answered() == 18 ? (o[k] - 3) / 12 : .5);
  const s = fit(c, sk);
  const i = (3 * n[0] + 2 * n[1] + n[2]) / 6 * 100;
  const d = profile.goal.domain;
  const g = d && d != 'Not sure' ? (d == c.domain ? 100 : 0) : 50;

  return {
    s,
    i,
    g,
    total: Math.round(.6 * s + .25 * i + .15 * g)
  };
}

const score = (c, sk) => parts(c, sk).total;

function projAlign(c) {
  return profile.projects
    .map(p => ({
      n: p.name,
      m: Object.keys(c.req).filter(s =>
        (p.tech || '').toLowerCase().includes(s.toLowerCase())
      )
    }))
    .filter(x => x.m.length)
    .map(x => x.n + ' uses ' + x.m.join(', '));
}

function recompute() {
  const o = rsum();

  Object.values(careers).forEach(c => {
    c.parts = parts(c);
    c.score = c.parts.total;

    const m = Object.entries(c.req)
      .filter(([s, r]) => (profile.skills[s] || 0) >= r)
      .map(([s, r]) => `${s} meets the required level (${profile.skills[s]}/${r})`);

    c.why = [
      ...m,
      ...(answered() == 18
        ? c.rc.filter(k => o[k] >= 10).map(k => `${RC[k]} interest score ${o[k]}/15`)
        : [])
    ];

    if (!c.why.length) {
      c.why = ['No required skills met yet'];
    }
  });
}

function buildPath(c) {
  const g = gaps(c).filter(x => x.g);

  const st = g.map(x => [
    'Build ' + x.s + ' skills',
    `Required level ${x.r}, you are at ${x.c}`,
    DEP[x.s] || 'None',
    `~${x.g * 3} weeks (rough estimate)`
  ]);

  if (g.length) {
    st.push([
      'Build a project that uses these skills',
      'Shows applied experience',
      g[g.length - 1].s,
      '~4 weeks (rough estimate)'
    ]);
  }

  st.push([
    'Target: ' + c.title,
    'Re-check your match after the steps above',
    'All steps above',
    '—'
  ]);

  return st;
}

function extractSkills(t) {
  t = t.toLowerCase();

  return SKILLS.filter(s =>
    new RegExp('(^|[^a-z])' + s.toLowerCase() + '($|[^a-z])').test(t)
    || (s == 'Machine Learning' && /(^|[^a-z])ml($|[^a-z])/.test(t))
  );
}

function completion() {
  const L = profile.links;

  const it = [
    ['Interest assessment', answered() == 18],
    ['Career goals', !!profile.goal.domain],
    ['Skills', Object.keys(profile.skills).length > 0],
    ['Resume', !!profile.resume],
    ['Projects', profile.projects.length > 0],
    ['GitHub / LinkedIn / LeetCode', !!(L.github || L.linkedin || L.leetcode)]
  ];

  return {
    items: it,
    pct: Math.round(it.filter(x => x[1]).length / it.length * 100)
  };
}