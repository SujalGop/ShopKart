import React, { useState } from 'react';

export default function CartItem({ item, updateQuantity, removeFromCart }) {
    const { product, quantity } = item;
    const [isUpdating, setIsUpdating] = useState(false);

    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity < 1 || newQuantity > product.stock) return;
        setIsUpdating(true);
        await updateQuantity(product._id, newQuantity);
        setIsUpdating(false);
    };

    return (
        <div className="flex items-center gap-6 py-6 border-b border-gray-100 last:border-0 relative">
            {isUpdating && (
                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-500">Updating...</span>
                </div>
            )}

            <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded border p-2 flex items-center justify-center">
                <img src={product.image} alt={product.name} className="max-h-full object-contain mix-blend-multiply" />
            </div>

            <div className="flex-grow">
                <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <button 
                    onClick={() => removeFromCart(product._id)} 
                    className="text-sm font-medium text-red-500 hover:text-red-700 transition">
                    Remove
                </button>
            </div>

            <div className="flex flex-col items-end gap-3">
                <span className="font-bold text-gray-900">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                
                <div className="flex items-center border rounded">
                    <button 
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1 || isUpdating}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition">
                        -
                    </button>
                    <span className="px-4 py-1 font-medium border-l border-r text-sm w-12 text-center">
                        {quantity}
                    </span>
                    <button 
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stock || isUpdating}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition">
                        +
                    </button>
                </div>
                {quantity >= product.stock && (
                    <span className="text-[10px] text-red-500 font-medium uppercase tracking-wide">Max Stock Reached</span>
                )}
            </div>
        </div>
    );
}