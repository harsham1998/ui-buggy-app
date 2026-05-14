const EVENTS = {
  'tech-summit':   { date: '15 Mar 2025', venue: 'HICC, Hyderabad' },    // BUG #3: hardcoded 2025
  'design-conf':  { date: '22 Apr 2025', venue: 'NSIC, Delhi' },          // BUG #3
  'startup-expo': { date: '10 May 2025', venue: 'BIEC, Bangalore' },      // BUG #3
  'ai-workshop':  { date: '05 Jun 2025', venue: 'ITC, Mumbai' },          // BUG #3
};

const TICKET_PRICES = { General: 500, VIP: 1500, Student: 200 };

function fillEventDetails() {
  const key = document.getElementById('eventName').value;
  const ev = EVENTS[key] || {};
  document.getElementById('eventDate').value = ev.date || '';
  document.getElementById('eventVenue').value = ev.venue || '';
}

function calcAmount() {
  const ticketType = document.querySelector('input[name="ticketType"]:checked')?.value;
  const num = parseInt(document.getElementById('numTickets').value) || 1;
  const price = TICKET_PRICES[ticketType] || 0;
  // BUG #8: this function is called on numTickets change but NOT on ticket type radio change
  document.getElementById('totalAmount').value = '₹' + (price * num);
}

// BUG #5: student ID section is never shown (display stays 'none')
function toggleStudentId() {
  // BUG: intentionally empty — student ID upload never appears
}

function toggleCardField() {
  const method = document.querySelector('input[name="payMethod"]:checked')?.value;
  // BUG #13: card field always stays in DOM regardless of payment method
  // No hide/show logic implemented
}

let couponDiscount = 0;

// BUG #6: "EVENT50" shows "10% off" in message but applies 50% to total
function applyCoupon() {
  const code = document.getElementById('couponCode').value.trim().toUpperCase();
  const msg = document.getElementById('couponMsg');
  if (code === 'EVENT50') {
    couponDiscount = 0.50;
    msg.textContent = '✅ 10% off applied!'; // BUG: says 10% but calculates 50%
    msg.style.color = '#2e7d32';
    recalcWithCoupon();
  } else {
    couponDiscount = 0;
    msg.textContent = 'Invalid coupon code';
    msg.style.color = '#e53935';
  }
}

function recalcWithCoupon() {
  const ticketType = document.querySelector('input[name="ticketType"]:checked')?.value;
  const num = parseInt(document.getElementById('numTickets').value) || 1;
  const price = TICKET_PRICES[ticketType] || 0;
  const total = price * num * (1 - couponDiscount);
  document.getElementById('totalAmount').value = '₹' + total;
}

document.getElementById('numTickets').addEventListener('input', calcAmount);

document.getElementById('eventForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  // BUG #7: max 10 tickets not enforced
  const numTickets = parseInt(document.getElementById('numTickets').value);

  // BUG #12: termsAccepted not validated
  // BUG #10: newsletter always sends true regardless of checkbox state
  const newsletter = true; // BUG: should be document.getElementById('newsletter').checked

  const payload = {
    eventName: document.getElementById('eventName').value,
    eventDate: document.getElementById('eventDate').value,
    ticketType: document.querySelector('input[name="ticketType"]:checked')?.value || '',
    numTickets,
    attendeeName: document.getElementById('attendeeName').value,
    email: document.getElementById('attendeeEmail').value,
    phone: document.getElementById('attendeePhone').value,
    company: document.getElementById('company').value,
    jobTitle: document.getElementById('jobTitle').value,
    dietary: document.getElementById('dietary').value,
    tshirtSize: document.getElementById('tshirtSize').value,
    totalAmount: document.getElementById('totalAmount').value,
    payMethod: document.querySelector('input[name="payMethod"]:checked')?.value || '',
    // BUG #13: card number always included even for UPI/Wallet
    cardNumber: document.getElementById('cardNumber').value,
    newsletter, // BUG #10: always true
    termsAccepted: document.getElementById('termsAccepted').checked,
    coupon: document.getElementById('couponCode').value,
  };

  // BUG #11: API ignores coupon — charges full price regardless
  try {
    const res = await fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    // BUG #9: success toast always shows regardless of response
    showToast('Registration Successful!', 'success');
  } catch {
    showToast('Registration Successful!', 'success'); // BUG: shows success even on catch
  }

  // BUG #14: localStorage overwrites previous registration (setItem not saveToStorage)
  localStorage.setItem('eventRegistrations', JSON.stringify(payload));
  this.reset();
  couponDiscount = 0;
  loadRecords();
});

function loadRecords() {
  const list = document.getElementById('recordList');
  let data = localStorage.getItem('eventRegistrations');
  let records = [];
  try {
    const parsed = JSON.parse(data || 'null');
    records = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
  } catch { records = []; }
  if (!records.length) { list.innerHTML = '<p class="no-records">No registrations yet.</p>'; return; }
  list.innerHTML = records.map(r => `
    <div class="record-card">
      <strong>${r.attendeeName}</strong> — ${r.eventName}<br>
      🎫 ${r.ticketType} × ${r.numTickets} | 💰 ${r.totalAmount}<br>
      📅 ${r.eventDate}
    </div>`).join('');
}

loadRecords();
