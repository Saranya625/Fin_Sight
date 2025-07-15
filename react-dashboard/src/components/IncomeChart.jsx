import { useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const IncomeChart = ({ transactions }) => {
  const chartRef = useRef()

  const processChartData = () => {
    const incomeMap = {}

    transactions.forEach(tx => {
      const dateObj = new Date(tx.date)
      const key = `${dateObj.toLocaleString('default', { month: 'short' })} ${dateObj.getFullYear()}`

      if (!incomeMap[key]) {
        incomeMap[key] = 0
      }

      incomeMap[key] += tx.amount
    })

    const allLabels = Object.keys(incomeMap)
    allLabels.sort((a, b) => new Date(a) - new Date(b))

    return {
      labels: allLabels.length > 0 ? allLabels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Income',
          data: allLabels.length > 0 ? allLabels.map(label => incomeMap[label] || 0) : [],
          borderColor: '#00c896',
          backgroundColor: '#00c896',
          fill: false,
        },
      ],
    }
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return <Line ref={chartRef} data={processChartData()} options={options} />
}

export default IncomeChart