 const ctxPie = document.getElementById('pieChart').getContext('2d');
    const ctxBar = document.getElementById('barChart').getContext('2d');

    new Chart(ctxPie, {
      type: 'pie',
      data: {
        labels: ['Rent', 'Groceries', 'Utilities', 'Entertainment'],
        datasets: [{
          data: [500, 300, 150, 200],
          backgroundColor: ['#00c896', '#36a2eb', '#f39c12', '#e74c3c']
        }]
      }
    });

    new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{
          label: 'Expenses',
          data: [1200, 1350, 1100, 1600],
          backgroundColor: '#00c896'
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    function getSelectedSections() {
      const checkboxes = document.querySelectorAll('.report-option');
      const selected = [];
      checkboxes.forEach(box => {
        if (box.checked) selected.push(box.value);
      });
      return selected;
    }

    document.getElementById('generateBtn').addEventListener('click', () => {
      const selected = getSelectedSections();
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      let y = 20;

      doc.setFontSize(18);
      doc.text("Finance Report", 20, y);
      y += 10;

      if (selected.includes('summary')) {
        doc.setFontSize(14);
        doc.text("Executive Summary:", 20, y += 15);
        doc.setFontSize(12);
        doc.text("Income: $X, Expenses: $Y, Savings: $Z", 20, y += 10);
      }
      if (selected.includes('income')) {
        doc.setFontSize(14);
        doc.text("Income Overview:", 20, y += 15);
        doc.setFontSize(12);
        doc.text("- Salary: $1000\n- Freelancing: $500", 20, y += 10);
      }
      if (selected.includes('spending')) {
        doc.setFontSize(14);
        doc.text("Spending Patterns:", 20, y += 15);
        doc.setFontSize(12);
        doc.text("Rent, Groceries, etc.", 20, y += 10);
      }
      if (selected.includes('trends')) {
        doc.setFontSize(14);
        doc.text("Monthly Trends:", 20, y += 15);
        doc.setFontSize(12);
        doc.text("Spending by month (see analytics)", 20, y += 10);
      }

      doc.save("finance_report.pdf");
    });