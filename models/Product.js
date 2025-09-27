const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    public_id: { type: String, required: true }
});


const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    deviceName: { type: String, required: true },
    image: { type: imageSchema, required: true }
}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema);