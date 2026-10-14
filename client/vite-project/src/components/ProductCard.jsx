import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toggleWishlistAPI } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, isInitiallySaved }) {
  
  const [wishlistState, setWishlistState] = useState(isInitiallySaved ? 'saved' : 'default')
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    setWishlistState(isInitiallySaved ? 'saved' : 'default');
  }, [isInitiallySaved]);

  const handleWishlistToggle = async () => {
    if (wishlistState === 'saving') return; 
    
    setWishlistState('saving');
    try {
      const response = await toggleWishlistAPI(product._id);
      setWishlistState(response.data.saved ? 'saved' : 'default');
    } catch (err) {
      alert("Unable to save product. Please try again.");
      setWishlistState(isInitiallySaved ? 'saved' : 'default'); 
    }
  };

  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    setIsAddingToCart(true);
    try {
        await addToCart(product._id); 
    } catch (error) {
        alert(error.response?.data?.message || "Failed to add to cart");
    } finally {
        setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition duration-200 overflow-hidden flex flex-col">
      <div className="h-48 bg-gray-50 flex items-center justify-center p-4 border-b">
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-h-full object-contain mix-blend-multiply"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-[#e26e3c] uppercase tracking-wider mb-1">
          {product.category}
        </span>
        <h3 className="text-lg font-medium text-gray-900 mb-2 leading-tight">
          {product.name}
        </h3>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
            </span>
          </div>
          
          <div className="flex flex-col gap-2">
            <Link 
              to={`/products/${product._id}`}
              className="block w-full text-center bg-gray-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition">
              View Details
            </Link>
            
            <button 
              onClick={handleWishlistToggle}
              disabled={wishlistState === 'saving'}
              className={`block w-full text-center px-4 py-2 rounded text-sm font-medium border transition ${
                wishlistState === 'saved' 
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}>
              {wishlistState === 'default' && '♡ Add to Wishlist'}
              {wishlistState === 'saving' && '⏳ Saving...'}
              {wishlistState === 'saved' && '♥ Added to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}