import React from 'react';

export default function SearchBar({ 
  search, setSearch, 
  category, setCategory, 
  sort, setSort 
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input 
        type="text" 
        placeholder="Search products..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
      />
      
      <select 
        value={category} 
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 bg-white focus:outline-none focus:border-blue-500">
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Fitness">Fitness</option>
        <option value="Fashion">Fashion</option>
        <option value="Books">Books</option>
        <option value="Home">Home</option>
      </select>

      <select 
        value={sort} 
        onChange={(e) => setSort(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 bg-white focus:outline-none focus:border-blue-500">
        <option value="">Latest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}