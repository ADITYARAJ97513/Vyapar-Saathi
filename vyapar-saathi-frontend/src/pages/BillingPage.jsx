import React, { useState, useEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Search, Plus, Minus, Trash2, ShoppingCart, Share2, Printer } from 'lucide-react';
import { productAPI, salesAPI, paymentAPI } from '../services/api';
import JsConfetti from 'js-confetti';
import BillToPrint from './BillToPrint';
import toast from 'react-hot-toast';

const BillingPage = ({ businessInfo }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastBill, setLastBill] = useState(null);
  const [jsConfetti, setJsConfetti] = useState(null);

  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(5);

  const [totals, setTotals] = useState({
    subtotal: 0,
    taxAmount: 0,
    grandTotal: 0,
  });

  useEffect(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const grandTotal = subtotal + taxAmount - discount;
    setTotals({ subtotal, taxAmount, grandTotal });
  }, [cart, discount, taxRate]);

  const handlePrint = () => {
    if (!lastBill) return;
    const billHtml = ReactDOMServer.renderToString(
      <BillToPrint billDetails={lastBill} businessInfo={businessInfo} />
    );
    const printWindow = window.open('', '_blank', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Bill</title>');
    printWindow.document.write('<script src="https://cdn.tailwindcss.com/"></script>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(billHtml);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
  };

  useEffect(() => {
    setJsConfetti(new JsConfetti());
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getAll();
      setProducts(res.data);
    } catch {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.productId === product._id);
      if (existing) {
        return prevCart.map(item =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { productId: product._id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id, qty) => {
    setCart(cart.map(item => item.productId === id ? { ...item, quantity: qty } : item).filter(item => item.quantity > 0));
  };
  
  const completeSale = (finalBillFromServer) => {
    if (jsConfetti) jsConfetti.addConfetti();
    setLastBill(finalBillFromServer); 
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscount(0);
    fetchProducts();
    toast.success('Sale complete!');
  };
  
  const processSale = async (method) => {
    const saleData = {
      items: cart,
      totalAmount: totals.grandTotal,
      paymentMethod: method,
      customerName,
      customerPhone,
      discount,
      taxRate,
    };

    try {
      const response = await salesAPI.create(saleData);
      completeSale(response.data.sale); 
    } catch (err) {
      toast.error('Sale failed. Please try again.');
      console.error(err);
    }
  };

  const handleOnlinePayment = async (method) => {
    const totalAmount = totals.grandTotal;
    if (totalAmount < 1) return toast.error('Total amount must be at least ₹1.');

    try {
      const orderResponse = await paymentAPI.createOrder(totalAmount);
      const orderData = orderResponse.data;
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: businessInfo.name,
        description: `Payment for bill`,
        order_id: orderData.id,
        handler: async function (response) {
          await processSale(method);
        },
        prefill: {
          name: customerName || 'Valued Customer',
          contact: customerPhone || '',
        },
        theme: {
          color: '#3399cc'
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Error initiating payment.');
    }
  };

  const handlePayment = async (method) => {
    if (cart.length === 0) return toast.error('Cart is empty!');
    if (method === 'UPI' || method === 'Card') {
      handleOnlinePayment(method);
      return;
    }
    if (method === 'Udhaar' && (!customerName || !customerPhone)) {
      return toast.error('Customer name and phone are required.');
    }
    await processSale(method);
  };
  
  const handleShareOnWhatsApp = () => {
    if (!lastBill) return;
    let billText = `*${businessInfo.name} Bill*\n\nBill No: ${lastBill.billNumber}\nTotal: *₹${lastBill.totalAmount.toLocaleString()}*\n\nItems:\n`;
    lastBill.items.forEach(item => {
      billText += `- ${item.name} (x${item.quantity})\n`;
    });
    billText += `\nThank you!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(billText)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Point of Sale</h1>
      </div>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Products</h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredProducts.map(p => (
              <div key={p._id} onClick={() => addToCart(p)} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <h3 className="font-medium">{p.name}</h3>
                  <p className="text-sm text-gray-600">₹{p.price} • Stock: {p.stock}</p>
                </div>
                <Plus className="text-blue-600" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          {lastBill ? (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-700 mb-2">Sale Complete!</h3>
              <p>Total: <span className="font-bold">₹{lastBill.totalAmount.toLocaleString()}</span> | Method: {lastBill.paymentMethod}</p>
              <div className="mt-4 flex flex-col gap-3">
                <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-black">
                  <Printer size={18}/> Print Bill
                </button>
                <button onClick={handleShareOnWhatsApp} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">
                  <Share2 size={18}/> Share on WhatsApp
                </button>
                <button onClick={() => setLastBill(null)} className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700">
                  New Sale
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4 flex items-center"><ShoppingCart className="mr-2" /> Cart ({cart.length})</h2>
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center">Cart is empty</p>
                ) : (
                  cart.map(item => (
                    <div key={item.productId} className="flex justify-between items-center p-3 border rounded-lg">
                      <div><h4>{item.name}</h4><p className="text-sm">₹{item.price}</p></div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}><Minus /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}><Plus /></button>
                        <button onClick={() => updateQuantity(item.productId, 0)} className="text-red-600"><Trash2 /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mb-4">
                <h3 className="font-medium">Customer Info </h3>
                <input type="text" placeholder="Name" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full mb-2 px-3 py-2 border rounded-lg" />
                <input type="tel" placeholder="Phone" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Discount (₹)</label>
                    <input type="number" placeholder="0.00" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                    <label className="text-sm font-medium">Tax Rate (%)</label>
                    <input type="number" placeholder="5" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>

              <div className="border-t pt-4 mb-6 flex justify-between font-bold text-xl">
                <span>Total:</span>
                <span>₹{totals.grandTotal.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['Cash', 'UPI', 'Card', 'Udhaar'].map(method => (
                  <button key={method} onClick={() => handlePayment(method)} className={`py-3 px-4 rounded-lg text-white font-medium ${method === 'Cash' ? 'bg-green-600' : method === 'UPI' ? 'bg-blue-600' : method === 'Card' ? 'bg-purple-600' : 'bg-orange-600'}`}>
                    {method}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;