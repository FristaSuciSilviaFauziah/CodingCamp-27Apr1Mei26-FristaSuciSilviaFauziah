const form = document.getElementById("form");
const list = document.getElementById("list");
const total = document.getElementById("total");
const chartCanvas = document.getElementById("chart");

let transactions = JSON.parse(localStorage.getItem("data")) || [];
let chart; // biar chart tidak numpuk

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;

  if (!name || !amount) {
    alert("Isi semua field!");
    return;
  }

  const data = {
    id: Date.now(),
    name: name,
    amount: Number(amount),
    category: category
  };

  transactions.push(data);
  saveData();
  render();

  // reset form
  form.reset();
});

function saveData() {
  localStorage.setItem("data", JSON.stringify(transactions));
}

function render() {
  list.innerHTML = "";
  let totalAmount = 0;

  transactions.forEach(item => {
    totalAmount += item.amount;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - Rp ${item.amount} (${item.category})
      <button onclick="deleteItem(${item.id})">Hapus</button>
    `;
    list.appendChild(li);
  });

  total.innerText = totalAmount;

  updateChart();
}

function deleteItem(id) {
  transactions = transactions.filter(item => item.id !== id);
  saveData();
  render();
}

function updateChart() {
  const data = {
    Food: 0,
    Transport: 0,
    Fun: 0
  };

  transactions.forEach(item => {
    data[item.category] += item.amount;
  });

  // hapus chart lama biar tidak numpuk
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(chartCanvas, {
    type: "pie",
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: "Pengeluaran",
        data: Object.values(data)
      }]
    }
  });
}

// pertama kali load
render();