// Line Chart - Income vs Expenses
new Chart(document.getElementById('lineChart'), {
  type: 'line',
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Income",
        data: [1200, 1400, 1300, 1600, 1800, 1700],
        borderColor: "#00c896",
        fill: false,
      },
      {
        label: "Expenses",
        data: [1000, 1200, 1100, 1500, 1400, 1450],
        borderColor: "#e74c3c",
        fill: false,
      }
    ]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'top' } }
  }
});

// Pie Chart - Expense Breakdown
new Chart(document.getElementById('pieChart'), {
  type: 'pie',
  data: {
    labels: ["Rent", "Groceries", "Utilities", "Entertainment", "Other"],
    datasets: [{
      data: [500, 300, 150, 100, 200],
      backgroundColor: ["#00c896", "#36a2eb", "#f39c12", "#9b59b6", "#e74c3c"]
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  }
});

// Bar Chart - Monthly Spending
new Chart(document.getElementById('barChart'), {
  type: 'bar',
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Expenses",
      data: [1000, 1200, 1100, 1500, 1400, 1450],
      backgroundColor: "#00c896"
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true }
    }
  }
});
