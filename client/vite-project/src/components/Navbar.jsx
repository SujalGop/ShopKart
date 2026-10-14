import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutCustomerAPI } from '../services/api';
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const handleLogout = async () => {
    try {
      await logoutCustomerAPI();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 py-5 px-6 md:px-24 flex justify-between items-center sticky top-0 z-50">
      
      <Link to="/home" className="text-2xl font-serif font-bold text-gray-900 tracking-wide">
        ShopKart
      </Link>

      <div className="hidden md:flex space-x-10">
        <Link to="/products" className="text-sm font-medium text-gray-900 border-b-2 border-gray-900 pb-1">Shop</Link>
        <Link to="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition pb-1">New Arrivals</Link>
        <Link to="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition pb-1">Best Sellers</Link>
        <Link to="#" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition pb-1">Contact</Link>
        <Link to="/wishlist" className="text-sm font-medium text-gray-900 hover:text-[#e26e3c] transition">Wishlist</Link>
        <Link to="/orders" className="text-sm font-medium text-gray-900 hover:text-[#e26e3c] transition">My Orders</Link>
      </div>

      <div className="flex items-center space-x-6">
        
        <button className="text-gray-500 hover:text-gray-900 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
        
        <Link to="/cart" className="text-gray-500 hover:text-gray-900 transition relative flex items-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#e26e3c] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        <button 
          onClick={handleLogout} 
          className="text-sm font-medium text-gray-400 hover:text-red-500 transition border-l border-gray-200 pl-6 ml-2">
          Logout
        </button>

      </div>
    </nav>
  );
}