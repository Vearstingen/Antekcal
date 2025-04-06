
let products = [];
let selectedFood = null;
const amountInput = document.getElementById('amount');
const unitSelect = document.getElementById('unit');
const foodInput = document.getElementById('food');
const suggestionsDiv = document.getElementById('suggestions');
const listDiv = document.getElementById('list');
const summaryDiv = document.getElementById('summary');
const historyList = document.getElementById('history');
const weekDiv = document.getElementById('week');
const autoSwitch = document.getElementById('autoSwitch');

fetch('products.json')
  .then(res => res.json())
  .then(data => products = data);

function showSuggestions(text) {
  suggestionsDiv.innerHTML = '';
  const match = products.filter(p => p.name.toLowerCase().includes(text.toLowerCase()));
  match.forEach(p => {
    const div = document.createElement('div');
    div.textContent = p.name;
    div.onclick = () => {
      foodInput.value = p.name;
      selectedFood = p;
      suggestionsDiv.innerHTML = '';
      if (p.weightPerUnit && autoSwitch.checked) {
        unitSelect.value = 'st';
      }
    };
    suggestionsDiv.appendChild(div);
  });
}

foodInput.addEventListener('input', () => showSuggestions(foodInput.value));

document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const amount = parseFloat(amountInput.value);
  const unit = unitSelect.value;
  const name = foodInput.value;
  const food = products.find(p => p.name === name) || selectedFood;
  if (!food) return;

  let grams = amount;
  if (unit === 'st' && food.weightPerUnit) {
    grams = amount * food.weightPerUnit;
  }
  const kcal = grams * food.kcal / 100;
  const protein = grams * food.protein / 100;

  const entry = { name, kcal, protein };
  const list = JSON.parse(localStorage.getItem('currentDay') || '[]');
  list.push(entry);
  localStorage.setItem('currentDay', JSON.stringify(list));
  renderList();
});

function renderList() {
  const list = JSON.parse(localStorage.getItem('currentDay') || '[]');
  listDiv.innerHTML = '';
  let totalKcal = 0;
  let totalProtein = 0;
  list.forEach((item, i) => {
    totalKcal += item.kcal;
    totalProtein += item.protein;
    const div = document.createElement('div');
    div.textContent = `${item.name}: ${item.kcal.toFixed(1)} kcal, ${item.protein.toFixed(1)} g protein`;
    listDiv.appendChild(div);
  });
  summaryDiv.innerHTML = `<strong>Totalt:</strong> ${totalKcal.toFixed(1)} kcal, ${totalProtein.toFixed(1)} g protein`;
}

document.getElementById('save').onclick = () => {
  const list = JSON.parse(localStorage.getItem('currentDay') || '[]');
  if (!list.length) return;
  const date = new Date().toISOString().split('T')[0];
  localStorage.setItem('day_' + date, JSON.stringify(list));
  localStorage.removeItem('currentDay');
  renderList();
  renderHistory();
};

document.getElementById('reset').onclick = () => {
  localStorage.removeItem('currentDay');
  renderList();
};

function renderHistory() {
  historyList.innerHTML = '';
  const keys = Object.keys(localStorage).filter(k => k.startsWith('day_'));
  keys.forEach(key => {
    const li = document.createElement('li');
    li.textContent = key.replace('day_', '');
    li.onclick = () => {
      localStorage.setItem('currentDay', localStorage.getItem(key));
      renderList();
    };
    historyList.appendChild(li);
  });
}

renderList();
renderHistory();
