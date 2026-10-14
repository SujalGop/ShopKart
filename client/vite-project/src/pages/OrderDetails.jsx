import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderByIdAPI, updateOrderStatusAPI } from '../services/api';

const statusColor = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
  PLACED:          'bg-green-100 text-green-700',
  CONFIRMED:       'bg-blue-100 text-blue-700',
  SHIPPED:         'bg-purple-100 text-purple-700',
  DELIVERED:       'bg-gray-100 text-gray-700'
};

const STATUS_PROGRESSION = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchOrder = async () => {
    try {
      const { data } = await getOrderByIdAPI(id);
      setOrder(data.order);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleAdvanceStatus = async () => {
    if (!order) return;
    const currentIdx = STATUS_PROGRESSION.indexOf(order.status);
    if (currentIdx === -1 || currentIdx === STATUS_PROGRESSION.length - 1) return;

    const nextStatus = STATUS_PROGRESSION[currentIdx + 1];
    setStatusUpdating(true);
    setStatusMessage('');
    try {
      const { data } = await updateOrderStatusAPI(order._id, nextStatus);
      setOrder(data.order);
      setStatusMessage(`Status updated to ${nextStatus}`);
    } catch (err) {
      setStatusMessage(err?.response?.data?.message || 'Failed to update status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-32 text-gray-500">Loading order...</div>;
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto text-center py-32 px-4">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-red-600 font-medium mb-6">{error}</p>
        <Link to="/orders" className="text-[#e26e3c] font-medium hover:underline">
          ← Back to My Orders
        </Link>
      </div>
    );
  }

  const currentIdx = STATUS_PROGRESSION.indexOf(order.status);
  const canAdvance = currentIdx >= 0 && currentIdx < STATUS_PROGRESSION.length - 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link to="/orders" className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
        ← Back to My Orders
      </Link>

      <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Order Details</h1>

      <div className="bg-white border rounded-lg p-5 shadow-sm mb-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Order ID</span>
          <span className="font-mono text-gray-600 text-xs">{order._id}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Placed On</span>
          <span className="text-gray-700">{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="text-gray-500">Order Status</span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
            {order.status}
          </span>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span className="text-gray-500">Payment</span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            order.paymentStatus === 'PAID'
              ? 'bg-green-100 text-green-700'
              : order.paymentStatus === 'FAILED'
              ? 'bg-red-100 text-red-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {order.paymentStatus}
          </span>
        </div>
        {order.razorpayPaymentId && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Razorpay Payment ID</span>
            <span className="font-mono text-gray-600 text-xs">{order.razorpayPaymentId}</span>
          </div>
        )}
      </div>

      <div className="bg-white border rounded-lg p-5 shadow-sm mb-5">
        <h2 className="font-bold text-gray-900 mb-4 border-b pb-2">Items</h2>
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded border"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-400">
                  ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                </p>
              </div>
              <span className="text-sm font-bold text-gray-800">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-3 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-5 shadow-sm mb-5">
        <h2 className="font-bold text-gray-900 mb-3 border-b pb-2">Shipping Address</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.addressLine1}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
          <p>📞 {order.shippingAddress.phone}</p>
        </div>
      </div>

      {order.paymentStatus === 'PAID' && (
        <div className="bg-gray-50 border rounded-lg p-5">
          <h2 className="font-bold text-gray-900 mb-3">Update Status (Dev Panel)</h2>

          <div className="flex items-center gap-1 mb-4">
            {STATUS_PROGRESSION.map((s, i) => (
              <React.Fragment key={s}>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    i <= currentIdx
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {i < STATUS_PROGRESSION.length - 1 && (
                  <div className={`flex-1 h-0.5 ${i < currentIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {canAdvance && (
            <button
              onClick={handleAdvanceStatus}
              disabled={statusUpdating}
              className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded hover:bg-gray-700 transition disabled:opacity-50"
            >
              {statusUpdating ? 'Updating...' : `Advance to ${STATUS_PROGRESSION[currentIdx + 1]}`}
            </button>
          )}
          {!canAdvance && order.status === 'DELIVERED' && (
            <p className="text-green-600 text-sm font-medium">Order has been delivered ✓</p>
          )}
          {statusMessage && (
            <p className="text-sm mt-2 text-gray-600">{statusMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
