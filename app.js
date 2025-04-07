const searchInput = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
const entriesDiv = document.getElementById("entries");
const customDatabase = {};

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  if (query.length < 2) return suggestions.innerHTML = "";
  fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=50`)
    .then(res => res.json())
    .then(data => {
      suggestions.innerHTML = "";
      data.products.forEach(p => {
        const lang = p.lang || '';
        if (lang !== 'sv' && !p.countries_tags?.includes('sv')) return;
        const name = p.product_name || "Okänd";
        if (!p.nutriments) return;
        const kcal = p.nutriments["energy-kcal_100g"] || 0;
        const protein = p.nutriments["proteins_100g"] || 0;
        const fat = p.nutriments["fat_100g"] || 0;
        const div = document.createElement("div");
        div.textContent = name;
        div.onclick = () => {
          searchInput.value = name;
          searchInput.dataset.kcal = kcal;
          searchInput.dataset.protein = protein;
          searchInput.dataset.fat = fat;
          suggestions.innerHTML = "";
        };
        suggestions.appendChild(div);
      });
    });
});

document.getElementById("product-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = searchInput.value;
  const amount = parseFloat(document.getElementById("amount").value);
  const unit = document.getElementById("unit").value;
  const kcal = parseFloat(searchInput.dataset.kcal || 0);
  const protein = parseFloat(searchInput.dataset.protein || 0);
  const fat = parseFloat(searchInput.dataset.fat || 0);
  let factor = unit === "g" ? amount / 100 : 1;
  const entry = document.createElement("div");
  entry.className = "entry";
  entry.innerHTML = `<div>${name}<br>${(kcal*factor).toFixed(1)} kcal, ${(protein*factor).toFixed(1)} g protein, ${(fat*factor).toFixed(1)} g fett</div><button onclick="this.parentElement.remove()">Ta bort</button>`;
  entriesDiv.appendChild(entry);
});

document.getElementById("custom-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("customName").value.toLowerCase();
  const kcal = parseFloat(document.getElementById("customKcal").value);
  const protein = parseFloat(document.getElementById("customProtein").value);
  const fat = parseFloat(document.getElementById("customFat").value);
  const weight = parseFloat(document.getElementById("customWeight").value);
  customDatabase[name] = { kcal, protein, fat, weight };
  alert(`Produkten ${name} har sparats.`);
});

function saveGoals() {
  localStorage.setItem("goalKcal", document.getElementById("goalKcal").value);
  localStorage.setItem("goalProtein", document.getElementById("goalProtein").value);
  localStorage.setItem("goalFat", document.getElementById("goalFat").value);
  alert("Mål sparade!");
}

function clearGoals() {
  localStorage.removeItem("goalKcal");
  localStorage.removeItem("goalProtein");
  localStorage.removeItem("goalFat");
  document.getElementById("goalKcal").value = '';
  document.getElementById("goalProtein").value = '';
  document.getElementById("goalFat").value = '';
  alert("Mål borttagna.");
}