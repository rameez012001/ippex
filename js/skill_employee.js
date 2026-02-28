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
const stepMap = [[0], [1, 2], [3, 4], [5]];

let currentStep = 1;

const progressEls = $$(".step", $("#progress"));
const metaText = $("#metaText");
const btnBack = $("#btnBack");
const btnNext = $("#btnNext");
const btnSubmit = $("#btnSubmit");

function setStep(step) {
  currentStep = Math.min(4, Math.max(1, step));

  sections.forEach((card, idx) => {
    const shouldShow = stepMap[currentStep - 1].includes(idx);
    card.classList.toggle("hidden", !shouldShow);
  });

  progressEls.forEach((el) => {
    const s = Number(el.dataset.step);
    el.classList.toggle("active", s === currentStep);
    el.classList.toggle("done", s < currentStep);
  });

  metaText.textContent = `Step ${currentStep} of 4`;

  btnBack.style.visibility = currentStep === 1 ? "hidden" : "visible";
  btnBack.disabled = currentStep === 1;

  btnNext.classList.toggle("hidden", currentStep === 4);
  btnSubmit.classList.toggle("hidden", currentStep !== 4);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- Type-specific blocks ----------
const blockRecruiter = $("#blockRecruiter");
const blockEmployee = $("#blockEmployee");
const blockStudent = $("#blockStudent");
const typeHelp = $("#typeHelp");

// The type-specific card (section index 2) — shown only when a type is selected
const typeSpecificCard = sections[2];

// required fields per type
const recruiterReq = ["company_name", "company_location", "designation_recruiter"];
const employeeReq  = ["current_role", "total_experience", "employment_status", "preferred_roles"];
const studentReq   = ["college_name", "course_type", "branch", "grad_year", "internship_job"];

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
  const type = $('input[name="registration_type"]:checked')?.value;

  // Hide all inner blocks first
  blockRecruiter.classList.add("hidden");
  blockEmployee.classList.add("hidden");
  blockStudent.classList.add("hidden");

  // Clear all required flags
  setRequired(recruiterReq, false);
  setRequired(employeeReq, false);
  setRequired(studentReq, false);

  if (!type) {
    typeHelp.classList.remove("hidden");
    return;
  }

  typeHelp.classList.add("hidden");

  if (type === "recruiter") {
    blockRecruiter.classList.remove("hidden");
    setRequired(recruiterReq, true);
  } else if (type === "employee") {
    blockEmployee.classList.remove("hidden");
    setRequired(employeeReq, true);
  } else if (type === "student") {
    blockStudent.classList.remove("hidden");
    setRequired(studentReq, true);
  }
}

// $$('input[name="registration_type"]').forEach((r) => {
//   r.addEventListener("change", updateTypeBlocks);
// });

$$('input[name="registration_type"]').forEach((r) => {
  r.addEventListener("change", () => {
    updateTypeBlocks();
    // Small delay so user sees the selection before moving
    setTimeout(() => {
      if (validateStep(1)) setStep(2);
    }, 300);
  });
});
// ---------- Tag input ----------
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[m]);
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
    setTags: (arr) => { tags = arr.slice(); render(); },
  };
}

const keySkillsTags = setupTagInput({
  inputEl: $("#key_skills_input"),
  boxEl:   $("#skillsTagBox"),
  hiddenEl: $("#key_skills"),
});

const techSkillsTags = setupTagInput({
  inputEl: $("#tech_skills_input"),
  boxEl:   $("#techTagBox"),
  hiddenEl: $("#technical_skills"),
});

// ---------- Additional Education Rows ----------
const eduTable   = $("#eduTable");
const addEduRowBtn = $("#addEduRow");

function makeEduRow() {
  const row = document.createElement("div");
  row.className = "table-row";
  row.innerHTML = `
    <select name="edu_qual[]">
      <option value="">Select</option>
      <option>10th</option><option>12th</option><option>ITI</option>
      <option>Diploma</option><option>UG</option><option>PG</option><option>Other</option>
    </select>
    <input type="text"   name="edu_course[]"      placeholder="Course / Branch" />
    <input type="text"   name="edu_institution[]"  placeholder="Institution" />
    <input type="number" name="edu_year[]"  min="1980" max="2100" placeholder="Year" />
    <input type="text"   name="edu_score[]"        placeholder="% / CGPA" />
    <button type="button" class="icon-btn" title="Remove">✕</button>
  `;
  row.querySelector("button").addEventListener("click", () => row.remove());
  eduTable.appendChild(row);
}

addEduRowBtn.addEventListener("click", makeEduRow);

// ---------- Validation ----------
function clearInvalid() {
  $$("input,select,textarea", form).forEach((el) => el.classList.remove("invalid"));
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

  if (step === 3) {
    if (techSkillsTags.getTags().length === 0) {
      markInvalid($("#tech_skills_input"));
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

  for (let s = 1; s <= 4; s++) {
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
  alert("✅ Submitted successfully!\n\n(Data printed in console — connect to your backend API to save.)");
});

// ---------- Init ----------
setStep(1);
updateTypeBlocks();

$("#mobile").addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
});