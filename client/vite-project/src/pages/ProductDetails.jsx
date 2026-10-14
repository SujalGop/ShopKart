import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { fetchSingleProductAPI } from '../services/api'
import { useCart } from '../context/CartContext'

export default function ProductDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { addToCart } = useCart(); 
  const [isAddingToCart, setIsAddingToCart] = useState(false); 
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetchSingleProductAPI(id);
        setProduct(response.data.product);
      } catch (err) {
        setError('Something went wrong while loading the product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-red-500 font-medium">{error || 'Product not found.'}</p>
        <button 
          onClick={() => navigate('/products')} 
          className="text-blue-600 hover:underline">
          &larr; Back to Products
        </button>
      </div>
    );
  }


    const handleAddToCart = async () => {
        if (isAddingToCart) return;
        setIsAddingToCart(true);
        try {
            await addToCart(product._id); 
        } catch (error) {
            alert("Failed to add to cart");
        } finally {
            setIsAddingToCart(false);
        }
    };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate('/products')} 
        className="mb-8 text-sm font-medium text-gray-500 hover:text-gray-900 transition">
        &larr; Back to Catalog
      </button>

      <div className="flex flex-col md:flex-row gap-12 bg-white p-6 md:p-12 rounded-lg shadow-sm border border-gray-100">
        
        <div className="md:w-1/2 flex justify-center bg-gray-50 rounded-lg p-8">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-contain max-h-96 w-full mix-blend-multiply drop-shadow-md"
          />
        </div>

        <div className="md:w-1/2 flex flex-col justify-center space-y-6">
          <div>
            <span className="text-xs font-bold text-[#e26e3c] uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mt-2 leading-tight">
              {product.name}
            </h1>
          </div>

          <p className="text-3xl font-bold text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </p>

          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <div className="pt-6 border-t border-gray-100">
            <p className={`text-sm font-medium mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} units left in stock` : 'Out of Stock'}
            </p>
            
            <button onClick={handleAddToCart}
              disabled={product.stock < 1 || isAddingToCart}
              className={`px-8 py-3 rounded font-medium transition ${
              product.stock < 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-[#e26e3c] text-white hover:bg-[#c85a2e]'
               }`}>
              {isAddingToCart ? '⏳ Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}