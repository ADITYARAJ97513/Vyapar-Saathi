import React from 'react';

const BillToPrint = React.forwardRef(({ billDetails, businessInfo }, ref) => {
  if (!billDetails) return null;

  const { 
    items, 
    totalAmount, 
    customerName, 
    customerPhone, 
    paymentMethod = 'Cash',
    discount = 0,
    taxRate = 0,
    billNumber,
    billDate = new Date()
  } = billDetails;
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = totalAmount + discount - subtotal;
  const isUdhaar = paymentMethod.toLowerCase() === 'udhaar';

  return (
    <div ref={ref} className="p-8 bg-white text-gray-800 font-sans max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {businessInfo?.name || 'Your Business'}
          </h1>
          <p className="text-gray-600">{businessInfo?.tagline || 'Quality Products & Services'}</p>
          <div className="mt-2 text-sm text-gray-500">
            {businessInfo?.address && <p>{businessInfo.address}</p>}
            {businessInfo?.phone && <p>Phone: {businessInfo.phone}</p>}
            {businessInfo?.email && <p>Email: {businessInfo.email}</p>}
            {businessInfo?.gstin && <p>GSTIN: {businessInfo.gstin}</p>}
          </div>
        </div>
        
        <div className="text-right">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">INVOICE</h2>
          <div className="text-sm">
            <p><span className="font-medium">Invoice #:</span> {billNumber || '---'}</p>
            <p><span className="font-medium">Date:</span> {new Date(billDate).toLocaleDateString()}</p>
            <p>
              <span className="font-medium">Status:</span> 
              <span className={`ml-1 ${isUdhaar ? 'text-red-600' : 'text-green-600'}`}>
                {isUdhaar ? 'Not Paid (Udhaar)' : 'Paid'}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between mb-8">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">Bill To</h3>
          <p className="font-medium">{customerName || 'Walk-in Customer'}</p>
          {customerPhone && <p>Phone: {customerPhone}</p>}
        </div>
        
        <div className="w-full md:w-1/2">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">Payment Info</h3>
          <p><span className="font-medium">Method:</span> {paymentMethod}</p>
          {isUdhaar ? (
            <p className="text-red-600 font-medium">Due: Immediate</p>
          ) : (
            <p><span className="font-medium">Paid On:</span> {new Date().toLocaleDateString()}</p>
          )}
        </div>
      </div>
      <div className="mb-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 font-semibold text-gray-700 border">Item</th>
              <th className="py-3 px-4 font-semibold text-gray-700 border text-center">Qty</th>
              <th className="py-3 px-4 font-semibold text-gray-700 border text-right">Unit Price</th>
              <th className="py-3 px-4 font-semibold text-gray-700 border text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4 border">{item.name}</td>
                <td className="py-3 px-4 border text-center">{item.quantity}</td>
                <td className="py-3 px-4 border text-right">₹{item.price.toFixed(2)}</td>
                <td className="py-3 px-4 border text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <div className="w-full md:w-1/2">
          <div className="border-t border-gray-200">
            <div className="flex justify-between py-2">
              <span className="font-medium">Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            
            {taxRate > 0 && (
              <div className="flex justify-between py-2">
                <span className="font-medium">Tax ({taxRate}%):</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
            )}
            
            {discount > 0 && (
              <div className="flex justify-between py-2">
                <span className="font-medium">Discount:</span>
                <span className="text-red-600">-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 border-t border-gray-300 font-bold text-lg">
              <span>Total Amount:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            
            {isUdhaar && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                <p className="font-semibold">Payment Pending</p>
                <p className="text-sm">This amount will be added to customer's outstanding balance</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p className="mb-2">Thank you for your business!</p>
        {businessInfo?.thankYouMessage && (
          <p className="italic">{businessInfo.thankYouMessage}</p>
        )}
      </div>
    </div>
  );
});

export default BillToPrint;