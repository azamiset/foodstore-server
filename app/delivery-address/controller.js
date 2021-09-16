const { model } = require('mongoose');
const { subject } = require('@casl/ability');
const { policyFor } = require('../policy');
const DeliveryAddress = require('./model');
const { json } = require('express');

// membuat endpoint 'create' alamat pengiriman
async function store(req, res, next) {
  let policy = policyFor(req.user);
  if (!policy.can('create', 'DeliveryAddress')) {
    return res.json({
      error: 1,
      message: 'You are not allowed to perform this action',
    });
  }

  try {
    let payload = req.body;
    let user = req.user;
    // (1) Buat instance 'DeliveryAddress' berdasarkan payload dan data user
    let address = new DeliveryAddress({ ...payload, user: user._id });
    // (2) simpan instance 'DeliveryAddress' diatas ke MongoDB
    await address.save();
    // (3) respon dengan data 'address' dari MongoDb
    return res.json(address);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next();
  }
}

// membuat endpoint 'update' alamat pengiriman
async function update(req, res, next) {
  let policy = policyFor(req.user);

  try {
    // (1) Dapatkan 'id' dari 'req.params'
    let { id } = req.params;
    // (2) Buat 'payload' dan keluarkan 'id'
    let { _id, ...payload } = req.body;

    // <!-- cek policy -->
    let address = await DeliveryAddress.findOne({ _id: id });
    let subjectAddress = subject('DeliveryAddress', { ...address, user_id: address.user });
    if (!policy.can('update', subjectAddress)) {
      return res.json({
        error: 1,
        message: 'You are not allowed to modify this resource',
      });
    }
    // <!-- end cek policy -->

    //  (1) Update ke MongoDb
    address = await DeliveryAddress.findOneAndUpdate({ _id: id }, payload, { new: true });
    // (2) respon dengan data 'addres"
    return res.json(address);

  } catch (err) {
    // (1) Tangani kemungkinan error
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
}

// membuat endpoint 'delete' alamat pengiriman
async function destroy(req, res, next) {
  let policy = policyFor(req.user);

  try {
    let { id } = req.params;
    // (1) cari address yang mau dihapus
    let address = await DeliveryAddress.findOne({ _id: id });
    // (2) buat subject address
    let subjectAddress = subject({ ...address, user: address.user });

    // <!-- cek policy -->
    if (!policy.can('delete', subjectAddress)) {
      return res.json({
        error: 1,
        message: 'You are not allowed to delete this resource',
      });
    }
    // <!-- end cek policy -->

    // hapus data dari MongoDb
    await DeliveryAddress.findOneAndDelete({ _id: id });
    // berikan response ke client
    return res.json(address);

  } catch (err) {
    /// (1) Tangani kemungkinan error
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
}

// membuat endpoint 'daftar' alamat pengiriman
async function index(req, res, next) {
  const policy = policyFor(req.user);
  if (!policy.can('view', 'DeliveryAddress')) {
    return res.json({
      error: 1,
      message: 'You are not allowed to perform this action',
    });
  }

  try {
    let { limit = 10, skip = 0 } = req.body;
    // (1) Dapatkan jumlah data alamat pengiriminan
    const count = await DeliveryAddress.find({ user: req.user._id }).countDocuments();
    const deliveryAddress = await DeliveryAddress
      .find({ user: req.user.id })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort('-createdAt')
    //  response 'data' dan 'count' . count digunakan untuk pagination.
    return res.json({ data: deliveryAddress, count: count });

  } catch (err) {
    // (1) Tangani kemungkinan error
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
}

module.exports = { store, update, destroy, index };