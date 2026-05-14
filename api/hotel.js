module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { guestName, checkin, checkout, roomType } = req.body || {};

  if (!guestName || !checkin || !checkout || !roomType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // BUG: returns 200 with status: "error" body on valid booking (res.ok = true in frontend)
  return res.status(200).json({
    status: 'error',
    message: 'Booking could not be processed. Please contact support.'
  });
};
