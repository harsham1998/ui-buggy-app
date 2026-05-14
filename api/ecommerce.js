module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { custName, items } = req.body || {};

  if (!custName) {
    return res.status(400).json({ error: 'Customer name is required' });
  }

  // BUG: returns 201 even when cart is empty (should return 400 for empty cart)
  return res.status(201).json({
    orderId: 'ORD-' + Date.now(),
    message: 'Order placed successfully',
    itemCount: Array.isArray(items) ? items.length : 0
  });
};
