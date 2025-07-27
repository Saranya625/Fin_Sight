import { useState, useEffect } from 'react';
import { LineChart, PieChart, BarChart } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Pie, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const Analytics = ({ transactions }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    const filtered = selectedMonth ? transactions.filter(tx => {
      const txDate = new Date(tx.date);
      const selectedDate = new Date(selectedMonth + '-01');
      return txDate.getMonth() === selectedDate.getMonth() && txDate.getFullYear() === selectedDate.getFullYear();
    }) : transactions;
    setFilteredTransactions(filtered);
  }, [transactions, selectedMonth]);

  const lineChartData = (() => {
    const dailyData = {};
    filteredTransactions.forEach(tx => {
      const date = new Date(tx.date).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = { income: 0, expenses: 0 };
      }
      if (tx.type === 'income') {
        dailyData[date].income += tx.amount;
      } else {
        dailyData[date].expenses += tx.amount;
      }
    });

    const labels = Object.keys(dailyData).sort((a, b) => new Date(a) - new Date(b));
    const incomeData = labels.map(label => dailyData[label].income);
    const expensesData = labels.map(label => dailyData[label].expenses);

    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          borderColor: "#00c896",
          fill: false,
        },
        {
          label: "Expenses",
          data: expensesData,
          borderColor: "#e74c3c",
          fill: false,
        }
      ]
    };
  })();

  const pieChartData = (() => {
    const categorySpending = {};
    filteredTransactions.filter(tx => tx.type === 'expense').forEach(tx => {
      categorySpending[tx.category] = (categorySpending[tx.category] || 0) + tx.amount;
    });

    return {
      labels: Object.keys(categorySpending),
      datasets: [{
        data: Object.values(categorySpending),
        backgroundColor: ["#00c896", "#36a2eb", "#f39c12", "#9b59b6", "#e74c3c", "#8e44ad", "#2ecc71", "#d35400"]
      }]
    };
  })();

  const barChartData = (() => {
    const categorySpending = {};
    filteredTransactions.filter(tx => tx.type === 'expense').forEach(tx => {
      categorySpending[tx.category] = (categorySpending[tx.category] || 0) + tx.amount;
    });

    return {
      labels: Object.keys(categorySpending),
      datasets: [{
        label: "Expenses",
        data: Object.values(categorySpending),
        backgroundColor: "#e74c3c"
      }]
    };
  })();

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  }

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true }
    }
  }

  const pieOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  }

  return (
    <div>
    <div className="month-selector-container">
        <label htmlFor="monthSelect">Select Month:</label>
        <input 
          type="month" 
          id="monthSelect" 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="month-selector-input"
        />
      </div>
    <section className="analytics-grid">
       
      <div className="card">
        <h3>
          <LineChart /> Income vs Expenses
        </h3>
        <Line data={lineChartData} options={chartOptions} />
      </div>

      <div className="card">
        <h3>
          <PieChart /> Expense Breakdown
        </h3>
        <Pie data={pieChartData} options={pieOptions} />
      </div>

      <div className="card">
        <h3>
          <BarChart /> Monthly Spending
        </h3>
        <Bar data={barChartData} options={barOptions} />
      </div>
    </section>
    </div>
  )
}

export default Analytics