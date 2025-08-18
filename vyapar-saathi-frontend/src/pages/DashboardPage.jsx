import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, CreditCard, Receipt } from 'lucide-react';
import { reportsAPI } from '../services/api';
const DashboardPage = ({ refreshTrigger }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState({
    totalSales: 0,
    salesByMethod: { Cash: 0, UPI: 0, Card: 0, Udhaar: 0 },
    totalExpenses: 0,
    netProfit: 0,
    salesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDailyReport = async (date) => {
    try {
      setLoading(true);
      const response = await reportsAPI.getDailyReport(date);
      setReportData(response.data);
    } catch (err) {
      setError('Failed to fetch daily report');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDailyReport(selectedDate);
  }, [selectedDate, refreshTrigger]);

  const StatCard = ({ title, value, icon: Icon, color, prefix = '₹' }) => (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600 mr-4`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{prefix}{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Sales" value={reportData.totalSales} icon={TrendingUp} color="green" />
        <StatCard title="Total Expenses" value={reportData.totalExpenses} icon={Receipt} color="red" />
        <StatCard title="Net Profit" value={reportData.netProfit} icon={DollarSign} color={reportData.netProfit >= 0 ? "green" : "red"} />
        <StatCard title="Sales Count" value={reportData.salesCount} icon={CreditCard} color="blue" prefix="" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Sales by Payment Method</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(reportData.salesByMethod).map(([method, amount]) => (
            <div key={method} className="text-center bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">{method}</p>
              <p className="text-xl font-bold">₹{amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;