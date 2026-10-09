const sc = id =>
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });

const sec = (id, h, sub, b, alt) => `
  <section id="${id}" class="sec ${alt ? "alt" : ""}">
    <div class="container">
      <div class="sh">
        <h2>${h}</h2>
        <p class="mu">${sub}</p>
      </div>
      ${b}
    </div>
  </section>
`;

const cols = (a, cl) => `
  <div class="row g-3">
    ${a.map(x => `
      <div class="${cl}">
        <div class="card h100">
          <h3>${x[0]}</h3>
          <p class="mu sm" style="margin:0">${x[1]}</p>
        </div>
      </div>
    `).join("")}
  </div>
`;

/* Vertical workflow: one step per row */
const steps = a => `
  <div class="d-flex flex-column gap-3">
    ${a.map((x, i) => `
      <div class="card">
        <div class="d-flex align-items-start gap-3">
          <span class="bd n flex-shrink-0">${i + 1}</span>
          <div>
            <h3 style="margin:0 0 6px">${x[0]}</h3>
            <p class="mu sm" style="margin:0">${x[1]}</p>
          </div>
        </div>
      </div>
    `).join("")}
  </div>
`;

V[""] = () => `
  <header class="lnav">
    <div class="container hs sp">
      <span class="lg"></span>

      <nav class="hs lnk" aria-label="Sections">
        ${[
          ["how", "How it works"],
          ["interests", "Assessment"],
          ["features", "Features"],
          ["data", "Data"]
        ].map(([i, l]) => `
          <a href="#" onclick="sc('${i}');return false">${l}</a>
        `).join("")}
      </nav>

      <div class="hs">
        <a class="btn" href="#/dashboard">Sign in</a>
        <a class="btn p" href="#/signup">Get started</a>
      </div>
    </div>
  </header>

  <section class="hero2">
    <div class="container">
      <div class="row g-5 ai-c">
        <div class="col-lg-7">
          <h1>Plan your career with a clearer picture of where you stand.</h1>

          <p class="lead mu">
            Our Project evaluates your profile, identifies suitable career
            directions, highlights skill gaps and builds a personalized
            development path.
          </p>

          <div class="hs">
            <a class="btn p" href="#/signup">Build My Career Profile</a>
            <a class="btn" href="#"
              onclick="sc('how');return false">
              Explore How It Works
            </a>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="card">
            <h3>From profile to plan</h3>

            ${[
              "Profile",
              "Assessment",
              "Career match",
              "Skill gap",
              "Career path",
              "Simulation"
            ].map((s, i) => `
              <div class="hs"
                style="padding:10px 0;border-top:1px solid var(--bd)">
                <span class="bd n">${i + 1}</span>
                <span>${s}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>

  ${sec(
    "how",
    "How it works",
    "Five steps from a blank profile to a development plan.",
    steps([
      [
        "1. Build profile",
        "Education goals, skills, resume, projects and links."
      ],
      [
        "2. Complete assessment",
        "18 questions on the kinds of work you enjoy."
      ],
      [
        "3. Explore careers",
        "See matches with the reasons behind each score."
      ],
      [
        "4. Identify skill gaps",
        "Compare your levels with what each career requires."
      ],
      [
        "5. Simulate your path",
        "Test how new skills change your suitability."
      ]
    ]),
    true
  )}

  ${sec(
    "interests",
    "An interest assessment you can read",
    "18 statements, three for each of the six RIASEC interest types (Holland codes). Rate how much you would enjoy each activity.",
    `
      <div class="row g-3">
        ${Object.keys(RC).map(k => `
          <div class="col-6 col-md-4">
            <div class="card h100">
              <h3>${RC[k]}</h3>
              <p class="mu sm" style="margin:0">${RD[k]}</p>
            </div>
          </div>
        `).join("")}
      </div>
    `
  )}

  ${sec(
    "features",
    "What our project does",
    "Every result comes with the reasoning behind it.",
    cols([
      [
        "Personalized career matching",
        "Scores combine your skills, interests and goals, and show each part."
      ],
      [
        "Skill gap analysis",
        "Your level against the required level, skill by skill."
      ],
      [
        "Career path planning",
        "A step-by-step order for closing your gaps."
      ],
      [
        "Skill acquisition simulation",
        "Estimate how learning a skill shifts your matches."
      ]
    ], "col-md-6 col-lg-3"),
    true
  )}

  ${sec(
    "data",
    "Occupational data",
    "Career requirements come from a standardized occupational knowledge base (O*NET), accessed through a backend service.",
    `
      <div class="row g-3">
        <div class="col-md-6">
          <div class="card h100">
            <h3>What we use</h3>
            <p class="mu sm" style="margin:0">
              Occupation descriptions, tasks, skills, technology,
              education and related occupations.
            </p>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card h100">
            <h3>How to read scores</h3>
            <p class="mu sm" style="margin:0">
              Match scores are AI-estimated suitability. They are not
              a prediction of employment or career success.
            </p>
          </div>
        </div>
      </div>
    `
  )}

  <section class="sec" style="text-align:center">
    <div class="container">
      <h2>Ready to see where you stand?</h2>
      <a class="btn p" href="#/signup">Build My Career Profile</a>
    </div>
  </section>

  <footer class="sec alt" style="padding:32px 0">
    <div class="container hs sp">
      <b></b>
      <span class="mu sm">
        About · Methodology · Data Sources · Privacy · Contact
      </span>
    </div>
  </footer>
`;