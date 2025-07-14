const modal = document.getElementById("transactionModal");
  const openBtn = document.getElementById("addBtn");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("transactionForm");
  const amountInput = document.getElementById("amount");
  const quickButtons = document.querySelectorAll(".quick-amounts button");
  const table = document.getElementById("transactionTable");

  let transactions = [];

  openBtn.onclick = () => modal.style.display = "flex";
  closeBtn.onclick = () => modal.style.display = "none";

  quickButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const value = parseFloat(btn.dataset.amount);
      amountInput.value = parseFloat(amountInput.value || 0) + value;
      quickButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
document.getElementById("monthSelect").addEventListener("change", () => {
  updateSummary();
});

  form.onsubmit = e => {
    e.preventDefault();
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    if (!date || !description || !category || isNaN(amount) || !type) {
      return alert("Please fill all fields.");
    }

    transactions.push({ date, description, category, amount, type });
    modal.style.display = "none";
    form.reset();
    quickButtons.forEach(b => b.classList.remove("selected"));

    updateTable();
    updateSummary();
    updateChart();
  };

  const updateTable = () => {
    table.innerHTML = "";
    transactions.filter(tx => tx.type === 'income').forEach(tx => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${tx.date}</td>
        <td>${tx.description}</td>
        <td>${tx.category}</td>
        <td class="plus">
          +${tx.amount.toFixed(2)}
        </td>
        <td>
          <i class="fas fa-edit"></i>
          <i class="fas fa-trash-alt"></i>
        </td>
      `;
      table.appendChild(tr);
    });
  };

  const updateSummary = () => {
  let income = 0;

  const selected = document.getElementById("monthSelect").value;
  const selectedDate = selected ? new Date(selected + "-01") : new Date();
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  transactions.forEach(tx => {
    const txDate = new Date(tx.date);
    if (txDate.getMonth() === selectedMonth && txDate.getFullYear() === selectedYear) {
      if (tx.type === "income") income += tx.amount;
    }
  });

  document.getElementById("incomeAmount").textContent = `$${income.toFixed(2)}`;
};
  const updateChart = () => {
  const incomeMap = {};
  const expenseMap = {};

  transactions.forEach(tx => {
    const dateObj = new Date(tx.date);
    const key = `${dateObj.toLocaleString('default', { month: 'short' })} ${dateObj.getFullYear()}`;

    if (!incomeMap[key]) {
      incomeMap[key] = 0;
      expenseMap[key] = 0;
    }

    if (tx.type === "income") incomeMap[key] += tx.amount;
    else expenseMap[key] += tx.amount;
  });

  const allLabels = Array.from(new Set([...Object.keys(incomeMap), ...Object.keys(expenseMap)]));
  allLabels.sort((a, b) => new Date(a) - new Date(b)); // ensures time order

  chart.data.labels = allLabels;
  chart.data.datasets[0].data = allLabels.map(label => incomeMap[label] || 0);
  chart.update();
};


  const ctx = document.getElementById("IncomeChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
      datasets: [
        {
          label: "Income",
          data: [],
          borderColor: "#00c896",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Income vs Expenses' }
      }
    }
  });

