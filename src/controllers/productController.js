import Product from '../models/Product.js';
import Category from '../models/Category.js';



// CREATE product
export const createProduct = async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;

    if (!name || price === undefined || !categoryId) {
      return res
        .status(400)
        .json({ message: 'name, price and categoryId are required' });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ message: 'price must be a positive number' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid categoryId' });
    }

    const existingProduct = await Product.findOne({
      name: name.trim(),
      category: categoryId,
    });

    if (existingProduct) {
      return res.status(200).json({
        message: 'Product already exists in this category',
        product: existingProduct,
      });
    }

    const product = await Product.create({
      name: name.trim(),
      price,
      category: categoryId,
      createdBy: req.user.id,
    });

    await Category.findByIdAndUpdate(categoryId, {
      $addToSet: { products: product._id },
    });

    return res.status(201).json({
      message: 'Product created',
      product,
    });
  } catch (err) {
    console.error('Error in createProduct controller : ', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



// GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('createdBy', 'name email');

    return res.status(200).json(products);
  } catch (err) {
    console.error('Get products error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



// UPDATE a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let oldCategoryId = product.category;

    if (name !== undefined) product.name = name.trim();
    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ message: 'price must be a positive number' });
      }
      product.price = price;
    }

    if (categoryId) {
      const newCategory = await Category.findById(categoryId);
      if (!newCategory) {
        return res.status(400).json({ message: 'Invalid new categoryId' });
      }
      product.category = categoryId;
    }

    await product.save();

    // handle category change (if changed)
    if (categoryId && String(oldCategoryId) !== String(categoryId)) {
      await Category.findByIdAndUpdate(oldCategoryId, {
        $pull: { products: product._id },
      });
      await Category.findByIdAndUpdate(categoryId, {
        $addToSet: { products: product._id },
      });
    }

    return res.status(200).json({
      message: 'Product updated',
      product,
    });
  } catch (err) {
    console.error('Update product error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



// DELETE a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const categoryId = product.category;

    await Category.findByIdAndUpdate(categoryId, {
      $pull: { products: product._id },
    });

    await Product.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
