function updatePropAge() {
  const val = document.getElementById('propAge').value;
  // BUG #10: sends string "X years" instead of integer X
  document.getElementById('propAgeVal').textContent = val + ' years';
}

// BUG #5: price per sqft = price ÷ bedrooms (should be price ÷ area)
function calcPricePerSqft() {
  const price = parseFloat(document.getElementById('price').value) || 0;
  const bedrooms = parseInt(document.getElementById('bedrooms').value) || 1;
  // BUG: divides by bedrooms not area
  const perSqft = price > 0 ? (price / bedrooms).toFixed(2) : '';
  document.getElementById('pricePerSqft').value = perSqft ? '₹' + perSqft : '';
}

document.getElementById('realestateForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const amenities = [...document.querySelectorAll('input[name="amenity"]:checked')].map(c => c.value);
  const files = document.getElementById('propPhotos').files;
  // BUG #9: only first photo filename is saved
  const photoName = files.length > 0 ? files[0].name : '';

  const propAge = document.getElementById('propAge').value;
  const listingType = document.querySelector('input[name="listingType"]:checked')?.value || '';
  const price = document.getElementById('price').value;

  const payload = {
    listingType,
    propertyType: document.getElementById('propertyType').value,
    title: document.getElementById('propTitle').value,
    description: document.getElementById('propDesc').value,
    address: document.getElementById('propAddress').value,
    city: document.getElementById('propCity').value,
    area: document.getElementById('area').value,
    bedrooms: document.getElementById('bedrooms').value,
    bathrooms: document.getElementById('bathrooms').value,
    furnished: document.getElementById('furnished').value,
    amenities,
    price,
    availableFrom: document.getElementById('availableFrom').value,
    // BUG #10: sends string "X years" not integer
    propertyAge: propAge + ' years',
    ownerName: document.getElementById('ownerName').value,
    ownerContact: document.getElementById('ownerContact').value,
    featured: document.getElementById('featuredListing').checked,
    photo: photoName,
  };

  saveToStorage('listings', payload);
  updateSearchData();

  try {
    const res = await fetch('/api/realestate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    // BUG #12: API returns 200 with empty {} body
    if (res.ok) {
      showToast('Property listed successfully!', 'success');
    } else {
      showToast('Listing failed.', 'error');
    }
  } catch {
    showToast('Listing failed.', 'error');
  }

  this.reset();
  loadRecords();
  document.getElementById('pricePerSqft').value = '';
  document.getElementById('propAgeVal').textContent = '5 years';
});

// BUG #7: search only matches title — city and type filters have no effect
function searchListings() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  // city and type filters intentionally ignored
  const all = loadFromStorage('listings');
  const results = all.filter(l => l.title.toLowerCase().includes(query));
  renderSearchResults(results);
}

function renderSearchResults(results) {
  const countEl = document.getElementById('searchCount');
  const resultsEl = document.getElementById('searchResults');
  // BUG #14: count shows results.length + 1 (off by one)
  countEl.textContent = results.length ? `Found ${results.length + 1} properties` : 'No properties found';
  if (!results.length) { resultsEl.innerHTML = ''; return; }
  resultsEl.innerHTML = results.map(r => `
    <div class="record-card">
      <strong>${r.title}</strong> — ${r.listingType}<br>
      📍 ${r.city} | ${r.propertyType} | ${r.bedrooms} BHK<br>
      💰 ₹${r.price} | Available: ${r.availableFrom}
    </div>`).join('');
}

let searchData = [];
function updateSearchData() { searchData = loadFromStorage('listings'); }

function loadRecords() {
  const list = document.getElementById('recordList');
  const records = loadFromStorage('listings');
  if (!records.length) { list.innerHTML = '<p class="no-records">No listings yet.</p>'; return; }
  // BUG #13: Rent price labeled as "per month" but stored value is annual
  list.innerHTML = records.map(r => `
    <div class="record-card">
      <strong>${r.title}</strong> [${r.listingType}]<br>
      📍 ${r.city} | ${r.area} sq ft | ${r.bedrooms} BHK<br>
      💰 ${r.listingType === 'Rent' ? '₹' + r.price + '/month' : '₹' + r.price}
    </div>`).join('');
}

loadRecords();
