
let products = [];
let customProducts = JSON.parse(localStorage.getItem("customProducts") || "[]");
let currentList = [];

async function loadProducts() {
  const res = await fetch("products.json");
  const data = await res.json();
  products = [...data, ...customProducts];
}
function updateSuggestions(value) {
  const matches = products.filter(p => p.name.toLowerCase().startsWith(value.toLowerCase())).slice(0, 10);
  const container = document.getElementById("suggestions");
  container.innerHTML = "";
  matches.forEach(m => {
    const div = document.createElement("div");
    div.textContent = m.name;
    div.onclick = () => {
      document.getElementById("food").value = m.name;
      container.innerHTML = "";
    };
    container.appendChild(div);
  });
}
function updateSummary() {
  const total = currentList.reduce((acc, item) => {
    acc.kcal += item.kcal;
    acc.protein += item.protein;
    return acc;
  }, { kcal: 0, protein: 0 });
  document.getElementById("summary").innerText = `Totalt: ${total.kcal} kcal, ${total.protein} g protein`;
}
function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";
  currentList.forEach((item, i) => {
    const div = document.createElement("div");
    div.textContent = `${item.name}: ${item.kcal} kcal, ${item.protein} g protein`;
    const btn = document.createElement("button");
    btn.textContent = "Ta bort";
    btn.onclick = () => {
      currentList.splice(i, 1);
      renderList();
      updateSummary();
    };
    div.appendChild(btn);
    list.appendChild(div);
  });
  updateSummary();
}
document.getElementById("food").addEventListener("input", e => {
  updateSuggestions(e.target.value);
});
document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById("amount").value);
  const unit = document.getElementById("unit").value;
  const name = document.getElementById("food").value.toLowerCase();
  const autoSwitch = document.getElementById("autoSwitch").checked;
  const match = products.find(p => p.name.toLowerCase() === name);
  if (!match) return alert("Produkt ej hittad.");
  let weight = amount;
  if (unit === "g" && match.weightPerUnit && autoSwitch) {
    weight = amount * match.weightPerUnit;
  }
  if (unit === "st") {
    if (!match.weightPerUnit) return alert("Ingen vikt/styck angiven.");
    weight = amount * match.weightPerUnit;
  }
  currentList.push({
    name: match.name,
    kcal: Math.round((match.kcal / 100) * weight),
    protein: +(match.protein / 100 * weight).toFixed(1)
  });
  renderList();
  document.getElementById("form").reset();
});
document.getElementById("customForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("customName").value;
  const kcal = parseFloat(document.getElementById("customKcal").value);
  const protein = parseFloat(document.getElementById("customProtein").value);
  const weightPerUnit = parseFloat(document.getElementById("customWeight").value) || null;
  const newProd = { name, kcal, protein };
  if (weightPerUnit) newProd.weightPerUnit = weightPerUnit;
  customProducts.push(newProd);
  localStorage.setItem("customProducts", JSON.stringify(customProducts));
  products.push(newProd);
  alert("Produkt sparad!");
  document.getElementById("customForm").reset();
});
loadProducts();
