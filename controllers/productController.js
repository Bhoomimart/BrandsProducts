const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

// Create
exports.createProduct = async (req, res, next) => {
    try {
        const { name, category, deviceName } = req.body;
        if (!req.file) return res.status(400).json({ success: false, error: 'Image is required' });


        // upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'brands_products' });


        // remove temp file
        fs.unlink(req.file.path, () => { });


        const product = await Product.create({
            name,
            category,
            deviceName,
            image: { url: result.secure_url, public_id: result.public_id }
        });


        res.status(201).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

// Get all
exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json({ success: true, count: products.length, data: products });
    } catch (err) {
        next(err);
    }
};

// Get single
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

// Update (optionally replace image)
exports.updateProduct = async (req, res, next) => {
    try {
        const { name, category, deviceName } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });


        // If there's a new image, delete old from cloudinary and upload new
        if (req.file) {
            // delete old
            if (product.image && product.image.public_id) {
                await cloudinary.uploader.destroy(product.image.public_id);
            }
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'brands_products' });
            // remove temp file
            fs.unlink(req.file.path, () => { });


            product.image = { url: result.secure_url, public_id: result.public_id };
        }


        if (name !== undefined) product.name = name;
        if (category !== undefined) product.category = category;
        if (deviceName !== undefined) product.deviceName = deviceName;


        await product.save();


        res.json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

// Delete
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

        // delete image from cloudinary
        if (product.image && product.image.public_id) {
            await cloudinary.uploader.destroy(product.image.public_id);
        }

        await product.deleteOne(); // ✅ instead of product.remove()

        res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
        next(err);
    }
};
