require('dotenv').config()
const { StatusCodes } = require('http-status-codes')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const items = require('../models/items.js')
const storeItems = items.music.concat(items.merch)


// home page
const getHome = async (req, res) => {
  res.status(StatusCodes.OK).render('../views/home', {
    title: 'The Generics | Home',
    ishome: true
  })
}

// about page
const getAbout = async (req, res) => {
  res.status(StatusCodes.OK).render('../views/about', {
    title: 'The Generics | About'
  })
}

// store page
const getStore = async (req, res) => {
  if (!items)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('../views/store', {
      title: 'The Generics | Store',
      errMsg: `Something went wrong: ${err.message}`
    })
  else
    res.status(StatusCodes.OK).render('../views/store', {
      title: 'The Generics | Store',
      music: items.music,
      merch: items.merch,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY
    })
}

// purchase items
const purchaseItems = async (req, res) => {
  const { purchasedItems } = req.body
  if (!purchasedItems) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('../views/store', {
      title: 'The Generics | Store',
      music: items.music,
      merch: items.merch,
      errMsg: `Something went wrong: ${err.message}`
    })
  }
  else {
    console.log('fuck you');
    res.status(StatusCodes.OK).render('../views/checkout', {
      title: 'The Generics | Store checkout',
      purchasedItems,
      isCheckout: true,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY
    })
  }
}

// checkout
const getCheckout = async (req, res) => {
  const { purchasedItems } = req.body
  console.log(req.body);
  res.status(StatusCodes.OK).render('../views/checkout', {
    title: 'The Generics | Store checkout',
    purchasedItems,
    isCheckout: true,
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY
  })
}

// checkout
const payment = async (req, res) => {
  const { items } = req.body

  const paymentIntent = await stripe.paymentIntents.create({
    amount: getItemsTotal(items),
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  })

  if (!paymentIntent) res.status(StatusCodes.BAD_REQUEST).render('../views/checkout', {
    title: 'The Generics | Store checkout',
    items,
    isCheckout: true,
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY
  })
  else res.status(StatusCodes.OK).render('../views/checkout', {
    title: 'The Generics | Store checkout',
    items,
    isCheckout: true,
    clientSecret: paymentIntent.client_secret,
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY
  })
}


function getItemsTotal(purchasedItems) {
  let total = 0
  purchasedItems.forEach((item) => {
    storeItems.forEach(storeItem => {
      if (storeItem.id == item.id) {
        total += (storeItem.price * parseInt(item.quantity))
      }
    })
  })
  return total
}

module.exports = { getHome, getAbout, getStore, getCheckout, purchaseItems, payment }