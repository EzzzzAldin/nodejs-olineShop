const productsModel = require('../models/products.model');
const ordersModel = require('../models/order.model');
const validationResult = require('express-validator').validationResult;  

exports.getAdd = (req, res) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        validationErrors: req.flash('validationErrors'),
        isUser: true,
        isAdmin: true,
        productAdded: req.flash("added")[0]
    });
};

exports.postAdd = (req, res) => {
    if( validationResult(req).isEmpty()) {
        // Get Image
        req.body.image = req.file.filename;
        productsModel.addNewProduct(req.body)
                     .then(() => {
                         req.flash('added', true);
                         res.redirect("/admin/add");
                     }).catch(err => {
                         res.redirect('/error');
                     });
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/admin/add");
    }
};

exports.getOrders = (req, res) => {
    ordersModel.getAllOrders()
               .then(items => {
                   res.render('manage-orders', {
                       pageTitle: 'Mange Orders',
                       isUser: true,
                       isAdmin: true,
                       items: items
                   });
               })
               .catch(err => res.redirect('/error'));
};

exports.postOrders = (req, res) => {
    ordersModel.editOrder(req.body.orderId, req.body.status)
               .then(() => res.redirect("/admin/orders"))
               .catch(err => res.redirect('/error'));
};