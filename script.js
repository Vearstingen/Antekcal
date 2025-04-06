
let products = [];
let currentList = [];
let customProducts = JSON.parse(localStorage.getItem("customProducts") || "[]");

async function loadProducts() {
  const res = await fetch("products.json");
  const data = await res.json();
  products = [...data, ...customProducts];
}

function updateSummary() {
  const total = currentList.reduce((acc, item) => {
    acc.kcal += item.kcal;
    acc.protein += item.protein;
    return acc;
  }, { kcal: 0, protein: 0 });

  document.getElementById("summary").innerText =
    `Totalt: ${total.kcal} kcal, ${total.protein} g protein`;
}

function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";
  currentList.forEach((item, i) => {
    const div = document.createElement("div");
    div.innerText = `${item.name}: ${item.kcal} kcal, ${item.protein} g protein`;
    const btn = document.createElement("button");
    btn.innerText = "Ta bort";
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

document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById("amount").value);
  const unitEl = document.getElementById("unit");
  let unit = unitEl.value;
  const food = document.getElementById("food").value.toLowerCase();
  const autoSwitch = document.getElementById("autoSwitch").checked;

  const match = products.find(p => p.name.toLowerCase() === food);
  if (!match) {
    alert("Kunde inte hitta produkt.");
    return;
  }

  // Smart enhetshantering
  if (unit === "g" && match.weightPerUnit) {
    if (autoSwitch) {
      unit = "st";
      unitEl.value = "st";
    } else {
      const confirmSwitch = confirm(`${match.name} har vikt per styck (${match.weightPerUnit}g).
Vill du använda styck istället?`);
      if (confirmSwitch) {
        unit = "st";
        unitEl.value = "st";
      }
    }
  }

  let weight = amount;
  if (unit === "st") {
    if (!match.weightPerUnit) {
      alert("Ingen vikt per styck angiven för denna produkt.");
      return;
    }
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
  alert("Produkten sparad!");
  document.getElementById("customForm").reset();
});

loadProducts();
