import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerCustomerAPI } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.fullname || !form.email || !form.password || !form.phone) {
      return setError('Please fill in all required fields.');
    }

    setLoading(true);
    try {
      await registerCustomerAPI(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };
    

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register for ShopKart</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
    <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" name="fullname" placeholder="Full Name" 
          className="w-full border p-2 rounded" 
          value={form.fullname} onChange={handleChange} 
        />
        <input 
          type="email" name="email" placeholder="Email" 
          className="w-full border p-2 rounded" 
          value={form.email} onChange={handleChange} 
        />
        <input 
          type="password" name="password" placeholder="Password" 
          className="w-full border p-2 rounded" 
          value={form.password} onChange={handleChange} 
        />
        <input 
          type="text" name="phone" placeholder="Phone Number" 
          className="w-full border p-2 rounded" 
          value={form.phone} onChange={handleChange} 
        />
        
        <button 
          type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Already have an account? <Link to="/login" className="text-blue-600">Login here</Link>
      </p>
    </div>
  );
}