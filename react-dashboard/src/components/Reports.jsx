import { useState } from 'react';
import { FileText, Mail, Download, Eye } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../Reports.css';

const Reports = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState({
    incomeExpenseSummary: true,
    spendingByCategory: true,
    budgetVsActual: false,
    taxSavingExpenses: false,
    highValueTransactions: false,
    monthlyCashFlow: false,
    anomalies: false,
    topMerchants: false,
  });

  const [format, setFormat] = useState('pdf');
  const [duration, setDuration] = useState('thisMonth');
  const [customDate, setCustomDate] = useState({ start: '', end: '' });
  const [previewData, setPreviewData] = useState(null);

  const handleInsightChange = (e) => {
    setInsights({ ...insights, [e.target.name]: e.target.checked });
  };

  const handleGenerateReport = async (preview = false) => {
    const reportOptions = {
      insights,
      format: preview ? 'preview' : format,
      duration,
      customDate,
    };

    try {
      const response = await api.generateReport(user.id, reportOptions);
      if (preview) {
        const data = await response.json();
        setPreviewData(data);
      } else if (format === 'csv' || format === 'pdf') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const result = await response.text();
        alert(result);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  return (
    <div className="reports-container">
      <h2>Generate a Personalized Report</h2>
      <p>Select the insights that matter to you, and we’ll generate a personalized report with smart summaries and visualizations.</p>

      <div className="report-options">
        <div className="insights-selection">
          <h3>What would you like to include?</h3>
          <ul>
            {Object.keys(insights).map((insight) => (
              <li key={insight}>
                <label>
                  <input
                    type="checkbox"
                    name={insight}
                    checked={insights[insight]}
                    onChange={handleInsightChange}
                  />
                  {insight.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="format-duration-selection">
          <div className="format-selection">
            <h3>Format:</h3>
            <div className="format-options">
              <button className={format === 'pdf' ? 'active' : ''} onClick={() => setFormat('pdf')}>
                <FileText /> PDF Report
              </button>
              <button className={format === 'email' ? 'active' : ''} onClick={() => setFormat('email')}>
                <Mail /> Email to Myself
              </button>
              <button className={format === 'csv' ? 'active' : ''} onClick={() => setFormat('csv')}>
                <Download /> Download CSV
              </button>
            </div>
          </div>

          <div className="duration-selection">
            <h3>Duration:</h3>
            <div className="duration-options">
              <button className={duration === 'thisMonth' ? 'active' : ''} onClick={() => setDuration('thisMonth')}>
                This Month
              </button>
              <button className={duration === 'last3Months' ? 'active' : ''} onClick={() => setDuration('last3Months')}>
                Last 3 Months
              </button>
              <button className={duration === 'custom' ? 'active' : ''} onClick={() => setDuration('custom')}>
                Custom Date Range
              </button>
            </div>
            {duration === 'custom' && (
              <div className="custom-date-range">
                <input type="date" value={customDate.start} onChange={(e) => setCustomDate({ ...customDate, start: e.target.value })} />
                <span>to</span>
                <input type="date" value={customDate.end} onChange={(e) => setCustomDate({ ...customDate, end: e.target.value })} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="report-actions">
        <button className="generate-report-btn" onClick={() => handleGenerateReport(false)}>
          Generate Report
        </button>
        <button className="preview-btn" onClick={() => handleGenerateReport(true)}>
          <Eye /> Preview
        </button>
      </div>

      {previewData && (
        <div className="preview-section">
          <h3>Report Preview</h3>
          <pre>{JSON.stringify(previewData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Reports;
