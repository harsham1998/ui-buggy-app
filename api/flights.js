// BUG: file is named "flights.js" (plural) so Vercel routes it to /api/flights
// Frontend calls /api/flight (singular) which returns 404 Not Found
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { passengerName, from, to, departureDate } = req.body || {};

  if (!passengerName || !from || !to || !departureDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  return res.status(201).json({
    bookingRef: 'FLT-' + Date.now(),
    message: 'Flight booked successfully'
  });
};
