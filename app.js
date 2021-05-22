// selecting DOM Elements
const searchBar = document.querySelector('#search')
const cartIcon = document.querySelector('#cart-icon')
const cartCounter = document.querySelector('#cart-count')
const cartItems = document.querySelector('#cart-items')
const cartTotal = document.querySelector('#cart-total')
const cartDropdown = document.querySelector('#cart-dropdown')
const productsContainer = document.querySelector('#products')

const products = []
const cart = []

// cart item template
const cartItem = (name, price, index) =>
    `
    <div class="item">
        <span class="name">${
            name.length > 18 ? `${name.substr(0, 16)}...` : name
        }</span>
        <span class="price">$${price}</span>
        <button data-cart-index="${index}" class="delete">X</button>
    </div>
    `
const product = (name, price, index, imgSrc) =>
    `
<div class="product">
    <img src="${imgSrc}" alt="${name}" />
    <div class="product-info">
        <div id="name" class="name">
            <span>${name}</span>
        </div>
        <div id="price" class="price">
            <span>$ ${price}</span>
        </div>
    </div>
    <div class="buttons">
        <button id="checkout" class="checkout">
            Buy
        </button>
        <button  data-product-index="${index}" class="add-to-cart">
            cart
        </button>
    </div>
</div>
`

const updateCart = () => {
    cartItems.innerHTML = cart
        .map(({ name, price }, i) => {
            return cartItem(name, price, i)
        })
        .join('')

    document
        .querySelectorAll('.delete')
        .forEach(btn => (btn.onclick = deleteFromCart))

    cartCounter.textContent = cart.length

    const total = cart.reduce((total, { price }) => {
        total += +price
        return Math.round(total)
    }, 0)

    cartTotal.textContent = `$${total}`
}

function deleteFromCart({ target }) {
    if (target.matches('button')) {
        cart.splice(target.dataset.cartIndex, 1)
        target.parentNode.remove()
    }

    console.log(cart)

    updateCart()

    cartCounter.textContent = cart.length
}

const addItemToCart = ({ target }) => {
    if (target.matches('button')) {
        console.log(target.dataset.productIndex + 'added to cart')
        cart.push(products[target.dataset.productIndex])
        updateCart()
    }
}

const openCart = () => {
    cartDropdown.classList.toggle('hidden')
}

const getData = async () => {
    if (!localStorage.getItem('appData')) {
        const response = await fetch('https://fakestoreapi.com/products')
        const data = await response.text()

        localStorage.setItem('appData', data)
    }

    return localStorage.getItem('appData')
}

const useData = async () => {
    const data = JSON.parse(await getData())

    console.log(data)

    data.forEach(product => {
        products.push({
            name: product.title,
            price: product.price,
            imgSrc: product.image,
        })
    })

    productsContainer.innerHTML = products
        .map(({ name, price, imgSrc }, i) => product(name, price, i, imgSrc))
        .join('')

    document
        .querySelectorAll('.add-to-cart')
        .forEach(btn => (btn.onclick = addItemToCart))
}

useData()

cartIcon.addEventListener('click', openCart)
