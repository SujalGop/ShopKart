import React from 'react';
import { Link } from 'react-router-dom';

export default function WishlistCard({ product, onRemove }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-4 flex flex-col hover:shadow-md transition duration-200">
            <div className="h-40 bg-gray-50 flex items-center justify-center p-2 mb-4 rounded border">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-h-full object-contain mix-blend-multiply" 
                />
            </div>
            
            <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
            <p className="font-bold text-lg mt-1">₹{product.price.toLocaleString('en-IN')}</p>
            <p className="text-xs font-semibold text-[#e26e3c] uppercase tracking-wider mb-4 mt-1">
                {product.category}
            </p>
            
            <div className="mt-auto flex flex-col gap-2">
                <Link 
                    to={`/products/${product._id}`} 
                    className="block text-center bg-gray-900 text-white py-2 rounded text-sm font-medium hover:bg-gray-800 transition">
                    View Details
                </Link>
                <button 
                    onClick={() => onRemove(product._id)} 
                    className="text-sm font-medium text-red-500 border border-red-200 py-2 rounded hover:bg-red-50 transition">
                    Remove ♥
                </button>
            </div>
        </div>
    );
}