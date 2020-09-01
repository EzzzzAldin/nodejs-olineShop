const cartModel = require('../models/cart.model');
const validationResult = require('express-validator').validationResult;

exports.getCart = (req, res) => {
    // Get Data in DB to Give Function getItemByUser
    cartModel.getItemByUser(req.session.userId).then(items => {
        res.render('cart', {
            pageTitle: 'Cart',
            items: items,
            isUser: true,
            isAdmin: req.session.isAdmin,
            validationErrors: req.flash('validationErrors')[0]
        }).catch((err) => res.redirect('/error'))
    })
};

exports.postCart = (req, res) => {
    // Check Errrors
    if( validationResult(req).isEmpty()) {
        // Get Data in cartModel
        cartModel.addNewItem({
            name: req.body.name,
            price: req.body.price,
            amount: req.body.amount,
            productId: req.body.productId,
            userId: req.session.userId,
            timestamp: Date.now()
        }, req.body.productId, req.body.amount).then(() => res.redirect('/cart'))
          .catch(err => res.redirect('/error'));
    } else {
        req.flash('validationErrors', validationResult(req).array());
        // Use req.body.redirectTo Becouse if User add Cart in home OR in ProductDetlies Page
        res.redirect(req.body.redirectTo);
    }
};

exports.postSave = (req, res) => {
    if( validationResult(req).isEmpty()) {
        cartModel.editItem(req.body.cartId, {
            amount: req.body.amount, 
            timestamp: Date.now()
        }).then(() => res.redirect('/cart'))
          .catch(err => res.redirect('/error'));
    } else {
        req.flash('validationErrors', validationResult(req).array());
        res.redirect('/cart');
    }
};

exports.postDelete = (req, res) => {
    cartModel.deleteItem(req.body.cartId)
             .then(() => res.redirect('/cart'))
             .catch(err => res.redirect('/error'));
};

exports.postDeleteAll = (req, res) => {
    cartModel.deleteAllItem(req.body.id)
             .then(() => res.redirect('/'))
             .catch(err => res.redirect('/error'));
};