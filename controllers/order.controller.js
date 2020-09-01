const orderModel = require('../models/order.model');
const cartModel =  require('../models/cart.model');

const validationResult = require('express-validator').validationResult;

exports.getOrderVerify = (req, res) => {
    // Get Data Item
    cartModel.getItemById(req.query.order).then(cartItem => {
        res.render('verify-order', {
            pageTitle: 'Verify Order',
            cart: cartItem,
            isUser: true,
            validationError: req.flash("validationErrors")[0]
        })
    }).catch(err => res.redirect('/error'))
};

exports.getOrder = (req, res) => {
    orderModel
        .getOrderByUser(req.session.userId)
        .then(items => {
            res.render("orders", {
                pageTitle: "Orders",
                isUser: true,
                isAdmin: req.session.isAdmin,
                items: items
            });
        })
        .catch(err => res.redirect("/error"));
};

exports.postOrder = (req, res) => {
    if(validationResult(req).isEmpty()) {
        orderModel.addNewOrder(req.body)
                .then(() => res.redirect('/orders'))
                .catch(err => {
                    res.redirect('/error');
                });
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/verify-order?order=" + req.body.cartId);
    }
};

exports.postCancel = (req, res) => {
    orderModel.cancelOrder(req.body.orderId)
             .then(() => res.redirect('/orders'))
             .catch(err => res.redirect('/error'));
};

exports.postCancelAll = (req, res) => {
    orderModel.cancelAllOrder(req.body.id)
             .then(() => res.redirect('/orders'))
             .catch(err => res.redirect('/error'));
};