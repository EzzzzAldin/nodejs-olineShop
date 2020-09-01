const productsModel = require('../models/products.model');

exports.getHome = (req, res) => {
    // Get category
    let category = req.query.category;
    // Valid Category
    let validCategories = ['clothes', 'phones', 'computers'];
    // Render index
    let productPromise;
    if( category && validCategories.includes(category)) productPromise = productsModel.getProductsByCategory(category);
    
    else productPromise = productsModel.getAllProducts()
    productPromise.then(products => {
        res.render('index', {
            products: products,
            isUser: req.session.userId,
            isAdmin: req.session.isAdmin,
            validationErrors: req.flash('validationErrors')[0],
            pageTitle: 'Home'
        })
    }).catch(err => res.redirect('/error'));

};