module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { studentName, grade, parentEmail, payment } = req.body || {};

  if (!studentName || !grade || !parentEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (payment === 'Cheque') {
    // BUG would surface here: expects chequeNumber but frontend never sends it
    // However we return 500 regardless to implement Bug #11
  }

  // BUG: returns 500 on valid enrollment (should be 201)
  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'Failed to process enrollment. Please try again.'
  });
};
