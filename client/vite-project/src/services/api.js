import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8005', 
  withCredentials: true,
});

export const registerCustomerAPI = (data) => axiosInstance.post('/customers/register', data);
export const loginCustomerAPI = (data) => axiosInstance.post('/customers/login', data);
export const logoutCustomerAPI = () => axiosInstance.post('/customers/logout');
export const getCustomerAPI = () => axiosInstance.get('/customers/me');

export const fetchAllProductsAPI = (params) => axiosInstance.get('/products', { params });
export const fetchSingleProductAPI = (id) => axiosInstance.get(`/products/${id}`);


export const getWishlistAPI = () => axiosInstance.get('/wishlist');
export const toggleWishlistAPI = (productId) => axiosInstance.patch(`/wishlist/${productId}/toggle`);


export const getCartAPI = () => axiosInstance.get('/cart');
export const addToCartAPI = (productId) => axiosInstance.post(`/cart/${productId}`);
export const updateCartQuantityAPI = (productId, quantity) => axiosInstance.patch(`/cart/${productId}`, { quantity });
export const removeFromCartAPI = (productId) => axiosInstance.delete(`/cart/${productId}`);


export const createPaymentOrderAPI = (shippingAddress) =>
  axiosInstance.post('/orders/create-payment-order', { shippingAddress });

export const verifyPaymentAPI = (data) =>
  axiosInstance.post('/orders/verify-payment', data);

export const getMyOrdersAPI = () => axiosInstance.get('/orders');

export const getOrderByIdAPI = (id) => axiosInstance.get(`/orders/${id}`);

export const updateOrderStatusAPI = (id, status) =>
  axiosInstance.patch(`/orders/${id}/status`, { status });
