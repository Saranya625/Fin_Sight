import { useEffect, useRef } from 'react'
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

const IncomeExpenseChart = ({ transactions }) => {
  const chartRef = useRef()

  const processChartData = () => {
    const incomeMap = {}
    const expenseMap = {}

    transactions.forEach(tx => {
      const dateObj = new Date(tx.date)
      const key = `${dateObj.toLocaleString('default', { month: 'short' })} ${dateObj.getFullYear()}`

      if (!incomeMap[key]) {
        incomeMap[key] = 0
        expenseMap[key] = 0
      }

      if (tx.type === 'income') {
        incomeMap[key] += tx.amount
      } else {
        expenseMap[key] += tx.amount
      }
    })

    const allLabels = Array.from(new Set([...Object.keys(incomeMap), ...Object.keys(expenseMap)]))
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
        {
          label: 'Expenses',
          data: allLabels.length > 0 ? allLabels.map(label => expenseMap[label] || 0) : [],
          borderColor: '#e74c3c',
          backgroundColor: '#e74c3c',
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
        text: 'Income vs Expenses',
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

export default IncomeExpenseChart