import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrdersAPI } from '../services/api';

const statusColor = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
  PLACED:          'bg-green-100 text-green-700',
  CONFIRMED:       'bg-blue-100 text-blue-700',
  SHIPPED:         'bg-purple-100 text-purple-700',
  DELIVERED:       'bg-gray-100 text-gray-700'
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });


function OrderCard({ order }) {
  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
        <div>
          <p className="text-xs text-gray-400 font-mono">Order #{order._id}</p>
          <p className="text-sm text-gray-500 mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full w-fit ${
            statusColor[order.status] || 'bg-gray-100 text-gray-600'
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="space-y-1 mb-4">
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

      <div className="border-t pt-3 flex justify-between items-center">
        <span className="font-bold text-gray-900">
          Total: ₹{order.totalAmount.toLocaleString('en-IN')}
        </span>
        <Link
          to={`/orders/${order._id}`}
          className="text-sm text-[#e26e3c] font-medium hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}


export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getMyOrdersAPI();
        setOrders(data.orders);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load your orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-32 text-gray-500 font-medium">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-32 px-4">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-red-600 font-medium mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-32 px-4">
        <div className="text-6xl mb-6">📦</div>
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">No orders yet</h2>
        <p className="text-gray-500 mb-8">You have not placed any orders yet.</p>
        <Link
          to="/products"
          className="inline-block bg-gray-900 text-white font-medium px-8 py-3 rounded hover:bg-gray-800 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">My Orders</h1>

      <div className="flex flex-col gap-5">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
