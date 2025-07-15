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

const Analytics = () => {
  // Sample data - in a real app, this would come from props or state
  const lineChartData = {
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
  }

  const pieChartData = {
    labels: ["Rent", "Groceries", "Utilities", "Entertainment", "Other"],
    datasets: [{
      data: [500, 300, 150, 100, 200],
      backgroundColor: ["#00c896", "#36a2eb", "#f39c12", "#9b59b6", "#e74c3c"]
    }]
  }

  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Expenses",
      data: [1000, 1200, 1100, 1500, 1400, 1450],
      backgroundColor: "#00c896"
    }]
  }

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
    <section className="analytics-grid">
      <div className="card">
        <h3>
          <i className="fas fa-chart-line"></i> Income vs Expenses
        </h3>
        <Line data={lineChartData} options={chartOptions} />
      </div>

      <div className="card">
        <h3>
          <i className="fas fa-chart-pie"></i> Expense Breakdown
        </h3>
        <Pie data={pieChartData} options={pieOptions} />
      </div>

      <div className="card">
        <h3>
          <i className="fas fa-chart-bar"></i> Monthly Spending
        </h3>
        <Bar data={barChartData} options={barOptions} />
      </div>

      <div className="card">
        <h3>
          <i className="fas fa-bullseye"></i> Saving Goals
        </h3>
        <div className="goal">
          <p>Vacation Fund</p>
          <div className="progress">
            <div style={{ width: '70%' }}></div>
          </div>
          <small>$700 / $1000</small>
        </div>
        <div className="goal">
          <p>Emergency Fund</p>
          <div className="progress">
            <div style={{ width: '40%' }}></div>
          </div>
          <small>$400 / $1000</small>
        </div>
      </div>
    </section>
  )
}

export default Analytics