const mongoose = require('mongoose');

const DB_URL = 'mongodb://127.0.0.1:27017/online-shop';

const productShema = mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    description: String,
    image: String
});

const Product = mongoose.model('product', productShema);

exports.addNewProduct = data => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            let newProduct = new Product(data);
            return newProduct.save();
        }).then(products => {
                mongoose.disconnect();
                resolve(products);
        }).catch(err => reject(err))
    })
};

exports.getAllProducts = () => {
    // Connect to db
    // Get product
    // Disconnect
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            return Product.find({})
        }).then(products => {
                mongoose.disconnect();
                resolve(products);
        }).catch(err => reject(err))
    })

};
exports.getProductsByCategory = (category) => {

    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            return Product.find({category: category})
        }).then(products => {
                mongoose.disconnect();
                resolve(products);
        }).catch(err => reject(err))
    })

};
exports.getProductsById = (id) => {

    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            return Product.findById(id)
        }).then(product => {
                mongoose.disconnect();
                resolve(product);
        }).catch(err => reject(err))
    })

};

exports.getFirstProduct = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            return Product.findOne({});
        }).then(product => {
                mongoose.disconnect();
                resolve(product);
        }).catch(err => reject(err))
    })

}