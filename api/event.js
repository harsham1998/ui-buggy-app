const TICKET_PRICES = { General: 500, VIP: 1500, Student: 200 };

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { attendeeName, eventName, ticketType, numTickets, coupon } = req.body || {};

  if (!attendeeName || !eventName || !ticketType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const basePrice = TICKET_PRICES[ticketType] || 500;
  const qty = parseInt(numTickets) || 1;

  // BUG: coupon is completely ignored — always charges full price
  const total = basePrice * qty;

  return res.status(201).json({
    registrationId: 'EVT-' + Date.now(),
    message: 'Registration successful',
    total,
    // BUG: coupon discount not applied even if valid
  });
};
