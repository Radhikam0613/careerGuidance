
/* Career matches (charts + network) and career detail (sectioned) */
const ranked = () => Object.values(careers).sort((a, b) => b.score - a.score);

const tg = c => `style="color:var(--${c >= 70 ? 'g' : c >= 50 ? 'a' : 'r'})"`;

V.careers = () => {
    let r = ranked();
    const f = S.dom,
        list = r.filter(c => !f || c.domain == f);

    if (S.sort == 'gap') {
        list.sort(
            (a, b) =>
                gaps(a).filter(x => x.g).length -
                gaps(b).filter(x => x.g).length
        );
    }

    chart('c_rs', radarRS());

    chart('c_br', {
        type: 'bar',
        data: {
            labels: r.map(c => c.short),
            datasets: [
                ['Skills (60%)', .6, 's', NAVY],
                ['Interests (25%)', .25, 'i', BLUE],
                ['Goal (15%)', .15, 'g', PALE]
            ].map(([l, w, k, c]) => ({
                label: l,
                data: r.map(x => +(x.parts[k] * w).toFixed(1)),
                backgroundColor: c
            }))
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    stacked: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Suitability points'
                    }
                },
                y: {
                    stacked: true
                }
            }
        }
    });

    return shell('Career Matches', `
        <h1>Your career matches</h1>
        <p class="mu">AI-estimated suitability, built from your skills, interests and goal. Not a prediction of employment.</p>

        <div class="row g-3">
            <div class="col-lg-5">
                <div class="card h100">
                    <h3>Your interest profile (RIASEC)</h3>
                    ${cv('c_rs', 300, 'RIASEC radar chart')}
                </div>
            </div>
            <div class="col-lg-7">
                <div class="card h100">
                    <h3>Where each match score comes from</h3>
                    ${cv('c_br', 300, 'Stacked bar of score components')}
                </div>
            </div>
        </div>

        <div class="card" style="margin-top:16px">
            <h3>Skill and career network</h3>
            ${net()}
        </div>

        <div class="hs sp" style="margin:28px 0 12px">
            <h2 style="margin:0">All careers</h2>
            <div class="hs">
                ${['', 'Data', 'Software', 'Research'].map(d => `
                    <span class="chip btnc ${f == d ? 'sel' : ''}" tabindex="0" onclick="S.dom='${d}';draw()" ${KD}>
                        ${d || 'All'}
                    </span>
                `).join('')}
                <select aria-label="Sort" style="width:auto" onchange="S.sort=this.value;draw()">
                    <option value="best">Best match</option>
                    <option value="gap" ${S.sort == 'gap' ? 'selected' : ''}>Lowest skill gap</option>
                </select>
            </div>
        </div>

        <div class="row g-3">
            ${list.map(c => `
                <div class="col-md-6 col-xl-4">
                    ${cc(c, `<button class="btn" onclick="S.target='${c.id}';location.hash='#/simulation'">Simulate</button>`)}
                </div>
            `).join('') || '<p class="mu">No careers in this domain.</p>'}
        </div>
    `);
};

V.career = id => {
    const c = careers[id];

    if (!c) {
        return shell(
            'Career',
            '<h1>Career not found</h1><a href="#/careers">Back to matches</a>'
        );
    }

    const g = gaps(c),
        p = c.parts,
        o = rsum(),
        rk = ranked(),
        pa = projAlign(c),
        L = g.filter(x => x.g);

    chart('d_rad', {
        type: 'radar',
        data: {
            labels: g.map(x => x.s),
            datasets: [
                {
                    label: 'Required',
                    data: g.map(x => x.r),
                    borderColor: AMB,
                    backgroundColor: rgba(AMB, .1)
                },
                {
                    label: 'You',
                    data: g.map(x => x.c),
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

    chart('d_bar', {
        type: 'bar',
        data: {
            labels: g.map(x => x.s),
            datasets: [
                {
                    label: 'Your level',
                    data: g.map(x => x.c),
                    backgroundColor: NAVY
                },
                {
                    label: 'Required',
                    data: g.map(x => x.r),
                    backgroundColor: AMB
                }
            ]
        },
        options: {
            scales: {
                y: {
                    min: 0,
                    max: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    chart('d_dn', {
        type: 'doughnut',
        data: {
            labels: ['Skills', 'Interests', 'Goal', 'Not matched'],
            datasets: [
                {
                    data: [
                        p.s * .6,
                        p.i * .25,
                        p.g * .15,
                        100 - p.total
                    ].map(v => +v.toFixed(1)),
                    backgroundColor: [
                        NAVY,
                        BLUE,
                        PALE,
                        '#e3e6ec'
                    ]
                }
            ]
        },
        options: {
            cutout: '62%'
        }
    });

    chart('d_cmp', {
        type: 'bar',
        data: {
            labels: rk.map(x => x.short),
            datasets: [
                {
                    label: 'Match %',
                    data: rk.map(x => x.score),
                    backgroundColor: rk.map(x => x.id == c.id ? NAVY : PALE)
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100
                }
            }
        }
    });

    const H = (i, t) => `<a href="#" onclick="sc('${i}');return false">${t}</a>`;

    return shell(c.title, `
        <div class="hs sp">
            <div>
                <h1 style="margin:0">${c.title}</h1>
                <p class="mu">SOC code <code>${c.soc}</code> · ${c.domain}</p>
            </div>
            <div class="hs">
                ${ring(c.score)}
                <span class="sm mu">AI-estimated<br>suitability</span>
            </div>
        </div>

        <div class="note">${disc}</div>
        ${mockNote}

        <div class="pills">
            ${H('s-over', 'Overview')}
            ${H('s-skills', 'Skills')}
            ${H('s-fit', 'Match explained')}
            ${H('s-info', 'Tasks and tools')}
            ${H('s-expl', 'Alignment')}
        </div>

        <section id="s-over" class="blk" style="margin-top:12px">
            <h2>Overview</h2>
            <p>${c.desc}</p>
            <div class="hs">
                <button class="btn p" onclick="S.saved.includes('${c.id}')||S.saved.push('${c.id}');save();toast('Career saved')">Save career</button>
                <button class="btn" onclick="S.target='${c.id}';location.hash='#/simulation'">Simulate</button>
                <a class="btn" href="#/careers">Back to matches</a>
            </div>
        </section>

        <section id="s-skills" class="blk">
            <h2>Your skills vs required</h2>
            <div class="row g-3">
                <div class="col-lg-5">
                    <div class="card h100">
                        ${cv('d_rad', 300, 'Radar of your skills and required skills')}
                    </div>
                </div>
                <div class="col-lg-7">
                    <div class="card h100">
                        ${cv('d_bar', 300, 'Bar chart of current and required levels')}
                    </div>
                </div>
            </div>

            <div class="card tw" style="margin-top:16px">
                <table>
                    <tr>
                        <th>Skill</th>
                        <th>Current</th>
                        <th>Required</th>
                        <th>Gap</th>
                        <th style="min-width:140px">Comparison</th>
                    </tr>
                    ${g.map(x => `
                        <tr>
                            <td>${x.s}</td>
                            <td>${x.c}</td>
                            <td>${x.r}</td>
                            <td>${bdg(x.g, x.g ? pri(x.g)[1] : 'g')}</td>
                            <td>${cmpBar(x)}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        </section>

        <section id="s-fit" class="blk">
            <h2>How this match is calculated</h2>
            <div class="row g-3">
                <div class="col-md-5">
                    <div class="card h100">
                        ${cv('d_dn', 240, 'Doughnut of match score components')}
                    </div>
                </div>
                <div class="col-md-7">
                    <div class="card h100">
                        ${cv('d_cmp', 240, 'Comparison of match across careers')}
                        <p class="sm mu" style="margin:8px 0 0">Skills 60% · interests (RIASEC) 25% · career goal 15%. This career is highlighted.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="s-info" class="blk">
            <h2>Tasks, tools and context</h2>
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="card h100">
                        <h3>Typical tasks</h3>
                        <ul>
                            ${c.tasks.map(t => `<li>${t}</li>`).join('')}
                        </ul>
                        <h3>Work context</h3>
                        <ul>
                            ${c.ctx.map(t => `<li>${t}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card h100">
                        <h3>Technology and tools</h3>
                        ${c.tech.map(t => `<span class="chip">${t}</span>`).join('')}
                        <h3 style="margin-top:12px">Education</h3>
                        <p>${c.edu}</p>
                        <h3>Related occupations</h3>
                        ${c.rel.map(t => `<span class="chip">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        </section>

        <section id="s-expl" class="blk">
            <h2>Why it matches</h2>
            <div class="row g-3">
                ${[
                    ['Strengths', c.why],
                    ['Skill gaps', L.map(x => `${x.s}: level ${x.c}, required ${x.r}`)],
                    [
                        'Interest alignment',
                        answered() == 18
                            ? c.rc.map(k => `${RC[k]}: you scored ${o[k]}/15`)
                            : ['Complete the assessment to see this']
                    ],
                    [
                        'Experience alignment',
                        pa.length ? pa : ['No project uses the required skills yet']
                    ]
                ].map(([h, l]) => `
                    <div class="col-md-6 col-xl-3">
                        <div class="card h100">
                            <h3>${h}</h3>
                            <ul style="padding-left:18px;margin:0">
                                ${(l.length ? l : ['None identified']).map(t => `<li>${t}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `);
};