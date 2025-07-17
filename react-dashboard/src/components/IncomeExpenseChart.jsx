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
          borderColor: '#3dac43',
          backgroundColor: '#3dac43',
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
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 30,
        right: 30,
      },
      margin: {
        bottom: 20
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income vs Expenses',
        color: '#8db1e0',
        font: {
          size: '20',
          weight: '600',
        },
      },
      custom_canvas_background_color: {},
    },
    scales: {
      x: {
        ticks: {
          color: '#8db1e0', // 🔵 X-axis labels (months)
          font: {
            size: 14,
            weight: 'normal',
          },
        },
        grid: {
          color: '#ffffff2f', // grid line color (x-axis)
        },
        border: {
          color: '#ffffff2f', // axis line color (x-axis)
        },
      },
      y: {
        ticks: {
          color: '#8db1e0', // 🔵 X-axis labels (months)
          font: {
            size: 14,
            weight: 'normal',
          },
        },
        grid: {
          color: '#ffffff2f', // grid line color (y-axis)
        },
        border: {
          color: '#ffffff2f', // axis line color (y-axis)
        },
        beginAtZero: true,
      },
    },
  }

  return <Line ref={chartRef} data={processChartData()} options={options} />
}

export default IncomeExpenseChart