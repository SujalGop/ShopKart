import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOrderByIdAPI } from '../services/api';

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await getOrderByIdAPI(id);
        setOrder(data.order);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-32 text-gray-500 font-medium">
        Loading order details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto text-center py-32 px-4">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-red-600 font-medium mb-6">{error}</p>
        <Link to="/orders" className="text-[#e26e3c] font-medium hover:underline">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-7xl mb-6">✅</div>
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
        Order Placed Successfully!
      </h1>
      <p className="text-gray-500 mb-8">Thank you for shopping with ShopKart.</p>

      <div className="bg-white border rounded-lg p-6 text-left shadow-sm mb-8 space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span className="font-medium text-gray-700">Order ID</span>
          <span className="font-mono text-gray-500 text-xs">{order._id}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span className="font-medium text-gray-700">Status</span>
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
            {order.status}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span className="font-medium text-gray-700">Payment</span>
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
            {order.paymentStatus}
          </span>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Items Ordered</p>
          <div className="space-y-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm text-gray-600">
                <span>
                  {item.name}
                  <span className="text-gray-400 ml-1">× {item.quantity}</span>
                </span>
                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/orders"
          className="bg-gray-900 text-white font-medium px-6 py-3 rounded hover:bg-gray-800 transition"
        >
          View My Orders
        </Link>
        <Link
          to="/products"
          className="border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded hover:bg-gray-50 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
