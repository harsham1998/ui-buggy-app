initFileInput('signatureFile', 'signatureName');
initFileInput('addressProof', 'addressProofName');

document.getElementById('bankForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const pan = document.getElementById('panNumber').value;
  const aadhaar = document.getElementById('aadhaarNumber').value;

  // BUG #5: no PAN format validation (any string accepted)
  // BUG #6: aadhaar length not validated (less than 12 digits accepted)

  const deposit = parseFloat(document.getElementById('initialDeposit').value);
  // BUG #7: ₹1 allowed — no minimum ₹500 enforcement

  // BUG #14: DOB not checked for age < 18

  const payload = {
    fullName: document.getElementById('fullName').value,
    dob: document.getElementById('dob').value,
    panNumber: pan,
    aadhaarNumber: aadhaar,
    email: document.getElementById('email').value,
    mobile: document.getElementById('mobile').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    pincode: document.getElementById('pincode').value,
    accountType: document.getElementById('accountType').value,
    initialDeposit: deposit,
    operation: document.querySelector('input[name="operation"]:checked')?.value || '',
    nomineeName: document.getElementById('nomineeName').value,
    nomineeRel: document.getElementById('nomineeRel').value,
    nomineeDob: document.getElementById('nomineeDob').value,
    debitCard: document.getElementById('debitCard').checked,
    // BUG #12: netBanking not included in payload
    declaration: document.getElementById('declaration').checked,
    // BUG #10: declaration not enforced as required
  };

  saveToStorage('bankApplications', payload);

  try {
    const res = await fetch('/api/banking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    // BUG #11: API returns 201 with no ID — data has no application ID
    if (res.status === 201) {
      showToast('Application submitted successfully!', 'success');
    } else {
      showToast('Application failed.', 'error');
    }
  } catch {
    showToast('Application failed.', 'error');
  }

  this.reset();
  loadRecords();
});

function loadRecords() {
  const list = document.getElementById('recordList');
  const records = loadFromStorage('bankApplications');
  if (!records.length) { list.innerHTML = '<p class="no-records">No applications yet.</p>'; return; }
  list.innerHTML = records.map(r => `
    <div class="record-card">
      <strong>${r.fullName}</strong><br>
      🏦 ${r.accountType} | 💰 ₹${r.initialDeposit}<br>
      📋 PAN: ${r.panNumber} | Nominee: ${r.nomineeName}
    </div>`).join('');
}

loadRecords();
