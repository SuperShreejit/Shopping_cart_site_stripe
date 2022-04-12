// external modules
require('dotenv').config()
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

// internal modules
const Router = require('./routes/static')

// statics
app.use(express.static('./public'))

// template views
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views',`./views`)
app.set('layout', `layouts/layout`)

// middlewares
app.use(express.json())

// routes
app.use('/',Router)

//  initialize
const port = process.env.PORT || 3000
const start = async () => {
  try {
     app.listen(port,()=>console.log(`Server listening on port: ${port}`))    
  } catch (error) {
    console.error(error.message);
  }
}
start()