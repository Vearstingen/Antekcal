
let products = [];
let currentList = [];
let customProducts = JSON.parse(localStorage.getItem("customProducts") || "[]");
let selectedProduct = null;

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
  const food = document.getElementById("food").value.toLowerCase();
  const match = products.find(p => p.name.toLowerCase() === food);
  if (!match) {
    alert("Kunde inte hitta produkt.");
    return;
  }
  currentList.push({
    name: match.name,
    kcal: Math.round((match.kcal / 100) * amount),
    protein: +(match.protein / 100 * amount).toFixed(1)
  });
  renderList();
  document.getElementById("form").reset();
});

document.getElementById("customForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("customName").value;
  const kcal = parseFloat(document.getElementById("customKcal").value);
  const protein = parseFloat(document.getElementById("customProtein").value);
  const newProd = { name, kcal, protein };
  customProducts.push(newProd);
  localStorage.setItem("customProducts", JSON.stringify(customProducts));
  products.push(newProd);
  alert("Produkten sparad!");
  document.getElementById("customForm").reset();
});

loadProducts();
