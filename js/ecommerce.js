const PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 2499, icon: '🎧' },
  { id: 2, name: 'Running Shoes', category: 'Sports', price: 1999, icon: '👟' },
  { id: 3, name: 'Python Cookbook', category: 'Books', price: 599, icon: '📘' },
  { id: 4, name: 'Cotton T-Shirt', category: 'Clothing', price: 499, icon: '👕' },
  { id: 5, name: 'Desk Lamp', category: 'Home', price: 899, icon: '💡' },
  { id: 6, name: 'Bluetooth Speaker', category: 'Electronics', price: 1799, icon: '🔊' },
  { id: 7, name: 'Yoga Mat', category: 'Sports', price: 799, icon: '🧘' },
  { id: 8, name: 'Design Thinking', category: 'Books', price: 449, icon: '📗' },
  { id: 9, name: 'Denim Jeans', category: 'Clothing', price: 1299, icon: '👖' },
  { id: 10, name: 'Coffee Maker', category: 'Home', price: 2999, icon: '☕' },
];

let cart = [];
let discountPct = 0;

function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  if (!list.length) { grid.innerHTML = '<p class="no-records">No products found.</p>'; return; }
  grid.innerHTML = list.map(p => `
    <div class="product-item">
      <div class="p-icon">${p.icon}</div>
      <div class="p-name">${p.name}</div>
      <div class="p-price">₹${p.price}</div>
      <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
    </div>`).join('');
}

// BUG #5: search is case-sensitive (no .toLowerCase())
function searchProducts() {
  const q = document.getElementById('productSearch').value;
  renderProducts(PRODUCTS.filter(p => p.name.includes(q)));
}

// BUG #14: filterByCategory resets search text input
function filterByCategory() {
  document.getElementById('productSearch').value = ''; // BUG: clears search
  const cat = document.getElementById('categoryFilter').value;
  renderProducts(cat ? PRODUCTS.filter(p => p.category === cat) : PRODUCTS);
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty += 1; }
  else { cart.push({ ...product, qty: 1 }); }
  renderCart();
  updateCartBadge();
}

// BUG #1 (badge): cart count always shows 0 — badge never updates correctly
function updateCartBadge() {
  document.getElementById('cartBadge').textContent = 0; // BUG: hardcoded 0
}

function renderCart() {
  const tbody = document.getElementById('cartBody');
  if (!cart.length) {
    tbody.innerHTML = '<tr id="emptyCartRow"><td colspan="5" style="text-align:center;color:#999;padding:16px;">Cart is empty</td></tr>';
    updateTotals();
    return;
  }
  tbody.innerHTML = cart.map(item => `
    <tr>
      <td>${item.icon} ${item.name}</td>
      <td>₹${item.price}</td>
      <td>
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span style="margin:0 8px;">${item.qty}</span>
        <!-- BUG #6: increase button adds 2 instead of 1 -->
        <button class="qty-btn" onclick="changeQty(${item.id}, 2)">+</button>
      </td>
      <td>₹${item.price * item.qty}</td>
      <td><button class="remove-btn" onclick="removeItem(${item.id})">🗑</button></td>
    </tr>`).join('');
  updateTotals();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
  // BUG #12: totals not recalculated after remove (updateTotals not called here with fresh cart)
}

function updateTotals() {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  // BUG #7: tax is calculated at 18% but label says "5% GST"
  const tax = subtotal * 0.18;
  const discount = subtotal * discountPct;
  const grand = subtotal + tax - discount;
  document.getElementById('subtotal').textContent = '₹' + subtotal.toFixed(2);
  document.getElementById('taxAmt').textContent = '₹' + tax.toFixed(2);
  document.getElementById('discountAmt').textContent = '-₹' + discount.toFixed(2);
  document.getElementById('grandTotal').textContent = '₹' + grand.toFixed(2);
}

// BUG #8: DISC20 applies 10% discount, not 20%
function applyCoupon() {
  const code = document.getElementById('couponCode').value.trim().toUpperCase();
  if (code === 'DISC20') {
    discountPct = 0.10; // BUG: should be 0.20
    showToast('Coupon applied: 10% discount', 'success');
  } else {
    discountPct = 0;
    showToast('Invalid coupon code', 'error');
  }
  updateTotals();
}

// BUG #9: card field stays visible when COD or UPI is selected
function toggleCard() {
  const method = document.querySelector('input[name="payment"]:checked')?.value;
  // BUG: card field always shown — no hiding logic
}

async function placeOrder() {
  const custName = document.getElementById('custName').value;
  if (!custName) { showToast('Please fill customer details.', 'error'); return; }

  const payment = document.querySelector('input[name="payment"]:checked')?.value;
  if (!payment) { showToast('Select payment method.', 'error'); return; }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const payload = {
    custName,
    email: document.getElementById('custEmail').value,
    address: document.getElementById('shippingAddr').value,
    city: document.getElementById('city').value,
    pincode: document.getElementById('pincode').value,
    items: cart,
    payment,
    deliveryDate: document.getElementById('deliveryDate').value,
    total: document.getElementById('grandTotal').textContent,
    notes: document.getElementById('orderNotes').value
  };

  // BUG #13: saves to "orders" but history reads "orderHistory"
  saveToStorage('orders', { ...payload, date: new Date().toLocaleDateString() });

  try {
    const res = await fetch('/api/ecommerce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    // BUG #10: API returns 201 even for empty cart — frontend doesn't catch this
    showToast('Order placed successfully!', 'success');
  } catch {
    showToast('Order failed. Try again.', 'error');
  }

  cart = [];
  discountPct = 0;
  renderCart();
  loadRecords();
}

function loadRecords() {
  const list = document.getElementById('recordList');
  // BUG #13: reads "orderHistory" but data saved under "orders"
  const records = loadFromStorage('orderHistory');
  if (!records.length) { list.innerHTML = '<p class="no-records">No orders yet.</p>'; return; }
  list.innerHTML = records.map(r => `
    <div class="record-card">
      <strong>${r.custName}</strong> — ${r.date}<br>
      💳 ${r.payment} | Total: ${r.total}
    </div>`).join('');
}

renderProducts(PRODUCTS);
loadRecords();
