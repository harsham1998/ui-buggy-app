initFileInput('birthCert', 'birthCertName');
initFileInput('transferCert', 'transferCertName');

const GRADE_FEES = { 1: 45000, 2: 45000, 3: 48000, 4: 48000, 5: 50000, 6: 52000, 7: 52000, 8: 55000, 9: 58000, 10: 60000, 11: 65000, 12: 65000 };

// BUG #6: updateFee is called on grade change but never actually updates the fee
function updateFee() {
  // BUG: intentionally doing nothing — fee never changes
}

document.getElementById('schoolForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  // BUG #9: termsAccepted not validated
  const courses = [...document.querySelectorAll('input[name="course"]:checked')].map(c => c.value);

  // BUG #7: more than 3 courses can be selected — no enforcement here
  const payment = document.querySelector('input[name="payment"]:checked')?.value || '';

  const payload = {
    studentName: document.getElementById('studentName').value,
    dob: document.getElementById('dob').value,
    gender: document.querySelector('input[name="gender"]:checked')?.value || '',
    parentName: document.getElementById('parentName').value,
    parentEmail: document.getElementById('parentEmail').value,
    parentPhone: document.getElementById('parentPhone').value,
    address: document.getElementById('address').value,
    grade: document.getElementById('grade').value,
    courses,
    enrollmentDate: document.getElementById('enrollmentDate').value,
    prevSchool: document.getElementById('prevSchool').value,
    prevGrade: document.getElementById('prevGrade').value,
    medicalNotes: document.getElementById('medicalNotes').value,
    feeAmount: document.getElementById('feeAmount').value,
    payment,
    // BUG #13: if payment is Cheque, no chequeNumber field — API will expect it
    termsAccepted: document.getElementById('termsAccepted').checked,
  };

  // BUG #14: overwrites existing records instead of appending
  localStorage.setItem('students', JSON.stringify(payload));

  try {
    const res = await fetch('/api/school', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      showToast('Student enrolled successfully!', 'success');
    } else {
      // BUG #11: API returns 500 on valid submission
      showToast('Enrollment failed. Please try again.', 'error');
    }
  } catch {
    showToast('Enrollment failed. Please try again.', 'error');
  }

  this.reset();
  loadRecords();
});

function loadRecords() {
  const list = document.getElementById('recordList');
  // BUG #14: localStorage.getItem returns an object (not array) due to overwrite bug
  let data = localStorage.getItem('students');
  let records = [];
  try {
    const parsed = JSON.parse(data || 'null');
    records = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
  } catch { records = []; }

  if (!records.length) { list.innerHTML = '<p class="no-records">No students enrolled yet.</p>'; return; }
  list.innerHTML = records.map(r => `
    <div class="record-card">
      <strong>${r.studentName}</strong> — Grade ${r.grade}<br>
      📚 ${Array.isArray(r.courses) ? r.courses.join(', ') : r.courses}<br>
      💰 Fee: ₹${r.feeAmount} | 📅 ${r.enrollmentDate}
    </div>`).join('');
}

loadRecords();
