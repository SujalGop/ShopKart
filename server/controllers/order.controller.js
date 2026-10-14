import crypto from 'crypto';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import razorpay from '../config/razorpay.js';

const validateShippingAddress = (addr) => {
  const errors = [];
  if (!addr || typeof addr !== 'object') return ['Shipping address is required.'];

  if (!addr.fullName || !addr.fullName.trim()) errors.push('Full name is required.');
  if (!addr.phone || !addr.phone.trim()) errors.push('Phone number is required.');
  else if (!/^[6-9]\d{9}$/.test(addr.phone.trim()))
    errors.push('Phone must be a valid 10-digit Indian mobile number.');
  if (!addr.addressLine1 || !addr.addressLine1.trim()) errors.push('Address line is required.');
  if (!addr.city || !addr.city.trim()) errors.push('City is required.');
  if (!addr.state || !addr.state.trim()) errors.push('State is required.');
  if (!addr.pincode || !addr.pincode.trim()) errors.push('Pincode is required.');
  else if (!/^\d{6}$/.test(addr.pincode.trim()))
    errors.push('Pincode must contain exactly 6 digits.');

  return errors;
};

export const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const addrErrors = validateShippingAddress(shippingAddress);
    if (addrErrors.length > 0) {
      return res.status(400).json({ success: false, message: addrErrors.join(' ') });
    }

    const customer = await Customer.findById(req.customer._id).populate({
      path: 'cart.product',
      select: 'name price image stock'
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty. Add items before checking out.' });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const cartItem of customer.cart) {
      const productId = cartItem.product?._id || cartItem.product;

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `A product in your cart is no longer available. Please review your cart.`
        });
      }

      if (cartItem.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${cartItem.quantity}.`
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,       
        quantity: cartItem.quantity,
        image: product.image
      });

      totalAmount += product.price * cartItem.quantity;
    }

    const shopKartOrder = await Order.create({
      user: customer._id,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        addressLine1: shippingAddress.addressLine1.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim()
      },
      totalAmount,
      paymentStatus: 'PENDING',
      status: 'PENDING_PAYMENT'
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),   // paise
      currency: 'INR',
      receipt: shopKartOrder._id.toString()
    });

    shopKartOrder.razorpayOrderId = razorpayOrder.id;
    await shopKartOrder.save();

    return res.status(200).json({
      success: true,
      shopKartOrderId: shopKartOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,   
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID  
    });
  } catch (error) {
    console.error('createPaymentOrder error:', error);
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!shopKartOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing required payment verification fields.' });
    }

    const order = await Order.findById(shopKartOrderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.user.toString() !== req.customer._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    const body = order.razorpayOrderId + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = 'FAILED';
      await order.save();
      return res.status(400).json({ success: false, message: 'Invalid payment signature. Payment verification failed.' });
    }

    order.paymentStatus = 'PAID';
    order.status = 'PLACED';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    await Customer.findByIdAndUpdate(req.customer._id, { cart: [] });

    return res.status(200).json({
      success: true,
      message: 'Payment verified. Order placed successfully.',
      order
    });
  } catch (error) {
    console.error('verifyPayment error:', error);
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.customer._id })
      .sort({ createdAt: -1 });   

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('getMyOrders error:', error);
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.user.toString() !== req.customer._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden. You do not own this order.' });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('getOrderById error:', error);
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    return res.status(200).json({ success: true, message: 'Order status updated.', order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};
