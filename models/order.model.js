const mongoose = require('mongoose');

const cartModel =  require('./cart.model');

const DB_URL = 'mongodb://127.0.0.1:27017/online-shop';

const orderSchema = mongoose.Schema({
    name: String,
    price: Number,
    amount: Number,
    userId: String,
    productId: String,
    timestamp: Number,
    address: String,
    email: String,
    status: {
        type: String,
        default: "Pending"
    },
    timestamp: Number
});

const Order = mongoose.model('order', orderSchema);

exports.addNewOrder = data => {
    return new Promise((resolve, reject) => {
        // Delete Item in Carts And Add to Orders
        cartModel.deleteItem(data.cartId)
                 .then(() => mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}))
                 .then(() => {
                    //  Create New Order
                    data.timestamp = Date.now();
                    let order = new Order(data);
                    return order.save();
                }).then(() => {
                    mongoose.disconnect();
                    resolve();
                }).catch(err => {
                    mongoose.disconnect();
                    reject(err);
        });
    });
};

exports.getOrderByUser = userId => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            // Find Items By User ID And Sort Items 
            return Order.find({userId: userId}, {}, {sort: {timestamp: 1}});
        }).then((item) => {
            mongoose.disconnect();
            resolve(item);
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        })
    })
};

exports.cancelOrder = id => {
    return new Promise((resolve, reject) => {
        // DB connect
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            // Delete Data in DB
            return Order.findByIdAndDelete(id);
        }).then(() => {
            mongoose.disconnect();
            resolve();
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        })
    })
};

 exports.cancelAllOrder = id => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            return Order.deleteMany(id);
        }).then(() => {
            mongoose.disconnect();
            resolve();
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        })
    })
};

exports.getAllOrders = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            return Order.find({}, {}, {sort: {timestamp: 1}});
        }).then((items) => {
            mongoose.disconnect();
            resolve(items);
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        })
    })
};

exports.editOrder = (id, newStatus) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            return Order.update({_id: id}, {status: newStatus});
        }).then((items) => {
            mongoose.disconnect();
            resolve(items);
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        })
    })
};
