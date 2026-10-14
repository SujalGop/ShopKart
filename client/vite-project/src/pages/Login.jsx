import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginCustomerAPI } from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      return setError('Email and password are required.');
    }

    setLoader(true);
    try {
     await loginCustomerAPI(form);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Credentials');
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">ShopKart Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
        
        <button 
          type="submit" disabled={loader}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50">
          {loader ? 'Authenticating...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Don't have an account? <Link to="/register" className="text-blue-600">Register here</Link>
      </p>
    </div>
  );
}