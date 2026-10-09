
const NEED = [
    'dashboard',
    'careers',
    'skill-gap',
    'career-path',
    'simulation',
    'saved',
    'compare'
];

function draw() {
    const h = location.hash.slice(2).split('/');

    if (!['', 'signup'].includes(h[0]) && !S.user) {
        location.hash = '#/signup';
        return;
    }

    if (h[0] == 'signup' && S.user) {
        location.hash = '#/dashboard';
        return;
    }

    if (NEED.includes(h[0]) && !Object.keys(profile.skills).length) {
        S.ob = 1;
        location.hash = '#/onboarding';
        return;
    }

    CQ = [];

    const v = h[0] == 'careers' && h[1]
        ? V.career(h[1])
        : (V[h[0]] || V[''])();

    document.getElementById('root').innerHTML =
        v + (S.toast ? `<div class="tst" role="status">${S.toast}</div>` : '');

    runCharts();
}

addEventListener('hashchange', () => {
    S.nav = false;
    scrollTo(0, 0);
    draw();
});

load();
recompute();
draw();