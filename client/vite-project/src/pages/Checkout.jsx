import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createPaymentOrderAPI, verifyPaymentAPI } from '../services/api';


const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const initialForm = {
  fullName: '',
  phone: '',
  addressLine1: '',
  city: '',
  state: '',
  pincode: ''
};


const validate = (form) => {
  const errors = {};

  if (!form.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  }
  if (!form.addressLine1.trim()) errors.addressLine1 = 'Address is required.';
  if (!form.city.trim()) errors.city = 'City is required.';
  if (!form.state.trim()) errors.state = 'State is required.';
  if (!form.pincode.trim()) {
    errors.pincode = 'Pincode is required.';
  } else if (!/^\d{6}$/.test(form.pincode.trim())) {
    errors.pincode = 'Pincode must contain exactly 6 digits.';
  }

  return errors;
};


const Field = ({ label, name, value, onChange, error, type = 'text', placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
        error ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-gray-400'
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);


export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, cartCount, clearCart } = useCart();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-32 px-4">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add items to your cart before checking out.</p>
        <button
          onClick={() => navigate('/products')}
          className="inline-block bg-gray-900 text-white font-medium px-8 py-3 rounded hover:bg-gray-800 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handlePlaceOrder = async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsPlacing(true);
    setServerError('');

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setServerError('Failed to load Razorpay. Check your internet connection.');
        setIsPlacing(false);
        return;
      }

      const { data } = await createPaymentOrderAPI(form);

      const options = {
        key: data.key,               
        amount: data.amount,         
        currency: data.currency,
        name: 'ShopKart',
        description: 'ShopKart Order',
        order_id: data.razorpayOrderId,

        handler: async function (response) {
          try {
            const { data: verifyData } = await verifyPaymentAPI({
              shopKartOrderId: data.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyData.success) {
              clearCart();
              navigate(`/order-success/${data.shopKartOrderId}`);
            }
          } catch (verifyErr) {
            const msg =
              verifyErr?.response?.data?.message ||
              'Payment verification failed. Please contact support.';
            setServerError(msg);
          }
        },

        prefill: {
          name: form.fullName,
          contact: form.phone
        },

        theme: {
          color: '#e26e3c'
        }
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on('payment.failed', function (response) {
        setServerError(
          `Payment failed: ${response.error.description || 'An error occurred'}. Your cart has not been cleared. Please try again.`
        );
      });

      paymentObject.open();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        'Something went wrong. Please try again.';
      setServerError(msg);
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-3/5 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-bold text-gray-900 mb-5 border-b pb-3">Shipping Details</h2>

          <div className="space-y-4">
            <Field
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="Aarav Sharma"
            />
            <Field
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
              type="tel"
              placeholder="9876543210"
            />
            <Field
              label="Address"
              name="addressLine1"
              value={form.addressLine1}
              onChange={handleChange}
              error={errors.addressLine1}
              placeholder="22 MG Road, Indiranagar"
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                error={errors.city}
                placeholder="Bengaluru"
              />
              <Field
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                error={errors.state}
                placeholder="Karnataka"
              />
            </div>
            <Field
              label="Pincode"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              error={errors.pincode}
              placeholder="560001"
            />
          </div>
        </div>

        <div className="lg:w-2/5">
          <div className="bg-gray-50 p-6 rounded-lg border sticky top-24">
            <h2 className="font-bold text-gray-900 text-lg mb-5 border-b pb-3">Order Summary</h2>

            <div className="space-y-3 mb-5">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex justify-between text-sm text-gray-700">
                  <span>
                    {item.product.name}
                    <span className="text-gray-400 ml-1">× {item.quantity}</span>
                  </span>
                  <span className="font-medium">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6 flex justify-between items-center">
              <span className="font-bold text-gray-900 text-base">Total ({cartCount} items)</span>
              <span className="font-bold text-gray-900 text-lg">
                ₹{cartSubtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4">
                {serverError}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacing}
              className={`w-full py-3 rounded font-medium text-white transition shadow-sm ${
                isPlacing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#e26e3c] hover:bg-[#c85a2e]'
              }`}
            >
              {isPlacing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                '💳 Pay with Razorpay'
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Secured by Razorpay · Test Mode Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
