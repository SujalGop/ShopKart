import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

export default function Cart() {
    const { cartItems, loading, cartCount, cartSubtotal, updateQuantity, removeFromCart } = useCart();

    if (loading) {
        return <div className="text-center py-32 text-gray-500 font-medium">Loading your cart...</div>;
    }

    if (cartItems.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center py-32 px-4">
                <div className="text-6xl mb-6">🛒</div>
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link to="/products" className="inline-block bg-gray-900 text-white font-medium px-8 py-3 rounded hover:bg-gray-800 transition">
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">My Cart</h1>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-sm border">
                    <div className="border-b pb-4 mb-4">
                        <h2 className="font-bold text-gray-900 text-lg">Items ({cartCount})</h2>
                    </div>
                    <div className="flex flex-col">
                        {cartItems.map((item) => (
                            <CartItem 
                                key={item.product._id} 
                                item={item} 
                                updateQuantity={updateQuantity}
                                removeFromCart={removeFromCart}
                            />
                        ))}
                    </div>
                </div>

                <div className="lg:w-1/3">
                    <div className="bg-gray-50 p-6 rounded-lg border sticky top-24">
                        <h2 className="font-bold text-gray-900 text-lg mb-6 border-b pb-4">Order Summary</h2>
                        
                        <div className="space-y-3 text-sm text-gray-600 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal ({cartCount} items)</span>
                                <span className="font-medium text-gray-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                        </div>
                        
                        <div className="border-t pt-4 mb-6 flex justify-between items-center">
                            <span className="font-bold text-gray-900 text-lg">Total</span>
                            <span className="font-bold text-gray-900 text-xl">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                        </div>
                        
                        <Link 
                            to="/checkout"
                            className="w-full block text-center bg-[#e26e3c] text-white font-medium py-3 rounded hover:bg-[#c85a2e] transition shadow-sm"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}