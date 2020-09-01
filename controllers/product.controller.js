const productsModel = require('../models/products.model');

exports.getProduct = (req, res) => {
    productsModel.getFirstProduct().then((product) => {
        res.render('product', {
            pageTitle: 'Product Delalies',
            product: product,
            isUser: req.session.userId,
            isAdmin: req.session.isAdmin
        });
    }).then(err => res.redirect('/error'))
}

exports.getProductById = (req, res) => {
    // Get ID
    let id = req.params.id;
    // Get Products
    productsModel.getProductsById(id).then((product) => {
        res.render('product', {
            pageTitle: product.name,
            product: product,
            isUser: req.session.userId,
            isAdmin: req.session.isAdmin,
            validationErrors: req.flash('validationErrors')[0]
        });
    }).catch(err => res.redirect('/error'))
};