const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');


dotenv.config();
const app = express();


// middleware
app.use(express.json()); // for application/json
app.use(morgan('dev'));


// routes
app.use('/api/v1/products', productRoutes);


// error handler
app.use(errorHandler);


// connect DB and start
const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('DB connection error:', err);
        process.exit(1);
    });