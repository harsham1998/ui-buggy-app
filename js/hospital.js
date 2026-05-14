// BUG #7: age off by 1 year (always adds 1 extra)
document.getElementById('dob').addEventListener('change', function () {
  const dob = new Date(this.value);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear() + 1; // BUG: +1 inflates age
  document.getElementById('calcAge').value = age;
});

// BUG #6: filterDoctors does nothing — all doctors always shown regardless of department
function filterDoctors() {
  // intentionally empty — no filtering applied
}

initFileInput('idProof', 'idProofName');

document.getElementById('patientForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const payload = {
    fullName: document.getElementById('fullName').value,
    dob: document.getElementById('dob').value,
    age: document.getElementById('calcAge').value,
    gender: document.querySelector('input[name="gender"]:checked')?.value || '',
    bloodGroup: document.getElementById('bloodGroup').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    department: document.getElementById('department').value,
    doctor: document.getElementById('doctor').value,
    appointmentDate: document.getElementById('appointmentDate').value,
    // BUG #14: appointmentTime intentionally omitted from payload
    emergencyName: document.getElementById('emergencyName').value,
    emergencyPhone: document.getElementById('emergencyPhone').value,
    insuranceActive: document.getElementById('insuranceActive').checked,
    notes: document.getElementById('notes').value
  };

  // BUG #11: saves with key "patientData" but loadRecords reads "patients"
  saveToStorage('patientData', payload);

  try {
    const res = await fetch('/api/hospital', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    // BUG #10: API always returns 500, so this always goes to else
    if (res.ok) {
      showToast('Patient registered successfully!', 'success');
    } else {
      showToast('Server error. Please try again.', 'error');
    }
  } catch {
    showToast('Server error. Please try again.', 'error');
  }

  this.reset();
  loadRecords();
});

function loadRecords() {
  const list = document.getElementById('recordList');
  // BUG #11: reads from "patients" but data was saved under "patientData" — always empty
  const records = loadFromStorage('patients');
  if (!records.length) {
    list.innerHTML = '<p class="no-records">No patients registered yet.</p>';
    return;
  }
  list.innerHTML = records.map(r => `
    <div class="record-card">
      <strong>${r.fullName}</strong> | ${r.bloodGroup} | ${r.department}<br>
      📅 ${r.appointmentDate} &nbsp;|&nbsp; 👨‍⚕️ ${r.doctor}
    </div>`).join('');
}

loadRecords();
