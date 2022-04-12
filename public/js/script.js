const removeCartItemButtons = document.querySelectorAll('.btn-danger')
const quantityInputs = document.querySelectorAll('.cart-quantity-input')
const addToCartButtons = document.querySelectorAll('.shop-item-button')
// const purchaseForm = document.querySelector('#checkout')
const purchaseBtn = document.querySelector('.btn-purchase')

removeCartItemButtons.forEach(button => {
  button.addEventListener('click', removeCartItem)
})
quantityInputs.forEach(input => {
  input.addEventListener('change', quantityChanged)
})
addToCartButtons.forEach(button => {
  button.addEventListener('click', addToCartClicked)
})
// purchaseForm.addEventListener('submit', purchaseClicked)
purchaseBtn.addEventListener('click', purchaseClicked)

async function purchaseClicked() {
  const purchasedItems = fetchItems()
  await axios.get('/checkout', {
    body: { purchasedItems }
  }).catch(err => console.error(err))
  clearCart()
}

// fetches items from the cart
function fetchItems() {
  const items = []
  const cartItemContainer = document.querySelector('.cart-items')
  const cartRows = cartItemContainer.querySelectorAll('.cart-row')
  cartRows.forEach(row => {
    const quantityElement = row.querySelector('.cart-quantity-input')
    const quantity = quantityElement.value
    const id = row.dataset.itemId
    items.push({
      id: id,
      quantity: quantity
    })
  })
  return items
}


function checkCart() {
  const cartItems = document.querySelector('.cart-items')
  if (!cartItems.hasChildNodes()) return false
  else return true
}

function clearCart() {
  const cartItems = document.querySelector('.cart-items')
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild)
  }
  updateCartTotal()
}

function removeCartItem(event) {
  const buttonClicked = event.target
  buttonClicked.parentElement.parentElement.remove()
  const doesCartHaveitems = checkCart()
  if (!doesCartHaveitems) {
    purchaseBtn.classList.add('hidden')
  }
  updateCartTotal()
}

function quantityChanged(event) {
  const input = event.target
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1
  }
  updateCartTotal()
}

function addToCartClicked(event) {
  const button = event.target
  const shopItem = button.parentElement.parentElement
  const title = shopItem.querySelector('.shop-item-title').innerText
  const price = shopItem.querySelector('.shop-item-price').innerText
  const imageSrc = shopItem.querySelector('.shop-item-image').src
  const id = shopItem.dataset.itemId
  addItemToCart(title, price, imageSrc, id)
  if (purchaseBtn.classList.contains('hidden'))
    purchaseBtn.classList.remove('hidden')
  updateCartTotal()
}

function addItemToCart(title, price, imageSrc, id) {
  const cartRow = document.createElement('div')
  cartRow.classList.add('cart-row')
  cartRow.dataset.itemId = id
  const cartItems = document.querySelector('.cart-items')
  const cartItemNames = cartItems.querySelectorAll('.cart-item-title')
  const cartRows = cartItems.querySelectorAll('.cart-row')
  let repeatFlag = false
  cartItemNames.forEach(item => {
    if (item.innerText == title) {
      alert('This item is already added to the cart')
      repeatFlag = true
    }
  })
  if (repeatFlag) return
  else {
    const cartRowContents = `
    <div class="cart-item cart-column">
    <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
    <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
    <input class="cart-quantity-input" type="number" value="1">
    <button class="btn btn-danger" type="button">REMOVE</button>
    </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.querySelector('.btn-danger').addEventListener('click', removeCartItem)
    cartRow.querySelector('.cart-quantity-input').addEventListener('change', quantityChanged)
  }
}

function updateCartTotal() {
  const cartItemContainer = document.querySelector('.cart-items')
  const cartRows = cartItemContainer.querySelectorAll('.cart-row')
  let total = 0
  cartRows.forEach(cartRow => {
    const priceElement = cartRow.querySelector('.cart-price')
    const quantityElement = cartRow.querySelector('.cart-quantity-input')
    const price = parseFloat(priceElement.innerText.replace('$', ''))
    const quantity = quantityElement.value
    total = total + (price * quantity)
  })
  total = Math.round(total * 100) / 100
  const cartTotalPriceElement = document.querySelector('.cart-total-price')
  cartTotalPriceElement.innerText = `$${total}`
}