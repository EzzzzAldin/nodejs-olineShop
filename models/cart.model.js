const mongoose = require('mongoose');

const DB_URL = 'mongodb://127.0.0.1:27017/online-shop';

const cartShecma = mongoose.Schema({
    name: String,
    price: Number,
    amount: Number,
    userId: String,
    email: String,
    productId: String,
    timestamp: Number
});

const cartItem = mongoose.model('cart', cartShecma);

exports.addNewItem = (data, productId, amount) => {
    return new Promise((resolve, reject) => {
        // DB connect
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            // Check if Product exits
            return cartItem.findOne({productId: productId})
        }).then((item) => {
            if(item) {
                // If product is Found Increment Amount this Product
                return cartItem.findOneAndUpdate({productId: productId}, {$inc : {amount: amount}});
            } else {
                // Create New Irem in Cart
                // Get New Data Item
                let item = new cartItem(data);
                return item.save();
            }
        }).then(() => {
            mongoose.disconnect();
            resolve();
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        })
    })
};

exports.getItemByUser = userId => {
    return new Promise((resolve, reject) => {
        // DB connect
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            // Find UserID And Sort data in ascending order
            return cartItem.find({userId: userId}, {}, {sort: {timestamp: 1}});
        }).then(items => {
            mongoose.disconnect();
            resolve(items);
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        })
    })
};

exports.editItem = (id, newData) => {
    return new Promise((resolve, reject) => {
        // DB connect
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            // Update Data in DB
            return cartItem.updateOne({_id: id}, newData)
        }).then(items => {
            mongoose.disconnect();
            resolve(items);
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        })
    })
};

exports.deleteItem = id => {
    return new Promise((resolve, reject) => {
        // DB connect
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            // Delete Data in DB
            return cartItem.findByIdAndDelete(id);
        }).then(() => {
            mongoose.disconnect();
            resolve();
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        })
    })
};

 exports.deleteAllItem = id => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            return cartItem.deleteMany(id);
        }).then(() => {
            mongoose.disconnect();
            resolve();
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        })
    })
};

exports.getItemById = id => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            return cartItem.findById(id);
        }).then((item) => {
            mongoose.disconnect();
            resolve(item);
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        })
    })
};