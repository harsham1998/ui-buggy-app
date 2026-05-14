// BUG #5: return date field always visible and required even for one-way trip
function toggleReturn() {
  const type = document.querySelector('input[name="tripType"]:checked')?.value;
  // BUG: field is never hidden for one-way — no logic here
}

function toggleBaggage() {
  const checked = document.getElementById('addBaggage').checked;
  document.getElementById('baggageSection').style.display = checked ? 'flex' : 'none';
}

// BUG #6: displays kg but sends value in lbs to the API
function updateBaggage() {
  const kg = document.getElementById('baggageWeight').value;
  document.getElementById('baggageVal').textContent = kg + ' kg';
  // value sent to API will be converted to lbs: kg * 2.205 (in submit handler)
}

// BUG #7: departure date minimum set to yesterday (should be today)
window.addEventListener('DOMContentLoaded', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  document.getElementById('departureDate').min = yesterday.toISOString().split('T')[0];
});

document.getElementById('flightForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const kgVal = parseInt(document.getElementById('baggageWeight').value);
  const addBag = document.getElementById('addBaggage').checked;

  const payload = {
    tripType: document.querySelector('input[name="tripType"]:checked')?.value || '',
    from: document.getElementById('fromCity').value,
    to: document.getElementById('toCity').value,
    departureDate: document.getElementById('departureDate').value,
    returnDate: document.getElementById('returnDate').value,
    // BUG #8: 0 passengers allowed — no min-1 validation enforced
    passengers: document.getElementById('passengers').value,
    flightClass: document.getElementById('flightClass').value,
    passengerName: document.getElementById('passengerName').value,
    passportNo: document.getElementById('passportNo').value,
    passportExpiry: document.getElementById('passportExpiry').value,
    nationality: document.getElementById('nationality').value,
    // BUG #13: mealPref intentionally omitted
    seatPref: document.querySelector('input[name="seat"]:checked')?.value || '',
    // BUG #6: sends lbs instead of kg
    baggageWeight: addBag ? Math.round(kgVal * 2.205) + ' lbs' : 0,
    contactEmail: document.getElementById('contactEmail').value,
    contactPhone: document.getElementById('contactPhone').value,
    // BUG #14: checkbox value is "on" string, not boolean
    travelInsurance: document.getElementById('travelInsurance').value || 'on',
  };

  saveToStorage('flights', payload);

  try {
    // BUG #12: API file is named flights.js (plural) — /api/flight returns 404
    const res = await fetch('/api/flight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      // BUG #9: toast duration = 0ms (disappears instantly)
      showToast('Flight booked successfully!', 'success', 0);
    } else {
      showToast('Booking failed.', 'error', 0); // also 0ms
    }
  } catch {
    showToast('Booking failed.', 'error', 0);
  }

  this.reset();
  loadRecords();
});

function loadRecords() {
  const list = document.getElementById('recordList');
  const records = loadFromStorage('flights');
  if (!records.length) { list.innerHTML = '<p class="no-records">No bookings yet.</p>'; return; }
  list.innerHTML = records.map(r => `
    <div class="record-card">
      <strong>${r.passengerName}</strong><br>
      ✈️ ${r.from} → ${r.to} | 📅 ${r.departureDate}<br>
      Class: ${r.flightClass} | Passengers: ${r.passengers}
    </div>`).join('');
}

loadRecords();
