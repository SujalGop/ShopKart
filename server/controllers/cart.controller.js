import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

export const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.customer._id).populate({
            path: 'cart.product',
            select: 'name price category image stock'
        });

        if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });

        res.status(200).json({ success: true, cart: customer.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.customer._id;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        const customer = await Customer.findById(customerId);
        
        const cartItemIndex = customer.cart.findIndex(item => item.product.toString() === productId);

        if (cartItemIndex > -1) {
            if (customer.cart[cartItemIndex].quantity + 1 > product.stock) {
                return res.status(400).json({ success: false, message: "Cannot exceed available stock" });
            }
            customer.cart[cartItemIndex].quantity += 1;
        } else {
            if (product.stock < 1) {
                return res.status(400).json({ success: false, message: "Product is out of stock" });
            }
            customer.cart.push({ product: productId, quantity: 1 });
        }

        await customer.save();
        res.status(200).json({ success: true, message: "Cart updated", cart: customer.cart });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ success: false, message: "Invalid product ID format" });
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const customerId = req.customer._id;

        if (quantity < 1) return res.status(400).json({ success: false, message: "Quantity must be at least 1" });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        if (quantity > product.stock) {
            return res.status(400).json({ success: false, message: "Cannot exceed available stock" });
        }

        const customer = await Customer.findById(customerId);
        const cartItem = customer.cart.find(item => item.product.toString() === productId);

        if (!cartItem) return res.status(404).json({ success: false, message: "Product not in cart" });

        cartItem.quantity = quantity;
        await customer.save();

        res.status(200).json({ success: true, message: "Quantity updated", cart: customer.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.customer._id;

        const customer = await Customer.findByIdAndUpdate(
            customerId, 
            { $pull: { cart: { product: productId } } },
            { new: true } 
        );

        res.status(200).json({ success: true, message: "Removed from cart", cart: customer.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};