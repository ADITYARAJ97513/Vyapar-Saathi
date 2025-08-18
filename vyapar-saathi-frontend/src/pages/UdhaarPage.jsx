import React, { useState, useEffect } from 'react';
import { Users, CreditCard, X, MessageSquare, Search } from 'lucide-react';
import { customersAPI } from '../services/api';
import toast from 'react-hot-toast';

const UdhaarPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersAPI.getAll();
      setCustomers(response.data);
    } catch (err) {
      setError('Failed to fetch customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleRecordPayment = (customer) => {
    setSelectedCustomer(customer);
    setPaymentAmount('');
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      return toast.error('Please enter a valid payment amount');
    }

    if (parseFloat(paymentAmount) > selectedCustomer.outstandingBalance) {
      return toast.error('Payment cannot exceed outstanding balance');
    }

    try {
      setLoading(true);
      await customersAPI.recordPayment(selectedCustomer._id, parseFloat(paymentAmount));

      setIsModalOpen(false);
      setSelectedCustomer(null);
      setPaymentAmount('');
      fetchCustomers();

      toast.success('Payment recorded successfully!');
    } catch (err) {
      toast.error('Failed to record payment.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = (customer) => {
    const message = `Hello ${customer.name}, this is a friendly reminder regarding your outstanding balance of ₹${customer.outstandingBalance.toLocaleString()}. Thank you!`;
    
    const formattedPhone = customer.phone.startsWith('91') ? customer.phone : `91${customer.phone}`;
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    toast.success(`Opening WhatsApp for ${customer.name}`);
  };

  const getTotalOutstanding = () => {
    return customers.reduce((total, customer) => total + customer.outstandingBalance, 0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
    setPaymentAmount('');
  };

  if (loading && customers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 backdrop-blur-lg bg-white/30 p-6 rounded-2xl shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 md:mb-0">Udhaar Dashboard</h1>
        <div className="bg-violet-100 px-5 py-2 rounded-xl shadow-md">
          <p className="text-violet-800 font-semibold text-lg">
            Total Outstanding: ₹{getTotalOutstanding().toLocaleString()}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-orange-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Outstanding</p>
              <p className="text-3xl font-bold text-orange-600">
                ₹{getTotalOutstanding().toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-blue-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Total Customers</p>
              <p className="text-3xl font-bold text-blue-600">{customers.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Outstanding Customers</h2>
          <div className="relative mt-4 md:mt-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white/70 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="text-center py-10">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No matching customers found' : 'No customers with outstanding balance'}
            </p>
            {!searchTerm && <p className="text-gray-400">All payments are up to date!</p>}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer._id} className="flex items-center justify-between p-5 bg-white/60 backdrop-blur-sm border rounded-xl hover:bg-white/80 transition">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{customer.name}</h3>
                  <p className="text-sm text-gray-500">{customer.phone}</p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-500">
                      ₹{customer.outstandingBalance.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Outstanding</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSendReminder(customer)}
                      className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition font-semibold flex items-center"
                      title="Send WhatsApp Reminder"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRecordPayment(customer)}
                      className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition font-semibold"
                    >
                      Paid
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Record Payment</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-200 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-semibold text-gray-900">{selectedCustomer.name}</p>
                <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Outstanding Balance</p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{selectedCustomer.outstandingBalance.toLocaleString()}
                </p>
              </div>

              <div>
                <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  id="paymentAmount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  max={selectedCustomer.outstandingBalance}
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-xl hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {loading ? 'Recording...' : 'Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UdhaarPage;