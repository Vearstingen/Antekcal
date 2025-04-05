let list = [];
let totalCalories = 0;
let totalProtein = 0;
let localProducts = [];
let selectedProduct = null;

function convert(amount, unit) {
  const factors = { g: 1, ml: 1, dl: 100, st: 100 };
  return amount * (factors[unit] || 1);
}

function loadProducts() {
  fetch("products.json")
    .then(res => res.json())
    .then(data => localProducts = data)
    .catch(() => {
      document.getElementById('feedback').textContent = 'Kunde inte ladda lokala produkter.';
    });
}

function updateDisplay() {
  const listDiv = document.getElementById('list');
  listDiv.innerHTML = '';
  list.forEach((item, index) => {
    const p = document.createElement('p');
    p.innerHTML = `${item.name}: ${item.kcal.toFixed(0)} kcal, ${item.protein.toFixed(1)} g protein`;
    const btn = document.createElement('button');
    btn.className = 'remove-btn';
    btn.textContent = 'Ta bort';
    btn.onclick = () => {
      totalCalories -= item.kcal;
      totalProtein -= item.protein;
      list.splice(index, 1);
      saveCurrentDay();
      updateDisplay();
    };
    p.appendChild(btn);
    listDiv.appendChild(p);
  });
  document.getElementById('summary').innerHTML = `<strong>Totalt:</strong> ${totalCalories.toFixed(0)} kcal, ${totalProtein.toFixed(1)} g protein`;
}

function saveCurrentDay() {
  localStorage.setItem('currentList', JSON.stringify(list));
  localStorage.setItem('currentCalories', totalCalories);
  localStorage.setItem('currentProtein', totalProtein);
}

function loadCurrentDay() {
  const savedList = localStorage.getItem('currentList');
  const savedCalories = localStorage.getItem('currentCalories');
  const savedProtein = localStorage.getItem('currentProtein');
  if (savedList) list = JSON.parse(savedList);
  if (savedCalories) totalCalories = parseFloat(savedCalories);
  if (savedProtein) totalProtein = parseFloat(savedProtein);
  updateDisplay();
}

function setupAutocomplete() {
  const input = document.getElementById('food');
  const box = document.getElementById('suggestions');
  const feedback = document.getElementById('feedback');

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase();
    box.innerHTML = '';
    feedback.textContent = '';
    selectedProduct = null;
    if (query.length < 2) return;

    const matches = localProducts.filter(p => p.name.toLowerCase().includes(query));
    if (matches.length === 0) {
      feedback.textContent = 'Inga träffar i lokal lista.';
      return;
    }

    matches.slice(0, 10).forEach(p => {
      const div = document.createElement('div');
      div.textContent = p.name;
      div.onclick = () => {
        input.value = p.name;
        selectedProduct = p;
        box.innerHTML = '';
        feedback.textContent = '';
      };
      box.appendChild(div);
    });
  });
}

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('amount').value);
  const unit = document.getElementById('unit').value;
  const grams = convert(amount, unit);

  if (!selectedProduct) {
    alert("Välj ett förslag från listan!");
    return;
  }

  const kcal = (selectedProduct.kcal / 100) * grams;
  const protein = (selectedProduct.protein / 100) * grams;
  list.push({ name: selectedProduct.name, kcal, protein });

  totalCalories += kcal;
  totalProtein += protein;
  saveCurrentDay();
  updateDisplay();
  document.getElementById('form').reset();
  selectedProduct = null;
});

document.getElementById('save').addEventListener('click', () => {
  const today = new Date().toISOString().split('T')[0];
  let data = JSON.parse(localStorage.getItem('days') || '{}');
  data[today] = { kcal: totalCalories, protein: totalProtein };
  localStorage.setItem('days', JSON.stringify(data));
  localStorage.removeItem('currentList');
  localStorage.removeItem('currentCalories');
  localStorage.removeItem('currentProtein');
  renderHistory();
});

document.getElementById('reset').addEventListener('click', () => {
  list = [];
  totalCalories = 0;
  totalProtein = 0;
  saveCurrentDay();
  updateDisplay();
});

function renderHistory() {
  const history = document.getElementById('history');
  history.innerHTML = '';
  const data = JSON.parse(localStorage.getItem('days') || '{}');
  for (let [date, entry] of Object.entries(data)) {
    const li = document.createElement('li');
    li.textContent = `${date}: ${entry.kcal.toFixed(0)} kcal, ${entry.protein.toFixed(1)} g protein`;
    li.onclick = () => {
      if (confirm('Ta bort denna dag?')) {
        delete data[date];
        localStorage.setItem('days', JSON.stringify(data));
        renderHistory();
      }
    };
    history.appendChild(li);
  }
  const week = document.getElementById('week');
  let wkcal = 0, wprot = 0;
  Object.values(data).forEach(d => {
    wkcal += d.kcal;
    wprot += d.protein;
  });
  week.innerHTML = `Totalt denna vecka: ${wkcal.toFixed(0)} kcal, ${wprot.toFixed(1)} g protein`;
}

window.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  setupAutocomplete();
  loadCurrentDay();
  renderHistory();
});
