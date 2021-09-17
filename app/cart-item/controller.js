const { policyFor } = require('../policy');
const Product = require('../product/model');
const CartItem = require('../cart-item/model');

// membuat endpoint 'update' pada cart item
async function update(req, res, next) {
  let policy = policyFor(req.user);

  if (!policy.can('update', 'Cart')) {
    return res.json({
      error: 1,
      message: `You're not allowed to perform this action`
    });
  }

  try {
    // (1) dapatkan `payload` `items`
    const { items } = req.body;

    // (2) ekstrak `_id` dari masing-masing `item`
    const productIds = items.map(itm => itm._id);

    // (3) cari data produk di MongoDB simpan sbg `products`
    const products = await Product.find({ _id: { $in: productIds } });

    // (4) persiapkan data `cartItem`
    let cartItems = items.map((item) => {
      let relatedProduct = products.find((product) => product._id.toString() === item._id);
      return {
        _id: relatedProduct._id,
        product: relatedProduct._id,
        price: relatedProduct.price,
        image_url: relatedProduct.image_url,
        name: relatedProduct.name,
        user: req.user._id,
        qty: item.qty
      }
    });

    // (5) update / simpan ke MongoDB semua item pada `cartItems`
    await CartItem.bulkWrite(cartItems.map(item => {
      return {
        updateOne: {
          filter: {
            user: req.user._id,
            product: item.product
          },
          update: item,
          upsert: true
        }
      }
    }));

    // (6) respon ke _client_
    return res.json(cartItems);

  } catch (err) {
    // (1) tangani kemungkinan _error_
    if (err && err.name == 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }

    // (2) Error lainnya serahkan ke express
    next(err);
  }
}

// membuat endpoint 'daftar item' di keranjang 
async function index(req, res, next) {
  let policy = policyFor(req.user);
  if (!policy.can('read', 'Cart')) {
    return res.json({
      error: 1,
      message: `You're not allowed to perform this action`
    });
  }
  try {
    let items = await CartItem
      .find({ user: req.user._id })
      .populate('product');
    return res.json(items);
  } catch (err) {
    if (err && err.name == 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err)
  }
}


module.exports = { update, index };