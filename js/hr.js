// BUG #3: employee ID auto-generates with letters (placeholder says "Numbers only")
document.getElementById('employeeId').value = 'EMP' + Math.random().toString(36).substr(2, 5).toUpperCase();

initFileInput('docFile', 'docFileName');

function previewPhoto() {
  const file = document.getElementById('photoFile').files[0];
  if (!file) return;
  document.getElementById('photoFileName').textContent = file.name;
  const reader = new FileReader();
  reader.onload = e => {
    const img = document.getElementById('photoPreview');
    img.src = e.target.result;
    img.style.display = 'block';
    // BUG #4: photo preview has transform:rotate(180deg) in HTML — image upside-down
  };
  reader.readAsDataURL(file);
}

let skills = [];

// BUG #7: removing any tag clears all tags
function addSkill() {
  const sel = document.getElementById('skillsSelect');
  const val = sel.value;
  if (!val || skills.includes(val)) { sel.value = ''; return; }
  skills.push(val);
  renderTags();
  sel.value = '';
}

function removeSkill(s) {
  skills = []; // BUG: clears all skills instead of just the selected one
  renderTags();
}

function renderTags() {
  const container = document.getElementById('tagsDisplay');
  container.innerHTML = skills.map(s =>
    `<span class="tag">${s} <span class="remove-tag" onclick="removeSkill('${s}')">×</span></span>`
  ).join('');
  document.getElementById('skillsValue').value = skills.join(',');
}

document.getElementById('hrForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  // BUG #10: salary saved as string (from text input value — not parsed as number)
  const salary = document.getElementById('salary').value; // stays as string

  const payload = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    employeeId: document.getElementById('employeeId').value,
    dob: document.getElementById('dob').value,
    gender: document.querySelector('input[name="gender"]:checked')?.value || '',
    nationality: document.getElementById('nationality').value,
    personalEmail: document.getElementById('personalEmail').value,
    workEmail: document.getElementById('workEmail').value,
    phone: document.getElementById('phone').value,
    department: document.getElementById('department').value,
    role: document.getElementById('role').value,
    empType: document.querySelector('input[name="empType"]:checked')?.value || '',
    startDate: document.getElementById('startDate').value,
    salary: salary, // BUG #10: string, not number
    manager: document.getElementById('manager').value,
    skills: document.getElementById('skillsValue').value,
    // BUG #13: laptop toggle value inverted (ON = false, OFF = true)
    laptopRequired: !document.getElementById('laptopRequired').checked,
    bgConsent: document.getElementById('bgConsent').checked,
    // BUG #11: bgConsent not validated as required — form always submits
  };

  saveToStorage('employees', payload);

  try {
    const res = await fetch('/api/hr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      // BUG #9: toast duration is 10000ms (10 seconds) instead of 3000ms
      showToast('Employee Added Successfully', 'success', 10000);
    } else {
      showToast('Failed to add employee.', 'error');
    }
  } catch {
    showToast('Failed to add employee.', 'error');
  }

  this.reset();
  skills = [];
  renderTags();
  loadRecords();
  // BUG #3: re-generate ID after reset
  document.getElementById('employeeId').value = 'EMP' + Math.random().toString(36).substr(2, 5).toUpperCase();
});

function loadRecords() {
  const list = document.getElementById('recordList');
  const records = loadFromStorage('employees');
  if (!records.length) { list.innerHTML = '<p class="no-records">No employees added yet.</p>'; return; }
  list.innerHTML = records.map(r => `
    <div class="record-card">
      <strong>${r.firstName} ${r.lastName}</strong> (${r.employeeId})<br>
      🏢 ${r.department} — ${r.role}<br>
      💰 Salary: ${r.salary} | 📅 Start: ${r.startDate}
    </div>`).join('');
}

loadRecords();
