const express = require('express')
const router = express.Router()

const {getHome, getAbout, getStore, getCheckout, purchaseItems, payment } = require('../controllers/static')

router.route('/').get(getHome)
router.route('/about').get(getAbout)
router.route('/store').get(getStore).post(purchaseItems)
router.route('/checkout').get(getCheckout).post(payment)

module.exports= router