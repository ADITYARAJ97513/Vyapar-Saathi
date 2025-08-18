import React, { useState, useEffect } from 'react';
import { PlusCircle, Package, Edit, Trash2, X } from 'lucide-react';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';

const EditProductModal = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...product });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Product</h2>
          <button onClick={onCancel} className="p-1 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Price (₹)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Stock Quantity</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full mt-1 px-3 py-2 border rounded-lg" required />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onCancel} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getAll();
      setProducts(res.data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !stock) return toast.error('Please fill all fields.');
    
    setIsSubmitting(true);
    try {
      await productAPI.create({ name, price: parseFloat(price), stock: parseInt(stock, 10) });
      setName('');
      setPrice('');
      setStock('');
      toast.success('Product added successfully!');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to add product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(productId);
        toast.success('Product deleted successfully!');
        fetchProducts();
      } catch (err) {
        toast.error('Failed to delete product.');
      }
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedProduct) => {
    try {
      await productAPI.update(updatedProduct._id, {
        name: updatedProduct.name,
        price: parseFloat(updatedProduct.price),
        stock: parseInt(updatedProduct.stock, 10)
      });
      toast.success('Product updated successfully!');
      fetchProducts();
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      toast.error('Failed to update product.');
    }
  };

  return (
    <div className="space-y-6">
      {isEditModalOpen && (
        <EditProductModal 
          product={selectedProduct}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}

      <h1 className="text-3xl font-bold">Manage Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <PlusCircle className="mr-2" /> Add New Product
          </h2>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Price (₹)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Stock Quantity</label>
              <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg" required />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Package className="mr-2" /> Inventory
          </h2>
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {products.map(p => (
                <div key={p._id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium">{p.name}</h3>
                    <p className="text-sm text-gray-600">₹{p.price} • Stock: {p.stock}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleEditClick(p)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="Edit Product">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" title="Delete Product">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;