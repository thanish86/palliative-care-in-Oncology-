const app = document.getElementById("app");

const state = {
  symptom: null,
  step: 0,
  answers: [],
};

const LEVELS = [
  {
    icon: "🌿",
    tag: "Green · Manage at home",
    title: "You can look after this at home.",
    lead: "Try the steps below. Call your care team if you are not improving within 24 hours, or sooner if you feel worse.",
  },
  {
    icon: "📞",
    tag: "Amber · Call today",
    title: "Call your care team today.",
    lead: "Your answers suggest you should speak to your palliative care team today. Please don't wait for your next appointment.",
  },
  {
    icon: "🚑",
    tag: "Red · Urgent",
    title: "Get help right now.",
    lead: `Call ${SETTINGS.emergencyNumber} or come to ${SETTINGS.hospitalName} immediately. Please don't drive yourself.`,
  },
];

function levelOf(option) {
  if (option.level !== undefined) return option.level;
  return SETTINGS.gradeToLevel[option.grade] ?? 0;
}

function tel(number) {
  return "tel:" + number.replace(/[^\d+]/g, "");
}

function render(html) {
  app.innerHTML = `<section class="screen">${html}</section>`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Screens ---------- */

function showWelcome() {
  state.symptom = null;
  render(`
    <div class="center">
      <div class="hero-orbs">
        <span class="orb"></span><span class="orb"></span><span class="orb"></span><span class="orb"></span><span class="orb"></span>
      </div>
      <p class="eyebrow">Palliative Care Symptom Checker</p>
      <h1>How are you<br />feeling today?</h1>
      <p class="lead">Answer a few simple questions about your symptoms. We'll help you decide whether to manage at home, call your care team, or come to hospital.</p>
      <div class="btn-row">
        <button class="btn btn-primary" data-action="start">Check my symptoms</button>
      </div>

      <div class="legend">
        <div class="legend-item mint"><strong>Manage at home</strong><span>Mild symptoms · Grade 1</span></div>
        <div class="legend-item lemon"><strong>Call your team</strong><span>Moderate symptoms · Grade 2</span></div>
        <div class="legend-item pink"><strong>Come in now</strong><span>Severe symptoms · Grade 3–4</span></div>
      </div>
      <p class="source">Symptom grading based on the NCI Common Terminology Criteria for Adverse Events (CTCAE) v6.0</p>
    </div>
  `);
}

function showRedFlags() {
  render(`
    <button class="back" data-action="home">‹ Back</button>
    <p class="eyebrow">First, a quick safety check</p>
    <h2>Do you have any of these right now?</h2>
    <div class="card">
      <ul class="flag-list">
        ${RED_FLAGS.map((f) => `<li>${f}</li>`).join("")}
      </ul>
    </div>
    <div class="btn-row">
      <button class="btn btn-red" data-action="flag-yes">Yes, I have one of these</button>
      <button class="btn btn-light" data-action="flag-no">No, none of these</button>
    </div>
  `);
}

function showSymptoms() {
  state.symptom = null;
  render(`
    <button class="back" data-action="flags">‹ Back</button>
    <p class="eyebrow">Choose a symptom</p>
    <h2>What's bothering you most?</h2>
    <p class="lead">Pick the symptom that worries you most. You can check another one afterwards.</p>
    <div class="grid">
      ${SYMPTOMS.map(
        (s) => `
        <button class="tile ${s.color}" data-action="symptom" data-id="${s.id}">
          <span class="tile-icon">${s.icon}</span>
          <span class="tile-name">${s.name}</span>
        </button>`
      ).join("")}
    </div>
  `);
}

function showQuestion() {
  const s = state.symptom;
  const q = s.questions[state.step];
  const progress = (state.step / s.questions.length) * 100;

  render(`
    <button class="back" data-action="prev">‹ Back</button>
    <div class="progress"><div class="progress-bar" style="width:${progress}%"></div></div>
    <p class="eyebrow">${s.icon} ${s.name} · Question ${state.step + 1} of ${s.questions.length}</p>
    <h2>${q.q}</h2>
    <div class="options">
      ${q.options.map((o, i) => `<button class="option" data-action="answer" data-index="${i}">${o.label}</button>`).join("")}
    </div>
  `);
}

function showResult({ level, reasons, homeCare, title, answers, grades }) {
  const L = LEVELS[level];

  const callout =
    level === 2
      ? `<div class="callout">
           <p>Emergency</p>
           <div class="phone">${SETTINGS.emergencyNumber}</div>
           <div class="btn-row" style="justify-content:center">
             <a class="btn btn-red" href="${tel(SETTINGS.emergencyNumber)}">Call ${SETTINGS.emergencyNumber}</a>
             <a class="btn btn-light" href="${tel(SETTINGS.careTeamPhone)}">Call care team</a>
           </div>
         </div>`
      : `<div class="callout">
           <p>${SETTINGS.careTeamName}</p>
           <div class="phone">${SETTINGS.careTeamPhone}</div>
           <div class="btn-row" style="justify-content:center">
             <a class="btn ${level === 1 ? "btn-amber" : "btn-light"}" href="${tel(SETTINGS.careTeamPhone)}">Call now</a>
           </div>
         </div>`;

  const reasonsCard = reasons.length
    ? `<div class="card"><h3>Why we suggest this</h3>
         <ul class="tips reasons">${reasons.map((r) => `<li>${r}</li>`).join("")}</ul></div>`
    : "";

  const homeCard =
    level < 2 && homeCare && homeCare.length
      ? `<div class="card"><h3>${level === 0 ? "What you can do at home" : "While you wait"}</h3>
           <ul class="tips">${homeCare.map((t) => `<li>${t}</li>`).join("")}</ul></div>`
      : "";

  const gradesCard = grades && grades.length
    ? `<div class="card"><h3>Symptom grades · CTCAE v6.0</h3>
         <p class="card-sub">For your nurse or doctor</p>
         <ul class="grades">${grades
           .map(
             (g) => `<li><span>${g.term}</span>
               <span class="grade-pill g${g.grade}">Grade ${g.grade} · ${GRADE_NAMES[g.grade]}</span></li>`
           )
           .join("")}</ul></div>`
    : "";

  const answersCard = answers && answers.length
    ? `<div class="card"><h3>Your answers — ${title}</h3>
         <ul class="tips">${answers.map((a) => `<li><strong>${a.q}</strong><br />${a.label}</li>`).join("")}</ul>
         <p class="lead" style="font-size:15px">You can read these to your nurse or doctor when you call.</p></div>`
    : "";

  render(`
    <div class="level-${level}">
      <div class="center">
        <div class="result-badge">${L.icon}</div>
        <p class="eyebrow">${L.tag}</p>
        <h1>${L.title}</h1>
        <p class="lead">${L.lead}</p>
      </div>
      ${callout}
      ${reasonsCard}
      ${homeCard}
      ${gradesCard}
      ${answersCard}
      <div class="btn-row" style="justify-content:center">
        <button class="btn btn-primary" data-action="symptoms">Check another symptom</button>
        <button class="btn btn-light" data-action="print">Print / save</button>
        <button class="btn btn-light" data-action="home">Start over</button>
      </div>
    </div>
  `);
}

/* ---------- Logic ---------- */

function finishSymptom() {
  const s = state.symptom;
  const level = Math.max(...state.answers.map(levelOf));
  const reasons = state.answers
    .filter((a) => levelOf(a) === level && level > 0 && a.note)
    .map((a) => a.note);

  const grades = state.answers
    .map((a, i) => ({ term: s.questions[i].ctcae, grade: a.grade }))
    .filter((g) => g.term && g.grade !== undefined);

  showResult({
    level,
    reasons,
    grades,
    homeCare: s.homeCare,
    title: s.name,
    answers: state.answers.map((a, i) => ({ q: s.questions[i].q, label: a.label })),
  });
}

app.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;

  switch (el.dataset.action) {
    case "home":
      showWelcome();
      break;
    case "start":
    case "flags":
      showRedFlags();
      break;
    case "flag-yes":
      showResult({
        level: 2,
        reasons: ["You told us you have a warning sign that needs urgent medical attention."],
      });
      break;
    case "flag-no":
    case "symptoms":
      showSymptoms();
      break;
    case "symptom":
      state.symptom = SYMPTOMS.find((s) => s.id === el.dataset.id);
      state.step = 0;
      state.answers = [];
      showQuestion();
      break;
    case "answer": {
      const option = state.symptom.questions[state.step].options[+el.dataset.index];
      state.answers[state.step] = option;
      state.step++;
      if (state.step < state.symptom.questions.length) showQuestion();
      else finishSymptom();
      break;
    }
    case "prev":
      if (state.step === 0) {
        showSymptoms();
      } else {
        state.step--;
        state.answers.length = state.step;
        showQuestion();
      }
      break;
    case "print":
      window.print();
      break;
  }
});

document.getElementById("homeBtn").addEventListener("click", showWelcome);
document.getElementById("navCall").href = tel(SETTINGS.careTeamPhone);
document.getElementById("footerEmergency").textContent = SETTINGS.emergencyNumber;

showWelcome();
