import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerAPI } from '../services/api';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCustomerAPI();
        setUser(response.data.customerData);
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading...
      </div>
    );
  if (!user) return null;

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="bg-[#f8f9fa] flex flex-col md:flex-row items-center justify-between px-6 md:px-24 py-12 md:py-0 min-h-[500px]">
        <div className="md:w-1/2 space-y-6 text-center md:text-left z-10">
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Welcome back, {user?.fullname}
          </p>
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 leading-tight">
            Discover Your Style
          </h1>
          <p className="text-gray-600 text-lg">
            Shop the latest trends & exclusive offers
          </p>
          <button className="bg-[#e26e3c] text-white px-8 py-3 rounded hover:bg-[#c95d2e] transition duration-300 font-medium tracking-wide">
            Shop Now
          </button>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center md:justify-end relative">
          <img
            src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Fashion Model"
            className="w-full max-w-md object-cover drop-shadow-2xl mix-blend-multiply rounded-lg"
          />
        </div>
      </div>

      <div className="border-y border-gray-200 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
          <div className="flex items-center gap-3 text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <span className="text-sm font-medium">Free Shipping</span>
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-300"></div>

          <div className="flex items-center gap-3 text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">Secure Checkout</span>
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-300"></div>

          <div className="flex items-center gap-3 text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="text-sm font-medium">24/7 Support</span>
          </div>
        </div>
      </div>

      <div className="py-20 px-6 md:px-24 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-center text-gray-900 mb-12">
          Featured Collections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="group cursor-pointer">
            <div className="bg-[#f4f4f4] aspect-[4/5] mb-4 overflow-hidden flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=400&auto=format&fit=crop"
                alt="Spring Fashion"
                className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
              />
            </div>
            <h3 className="text-center text-gray-900 font-medium">
              Spring Fashion
            </h3>
          </div>

          <div className="group cursor-pointer">
            <div className="bg-[#f4f4f4] aspect-[4/5] mb-4 overflow-hidden flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400&auto=format&fit=crop"
                alt="Luxury Watches"
                className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
              />
            </div>
            <h3 className="text-center text-gray-900 font-medium">
              Luxury Watches
            </h3>
          </div>

          <div className="group cursor-pointer">
            <div className="bg-[#f4f4f4] aspect-[4/5] mb-4 overflow-hidden flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=400&auto=format&fit=crop"
                alt="Home Essentials"
                className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
              />
            </div>
            <h3 className="text-center text-gray-900 font-medium">
              Home Essentials
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
