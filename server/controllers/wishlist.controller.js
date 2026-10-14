import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

export const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.customer._id).populate({
            path: 'wishlist',
            select: 'name price category image stock'
        });

        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            wishlist: customer.wishlist
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const addWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.customer._id;

        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const customer = await Customer.findById(customerId);
        if (customer.wishlist.includes(productId)) {
            return res.status(409).json({ success: false, message: "Product already in wishlist" });
        }

        await Customer.findByIdAndUpdate(customerId, { $addToSet: { wishlist: productId } });
        res.status(201).json({ success: true, message: "Product added to wishlist" });

    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ success: false, message: "Invalid product ID format" });
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const removeWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.customer._id;

        const customer = await Customer.findById(customerId);
        if (!customer.wishlist.includes(productId)) {
            return res.status(404).json({ success: false, message: "Product not in wishlist" });
        }

        await Customer.findByIdAndUpdate(customerId, { $pull: { wishlist: productId } });
        res.status(200).json({ success: true, message: "Product removed from wishlist" });

    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ success: false, message: "Invalid product ID format" });
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.customer._id;

        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const customer = await Customer.findById(customerId);
        const isWishlisted = customer.wishlist.includes(productId);

        if (isWishlisted) {
            await Customer.findByIdAndUpdate(customerId, { $pull: { wishlist: productId } });
            return res.status(200).json({ success: true, saved: false, message: "Removed from wishlist" });
        } else {
            await Customer.findByIdAndUpdate(customerId, { $addToSet: { wishlist: productId } });
            return res.status(200).json({ success: true, saved: true, message: "Added to wishlist" });
        }
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ success: false, message: "Invalid product ID format" });
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};