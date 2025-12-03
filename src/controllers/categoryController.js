import Category from '../models/Category.js';


export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name required' });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    const category = await Category.create({ name: name.trim() });

    return res.status(201).json({
      message: 'Category created',
      category,
    });
  } catch (err) {
    console.error('Create category error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};




export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().select('name products');
    return res.status(200).json(categories);
  } catch (err) {
    console.error('Get categories error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
