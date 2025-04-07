const products = [
    { name: "Ägg", kcal: 77, protein: 6, fat: 5 },
    { name: "Kvarg", kcal: 60, protein: 10, fat: 1 },
    { name: "Kycklingfilé", kcal: 110, protein: 23, fat: 2 },
    { name: "Banan", kcal: 89, protein: 1, fat: 0.3 },
    { name: "Havregryn", kcal: 370, protein: 13, fat: 7 }
];

let intake = [];

document.getElementById('search').addEventListener('input', function() {
    const val = this.value.toLowerCase();
    const suggestions = products.filter(p => p.name.toLowerCase().includes(val));
    const container = document.getElementById('suggestions');
    container.innerHTML = '';
    suggestions.forEach(p => {
        const div = document.createElement('div');
        div.textContent = p.name;
        div.onclick = () => {
            document.getElementById('search').value = p.name;
            container.innerHTML = '';
        };
        container.appendChild(div);
    });
});

function addProduct() {
    const amount = parseFloat(document.getElementById('amount').value);
    const unit = document.getElementById('unit').value;
    const name = document.getElementById('search').value;
    const product = products.find(p => p.name === name);
    if (!product || isNaN(amount)) return;

    const factor = unit === 'gram' ? amount / 100 : amount;
    const item = {
        name: product.name,
        kcal: product.kcal * factor,
        protein: product.protein * factor,
        fat: product.fat * factor
    };
    intake.push(item);
    updateDisplay();
}

function updateDisplay() {
    const list = document.getElementById('intakeList');
    list.innerHTML = '';
    let totalKcal = 0, totalProtein = 0, totalFat = 0;
    intake.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name}: ${item.kcal.toFixed(1)} kcal, ${item.protein.toFixed(1)} g protein, ${item.fat.toFixed(1)} g fett`;
        const btn = document.createElement('button');
        btn.textContent = "Ta bort";
        btn.onclick = () => {
            intake.splice(index, 1);
            updateDisplay();
        };
        li.appendChild(btn);
        list.appendChild(li);
        totalKcal += item.kcal;
        totalProtein += item.protein;
        totalFat += item.fat;
    });
    document.getElementById('totals').textContent = `Totalt: ${totalKcal.toFixed(0)} kcal, ${totalProtein.toFixed(1)} g protein, ${totalFat.toFixed(1)} g fett`;
}

function saveGoals() {
    localStorage.setItem('goalCalories', document.getElementById('goalCalories').value);
    localStorage.setItem('goalProtein', document.getElementById('goalProtein').value);
    localStorage.setItem('goalFat', document.getElementById('goalFat').value);
}

function clearGoals() {
    document.getElementById('goalCalories').value = '';
    document.getElementById('goalProtein').value = '';
    document.getElementById('goalFat').value = '';
    saveGoals();
}