import React, { useState, useEffect } from 'react';
import { fetchAllProductsAPI, getWishlistAPI } from '../services/api'; 
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [wishlistedIds, setWishlistedIds] = useState(new Set()); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [productsRes, wishlistRes] = await Promise.all([
          fetchAllProductsAPI({ search, category, sort }),
          getWishlistAPI().catch(() => ({ data: { wishlist: [] } }))
        ]);
        
        setProducts(productsRes.data.products);
        
        const ids = new Set(wishlistRes.data.wishlist.map(item => item._id));
        setWishlistedIds(ids);

      } catch (err) {
        setError('Something went wrong while loading products.');
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, category, sort]); 

      

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Shop All Products</h1>
        
        <SearchBar 
          search={search} setSearch={setSearch}
          category={category} setCategory={setCategory}
          sort={sort} setSort={setSort}
        />
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64 text-gray-500">Loading products...</div>
      )}

      {error && !loading && (
        <div className="flex justify-center items-center h-64 text-red-500 font-medium">{error}</div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="flex flex-col justify-center items-center h-64 text-gray-500">
          <p className="text-lg">No products found.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              isInitiallySaved={wishlistedIds.has(product._id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}