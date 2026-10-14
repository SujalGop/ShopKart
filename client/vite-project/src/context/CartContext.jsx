import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCartAPI, addToCartAPI, updateCartQuantityAPI, removeFromCartAPI } from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await getCartAPI();
            setCartItems(res.data.cart);
        } catch (error) {
            console.error("Failed to fetch cart", error);
            setCartItems([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (productId) => {
        await addToCartAPI(productId);
        await fetchCart();
    };

    const updateQuantity = async (productId, quantity) => {
        await updateCartQuantityAPI(productId, quantity);
        await fetchCart();
    };

    const removeFromCart = async (productId) => {
        await removeFromCartAPI(productId);
        await fetchCart();
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartSubtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            loading, 
            cartCount, 
            cartSubtotal, 
            addToCart, 
            updateQuantity, 
            removeFromCart,
            clearCart,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
