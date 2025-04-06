
let products = [];
fetch('products.json')
  .then(res => res.json())
  .then(data => products = data);

document.getElementById('food').addEventListener('input', e => {
  const val = e.target.value.toLowerCase();
  const sug = products.filter(p => p.name.toLowerCase().startsWith(val)).slice(0, 10);
  const sugBox = document.getElementById('suggestions');
  sugBox.innerHTML = '';
  sug.forEach(p => {
    const div = document.createElement('div');
    div.textContent = p.name;
    div.onclick = () => {
      document.getElementById('food').value = p.name;
      sugBox.innerHTML = '';
    };
    sugBox.appendChild(div);
  });
});

document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('amount').value);
  const unit = document.getElementById('unit').value;
  const name = document.getElementById('food').value;
  const product = products.find(p => p.name === name);
  if (!product) return alert('Produkt hittas ej');
  let grams = amount;
  if (unit === 'st' && product.weightPerUnit) grams = amount * product.weightPerUnit;
  const kcal = grams * product.kcal / 100;
  const protein = grams * product.protein / 100;
  const list = document.getElementById('list');
  const div = document.createElement('div');
  div.textContent = `${name}: ${kcal.toFixed(1)} kcal, ${protein.toFixed(1)} g protein`;
  list.appendChild(div);
});
