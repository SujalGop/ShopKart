import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlistAPI, toggleWishlistAPI } from '../services/api';
import WishlistCard from '../components/WishlistCard';

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const res = await getWishlistAPI();
            setWishlist(res.data.wishlist);
        } catch (err) {
            setError('Unable to load wishlist.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        try {
            await toggleWishlistAPI(productId);
            setWishlist(prev => prev.filter(item => item._id !== productId));
        } catch (err) {
            alert("Failed to remove item.");
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Loading your wishlist...</div>;
    
    if (error) return (
        <div className="text-center py-20 flex flex-col items-center">
            <p className="text-red-500 mb-4 font-medium">{error}</p>
            <button onClick={fetchWishlist} className="bg-gray-900 text-white px-6 py-2 rounded">Try Again</button>
        </div>
    );

    if (wishlist.length === 0) return (
        <div className="text-center py-20 space-y-4">
            <div className="text-5xl mb-4">❤️</div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">Your wishlist is empty</h2>
            <p className="text-gray-500">Save products you love and find them here later.</p>
            <Link to="/products" className="inline-block bg-[#e26e3c] text-white px-8 py-3 rounded mt-4 font-medium">
                Browse Products
            </Link>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-gray-500 mb-8 font-medium">{wishlist.length} products saved</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map(product => (
                    <WishlistCard 
                        key={product._id} 
                        product={product} 
                        onRemove={handleRemove} 
                    />
                ))}
            </div>
        </div>
    );
}