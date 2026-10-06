const calls = [
  {"id": 1, "name": "Anita Sharma", "status": "answered", "duration_secs": 137, "summary": "Booked a follow-up for Friday."},
  {"id": 2, "name": "Rahul Shah", "status": "failed", "duration_secs": 0, "summary": ""},
  {"id": 3, "name": null, "status": "answered", "duration_secs": 64, "summary": "Asked about clinic timings."},
  {"id": 4, "name": "Mohammed Irfan Abdul Rahman Siddiqui", "status": "answered", "duration_secs": 3725, "summary": "Called about his mother's knee surgery. Wanted to know the cost, how many days she would stay, whether insurance is accepted, what to bring on the day, and if the doctor could call him back personally before he decides. Asked the same questions again for his father."},
  {"id": 5, "name": "priya nair", "status": "no_answer", "duration_secs": 0, "summary": ""},
  {"id": 6, "name": "Deepak Verma", "status": "answered", "duration_secs": 212, "summary": "Said the doctor was <b>very</b> helpful."},
  {"id": 7, "name": "Sunita Rao", "status": "answered", "duration_secs": 59, "summary": "Rescheduled to Monday."},
  {"id": 7, "name": "Sunita Rao", "status": "answered", "duration_secs": 59, "summary": "Rescheduled to Monday."}
];

// ── Helpers ──

function formatDuration(secs) {
  if (secs === 0) return "0 sec";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const parts = [];
  if (h > 0) parts.push(h + " hr");
  if (m > 0) parts.push(m + " min");
  if (s > 0) parts.push(s + " sec");
  return parts.join(" ");
}

function formatStatus(status) {
  switch (status) {
    case "answered":  return "Answered";
    case "failed":    return "Failed";
    case "no_answer": return "No Answer";
    default:          return status;
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ── Stats ──

function renderStats() {
  const answered = calls.filter(c => c.status === "answered").length;
  const failed   = calls.filter(c => c.status === "failed").length;
  const noAnswer = calls.filter(c => c.status === "no_answer").length;

  document.getElementById("stats-row").innerHTML =
    '<div class="stat-card">' +
      '<div class="stat-value green">' + answered + '</div>' +
      '<div class="stat-label">Answered</div>' +
    '</div>' +
    '<div class="stat-card">' +
      '<div class="stat-value red">' + failed + '</div>' +
      '<div class="stat-label">Failed</div>' +
    '</div>' +
    '<div class="stat-card">' +
      '<div class="stat-value amber">' + noAnswer + '</div>' +
      '<div class="stat-label">No Answer</div>' +
    '</div>';
}

// ── Date ──

function renderDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById("header-date").textContent = now.toLocaleDateString('en-IN', options);
}

// ── SVG icon helpers ──

const icons = {
  clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  search: '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
};

// ── Render calls ──

function renderCalls(filter) {
  const list = document.getElementById("call-list");
  list.innerHTML = "";

  const filtered = calls.filter(call => {
    if (!filter) return true;
    const name = call.name || "";
    return name.toLowerCase().includes(filter.toLowerCase());
  });

  if (filtered.length === 0) {
    list.innerHTML =
      '<div class="no-results">' +
        '<div class="no-results-icon">' + icons.search + '</div>' +
        '<div class="no-results-title">No calls found</div>' +
        '<div class="no-results-sub">Try a different search term</div>' +
      '</div>';
    return;
  }

  filtered.forEach(function (call, index) {
    const card = document.createElement("div");
    card.className = "call-card card-" + call.status;
    card.style.animationDelay = (index * 0.04) + "s";

    const isUnknown = !call.name;
    const displayName = isUnknown ? "Unknown" : escapeHtml(call.name);
    const nameClass = "call-name" + (isUnknown ? " unknown" : "");

    const summaryRaw = call.summary ? escapeHtml(call.summary) : "";
    const summaryHtml = summaryRaw
      ? '<div class="call-summary">' + summaryRaw + '</div>'
      : '<div class="call-summary empty">No summary</div>';

    card.innerHTML =
      '<div class="call-header">' +
        '<span class="' + nameClass + '">' + displayName + '</span>' +
        '<span class="status-badge status-' + call.status + '">' +
          '<span class="status-dot"></span>' +
          formatStatus(call.status) +
        '</span>' +
      '</div>' +
      '<div class="call-meta">' +
        icons.clock + ' ' + formatDuration(call.duration_secs) +
      '</div>' +
      summaryHtml;

    list.appendChild(card);
  });
}

// ── Search ──

const searchBox = document.getElementById("search-box");
const clearBtn  = document.getElementById("search-clear");

searchBox.addEventListener("input", function () {
  const val = this.value.trim();
  clearBtn.classList.toggle("visible", val.length > 0);
  renderCalls(val);
});

clearBtn.addEventListener("click", function () {
  searchBox.value = "";
  clearBtn.classList.remove("visible");
  searchBox.focus();
  renderCalls("");
});

// ── Init ──

renderDate();
renderStats();
renderCalls("");
