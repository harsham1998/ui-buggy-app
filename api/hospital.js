module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fullName, dob, bloodGroup, department, doctor, appointmentDate } = req.body || {};

  if (!fullName || !dob || !bloodGroup || !department || !doctor || !appointmentDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // BUG: returns 500 on valid submission (should be 201)
  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred while registering the patient.'
  });
};
