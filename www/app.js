
const subjects = [
  {
    name: "Engineering Mathematics-III",
    type: "Theory",
    hours: 4,
    pdf: "",
    plan: "Start with algebra, trigonometry, differentiation and integration. Then follow your university syllabus unit by unit."
  },
  {
    name: "Engineering Thermodynamics",
    type: "Theory",
    hours: 3,
    pdf: "Thermodynamics.pdf",
    plan: "Start with thermodynamic systems, properties, work and heat. Continue with first law, second law, entropy, pure substances and thermodynamic cycles."
  },
  {
    name: "Strength of Materials",
    type: "Theory",
    hours: 3,
    pdf: "Strength Of Material.pdf",
    plan: "Start with stress, strain and Hooke's law. Continue with elastic constants, bending, shear force, bending moment, torsion and columns."
  },
  {
    name: "Engineering Mechanics",
    type: "Theory",
    hours: 2.5,
    pdf: "Engineering Mechanics.pdf",
    plan: "Start with units, vectors and forces. Continue with resultants, equilibrium, free body diagrams, friction, centroids, kinematics and dynamics."
  },
  {
    name: "Manufacturing Technology",
    type: "Theory",
    hours: 2,
    pdf: "MATERIALS & PROCESSES IN MANUFACTURING.pdf",
    plan: "Start with manufacturing basics, casting, forming, machining, turning, milling, welding, CNC and measurement."
  },
  {
    name: "Material Science and Smart Materials",
    type: "Theory",
    hours: 2,
    pdf: "MATERIALS SCIENCE AND ENGINEERING.pdf",
    plan: "Start with atomic structure, bonding and crystal structures. Continue with defects, mechanical properties, phase diagrams, metals, ceramics, polymers and composites."
  },
  {
    name: "Effective Communication Skills",
    type: "Theory",
    hours: 1.5,
    pdf: "",
    plan: "Start with grammar, vocabulary, sentence formation, reading, writing, formal emails, presentations and communication practice."
  },
  {
    name: "Manufacturing Process Lab",
    type: "Lab",
    hours: 1,
    pdf: "MATERIALS & PROCESSES IN MANUFACTURING.pdf",
    plan: "Prepare experiment aim, apparatus, diagrams, procedure, observations, calculations and results."
  },
  {
    name: "Strength of Materials Lab",
    type: "Lab",
    hours: 1,
    pdf: "Strength Of Material.pdf",
    plan: "Prepare testing procedures, formulas, observation tables, calculations and precautions."
  },
  {
    name: "Industry Automation Level-I",
    type: "Lab",
    hours: 1,
    pdf: "",
    plan: "Study sensors, actuators, wiring diagrams, control logic, PLC basics and practical experiments using your lab manual."
  }
];

const $ = id => document.getElementById(id);

let data = JSON.parse(
  localStorage.getItem("studyCompanion") ||
  '{"name":"","age":"","sessions":[]}'
);

let elapsed = 0;
let timer = null;
let lastAnswer = 0;

function save() {
  localStorage.setItem("studyCompanion", JSON.stringify(data));
  render();
}

function totalSeconds(sessions) {
  return sessions.reduce((sum, s) => sum + s.seconds, 0);
}

function formatTime(seconds) {
  seconds = Math.floor(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours + "h " + minutes + "m";
}

function render() {
  const total = totalSeconds(data.sessions);

  $("hello").textContent =
    "Hello" + (data.name ? ", " + data.name : ", Student");

  $("homeTotal").textContent = formatTime(total);
  $("profileTotal").textContent = formatTime(total);
  $("sessionCount").textContent = data.sessions.length;

  const now = new Date();
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));

  const weekly = data.sessions.filter(
    s => new Date(s.date) >= monday
  );

  $("weekTotal").textContent =
    formatTime(totalSeconds(weekly));

  $("today").textContent =
    now.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });

  $("name").value = data.name || "";
  $("age").value = data.age || "";

  $("todayPlan").innerHTML = subjects
    .filter(s => s.type === "Theory")
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 3)
    .map(s => `
      <div class="card">
        <b>${s.name}</b>
        <p class="muted">Target: ${s.hours} hours/week</p>
        <p>${s.plan}</p>
      </div>
    `).join("");

  $("subjectQuick").innerHTML = subjects.map(s => `
    <div class="subject-row">
      <span>${s.name}<br>
      <small>${s.type}</small></span>
      <b>${s.hours}h/wk</b>
    </div>
  `).join("");

  $("analysisDone").textContent = formatTime(total);
  $("percent").textContent =
    Math.min(100, Math.round(total / (21 * 3600) * 100)) + "%";

  $("analysisList").innerHTML = subjects.map(s => {
    const done = totalSeconds(
      data.sessions.filter(x => x.subject === s.name)
    );

    const target = s.hours * 3600;
    const progress = Math.min(100, done / target * 100);

    return `
      <div class="card">
        <b>${s.name}</b>
        <p class="muted">${s.type} · Target ${s.hours}h/week</p>
        <p>Studied: ${formatTime(done)}</p>
        <div class="bar">
          <span style="width:${progress}%"></span>
        </div>
        <p class="small">
          ${Math.max(0, s.hours - done / 3600).toFixed(1)}
          hours remaining
        </p>
        ${s.pdf ? `
          <a href="pdfs/${encodeURIComponent(s.pdf)}"
             target="_blank">Open PDF ↗</a>
        ` : ""}
      </div>
    `;
  }).join("");

  $("roadmaps").innerHTML = subjects.map(s => `
    <div class="card roadmap">
      <h4>${s.name} · ${s.type}</h4>
      <p>${s.plan}</p>
      ${s.pdf ? `
        <a href="pdfs/${encodeURIComponent(s.pdf)}"
           target="_blank">Open textbook ↗</a>
      ` : ""}
    </div>
  `).join("");

  $("history").innerHTML = data.sessions.length
    ? data.sessions.slice().reverse().map(s => `
      <div class="history-item">
        <span>
          <b>${s.subject}</b><br>
          <small class="muted">
            ${new Date(s.date).toLocaleString()}
          </small>
        </span>
        <b>${formatTime(s.seconds)}</b>
      </div>
    `).join("")
    : '<p class="muted">No saved sessions yet.</p>';
}

// Navigation
$("nav").addEventListener("click", e => {
  const button = e.target.closest("[data-page]");
  if (!button) return;

  document.querySelectorAll("nav button").forEach(b =>
    b.classList.toggle("active", b === button)
  );

  document.querySelectorAll(".page").forEach(page =>
    page.classList.toggle("active", page.id === button.dataset.page)
  );
});

// Timer
$("timerSubject").innerHTML = subjects.map(s =>
  `<option value="${s.name}">${s.name}</option>`
).join("");

function showClock() {
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;

  $("clock").textContent = [h, m, s]
    .map(v => String(v).padStart(2, "0"))
    .join(":");
}

$("startBtn").onclick = () => {
  if (timer) return;

  timer = setInterval(() => {
    elapsed++;
    showClock();
  }, 1000);

  $("timerStatus").textContent = "Studying...";
};

$("pauseBtn").onclick = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
    $("timerStatus").textContent = "Timer paused.";
  }
};

$("resetBtn").onclick = () => {
  if (timer) clearInterval(timer);
  timer = null;
  elapsed = 0;
  showClock();
  $("timerStatus").textContent = "Timer reset.";
};

$("saveBtn").onclick = () => {
  if (timer) clearInterval(timer);
  timer = null;

  if (elapsed < 1) {
    $("timerStatus").textContent = "No study time to save.";
    return;
  }

  data.sessions.push({
    subject: $("timerSubject").value,
    seconds: elapsed,
    date: new Date().toISOString()
  });

  elapsed = 0;
  showClock();
  $("timerStatus").textContent = "Session saved successfully.";
  save();
};

// Profile
$("saveProfile").onclick = () => {
  data.name = $("name").value.trim();
  data.age = $("age").value;
  save();
  alert("Profile saved successfully.");
};

// Scientific calculator
function calculate(expression) {
  let s = expression
    .replace(/π/g, "pi")
    .replace(/\^/g, "**")
    .replace(/\bpi\b/g, "Math.PI")
    .replace(/\be\b/g, "Math.E");

  s = s.replace(/(\d+(?:\.\d+)?)!/g, (_, value) => {
    const n = Number(value);
    if (!Number.isInteger(n) || n < 0 || n > 170) {
      throw Error("Invalid factorial");
    }
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return String(result);
  });

  s = s
    .replace(/\bsin\(/g, "Math.sin(Math.PI/180*")
    .replace(/\bcos\(/g, "Math.cos(Math.PI/180*")
    .replace(/\btan\(/g, "Math.tan(Math.PI/180*")
    .replace(/\basin\(/g, "(180/Math.PI*Math.asin(")
    .replace(/\bacos\(/g, "(180/Math.PI*Math.acos(")
    .replace(/\batan\(/g, "(180/Math.PI*Math.atan(")
    .replace(/\bsqrt\(/g, "Math.sqrt(")
    .replace(/\blog\(/g, "Math.log10(")
    .replace(/\bln\(/g, "Math.log(");

  if (!/^[0-9+\-*/().,\sA-Za-z_*]+$/.test(s)) {
    throw Error("Invalid expression");
  }

  if (/constructor|window|document|global|Function|eval/i.test(s)) {
    throw Error("Invalid expression");
  }

  return Function('"use strict"; return (' + s + ')')();
}

$("keys").onclick = e => {
  const button = e.target.closest("button");
  if (!button) return;

  const display = $("display");
  const action = button.dataset.action;

  if (action === "clear") {
    display.value = "0";
    return;
  }

  if (action === "back") {
    display.value = display.value.slice(0, -1) || "0";
    return;
  }

  if (action === "equals") {
    try {
      lastAnswer = calculate(display.value);
      display.value = String(Number(lastAnswer.toPrecision(12)));
    } catch {
      display.value = "Error";
    }
    return;
  }

  let value = button.dataset.v;

  if (value === "Ans") value = String(lastAnswer);

  if (display.value === "0" && /^[0-9.]$/.test(value)) {
    display.value = value;
  } else {
    display.value += value;
  }
};

render();
showClock();
