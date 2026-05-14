const MAX_CAPACITY = 8;

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { guestName, resDate, partySize } = req.body || {};

  if (!guestName || !resDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // BUG: returns 200 even when partySize > MAX_CAPACITY (no server-side capacity check)
  return res.status(200).json({
    reservationId: 'RES-' + Date.now(),
    message: 'Reservation confirmed',
    partySize
  });
};
