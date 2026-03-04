// ---------- Helpers ----------
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));

const form = $("#recruitForm");

// ---------- Steps ----------
const sections = $$("form section.card");

// step mapping:
// 1 => Registration Type
// 2 => Basic + Type-Specific
// 3 => Technical + Academic
// 4 => Upload & Submit
const stepMap = [[0], [1]];

let currentStep = 1;

const progressEls = $$(".step", $("#progress"));
const metaText = $("#metaText");
const btnBack = $("#btnBack");
const btnNext = $("#btnNext");
const btnSubmit = $("#btnSubmit");

function setStep(step) {
  currentStep = Math.min(2, Math.max(1, step));

  sections.forEach((card, idx) => {
    const shouldShow = stepMap[currentStep - 1].includes(idx);
    card.classList.toggle("hidden", !shouldShow);
  });

  progressEls.forEach((el) => {
    const s = Number(el.dataset.step);
    el.classList.toggle("active", s === currentStep);
    el.classList.toggle("done", s < currentStep);
  });

  metaText.textContent = `Step ${currentStep} of 2`;

  btnBack.style.visibility = currentStep === 1 ? "hidden" : "visible";
  btnBack.disabled = currentStep === 1;

  btnNext.classList.toggle("hidden", currentStep === 2);
  btnSubmit.classList.toggle("hidden", currentStep !== 2);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleBasicFields(type) {
  document.querySelectorAll(".employer-only, .employee-only, .student-only")
    .forEach(el => el.classList.add("hidden"));

  if (type === "recruiter") {
    document.querySelectorAll(".employer-only")
      .forEach(el => el.classList.remove("hidden"));
  }

  if (type === "employee") {
    document.querySelectorAll(".employee-only")
      .forEach(el => el.classList.remove("hidden"));
  }

  if (type === "student") {
    document.querySelectorAll(".student-only")
      .forEach(el => el.classList.remove("hidden"));
  }
}

function setRequired(ids, isRequired) {
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.required = isRequired;
    const lab = document.querySelector(`label[for="${id}"]`);
    if (lab) {
      if (isRequired) lab.classList.add("req");
      else lab.classList.remove("req");
    }
  });
}

function updateTypeBlocks() {
  const type = document.querySelector(
    'input[name="registration_type"]:checked'
  )?.value;

  if (!type) return;

  toggleBasicFields(type);
}

// $$('input[name="registration_type"]').forEach((r) => {
//   r.addEventListener("change", updateTypeBlocks);
// });

$$('input[name="registration_type"]').forEach((r) => {
  r.addEventListener("change", () => {
    updateTypeBlocks();
    setTimeout(() => {
      if (validateStep(1)) setStep(2);
    }, 200);
  });
});
// ---------- Tag input ----------
function escapeHtml(str) {
  return str.replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m],
  );
}

function setupTagInput({ inputEl, boxEl, hiddenEl }) {
  let tags = [];

  function render() {
    $$(".tag", boxEl).forEach((t) => t.remove());
    tags.forEach((t, idx) => {
      const pill = document.createElement("span");
      pill.className = "tag";
      pill.innerHTML = `<span>${escapeHtml(t)}</span><button type="button">×</button>`;
      pill.querySelector("button").addEventListener("click", () => {
        tags.splice(idx, 1);
        hiddenEl.value = tags.join(", ");
        render();
      });
      boxEl.insertBefore(pill, inputEl);
    });
    hiddenEl.value = tags.join(", ");
  }

  function addTag(raw) {
    const val = raw.trim().replace(/\s+/g, " ");
    if (!val) return;
    if (tags.some((t) => t.toLowerCase() === val.toLowerCase())) return;
    tags.push(val);
    render();
  }

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputEl.value);
      inputEl.value = "";
    }
    if (e.key === "Backspace" && !inputEl.value && tags.length) {
      tags.pop();
      render();
    }
  });

  return {
    getTags: () => tags.slice(),
    setTags: (arr) => {
      tags = arr.slice();
      render();
    },
  };
}

const keySkillsTags = setupTagInput({
  inputEl: $("#key_skills_input"),
  boxEl: $("#skillsTagBox"),
  hiddenEl: $("#key_skills"),
});

// ---------- Validation ----------
function clearInvalid() {
  $$("input,select,textarea", form).forEach((el) =>
    el.classList.remove("invalid"),
  );
}

function markInvalid(el) {
  el.classList.add("invalid");

  const card = el.closest("section.card");
  if (!card) return;

  const idx = sections.indexOf(card);
  let targetStep = 1;
  stepMap.forEach((idxArr, stepIdx) => {
    if (idxArr.includes(idx)) targetStep = stepIdx + 1;
  });

  setStep(targetStep);
  setTimeout(() => el.focus({ preventScroll: true }), 250);
}

function validateStep(step) {
  clearInvalid();
  const cardIdxs = stepMap[step - 1];
  let ok = true;

  const visibleEls = [];
  cardIdxs.forEach((i) => {
    $$("input,select,textarea", sections[i]).forEach((el) => {
      if (!el.disabled) visibleEls.push(el);
    });
  });

  for (const el of visibleEls) {
    // Skip elements inside any hidden ancestor
    if (el.closest(".hidden")) continue;

    if (el.hasAttribute("required") && !el.checkValidity()) {
      ok = false;
      markInvalid(el);
      break;
    }
  }
  if (!ok) return false;

  const type = $('input[name="registration_type"]:checked')?.value;

  if (step === 2 && type === "employee") {
    if (keySkillsTags.getTags().length === 0) {
      markInvalid($("#key_skills_input"));
      return false;
    }
  }

  return true;
}

// ---------- Buttons ----------
btnBack.addEventListener("click", () => setStep(currentStep - 1));
btnNext.addEventListener("click", () => {
  if (validateStep(currentStep)) setStep(currentStep + 1);
});

// ---------- Submit ----------
form.addEventListener("submit", (e) => {
  e.preventDefault();

  for (let s = 1; s <= 2; s++) {
    if (!validateStep(s)) return;
  }

  const fd = new FormData(form);
  const payload = {};

  fd.forEach((v, k) => {
    if (k.endsWith("[]")) {
      const key = k.slice(0, -2);
      payload[key] = payload[key] || [];
      payload[key].push(v);
    } else if (k === "exposure" || k === "languages") {
      payload[k] = payload[k] || [];
      payload[k].push(v);
    } else if (v instanceof File) {
      payload[k] = payload[k] || [];
      payload[k].push(v.name);
    } else {
      payload[k] = v;
    }
  });

  console.log("Form payload:", payload);
});

// ---------- Init ----------
setStep(1);
updateTypeBlocks();

$("#mobile").addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
});