
/* Sign up and onboarding: assessment > goals & skills > resume > projects & links */
const KD = "onkeydown=\"if(event.key==' '||event.key=='Enter'){event.preventDefault();this.click()}\"";
const STEPS = ['Assessment', 'Goals & skills', 'Resume', 'Projects & links'];

const err = () => S.err ? `<div class="err" role="alert">${S.err}</div>` : '';
const esc = v => (v || '').replace(/"/g, '&quot;');

function logout() {
    try {
        localStorage.removeItem(KEY);
    } catch (e) {}

    profile = blank();
    Object.assign(S, {
        user: null,
        saved: [],
        done: {},
        simSel: [],
        ob: 1,
        qp: 0,
        err: '',
        target: ''
    });

    recompute();
    location.hash = '#/';
}

function doSignup() {
    const g = id => document.getElementById(id).value.trim();
    const n = g('su_n');
    const e = g('su_e');

    if (!n || !/^\S+@\S+\.\S+$/.test(e) || document.getElementById('su_p').value.length < 6) {
        S.err = 'Enter your name, a valid email and a password of at least 6 characters.';
        return draw();
    }

    profile = blank();
    profile.name = n;
    profile.email = e;
    S.user = {
        name: n,
        email: e
    };
    S.ob = 1;
    S.qp = 0;
    S.err = '';
    save();
    recompute();
    location.hash = '#/onboarding';
}

function loadDemo() {
    const pat = {
        R: 3,
        I: 5,
        A: 3,
        S: 2,
        E: 3,
        C: 4
    };

    profile = Object.assign(blank(), {
        name: 'Aarav Rao',
        email: 'aarav@example.com',
        edu: 'B.E. Computer Engineering',
        rs: RQ.map(q => pat[q[0]]),
        goal: {
            domain: 'Data',
            work: 'Collaborative team',
            higher: 'Maybe',
            text: 'Become a machine learning engineer'
        },
        skills: {
            Python: 4,
            SQL: 4,
            Java: 3,
            JavaScript: 3,
            Git: 3,
            'Machine Learning': 2,
            Statistics: 2
        },
        projects: [
            {
                name: 'Music Genre Classification',
                tech: 'Python, Machine Learning',
                desc: 'Classifies tracks by genre.'
            },
            {
                name: 'Stock Trading Platform',
                tech: 'Java, SQL, JavaScript',
                desc: 'Simulated trading app.'
            }
        ],
        links: {
            github: 'https://github.com/demo',
            linkedin: '',
            leetcode: ''
        }
    });

    S.user = {
        name: profile.name,
        email: profile.email
    };
    S.ob = 4;
    save();
    recompute();
    location.hash = '#/onboarding';
}

function go(n) {
    S.ob = n;
    S.err = '';
    save();
    draw();
    scrollTo(0, 0);
}

function setRS(i, v) {
    profile.rs[i] = v;
    S.err = '';
    save();
    draw();
}

function qnext() {
    const a = S.qp * 6;

    if (profile.rs.slice(a, a + 6).some(v => !v)) {
        S.err = 'Answer all six questions on this page to continue.';
        return draw();
    }

    S.err = '';

    if (S.qp < 2) {
        S.qp++;
        draw();
        scrollTo(0, 0);
    } else {
        recompute();
        go(2);
    }
}

function qprev() {
    if (S.qp > 0) {
        S.qp--;
        draw();
        scrollTo(0, 0);
    }
}

function nextGoals() {
    const g = profile.goal;

    if (!g.domain || !Object.keys(profile.skills).length) {
        S.err = 'Choose a career direction and select at least one skill.';
        return draw();
    }

    recompute();
    go(3);
}

function togSkill(s) {
    if (profile.skills[s]) {
        delete profile.skills[s];
    } else {
        profile.skills[s] = 2;
    }

    save();
    draw();
}

function setLvl(s, v) {
    profile.skills[s] = +v;
    save();
    recompute();
}

function readResume(f) {
    if (!f) return;

    profile.resume = {
        name: f.name,
        size: Math.max(1, Math.round(f.size / 1024)) + ' KB',
        found: null
    };

    if (/\.(txt|md)$/i.test(f.name)) {
        f.text().then(t => {
            const d = extractSkills(t);
            profile.resume.found = d;
            d.forEach(s => {
                if (!profile.skills[s]) profile.skills[s] = 2;
            });
            save();
            recompute();
            draw();
        });
    } else {
        save();
        draw();
    }
}

function addProj() {
    const g = id => document.getElementById(id).value.trim();

    if (!g('p_n')) {
        S.err = 'Give the project a name.';
        return draw();
    }

    profile.projects.push({
        name: g('p_n'),
        tech: g('p_t'),
        desc: g('p_d')
    });

    S.err = '';
    save();
    recompute();
    draw();
}

function delProj(i) {
    profile.projects.splice(i, 1);
    save();
    recompute();
    draw();
}

function setLink(k, v) {
    profile.links[k] = v.trim();
    save();
}

function finish() {
    const L = profile.links;
    const bad = [
        ['github', 'github.com'],
        ['linkedin', 'linkedin.com'],
        ['leetcode', 'leetcode.com']
    ].find(([k, d]) => L[k] && !L[k].includes(d));

    if (bad) {
        S.err = `Check the ${bad[0]} link: it should contain ${bad[1]}.`;
        return draw();
    }

    recompute();
    save();
    location.hash = '#/careers';
    toast('Your career matches are ready');
}

const inp = (id, l, v, ex = '') =>
    `<div class="f"><label for="${id}">${l}</label><input id="${id}" value="${esc(v)}" ${ex}></div>`;

const slt = (id, l, o, v, fn) =>
    `<div class="f"><label for="${id}">${l}</label><select id="${id}" onchange="${fn}=this.value;save()"><option value="">Select</option>${o.map(x => `<option ${x == v ? 'selected' : ''}>${x}</option>`).join('')}</select></div>`;

function wiz(b) {
    return `
        <div class="container" style="padding:20px 12px 48px">
            <div class="row">
                <div class="col-lg-8 offset-lg-2">
                    <div class="hs sp">
                        <span class="lg"></span>
                        <span class="sm mu">${S.user.name}</span>
                    </div>
                    <ol class="steps">
                        ${STEPS.map((s, i) => `<li class="${i + 1 == S.ob ? 'on' : i + 1 < S.ob ? 'ok' : ''}">${s}</li>`).join('')}
                    </ol>
                    ${b}
                </div>
            </div>
        </div>`;
}

V.signup = () => `
    <div class="container" style="padding:48px 12px">
        <div class="row">
            <div class="col-md-6 offset-md-3">
                <h1>Create your account</h1>
                <p class="mu">About ten minutes: an 18-question interest assessment, goals and skills, resume, projects and links.</p>
                <div class="card">
                    ${err()}
                    <div class="f">
                        <label for="su_n">Full name</label>
                        <input id="su_n" autocomplete="name">
                    </div>
                    <div class="f">
                        <label for="su_e">Email</label>
                        <input id="su_e" type="email" autocomplete="email">
                    </div>
                    <div class="f">
                        <label for="su_p">Password (6+ characters)</label>
                        <input id="su_p" type="password" autocomplete="new-password">
                    </div>
                    <button class="btn p" style="width:100%" onclick="doSignup()">Create account</button>
                </div>
                <p class="sm mu" style="margin-top:8px">Demo only: no server. Your data stays in this browser.</p>
                <button class="btn" onclick="loadDemo()">Load demo student instead</button>
            </div>
        </div>
    </div>`;

V.onboarding = () => {
    const s = S.ob,
        r = profile.resume,
        g = profile.goal,
        L = profile.links;
    let b = '';

    if (s == 1) {
        const a = S.qp * 6,
            n = answered();

        b = `
            <div class="card">
                <h2>Interest assessment</h2>
                <p class="mu">How much would you enjoy each activity? Page ${S.qp + 1} of 3 · ${n} / 18 answered</p>
                ${bar(n, 18)}
                ${err()}
                ${RQ.slice(a, a + 6).map((q, j) => {
                    const i = a + j;

                    return `
                        <div style="margin:16px 0" role="radiogroup" aria-label="${q[1]}">
                            <b>${i + 1}. ${q[1]}</b>
                            <div class="lkr">
                                ${LK.map((l, k) => `
                                    <label class="lkb ${profile.rs[i] == k + 1 ? 'on' : ''}">
                                        <input type="radio" name="q${i}" ${profile.rs[i] == k + 1 ? 'checked' : ''} onchange="setRS(${i},${k + 1})">${l}
                                    </label>
                                `).join('')}
                            </div>
                        </div>`;
                }).join('')}
                <div class="hs">
                    ${S.qp ? '<button class="btn" onclick="qprev()">Back</button>' : ''}
                    <button class="btn p" onclick="qnext()">${S.qp < 2 ? 'Next page' : 'Continue'}</button>
                </div>
            </div>`;
    }

    if (s == 2) {
        b = `
            <div class="card">
                <h2>Career goals and skills</h2>
                ${err()}
                <div class="row g-3">
                    <div class="col-md-6">
                        ${slt('g_d', 'Career direction', ['Data', 'Software', 'Research', 'Not sure'], g.domain, 'profile.goal.domain')}
                    </div>
                    <div class="col-md-6">
                        ${slt('g_w', 'Preferred work style', ['Individual', 'Collaborative team', 'Mixed'], g.work, 'profile.goal.work')}
                    </div>
                    <div class="col-md-6">
                        ${slt('g_h', 'Interested in higher studies?', ['Yes', 'No', 'Maybe'], g.higher, 'profile.goal.higher')}
                    </div>
                    <div class="col-md-6">
                        ${inp('g_e', 'Degree and branch', profile.edu, 'oninput="profile.edu=this.value;save()"')}
                    </div>
                </div>
                ${inp('g_t', 'Your career goal in one sentence', g.text, 'oninput="profile.goal.text=this.value;save()"')}
                <h3>Skills</h3>
                <p class="mu sm">Select your skills and rate your level.</p>
                ${SKILLS.map(k => {
                    const l = profile.skills[k];

                    return `
                        <div class="sk">
                            <span class="chip btnc ${l ? 'sel' : ''}" role="checkbox" aria-checked="${!!l}" tabindex="0" onclick="togSkill('${k}')" ${KD}>${k}</span>
                            ${l ? `
                                <select aria-label="${k} level" onchange="setLvl('${k}',this.value)">
                                    ${[1, 2, 3, 4, 5].map(n => `<option value="${n}" ${n == l ? 'selected' : ''}>${n} · ${LV[n]}</option>`).join('')}
                                </select>
                            ` : ''}
                        </div>`;
                }).join('')}
                <div class="hs" style="margin-top:12px">
                    <button class="btn" onclick="go(1)">Back</button>
                    <button class="btn p" onclick="nextGoals()">Continue</button>
                </div>
            </div>`;
    }

    if (s == 3) {
        b = `
            <div class="card">
                <h2>Upload your resume</h2>
                <p class="mu">Optional. Skills found in the file are added to your profile for you to confirm.</p>
                <div class="drop">
                    <label for="rf" style="cursor:pointer">Choose a file (PDF, DOCX or TXT)</label>
                    <input id="rf" type="file" accept=".pdf,.doc,.docx,.txt,.md" onchange="readResume(this.files[0])" style="margin-top:8px">
                </div>
                ${r ? `
                    <div class="note">
                        <b>${r.name}</b> (${r.size}) attached.<br>
                        ${r.found ? (r.found.length ? 'Found skills: ' + r.found.join(', ') + '. Adjust levels in the skills step if needed.' : 'No known skills detected.') : 'Automatic extraction from PDF and Word files needs the backend. Your skills from the previous step are used for now.'}
                    </div>
                ` : ''}
                <div class="hs">
                    <button class="btn" onclick="go(2)">Back</button>
                    <button class="btn p" onclick="go(4)">${r ? 'Continue' : 'Skip for now'}</button>
                </div>
            </div>`;
    }

    if (s == 4) {
        b = `
            <div class="card">
                <h2>Projects and links</h2>
                ${err()}
                <h3>Projects</h3>
                ${profile.projects.map((p, i) => `
                    <div class="hs sp" style="padding:6px 0;border-bottom:1px solid var(--bd)">
                        <span>
                            <b>${p.name}</b><br>
                            <span class="mu sm">${p.tech || 'No technologies listed'}</span>
                        </span>
                        <button class="btn" onclick="delProj(${i})" aria-label="Remove ${esc(p.name)}">Remove</button>
                    </div>
                `).join('') || '<p class="mu sm">No projects yet.</p>'}
                <div class="row g-2" style="margin-top:12px">
                    <div class="col-md-6">
                        ${inp('p_n', 'Project name', '')}
                    </div>
                    <div class="col-md-6">
                        ${inp('p_t', 'Technologies (comma separated)', '')}
                    </div>
                </div>
                ${inp('p_d', 'Short description', '')}
                <button class="btn" onclick="addProj()">Add project</button>
                <h3 style="margin-top:20px">Profiles</h3>
                ${inp('l_g', 'GitHub link', L.github, 'oninput="setLink(\'github\',this.value)" placeholder="https://github.com/username"')}
                ${inp('l_l', 'LinkedIn link', L.linkedin, 'oninput="setLink(\'linkedin\',this.value)" placeholder="https://linkedin.com/in/username"')}
                ${inp('l_c', 'LeetCode link', L.leetcode, 'oninput="setLink(\'leetcode\',this.value)" placeholder="https://leetcode.com/username"')}
                <p class="sm mu">Links are saved with your profile. Analysing them needs the backend.</p>
                <div class="hs">
                    <button class="btn" onclick="go(3)">Back</button>
                    <button class="btn p" onclick="finish()">See my career matches</button>
                </div>
            </div>`;
    }

    return wiz(b);
};

V.assessment = () => shell(
    'Interest Assessment',
    `<h1>Interest assessment</h1><p class="mu">Your RIASEC profile</p><div class="card">${cv('as_r', 300, 'RIASEC radar')}<a class="btn" style="margin-top:12px" href="#/onboarding" onclick="S.ob=1;S.qp=0">Retake assessment</a></div>` + (chart('as_r', radarRS()), '')
);

function radarRS() {
    const o = rsum();

    return {
        type: 'radar',
        data: {
            labels: Object.values(RC),
            datasets: [{
                label: 'Your score',
                data: Object.keys(RC).map(k => o[k]),
                backgroundColor: rgba(NAVY, .2),
                borderColor: NAVY
            }]
        },
        options: {
            scales: {
                r: {
                    min: 0,
                    max: 15,
                    ticks: {
                        stepSize: 5
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };
}