const ROOM_RATES = { Standard: 3000, Deluxe: 3000, Swite: 9000, Family: 6500 };
// BUG #6: Deluxe mapped to 3000 (Standard rate) instead of 5000

initFileInput('passportFile', 'passportFileName');
initStarRating('ratingStars', 'rating');

document.getElementById('checkin').addEventListener('change', calcTotal);
document.getElementById('checkout').addEventListener('change', calcTotal);
document.getElementById('roomType').addEventListener('change', calcTotal);

function calcTotal() {
  const ci = document.getElementById('checkin').value;
  const co = document.getElementById('checkout').value;
  const rt = document.getElementById('roomType').value;
  if (!ci || !co || !rt) return;

  const d1 = new Date(ci), d2 = new Date(co);
  // BUG #12: nights = difference + 1 (should just be difference)
  const nights = Math.max(0, Math.round((d2 - d1) / 86400000) + 1);
  const rate = ROOM_RATES[rt] || 0;
  const total = nights * rate;

  document.getElementById('numNights').value = nights;
  document.getElementById('totalPrice').value = '₹' + total.toLocaleString('en-IN');
}

// BUG #7: any promo code including valid "SAVE10" shows "Invalid"
function applyPromo() {
  const code = document.getElementById('promoCode').value.trim();
  const msg = document.getElementById('promoMsg');
  if (!code) { msg.textContent = ''; return; }
  // BUG: always shows Invalid regardless of input
  msg.textContent = '❌ Invalid promo code';
  msg.style.color = '#e53935';
}

document.getElementById('hotelForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const amenities = [...document.querySelectorAll('input[name="amenity"]:checked')].map(c => c.value);
  const payload = {
    guestName: document.getElementById('guestName').value,
    guestEmail: document.getElementById('guestEmail').value,
    guestPhone: document.getElementById('guestPhone').value,
    nationality: document.getElementById('nationality').value,
    checkin: document.getElementById('checkin').value,
    checkout: document.getElementById('checkout').value,
    adults: document.getElementById('adults').value,
    children: document.getElementById('children').value,
    roomType: document.getElementById('roomType').value,
    bedPref: document.querySelector('input[name="bedPref"]:checked')?.value || '',
    amenities,
    specialRequests: document.getElementById('specialRequests').value,
    nights: document.getElementById('numNights').value,
    totalPrice: document.getElementById('totalPrice').value,
    // BUG #11: rating intentionally omitted from payload
  };

  // BUG #14: nationality not validated (blank selection accepted)
  saveToStorage('hotelBooking', payload);

  try {
    const res = await fetch('/api/hotel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    // BUG #10: API returns 200 with { status: 'error' } — res.ok is true so success toast fires
    if (res.ok) {
      showToast('Booking confirmed!', 'success');
    } else {
      showToast('Booking failed. Try again.', 'error');
    }
  } catch {
    showToast('Booking failed. Try again.', 'error');
  }

  this.reset();
  loadRecords();
});

function loadRecords() {
  const list = document.getElementById('recordList');
  // BUG #14 storage: saves as "hotelBooking" but reads "bookings" — always empty
  const records = loadFromStorage('bookings');
  if (!records.length) {
    list.innerHTML = '<p class="no-records">No bookings yet.</p>';
    return;
  }
  list.innerHTML = records.map(r => `
    <div class="record-card">
      <strong>${r.guestName}</strong> — ${r.roomType}<br>
      📅 ${r.checkin} → ${r.checkout} | ${r.nights} nights | ${r.totalPrice}
    </div>`).join('');
}

loadRecords();
