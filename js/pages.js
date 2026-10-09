
/* Pages that depend on the user's own profile */
const tgt = () => careers[S.target] || ranked()[0];

const tsel = () => `
    <label for="tg" class="sm mu">Target career</label>
    <select id="tg" style="max-width:320px;margin-bottom:16px" onchange="S.target=this.value;draw()">
        ${Object.values(careers).map(c => `<option value="${c.id}" ${c.id == tgt().id ? 'selected' : ''}>${c.title}</option>`).join('')}
    </select>`;

const cmpBar = x => `
    <div class="cmp">
        <b style="width:${x.c * 20}%;background:var(--${lvl(x.c, x.r)})"></b>
        <u style="left:${x.r * 20}%"></u>
    </div>`;

function togDone(k) {
    S.done[k] = !S.done[k];
    save();
    draw();
}

function togSim(s) {
    S.simSel = S.simSel.includes(s)
        ? S.simSel.filter(x => x != s)
        : [...S.simSel, s];
    draw();
}

V.dashboard = () => {
    const cp = completion(),
        r = ranked(),
        t = r[0],
        g = gaps(t).filter(x => x.g).slice(0, 3),
        h = new Date().getHours(),
        st = buildPath(t),
        p2 = { ...profile.skills };

    g.slice(0, 2).forEach(x => p2[x.s] = Math.max(p2[x.s] || 0, 4));

    return shell('Dashboard', `
        <h1>${h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'}, ${profile.name.split(' ')[0]}</h1>
        <p class="mu">Your career profile is ${cp.pct}% complete.</p>
        ${bar(cp.pct)}

        <div class="grid g2" style="margin-top:20px">
            <div class="card">
                <h2>Career profile</h2>
                ${cp.items.map(([l, ok]) => `
                    <div class="row sp" style="padding:3px 0">
                        <span>${l}</span>
                        ${bdg(ok ? 'Complete' : 'Missing', ok ? 'g' : 'n')}
                    </div>
                `).join('')}
                <a class="btn" style="margin-top:8px" href="#/onboarding">${cp.pct < 100 ? 'Complete Profile' : 'Edit Profile'}</a>
            </div>

            <div class="card">
                <h2>Current skill gaps</h2>
                <p class="mu sm">For ${t.title}</p>
                ${g.length
                    ? g.map(x => `
                        <div class="row sp" style="padding:4px 0">
                            <span>${x.s}</span>
                            ${bdg('Priority: ' + pri(x.g)[0], pri(x.g)[1])}
                        </div>
                    `).join('')
                    : '<p class="mu">No gaps found for this career.</p>'}
                <a href="#/skill-gap">Full skill gap</a>
            </div>
        </div>

        <h2 style="margin-top:24px">Top career matches</h2>
        <div class="grid g2">${r.slice(0, 3).map(c => cc(c)).join('')}</div>

        <div class="grid g2" style="margin-top:16px">
            <div class="card">
                <h2>Career path progress</h2>
                ${st.map((p, i) => `
                    <div class="row">
                        <span class="bd ${S.done[t.id + i] ? 'g' : 'n'}">${S.done[t.id + i] ? 'Done' : 'To do'}</span>
                        ${p[0]}
                    </div>
                `).join('')}
                <a href="#/career-path">Open roadmap</a>
            </div>

            <div class="card">
                <h2>Simulation snapshot</h2>
                <p class="mu sm">${t.title}</p>
                ${g.length
                    ? `<p>Current suitability: <b>${t.score}%</b><br>After ${g.slice(0, 2).map(x => x.s).join(' + ')}: <b>${score(t, p2)}%</b></p>`
                    : '<p class="mu">No gaps to simulate.</p>'}
                <a class="btn p" href="#/simulation">Open Simulation</a>
                <p class="sm mu" style="margin-top:8px">An estimate, not a probability of employment.</p>
            </div>
        </div>
    `);
};

V['skill-gap'] = () => {
    const t = tgt();

    return shell('Skill Gap', `
        <h1>Skill gap</h1>
        <p class="mu">What you have versus what the career requires.</p>
        ${tsel()}

        <div class="card tw">
            <table>
                <tr>
                    <th>Skill</th>
                    <th>Your level</th>
                    <th>Required</th>
                    <th>Gap</th>
                    <th>Priority</th>
                    <th style="min-width:140px">Comparison</th>
                </tr>
                ${gaps(t).map(x => `
                    <tr>
                        <td>${x.s}</td>
                        <td>${x.c}</td>
                        <td>${x.r}</td>
                        <td>${x.g}</td>
                        <td>${bdg(pri(x.g)[0], pri(x.g)[1])}</td>
                        <td>${cmpBar(x)}</td>
                    </tr>
                `).join('')}
            </table>
        </div>

        <div class="card" style="margin-top:16px">
            <h3>Why is this skill important?</h3>
            <p class="mu">Priority reflects career relevance, the size of the gap, dependencies between skills and learning effort. In this demo it is derived from gap size only; the backend will supply the full ranking.</p>
        </div>
    `);
};

V['career-path'] = () => {
    const t = tgt(),
        st = buildPath(t);

    return shell('Career Path', `
        <h1>Career path</h1>
        <p class="mu">Select a step to mark it complete.</p>
        ${tsel()}

        <div class="card">
            ${st.map((p, i) => `
                <div class="step">
                    <div class="dot ${S.done[t.id + i] ? 'd' : ''}" role="checkbox" aria-checked="${!!S.done[t.id + i]}" tabindex="0" onclick="togDone('${t.id + i}')" ${KD}></div>
                    <div>
                        <b>${p[0]}</b><br>
                        <span class="mu sm">${p[1]} · Prerequisite: ${p[2]} · Effort: ${p[3]}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `);
};

V.profile = () => {
    const L = profile.links,
        o = rsum();

    return shell('My Profile', `
        <h1>My profile</h1>

        <div class="row g-3">
            <div class="col-md-6">
                <div class="card h100">
                    <h2>About</h2>
                    <p>${profile.name}<br><span class="mu">${profile.email}</span></p>
                    <p>${profile.edu || 'Degree not added'}</p>
                    <p>
                        <b>Goal:</b> ${profile.goal.text || 'Not added'}<br>
                        <span class="mu sm">${[profile.goal.domain, profile.goal.work, profile.goal.higher && 'Higher studies: ' + profile.goal.higher].filter(Boolean).join(' · ')}</span>
                    </p>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card h100">
                    <h2>Resume and links</h2>
                    <p>${profile.resume ? profile.resume.name : 'No resume uploaded'}</p>
                    ${[['GitHub', L.github], ['LinkedIn', L.linkedin], ['LeetCode', L.leetcode]].map(([n, v]) => `
                        <div>
                            ${n}:
                            ${v ? `<a href="${esc(v)}" target="_blank" rel="noopener">${v}</a>` : '<span class="mu">Not added</span>'}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="col-lg-6">
                <div class="card h100">
                    <h2>Interest profile</h2>
                    ${answered() == 18 ? cv('p_rs', 260, 'RIASEC radar') : '<p class="mu">Assessment not completed.</p>'}
                </div>
            </div>

            <div class="col-lg-6">
                <div class="card h100">
                    <h2>Skills</h2>
                    <table>
                        <tr>
                            <th>Skill</th>
                            <th>Level</th>
                        </tr>
                        ${Object.entries(profile.skills).map(([s, l]) => `
                            <tr>
                                <td>${s}</td>
                                <td>${l} / 5 · ${LV[l]}</td>
                            </tr>
                        `).join('')}
                    </table>

                    <h3 style="margin-top:12px">Projects</h3>
                    ${profile.projects.map(p => `<span class="chip">${p.name}</span>`).join('') || '<span class="mu">None</span>'}
                </div>
            </div>
        </div>

        <div class="hs" style="margin-top:16px">
            <button class="btn p" onclick="S.ob=1;S.qp=0;location.hash='#/onboarding'">Edit profile</button>
        </div>
    `) + (answered() == 18 ? (chart('p_rs', radarRS()), '') : '');
};

V.simulation = () => {
    const t = tgt(),
        pool = [...new Set(Object.values(careers).flatMap(c => gaps(c).filter(x => x.g).map(x => x.s)))],
        sel = S.simSel.filter(s => pool.includes(s)),
        sk = { ...profile.skills };

    sel.forEach(s => sk[s] = Math.max(sk[s] || 0, 4));

    const b = ranked(),
        a = Object.values(careers).sort((x, y) => score(y, sk) - score(x, sk)),
        n = score(t, sk),
        d = n - t.score,
        g = gaps(t);

    chart('s_bar', {
        type: 'bar',
        data: {
            labels: b.map(c => c.short),
            datasets: [
                {
                    label: 'Current',
                    data: b.map(c => c.score),
                    backgroundColor: GRY
                },
                {
                    label: 'After simulation',
                    data: b.map(c => score(c, sk)),
                    backgroundColor: NAVY
                }
            ]
        },
        options: {
            scales: {
                y: {
                    min: 0,
                    max: 100
                }
            }
        }
    });

    chart('s_rad', {
        type: 'radar',
        data: {
            labels: g.map(x => x.s),
            datasets: [
                {
                    label: 'Required',
                    data: g.map(x => x.r),
                    borderColor: AMB,
                    backgroundColor: rgba(AMB, .08)
                },
                {
                    label: 'Current',
                    data: g.map(x => x.c),
                    borderColor: GRY,
                    backgroundColor: rgba(GRY, .2)
                },
                {
                    label: 'After',
                    data: g.map(x => Math.max(x.c, sel.includes(x.s) ? 4 : 0)),
                    borderColor: NAVY,
                    backgroundColor: rgba(NAVY, .25)
                }
            ]
        },
        options: {
            scales: {
                r: {
                    min: 0,
                    max: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    const kp = (l, v, k) => `
        <div class="col-4">
            <div class="card h100">
                <span class="sm mu">${l}</span>
                <div class="score" ${k ? tg(v) : ''}>${v}${l == 'Change' ? ' pts' : '%'}</div>
            </div>
        </div>`;

    return shell('Simulation', `
        <h1>Career path simulation</h1>
        <p class="mu">Explore how acquiring additional skills may change your career suitability.</p>
        ${tsel()}

        <div class="row g-3">
            <div class="col-lg-4">
                <div class="card h100">
                    <h2>Select skills to acquire</h2>
                    <p class="mu sm">Each selected skill is assumed to reach level 4 (Advanced).</p>
                    ${pool.map(s => `
                        <label style="display:flex;gap:8px;font-weight:400">
                            <input type="checkbox" style="width:auto" ${sel.includes(s) ? 'checked' : ''} onchange="togSim('${s}')">${s}
                        </label>
                    `).join('') || '<p class="mu">No gaps to simulate.</p>'}
                </div>
            </div>

            <div class="col-lg-8">
                <div class="row g-3">
                    <div class="col-12">
                        <p class="sm mu" style="margin:0">Estimated suitability after simulated skill acquisition: ${t.title}</p>
                    </div>
                    ${kp('Current', t.score, 1)}
                    ${kp('After', n, 1)}
                    ${kp('Change', (d >= 0 ? '+' : '') + d)}
                    <div class="col-12">
                        <div class="card">${cv('s_bar', 250, 'Current and simulated match for each career')}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-3" style="margin-top:4px">
            <div class="col-lg-5">
                <div class="card h100">
                    <h3>${t.short}: skill levels</h3>
                    ${cv('s_rad', 280, 'Radar of current, simulated and required skill levels')}
                </div>
            </div>

            <div class="col-lg-7">
                <div class="card h100">
                    <h3>Network after simulation</h3>
                    ${net(sk)}
                </div>
            </div>
        </div>

        <div class="row g-3" style="margin-top:4px">
            <div class="col-md-6">
                <div class="card h100">
                    <h3>Ranking before</h3>
                    <ol>
                        ${b.map(c => `<li>${c.title} (${c.score}%)</li>`).join('')}
                    </ol>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card h100">
                    <h3>Ranking after</h3>
                    <ol>
                        ${a.map(c => {
                            const m = b.indexOf(c) - a.indexOf(c);

                            return `<li>${c.title} (${score(c, sk)}%) ${m ? bdg(m > 0 ? 'up ' + m : 'down ' + -m, m > 0 ? 'g' : 'a') : ''}</li>`;
                        }).join('')}
                    </ol>
                </div>
            </div>
        </div>

        <div class="note">Simulated values are estimates from demo logic, not guaranteed outcomes.</div>
    `);
};

V.saved = () => shell('Saved Careers', `
    <h1>Saved careers</h1>
    ${S.saved.length
        ? `
            <div class="card tw">
                <table>
                    <tr>
                        <th>Career</th>
                        <th>Match</th>
                        <th>Largest gap</th>
                        <th>Actions</th>
                    </tr>
                    ${S.saved.map(id => {
                        const c = careers[id],
                            g = gaps(c)[0];

                        return `
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.score}%</td>
                                <td>${g.g ? g.s : 'None'}</td>
                                <td class="hs">
                                    <a href="#/careers/${id}">View</a>
                                    <a href="#/compare">Compare</a>
                                    <a href="#" onclick="S.saved=S.saved.filter(x=>x!='${id}');save();draw();return false">Remove</a>
                                </td>
                            </tr>`;
                    }).join('')}
                </table>
            </div>
        `
        : `
            <div class="card">
                <h3>No saved careers yet</h3>
                <p class="mu">Save careers from their detail page to compare them here.</p>
                <a class="btn p" href="#/careers">Browse matches</a>
            </div>
        `}
`);

V.compare = () => {
    const l = ranked().slice(0, 3),
        sk = ['Python', 'Statistics', 'Machine Learning', 'SQL'];

    chart('cp_b', {
        type: 'bar',
        data: {
            labels: sk,
            datasets: l.map((c, i) => ({
                label: c.short,
                data: sk.map(s => c.req[s] || 0),
                backgroundColor: [NAVY, BLUE, PALE][i]
            }))
        },
        options: {
            scales: {
                y: {
                    min: 0,
                    max: 5
                }
            }
        }
    });

    return shell('Compare', `
        <h1>Compare careers</h1>
        <p class="mu">Your top three matches.</p>

        <div class="card tw">
            <table>
                <tr>
                    <th>Parameter</th>
                    ${l.map(c => `<th>${c.title}</th>`).join('')}
                </tr>
                <tr>
                    <td>Match</td>
                    ${l.map(c => `<td>${c.score}%</td>`).join('')}
                </tr>
                <tr>
                    <td>Skills to build</td>
                    ${l.map(c => `<td>${gaps(c).filter(x => x.g).length}</td>`).join('')}
                </tr>
                <tr>
                    <td>Education</td>
                    ${l.map(c => `<td>${c.edu}</td>`).join('')}
                </tr>
            </table>
        </div>

        <div class="card" style="margin-top:16px">
            <h3>Required skill levels (0 = not listed)</h3>
            ${cv('cp_b', 260, 'Required skill levels by career')}
        </div>
    `);
};