initFileInput('occasionPhoto', 'photoName');
initStarRating('ambienceStars', 'ambienceRating');

function updatePartySize() {
  const val = document.getElementById('partySize').value;
  document.getElementById('partySizeVal').textContent = val + ' guests';
}

function updateSpend() {
  const val = document.getElementById('spendSlider').value;
  document.getElementById('spendVal').textContent = '$' + val + ' per person';
}

// BUG #7: selecting Vegan deselects Vegetarian
function handleVegan() {
  if (document.getElementById('dietVegan').checked) {
    document.getElementById('dietVeg').checked = false; // BUG: forcibly deselects Vegetarian
  }
}

// BUG #13: SMS toggle makes phone number non-required
function toggleSMS() {
  const sms = document.getElementById('smsNotify').checked;
  const phone = document.getElementById('guestPhone');
  if (sms) {
    phone.removeAttribute('required'); // BUG: phone should REMAIN required when SMS enabled
  } else {
    phone.setAttribute('required', 'required');
  }
}

// BUG #8: promo code input not cleared after applying
function applyPromo() {
  const code = document.getElementById('promoCode').value.trim();
  const msg = document.getElementById('promoMsg');
  if (code === 'DINE15') {
    msg.textContent = '✅ 15% discount applied!';
    msg.style.color = '#2e7d32';
    // BUG: promoCode field NOT cleared
  } else {
    msg.textContent = '❌ Invalid promo code';
    msg.style.color = '#e53935';
    // BUG: promoCode field NOT cleared here either
  }
}

document.getElementById('restaurantForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const diets = [...document.querySelectorAll('input[name="diet"]:checked')].map(c => c.value);

  const payload = {
    guestName: document.getElementById('guestName').value,
    guestEmail: document.getElementById('guestEmail').value,
    guestPhone: document.getElementById('guestPhone').value,
    resDate: document.getElementById('resDate').value,
    // BUG #10: resTime intentionally omitted from payload
    partySize: document.getElementById('partySize').value,
    occasion: document.getElementById('occasion').value,
    seating: document.querySelector('input[name="seating"]:checked')?.value || '',
    cuisine: document.getElementById('cuisine').value,
    diets,
    // BUG #11: spend slider value + 10 sent to API
    estimatedSpend: parseInt(document.getElementById('spendSlider').value) + 10,
    specialReq: document.getElementById('specialReq').value,
    smsNotify: document.getElementById('smsNotify').checked,
    rating: document.getElementById('ambienceRating').value,
    promoCode: document.getElementById('promoCode').value,
  };

  saveToStorage('reservations', payload);

  try {
    const res = await fetch('/api/restaurant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    // BUG #12: API returns 200 even for party > max capacity
    if (res.ok) {
      showToast('Reservation confirmed!', 'success');
    } else {
      showToast('Reservation failed.', 'error');
    }
  } catch {
    showToast('Reservation failed.', 'error');
  }

  this.reset();
  // BUG #14: star rating resets to 0 and stars are visually cleared but input still shows old value
  document.getElementById('ambienceRating').value = 0;
  document.querySelectorAll('#ambienceStars .star').forEach(s => s.classList.remove('active'));
  loadRecords();
});

function loadRecords() {
  const list = document.getElementById('recordList');
  const records = loadFromStorage('reservations');
  if (!records.length) { list.innerHTML = '<p class="no-records">No reservations yet.</p>'; return; }
  list.innerHTML = records.map(r => `
    <div class="record-card">
      <strong>${r.guestName}</strong> — ${r.resDate}<br>
      👥 ${r.partySize} guests | 🍽️ ${r.occasion || 'Casual'} | ${r.seating || 'Indoor'}
    </div>`).join('');
}

loadRecords();
