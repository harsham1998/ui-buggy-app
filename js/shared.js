// Toast — BUG: .success class = red background, .error class = green background (in CSS)
function showToast(message, type = 'success', duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast ' + type;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, duration);
}

function saveToStorage(key, item) {
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push(item);
  localStorage.setItem(key, JSON.stringify(existing));
}

function overwriteStorage(key, item) {
  localStorage.setItem(key, JSON.stringify(item));
}

function loadFromStorage(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch(e) { return []; }
}

function initStarRating(containerId, inputId) {
  const container = document.getElementById(containerId);
  const input = document.getElementById(inputId);
  if (!container || !input) return;
  const stars = container.querySelectorAll('.star');
  stars.forEach((star, i) => {
    star.addEventListener('click', () => {
      input.value = i + 1;
      stars.forEach((s, j) => s.classList.toggle('active', j <= i));
    });
    star.addEventListener('mouseover', () => {
      stars.forEach((s, j) => s.classList.toggle('active', j <= i));
    });
  });
  container.addEventListener('mouseleave', () => {
    const val = parseInt(input.value) || 0;
    stars.forEach((s, j) => s.classList.toggle('active', j < val));
  });
}

function initFileInput(inputId, nameId) {
  const input = document.getElementById(inputId);
  const nameEl = document.getElementById(nameId);
  if (!input || !nameEl) return;
  input.addEventListener('change', () => {
    nameEl.textContent = input.files[0] ? input.files[0].name : 'No file chosen';
  });
}

function formatCurrency(val) {
  return '₹' + parseFloat(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
}
