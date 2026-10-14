import Product from '../models/product.model.js';

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    
    let queryObj = {};
    
    if (search) {
      queryObj.name = { $regex: search, $options: 'i' };
    }
    
    if (category) {
      queryObj.category = category;
    }

    let mongooseQuery = Product.find(queryObj);

    if (sort) {
      if (sort === 'price_asc') {
        mongooseQuery = mongooseQuery.sort('price');
      } else if (sort === 'price_desc') {
        mongooseQuery = mongooseQuery.sort('-price');
      }
    } else {
      // Default sort by newest
      mongooseQuery = mongooseQuery.sort('-createdAt');
    }

    const products = await mongooseQuery;
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid Product ID' });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    return res.status(200).json({ success: true, message: 'Deleted successfully', product });
    
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid Product ID or server error' });
  }
};
